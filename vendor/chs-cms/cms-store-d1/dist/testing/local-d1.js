/**
 * A real SQLite engine behind the D1 binding API.
 *
 * The mock this replaces — 747 lines of SQL-substring matcher — was not a database. It
 * lowercased a query, looked for `from cms_tags order by label asc` in it, and returned a
 * filtered array of JavaScript objects. Any query it did not recognise returned
 * `{ changes: 0 }` or `[]`, which is the most dangerous possible failure mode: it looks
 * exactly like a query that matched nothing, so a suite asserting on it proved that the
 * mock's idea of the query was self-consistent. Two examples of what that hid, both of
 * which this file now executes for real:
 *
 *   - `countRecentFormResponses` interpolates its window into the SQL
 *     (`datetime('now', '-${windowSeconds} seconds')`). The mock ignored the window and
 *     counted by IP alone. Real SQL shows the window is also wrong: it compares a caller's
 *     ISO timestamp with SQLite's value, which reduces it to a calendar-day comparison.
 *   - Every write used `datetime('now')` where the caller had supplied an ISO string. The
 *     mock stored whatever it was handed and the shape of the value never mattered.
 *
 * ## What this does and does not prove
 *
 * It proves the dialect's SQL is valid SQLite, that its binds land where the placeholders
 * are, that its constraints fire, and that `batch` is atomic. It does not prove anything
 * about Cloudflare's distributed layer — replication, the D1-specific query planner, or
 * Workers runtime integration. Those are not reachable from a unit test in any engine, and
 * the honest statement is that they are untested rather than that they are fine.
 *
 * ## Why a shim at all
 *
 * `bun:sqlite` is not a D1 binding, and the dialect does not use drizzle — it builds SQL
 * strings and calls the binding API directly, so swapping the driver the way `auth-d1`
 * does is not available. What is needed is the four methods it actually calls, over a
 * database that genuinely parses and enforces.
 */
import { Database } from 'bun:sqlite';
function normalizeBinds(values) {
    // D1 accepts `unknown`; SQLite has no boolean type and no implicit undefined. A boolean
    // becomes 0/1 because SQLite has no boolean type and no implicit one — storing `true`
    // would bind as 1 in one driver and as an error in another, and the column is INTEGER.
    return values.map((value) => {
        if (typeof value === 'boolean')
            return value ? 1 : 0;
        if (value === undefined)
            return null;
        // D1's `bind` takes `unknown` and stores bytes; bun:sqlite binds a `Uint8Array`. A
        // raw `ArrayBuffer` is what a caller holding media bytes naturally has, so it is
        // converted rather than rejected — otherwise the only thing this shim would enforce
        // is that the tests use a different byte type than production.
        if (value instanceof ArrayBuffer)
            return new Uint8Array(value);
        return value;
    });
}
class LocalStatement {
    #sqlite;
    #sql;
    #binds = [];
    constructor(sqlite, sql) {
        this.#sqlite = sqlite;
        this.#sql = sql;
    }
    bind(...values) {
        // D1's `bind` returns a new statement rather than mutating: the same prepared
        // statement is reused with different values inside `batch`. Appending matches that.
        const next = new LocalStatement(this.#sqlite, this.#sql);
        next.#binds = values;
        return next;
    }
    #run() {
        return { stmt: this.#sqlite.prepare(this.#sql), binds: normalizeBinds(this.#binds) };
    }
    /**
     * The synchronous core, shared by all three verbs.
     *
     * It has to be synchronous because `batch` needs one: **bun:sqlite's `transaction()`
     * does not roll back when the callback is async.** Verified directly — an async
     * transaction that throws on its second statement leaves the first statement's row
     * behind, while the identical synchronous callback rolls back cleanly. Awaiting inside
     * the callback moves the writes past the transaction's scope, so an async `batch` would
     * silently be a non-atomic batch that reported itself as atomic.
     *
     * That was this adapter's own first implementation, and the batch test below is what
     * caught it.
     */
    /** Synchronous execution, shared by `all`/`run` and by `batch`. See the note above. */
    execSync() {
        const stmt = this.#sqlite.prepare(this.#sql);
        const binds = normalizeBinds(this.#binds);
        if (/^\s*(select|with|pragma)/i.test(this.#sql)) {
            return { success: true, meta: { changes: 0 }, results: stmt.all(...binds) };
        }
        return { success: true, meta: { changes: stmt.run(...binds).changes }, results: [] };
    }
    async all() {
        return this.execSync();
    }
    async first(colName) {
        const { stmt, binds } = this.#run();
        if (colName !== undefined) {
            // Cloudflare's `first("col")` returns that column's scalar rather than a row.
            const row = stmt.get(...binds);
            return row?.[colName] ?? null;
        }
        return stmt.get(...binds) ?? null;
    }
    async run() {
        return this.execSync();
    }
}
/**
 * Create a D1-shaped database over an in-memory SQLite engine.
 *
 * @param ddl the schema to create, in execution order
 *
 * Foreign keys are switched **on**, and that is a choice rather than a default. The port
 * documents that insert methods throw on constraint violations so `createCmsStore` can
 * turn them into `{ ok: false }` results, which means a suite that wants to observe a
 * refused insert needs enforcement. Cloudflare documents `PRAGMA foreign_keys = OFF` as
 * D1's default, so this adapter is **stricter than production** — chosen because the
 * alternative is a suite that cannot observe a constraint the dialect relies on, and
 * because a false failure here is visible while a missed constraint is not. It is stated
 * here rather than left to be discovered.
 */
export function createLocalD1(ddl) {
    const sqlite = new Database(':memory:');
    sqlite.exec('PRAGMA foreign_keys = ON;');
    if (ddl.trim().length > 0)
        sqlite.exec(ddl);
    const db = {
        prepare(query) {
            return new LocalStatement(sqlite, query);
        },
        async batch(statements) {
            // Real D1's `batch` is atomic: one statement fails and none of them applied. The
            // mock looped the statements and returned fabricated successes, so a test asserting
            // "these two writes both happened" passed against an implementation that could not
            // guarantee it and did not even attempt to.
            //
            // Synchronous throughout — see `#exec`. A statement that did not come from here
            // cannot be run synchronously, and saying so beats running the batch without a
            // transaction and reporting success.
            const results = [];
            const exec = sqlite.transaction(() => {
                for (const statement of statements) {
                    if (!(statement instanceof LocalStatement)) {
                        throw new TypeError('createLocalD1().db.batch() requires statements from its own prepare(); ' +
                            'an async statement cannot run inside a synchronous SQLite transaction');
                    }
                    results.push(statement.execSync());
                }
            });
            exec();
            return results;
        },
    };
    return { db, sqlite, close: () => sqlite.close() };
}

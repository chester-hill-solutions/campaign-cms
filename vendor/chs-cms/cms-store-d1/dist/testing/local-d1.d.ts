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
import type { D1Executor } from '../d1-executor.js';
export type LocalD1 = {
    /** D1-shaped, over real SQLite. */
    db: D1Executor;
    /** Escape hatch for assertions that need to read the stored bytes directly. */
    sqlite: Database;
    close: () => void;
};
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
export declare function createLocalD1(ddl: string): LocalD1;

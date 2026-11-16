/**
 * The CMS schema, as DDL a consumer can apply.
 *
 * `cms-setup` owns the twenty-one tables the Campaign CMS stores its data in. Until this module
 * existed the only way to reach that DDL was a filesystem path into another package's
 * internals — `packages/cms-store-d1/src/testing/ddl.ts` and
 * `packages/cms-store-postgres/src/integration.test.ts` both reached three directories up with
 * a relative path. A relative path into a sibling package breaks the moment either moves, and
 * it is not something a package's `exports` map can protect, because the files being read are
 * not modules.
 *
 * So the DDL is read from the same `sql/` directory the CLI copies into a consumer's project,
 * and exported here. One file, two readers: the CLI writes it and this hands it out, so there
 * is no second copy for the two to disagree about.
 *
 * Two dialects, because the CMS runs on D1 and on Postgres and the SQL genuinely differs:
 * `datetime('now')` against `(now()::text)`. `cmsDialectDdl` picks the directory; the two are
 * asserted to declare the same tables and columns by `ddl-parity.test.ts`, so a change to one
 * that does not reach the other fails rather than waiting for a runtime error in one of them.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
/** The two database dialects the CMS ships schema for. */
export const CMS_DIALECTS = ['d1', 'postgres'];
/** `packages/cms-setup/sql`, resolved from this module rather than from the working directory. */
const SQL_ROOT = fileURLToPath(new URL('../sql', import.meta.url));
/** The directory a dialect's migrations live in. */
function directoryFor(dialect) {
    return dialect === 'postgres' ? join(SQL_ROOT, 'postgres') : SQL_ROOT;
}
/**
 * The migrations for a dialect, in apply order.
 *
 * Read on each call rather than cached at module load, so a consumer that patches a migration
 * between calls in a test sees the file rather than a copy taken at import time.
 *
 * Order is numeric on the filename prefix, not lexicographic. `0001` defines `content_entries`
 * and `0002` to `0006` reference it, so the order is a real constraint rather than a
 * convention, and a lexicographic sort would keep working right up until a tenth migration
 * arrived.
 */
export function cmsDialectDdl(dialect) {
    const directory = directoryFor(dialect);
    return readdirSync(directory)
        .filter((name) => name.endsWith('.sql'))
        .sort(byMigrationOrder)
        .map((name) => ({ name, sql: readFileSync(join(directory, name), 'utf8') }));
}
/**
 * Every migration for a dialect as one string, for a driver that applies a script in a single
 * call.
 *
 * The files are joined rather than sent one at a time, because a driver that runs each file
 * separately still has to be told the order, and a consumer that gets the order wrong gets a
 * foreign-key error instead of a schema.
 */
export function cmsSchemaSql(dialect) {
    return cmsDialectDdl(dialect)
        .map((migration) => migration.sql)
        .join('\n');
}
/** Sort by the numeric prefix, so `0010` applies after `0009`. */
function byMigrationOrder(a, b) {
    const prefixA = Number.parseInt(a, 10);
    const prefixB = Number.parseInt(b, 10);
    // A file with no numeric prefix sorts last rather than as NaN, so one stray file cannot
    // silently reorder the rest.
    if (Number.isNaN(prefixA))
        return Number.isNaN(prefixB) ? a.localeCompare(b) : 1;
    if (Number.isNaN(prefixB))
        return -1;
    if (prefixA !== prefixB)
        return prefixA - prefixB;
    return a.localeCompare(b);
}
/**
 * The tables a DDL script declares, with their column names.
 *
 * Exported because a schema claim is only worth anything if something can check it, and a
 * second copy of this parser is a second thing that can be wrong. The drift tests and the
 * reachability guard all ask this question, so they all ask it here.
 *
 * **This reads table and column names, and nothing else.** It does not check types, defaults,
 * nullability, indexes or foreign keys — the dialects differ on all of those on purpose, since
 * `datetime('now')` and `(now()::text)` are one intent in two dialects. So "same shape" below
 * means the same names in the same tables, and a test that needs more than that has to say so.
 *
 * `CREATE TABLE` and append-only `ALTER TABLE ... ADD COLUMN` are read. `CREATE INDEX` is not, because an index is a performance
 * statement rather than part of the shape a store binds to.
 *
 * @param sql one or more migration scripts
 * @returns table name to column names, in declaration order
 */
export function cmsTables(sql) {
    const tables = new Map();
    const createTable = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?([A-Za-z0-9_]+)["`]?\s*\(/gi;
    for (const match of sql.matchAll(createTable)) {
        const table = match[1];
        // The body ends where the parenthesis opened above closes, found by counting rather than by
        // looking for `);` at the start of a line. Counting is what makes `CHECK (id = 1)` inside a
        // column list safe, and it also handles a one-line statement, which a line-anchored pattern
        // silently skipped.
        const open = match.index + match[0].length;
        const body = readBalanced(sql, open);
        if (body === null)
            continue;
        if (tables.has(table))
            continue;
        const columns = [];
        for (const definition of splitTopLevel(body)) {
            const line = definition.replace(/\s+/g, ' ').trim();
            if (line === '')
                continue;
            // Table-level constraints are not columns: the four the migrations use, plus anything named
            // as a constraint.
            if (/^(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK|CONSTRAINT)\b/i.test(line))
                continue;
            const column = /^["`]?([A-Za-z0-9_]+)["`]?\s+\S/.exec(line);
            if (column)
                columns.push(column[1]);
        }
        tables.set(table, columns);
    }
    const addColumn = /ALTER\s+TABLE\s+["`]?([A-Za-z0-9_]+)["`]?\s+ADD\s+(?:COLUMN\s+)?(?:IF\s+NOT\s+EXISTS\s+)?["`]?([A-Za-z0-9_]+)["`]?\s+/gi;
    for (const match of sql.matchAll(addColumn)) {
        const columns = tables.get(match[1]);
        if (columns && !columns.includes(match[2]))
            columns.push(match[2]);
    }
    return tables;
}
/**
 * Split a table body on the commas between column definitions.
 *
 * Not on every comma: `DECIMAL(10, 2)` and `CHECK (a IN (1, 2))` contain commas that are not
 * separators, so nesting is counted.
 */
function splitTopLevel(body) {
    const parts = [];
    let depth = 0;
    let current = '';
    for (const character of body) {
        if (character === '(')
            depth++;
        else if (character === ')')
            depth--;
        if (character === ',' && depth === 0) {
            parts.push(current);
            current = '';
            continue;
        }
        current += character;
    }
    if (current.trim() !== '')
        parts.push(current);
    return parts;
}
/**
 * The text between the parenthesis at `start` and the one that closes it.
 *
 * `null` when the parentheses never balance, which is a truncated script rather than a schema
 * worth reporting columns for.
 */
function readBalanced(sql, start) {
    let depth = 1;
    for (let index = start; index < sql.length; index++) {
        const character = sql[index];
        if (character === '(')
            depth++;
        else if (character === ')') {
            depth--;
            if (depth === 0)
                return sql.slice(start, index);
        }
    }
    return null;
}
/**
 * The tables a dialect's migrations declare, with their column names.
 *
 * The convenience form of `cmsTables` for the common comparison, so a caller does not have to
 * remember to join the migrations first.
 */
export function cmsDialectTables(dialect) {
    return cmsTables(cmsSchemaSql(dialect));
}
/**
 * Compare two table shapes, and report the difference in both directions.
 *
 * Both directions, because a one-directional check is the kind that passes. The existing
 * `schema-parity.test.ts` asserted that every column in a hand-written list appeared in the
 * drizzle tables; it could not fail on a column in the DDL that the schema does not declare,
 * which is the direction a copy drifting away from its source actually fails in.
 *
 * A shape is equal when `differences` comes back with nothing in it.
 */
export function compareShapes(reference, candidate) {
    const missingTables = [...reference.keys()].filter((table) => !candidate.has(table));
    const extraTables = [...candidate.keys()].filter((table) => !reference.has(table));
    const columns = [];
    for (const [table, referenceColumns] of reference) {
        const candidateColumns = candidate.get(table);
        if (!candidateColumns)
            continue;
        const missing = referenceColumns.filter((column) => !candidateColumns.includes(column));
        const extra = candidateColumns.filter((column) => !referenceColumns.includes(column));
        if (missing.length > 0 || extra.length > 0)
            columns.push({ table, missing, extra });
    }
    return { missingTables, extraTables, columns };
}
/** Whether two shapes are the same, as a readable sentence for a test to assert on. */
export function describeShapeDifference(difference) {
    if (difference.missingTables.length === 0 &&
        difference.extraTables.length === 0 &&
        difference.columns.length === 0) {
        return 'same shape';
    }
    const parts = [];
    if (difference.missingTables.length > 0) {
        parts.push(`missing tables: ${difference.missingTables.join(', ')}`);
    }
    if (difference.extraTables.length > 0) {
        parts.push(`extra tables: ${difference.extraTables.join(', ')}`);
    }
    for (const { table, missing, extra } of difference.columns) {
        const detail = [];
        if (missing.length > 0)
            detail.push(`missing [${missing.join(', ')}]`);
        if (extra.length > 0)
            detail.push(`extra [${extra.join(', ')}]`);
        parts.push(`${table}: ${detail.join(' ')}`);
    }
    return parts.join('; ');
}

/**
 * The D1 and Postgres DDL, imported from the package that owns it.
 *
 * The obvious alternative — a DDL string living here — would be a second copy of the schema,
 * and a second copy is a second thing that can be right while the first is wrong. The adapter
 * would then be tested against a schema nothing runs in production, which is the same class of
 * defect as the mock: a green suite about something other than the thing deployed.
 *
 * So the migrations come from `cms-setup`, which owns them as shipped files. This used to read
 * them from a filesystem path three directories up, with a comment saying that importing them
 * was #97's work. `cms-setup` now has an entry point, so this imports.
 *
 * The import is why `cms-setup` is a build dependency of this package's tests rather than only
 * a thing its scripts copied.
 */
import { cmsDialectDdl, cmsSchemaSql } from '@chester-hill-solutions/cms-setup';
/** Read the D1 migrations and concatenate them into one executable script. */
export function readD1Ddl() {
    return assertNotEmpty('d1');
}
/**
 * The Postgres dialect's migrations. They are not executed here — there is no Postgres engine
 * in this suite — but the two dialects must agree on which timestamp columns exist and on the
 * absence of a clock default, and that is a claim about the text rather than about a running
 * database.
 */
export function readPostgresDdl() {
    return assertNotEmpty('postgres');
}
/**
 * Fail loudly on an empty schema.
 *
 * An empty schema produces "no such table" from the first query, which points at the adapter
 * rather than at the DDL being wrong or unreadable.
 */
function assertNotEmpty(dialect) {
    const migrations = cmsDialectDdl(dialect);
    if (migrations.length === 0) {
        throw new Error(`cms-setup exported no ${dialect} migrations — cannot create the test schema`);
    }
    return cmsSchemaSql(dialect);
}

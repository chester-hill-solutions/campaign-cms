/** The two database dialects the CMS ships schema for. */
export declare const CMS_DIALECTS: readonly ["d1", "postgres"];
export type CmsDialect = (typeof CMS_DIALECTS)[number];
/** One migration file: its name, which is also its apply order, and its SQL. */
export type CmsMigration = {
    /** The file's basename, for example `0001_cms_core.sql`. Its prefix is the apply order. */
    name: string;
    /** The file's contents, verbatim. */
    sql: string;
};
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
export declare function cmsDialectDdl(dialect: CmsDialect): CmsMigration[];
/**
 * Every migration for a dialect as one string, for a driver that applies a script in a single
 * call.
 *
 * The files are joined rather than sent one at a time, because a driver that runs each file
 * separately still has to be told the order, and a consumer that gets the order wrong gets a
 * foreign-key error instead of a schema.
 */
export declare function cmsSchemaSql(dialect: CmsDialect): string;
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
export declare function cmsTables(sql: string): Map<string, string[]>;
/**
 * The tables a dialect's migrations declare, with their column names.
 *
 * The convenience form of `cmsTables` for the common comparison, so a caller does not have to
 * remember to join the migrations first.
 */
export declare function cmsDialectTables(dialect: CmsDialect): Map<string, string[]>;
/** One way a shape differs from another, named so a failure can quote it. */
export type ShapeDifference = {
    /** Tables in `reference` with no counterpart in `candidate`. */
    missingTables: string[];
    /** Tables in `candidate` with no counterpart in `reference`. */
    extraTables: string[];
    /** Per table, the columns each side has and the other does not. */
    columns: Array<{
        table: string;
        missing: string[];
        extra: string[];
    }>;
};
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
export declare function compareShapes(reference: Map<string, string[]>, candidate: Map<string, string[]>): ShapeDifference;
/** Whether two shapes are the same, as a readable sentence for a test to assert on. */
export declare function describeShapeDifference(difference: ShapeDifference): string;

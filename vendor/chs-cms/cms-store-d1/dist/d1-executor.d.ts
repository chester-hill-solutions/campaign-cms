/**
 * The slice of the D1 binding API this dialect actually uses.
 *
 * ## Why this exists rather than a cast
 *
 * `createD1Persistence` used to take `() => D1Database`, which meant the only way to run
 * the dialect's SQL anywhere but a Cloudflare worker was `as unknown as D1Database`. A
 * cast from a test double to a production type is precisely the mechanism by which a
 * green suite stops meaning anything: the type stops asserting that the double is
 * faithful, and nothing replaces it. The whole defect #99 exists to fix is a check that
 * returned a result and had nothing to do with storage.
 *
 * So the dependency is declared instead of asserted away. `D1Database` satisfies this
 * port structurally, Cloudflare's own types unchanged, and the local SQLite adapter
 * satisfies it by construction — so if the dialect ever grows a use of D1 that this port
 * does not describe, the local adapter stops typechecking rather than quietly returning
 * `undefined`.
 *
 * ## The shapes are D1's, not convenient ones
 *
 * `first` takes an optional column name because Cloudflare's does. `meta.changes` is
 * present on the result even though the dialect only reads it from `run()`, because a
 * narrowed result type would not be satisfied by the real one and the whole point is that
 * it is. `success` is `true`, not `boolean`, for the same reason.
 */
/** D1's `D1Result`, minus the fields this dialect never reads. */
export type D1ResultLike<T = Record<string, unknown>> = {
    success: true;
    meta: {
        changes: number;
    };
    results: T[];
};
/** D1's `D1PreparedStatement`, minus `raw()`, which nothing here calls. */
export type D1StatementLike = {
    bind(...values: unknown[]): D1StatementLike;
    first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
    run<T = Record<string, unknown>>(): Promise<D1ResultLike<T>>;
    all<T = Record<string, unknown>>(): Promise<D1ResultLike<T>>;
};
/** D1's `D1Database`, minus `exec`, `withSession` and `dump`. */
export type D1Executor = {
    prepare(query: string): D1StatementLike;
    batch<T = Record<string, unknown>>(statements: D1StatementLike[]): Promise<D1ResultLike<T>[]>;
};

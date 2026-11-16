/** Read the D1 migrations and concatenate them into one executable script. */
export declare function readD1Ddl(): string;
/**
 * The Postgres dialect's migrations. They are not executed here — there is no Postgres engine
 * in this suite — but the two dialects must agree on which timestamp columns exist and on the
 * absence of a clock default, and that is a claim about the text rather than about a running
 * database.
 */
export declare function readPostgresDdl(): string;

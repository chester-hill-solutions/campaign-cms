import type { CmsDomainPersistence } from '@chester-hill-solutions/cms-store';
import type { D1Executor } from './d1-executor.js';
/**
 * D1 implementation of the typed domain-content port.
 *
 * Three things differ from `createD1Persistence`, and each is deliberate.
 *
 * **Timestamps are numbers.** These tables store INTEGER epoch milliseconds, so
 * nothing here formats a date. The clock belongs to the caller (`cms-store` passes
 * epoch milliseconds in), which is the same rule the page persistence follows with
 * `isoNow` for a different column type.
 *
 * **Slug lookups are case-insensitive.** The table's UNIQUE constraint is
 * case-sensitive in SQLite, so `Black-Gold` and `black-gold` could both be stored.
 * Every read here compares with `COLLATE NOCASE` and `createDomainStore` refuses a
 * duplicate before inserting, which makes the two agree on what "taken" means. The
 * constraint remains the backstop for a write that races the check.
 *
 * **Multi-row writes use `batch`.** D1 runs a batch as one implicit transaction, so
 * an entry cannot exist without its first revision.
 */
export declare function createD1DomainPersistence(getDb: () => D1Executor): CmsDomainPersistence;

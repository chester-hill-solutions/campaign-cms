import type { DomainContentEntryRow, DomainContentRevisionRow, DomainTranslationRow } from '@chester-hill-solutions/cms-core';
import type { CmsDomainPersistence } from '../domainPorts.js';
export type MemoryDomainPersistence = CmsDomainPersistence & {
    entries: Map<string, DomainContentEntryRow>;
    revisions: Map<string, DomainContentRevisionRow>;
    translations: Map<string, DomainTranslationRow>;
};
/**
 * In-memory `CmsDomainPersistence`, for tests and for a store conformance run.
 * Mirrors the adapter contract, including case-insensitive slug collision
 * scoped to a content type and locale.
 */
export declare function createMemoryDomainPersistence(): MemoryDomainPersistence;

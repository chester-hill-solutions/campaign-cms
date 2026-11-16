import { type EntryListingSnapshot } from '@chester-hill-solutions/cms-core';
import type { CmsPersistence } from './ports.js';
/** A listing selection/value the editor can correct without losing local changes. */
export declare class CmsListingValidationError extends Error {
    constructor(message: string);
}
export declare function parseEntryListingSnapshot(raw: string): EntryListingSnapshot | null;
/** Resolve changed selections against the catalog; unchanged historical labels remain frozen. */
export declare function resolveEntryListingSnapshot(db: CmsPersistence, input: EntryListingSnapshot, previous?: EntryListingSnapshot): Promise<EntryListingSnapshot>;
export declare function assertListingPublishable(db: CmsPersistence, snapshot: EntryListingSnapshot): Promise<void>;

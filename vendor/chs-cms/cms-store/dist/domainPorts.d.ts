import type { DomainContentEntryRow, DomainContentRevisionRow, DomainRevisionListRow, DomainTranslationRow } from '@chester-hill-solutions/cms-core';
/**
 * Database port for typed domain content.
 *
 * Dialect-specific SQL lives in the adapters, and raw snake_case rows cross this
 * seam — the same rule as `CmsPersistence`. Kept separate from `CmsPersistence`
 * because domain content is a different pair of tables (`cms_content_entries` /
 * `cms_content_revisions`) with its own localization state, and because a site
 * that publishes only pages should not have to implement it.
 *
 * Optional on `CmsStorePorts`, so adding it cannot break an existing consumer.
 */
export type CmsDomainPersistence = {
    /** Entries, newest first is the adapter's choice; the store does not re-sort. */
    listDomainEntries(options?: {
        contentType?: string;
        status?: 'draft' | 'published';
        locale?: string;
    }): Promise<DomainContentEntryRow[]>;
    getDomainEntryById(entryId: string): Promise<DomainContentEntryRow | null>;
    getDomainEntryBySlug(contentType: string, slug: string, locale: string): Promise<DomainContentEntryRow | null>;
    /** Case-insensitive slug collision check, scoped to a content type. */
    findDomainSlugOwner(contentType: string, slug: string, locale: string): Promise<{
        id: string;
    } | null>;
    insertDomainEntry(row: DomainContentEntryRow): Promise<void>;
    /** Set the draft pointer, and the title, in one step. */
    setDomainDraftPointer(entryId: string, revisionId: string, title: string, updatedAt: number): Promise<void>;
    /** Publish: move the published pointer to the current draft and mark published. */
    publishDomainEntry(entryId: string, revisionId: string, updatedAt: number): Promise<void>;
    /** Return an entry to draft without dropping the published revision. */
    unpublishDomainEntry(entryId: string, updatedAt: number): Promise<void>;
    getDomainRevision(entryId: string, revisionId: string): Promise<DomainContentRevisionRow | null>;
    listDomainRevisions(entryId: string): Promise<DomainRevisionListRow[]>;
    nextDomainRevisionVersion(entryId: string): Promise<number>;
    insertDomainRevision(row: DomainContentRevisionRow): Promise<void>;
    upsertDomainTranslation(row: DomainTranslationRow): Promise<void>;
    /** Insert `rev` and make it the draft in one step; used when creating an entry. */
    insertDomainEntryWithDraft(entry: DomainContentEntryRow, rev: DomainContentRevisionRow, translation: DomainTranslationRow): Promise<void>;
};

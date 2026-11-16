/**
 * In-memory `CmsDomainPersistence`, for tests and for a store conformance run.
 * Mirrors the adapter contract, including case-insensitive slug collision
 * scoped to a content type and locale.
 */
export function createMemoryDomainPersistence() {
    const entries = new Map();
    const revisions = new Map();
    const translations = new Map();
    const revisionKey = (entryId, revisionId) => `${entryId}::${revisionId}`;
    const translationKey = (entryId, locale) => `${entryId}::${locale}`;
    const slugKey = (contentType, slug, locale) => `${contentType}::${slug.toLowerCase()}::${locale}`;
    const persistence = {
        listDomainEntries: async (options = {}) => [...entries.values()]
            .filter((entry) => (options.contentType ? entry.content_type === options.contentType : true))
            .filter((entry) => (options.status ? entry.status === options.status : true))
            .filter((entry) => (options.locale ? entry.locale === options.locale : true))
            .sort((a, b) => a.slug.localeCompare(b.slug)),
        getDomainEntryById: async (entryId) => entries.get(entryId) ?? null,
        getDomainEntryBySlug: async (contentType, slug, locale) => [...entries.values()].find((entry) => entry.content_type === contentType &&
            entry.slug.toLowerCase() === slug.toLowerCase() &&
            entry.locale === locale) ?? null,
        findDomainSlugOwner: async (contentType, slug, locale) => {
            const key = slugKey(contentType, slug, locale);
            const match = [...entries.values()].find((entry) => slugKey(entry.content_type, entry.slug, entry.locale) === key);
            return match ? { id: match.id } : null;
        },
        insertDomainEntry: async (row) => {
            if (entries.has(row.id))
                throw new Error(`duplicate entry id ${row.id}`);
            entries.set(row.id, { ...row });
        },
        setDomainDraftPointer: async (entryId, revisionId, title, updatedAt) => {
            const entry = entries.get(entryId);
            if (!entry)
                throw new Error(`unknown entry ${entryId}`);
            entry.draft_revision_id = revisionId;
            entry.title = title;
            entry.updated_at = updatedAt;
        },
        publishDomainEntry: async (entryId, revisionId, updatedAt) => {
            const entry = entries.get(entryId);
            if (!entry)
                throw new Error(`unknown entry ${entryId}`);
            entry.published_revision_id = revisionId;
            entry.status = 'published';
            entry.updated_at = updatedAt;
            entry.published_at = updatedAt;
        },
        unpublishDomainEntry: async (entryId, updatedAt) => {
            const entry = entries.get(entryId);
            if (!entry)
                throw new Error(`unknown entry ${entryId}`);
            entry.status = 'draft';
            entry.updated_at = updatedAt;
        },
        getDomainRevision: async (entryId, revisionId) => revisions.get(revisionKey(entryId, revisionId)) ?? null,
        listDomainRevisions: async (entryId) => [...revisions.values()]
            .filter((revision) => revision.entry_id === entryId)
            .sort((a, b) => b.version - a.version)
            .map((revision) => ({
            id: revision.id,
            version: revision.version,
            created_at: revision.created_at,
            message: revision.message,
            author: revision.author_email,
        })),
        nextDomainRevisionVersion: async (entryId) => [...revisions.values()]
            .filter((revision) => revision.entry_id === entryId)
            .reduce((max, revision) => Math.max(max, revision.version), 0) + 1,
        insertDomainRevision: async (row) => {
            const key = revisionKey(row.entry_id, row.id);
            if (revisions.has(key))
                throw new Error(`duplicate revision id ${row.id}`);
            revisions.set(key, { ...row });
        },
        upsertDomainTranslation: async (row) => {
            translations.set(translationKey(row.entry_id, row.locale), { ...row });
        },
        insertDomainEntryWithDraft: async (entry, revision, translation) => {
            if (entries.has(entry.id))
                throw new Error(`duplicate entry id ${entry.id}`);
            const owner = [...entries.values()].find((candidate) => slugKey(candidate.content_type, candidate.slug, candidate.locale) ===
                slugKey(entry.content_type, entry.slug, entry.locale));
            if (owner)
                throw new Error('UNIQUE constraint failed: slug');
            entries.set(entry.id, { ...entry });
            revisions.set(revisionKey(revision.entry_id, revision.id), { ...revision });
            translations.set(translationKey(translation.entry_id, translation.locale), { ...translation });
        },
    };
    return { ...persistence, entries, revisions, translations };
}

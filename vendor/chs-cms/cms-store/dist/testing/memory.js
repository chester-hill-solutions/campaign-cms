import { CmsRevisionConflictError } from '../revision-guard.js';
import { CmsPublishedSlugConflictError, publishedPageSlug } from '../publication.js';
import { createCmsStore } from '../createCmsStore.js';
export function createMemoryPersistence() {
    const entries = new Map();
    const revisions = new Map();
    const mediaAssets = new Map();
    const collections = new Map();
    const categories = new Map();
    const tags = new Map();
    const fields = new Map();
    const entryCollections = new Map();
    const entryTags = new Set();
    const entryMetadata = new Map();
    const formDefinitions = new Map();
    const formResponses = new Map();
    let analyticsConfigJson = null;
    let siteThemeJson = null;
    const getEntry = (id) => entries.get(id);
    const assignmentKey = (entryId, collectionId) => `${entryId}::${collectionId}`;
    const entryTagKey = (entryId, tagId) => `${entryId}::${tagId}`;
    const metadataKey = (entryId, collectionId, fieldKey) => `${entryId}::${collectionId}::${fieldKey}`;
    const persistence = {
        // --- content entries + revisions ---
        listContentEntries: async () => [...entries.values()].sort((a, b) => a.id.localeCompare(b.id)),
        getRevisionPayloadById: async (id) => revisions.get(id)?.payload ?? null,
        getPublishedPayloadJson: async (entryId) => {
            const entry = getEntry(entryId);
            if (!entry?.published_revision_id)
                return null;
            const revision = revisions.get(entry.published_revision_id);
            return revision?.entry_id === entryId ? revision.payload : null;
        },
        listPublishedPagePayloads: async (filter) => [...entries.values()]
            .filter((entry) => entry.published_revision_id)
            .sort((a, b) => a.id.localeCompare(b.id))
            .flatMap((entry) => {
            const revision = revisions.get(entry.published_revision_id);
            return revision?.entry_id === entry.id && (!filter || publishedPageSlug(entry.id, revision.payload, filter.homeEntryId) === filter.slug) ? [{ entryId: entry.id, revisionId: revision.id,
                    publishedAt: entry.published_at, payload: revision.payload, listingSnapshotJson: revision.listing_snapshot_json }] : [];
        }),
        getPageDocEntryIdBySlug: async (slug) => {
            for (const entry of entries.values()) {
                if (entry.type === 'page_doc' && entry.slug === slug)
                    return entry.id;
            }
            return null;
        },
        getContentEntryRow: async (entryId) => getEntry(entryId) ?? null,
        getContentEntryWithPublishedAt: async (entryId) => getEntry(entryId) ?? null,
        listPageDocEntries: async () => [...entries.values()]
            .filter((e) => e.type === 'page_doc')
            .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
            .map((e) => ({
            ...e,
            published_at: e.published_at ?? null,
            updated_at: e.updated_at ?? '',
        })),
        contentEntryExists: async (entryId) => entries.has(entryId),
        nextRevisionVersion: async (entryId) => {
            let max = 0;
            for (const rev of revisions.values()) {
                if (rev.entry_id === entryId)
                    max = Math.max(max, rev.version);
            }
            return max + 1;
        },
        insertContentEntry: async (row) => {
            entries.set(row.id, {
                id: row.id,
                type: row.type,
                slug: row.slug,
                title: row.title,
                status: row.status,
                published_revision_id: null,
                draft_revision_id: null,
                published_at: null,
                created_at: row.created_at,
                updated_at: row.updated_at,
            });
        },
        updateContentEntryMetadata: async (entryId, title, slug, updatedAt) => {
            const entry = getEntry(entryId);
            if (!entry)
                return;
            entry.title = title;
            entry.slug = slug;
            entry.updated_at = updatedAt;
        },
        setContentEntryType: async (entryId, type) => {
            const entry = getEntry(entryId);
            if (entry)
                entry.type = type;
        },
        insertRevisionAndSetDraft: async (rev, entryId, updatedAt, expectedRevisionId, metadata) => {
            if (rev.listing_snapshot_json == null)
                throw new Error('Revision listing snapshot is required');
            const entry = getEntry(entryId);
            if (!entry || entry.draft_revision_id !== expectedRevisionId)
                return { changes: 0 };
            const version = Math.max(0, ...[...revisions.values()].filter(row => row.entry_id === entryId).map(row => row.version)) + 1;
            revisions.set(rev.id, { ...rev, version });
            if (metadata)
                Object.assign(entry, metadata);
            if (entry) {
                entry.draft_revision_id = rev.id;
                entry.updated_at = updatedAt;
            }
            return { changes: 1 };
        },
        publishEntry: async (entryId, expectedRevisionId, context) => {
            const entry = getEntry(entryId);
            if (!entry?.draft_revision_id || entry.draft_revision_id !== expectedRevisionId)
                return { changes: 0 };
            const revision = revisions.get(expectedRevisionId);
            if (!revision || revision.entry_id !== entryId)
                return { changes: 0 };
            const slug = publishedPageSlug(entryId, revision.payload, context?.homeEntryId);
            if (slug !== null && [...entries.values()].some((other) => other.id !== entryId
                && other.published_revision_id
                && publishedPageSlug(other.id, revisions.get(other.published_revision_id)?.payload ?? '', context?.homeEntryId) === slug)) {
                throw new CmsPublishedSlugConflictError();
            }
            entry.published_revision_id = entry.draft_revision_id;
            entry.status = 'published';
            entry.published_at = new Date().toISOString();
            return { changes: 1 };
        },
        publishOperationalEntry: async (entryId, rev, context) => {
            if (rev.listing_snapshot_json == null)
                throw new Error('Revision listing snapshot is required');
            if (!getEntry(entryId))
                throw new Error('Operational entry not found');
            if (context && 'expectedDraftRevisionId' in context && getEntry(entryId).draft_revision_id !== context.expectedDraftRevisionId)
                throw new CmsRevisionConflictError();
            const slug = publishedPageSlug(entryId, rev.payload, context?.homeEntryId);
            if (slug !== null && [...entries.values()].some((other) => other.id !== entryId
                && other.published_revision_id
                && publishedPageSlug(other.id, revisions.get(other.published_revision_id)?.payload ?? '', context?.homeEntryId) === slug)) {
                throw new CmsPublishedSlugConflictError();
            }
            const version = Math.max(0, ...[...revisions.values()].filter((row) => row.entry_id === entryId).map((row) => row.version)) + 1;
            revisions.set(rev.id, { ...rev, version });
            const entry = getEntry(entryId);
            if (entry) {
                entry.published_revision_id = rev.id;
                entry.draft_revision_id = rev.id;
                entry.status = 'published';
                entry.published_at = rev.created_at;
            }
        },
        getRevisionForEntry: async (entryId, revisionId) => {
            const rev = revisions.get(revisionId);
            if (!rev || rev.entry_id !== entryId)
                return null;
            return { payload: rev.payload, listingSnapshotJson: rev.listing_snapshot_json };
        },
        listRevisionsForEntry: async (entryId) => [...revisions.values()]
            .filter((r) => r.entry_id === entryId)
            .sort((a, b) => b.version - a.version)
            .slice(0, 50)
            .map((r) => ({
            id: r.id,
            version: r.version,
            created_at: r.created_at,
            message: r.message,
        })),
        isSlugTaken: async (slug) => {
            for (const entry of entries.values()) {
                if (entry.slug === slug)
                    return { id: entry.id };
            }
            return null;
        },
        insertPageDocEntry: async (row) => {
            await persistence.insertContentEntry(row);
        },
        // --- media assets ---
        listMediaAssets: async (limit) => [...mediaAssets.values()]
            .sort((a, b) => b.created_at.localeCompare(a.created_at))
            .slice(0, limit),
        getMediaAssetByKey: async (key) => mediaAssets.get(key) ?? null,
        insertMediaAsset: async (row) => {
            mediaAssets.set(row.r2_key, row);
        },
        // --- taxonomy: collections ---
        listCollections: async () => [...collections.values()].sort((a, b) => a.label.localeCompare(b.label)),
        getCollection: async (id) => collections.get(id) ?? null,
        insertCollection: async (row) => {
            if (collections.has(row.id))
                throw new Error(`collection exists: ${row.id}`);
            collections.set(row.id, { ...row });
        },
        updateCollection: async (id, patch, updatedAt) => {
            const row = collections.get(id);
            if (!row)
                return;
            if (patch.label !== undefined)
                row.label = patch.label;
            if (patch.description !== undefined)
                row.description = patch.description;
            row.updated_at = updatedAt;
        },
        deleteCollection: async (id) => {
            collections.delete(id);
        },
        // --- taxonomy: categories ---
        listCollectionCategories: async (collectionId) => [...categories.values()]
            .filter((c) => c.collection_id === collectionId)
            .sort((a, b) => a.sort_order - b.sort_order),
        getCollectionCategory: async (id) => categories.get(id) ?? null,
        insertCollectionCategory: async (row) => {
            if (categories.has(row.id))
                throw new Error(`category exists: ${row.id}`);
            categories.set(row.id, { ...row });
        },
        updateCollectionCategory: async (id, patch) => {
            const row = categories.get(id);
            if (!row)
                return;
            if (patch.label !== undefined)
                row.label = patch.label;
            if (patch.slug !== undefined)
                row.slug = patch.slug;
            if (patch.description !== undefined)
                row.description = patch.description;
            if (patch.sortOrder !== undefined)
                row.sort_order = patch.sortOrder;
        },
        deleteCollectionCategory: async (id) => {
            categories.delete(id);
        },
        // --- taxonomy: tags ---
        listTags: async () => [...tags.values()].sort((a, b) => a.label.localeCompare(b.label)),
        getTag: async (id) => tags.get(id) ?? null,
        insertTag: async (row) => {
            if (tags.has(row.id))
                throw new Error(`tag exists: ${row.id}`);
            tags.set(row.id, { ...row });
        },
        updateTag: async (id, patch) => {
            const row = tags.get(id);
            if (!row)
                return;
            if (patch.label !== undefined)
                row.label = patch.label;
            if (patch.slug !== undefined)
                row.slug = patch.slug;
            if (patch.description !== undefined)
                row.description = patch.description;
        },
        deleteTag: async (id) => {
            tags.delete(id);
        },
        // --- taxonomy: collection fields ---
        listCollectionFields: async (collectionId) => [...fields.values()]
            .filter((f) => f.collection_id === collectionId)
            .sort((a, b) => a.sort_order - b.sort_order),
        getCollectionField: async (id) => fields.get(id) ?? null,
        insertCollectionField: async (row) => {
            if (fields.has(row.id))
                throw new Error(`field exists: ${row.id}`);
            fields.set(row.id, { ...row });
        },
        updateCollectionField: async (id, patch) => {
            const row = fields.get(id);
            if (!row)
                return;
            if (patch.key !== undefined)
                row.key = patch.key;
            if (patch.label !== undefined)
                row.label = patch.label;
            if (patch.type !== undefined)
                row.type = patch.type;
            if (patch.required !== undefined)
                row.required = patch.required;
            if (patch.configJson !== undefined)
                row.config_json = patch.configJson;
            if (patch.sortOrder !== undefined)
                row.sort_order = patch.sortOrder;
        },
        deleteCollectionField: async (id) => {
            fields.delete(id);
        },
        // --- taxonomy: entry assignments, tags, metadata ---
        upsertEntryCollectionAssignment: async (row) => {
            entryCollections.set(assignmentKey(row.entry_id, row.collection_id), { ...row });
        },
        deleteEntryCollectionAssignment: async (entryId, collectionId) => {
            entryCollections.delete(assignmentKey(entryId, collectionId));
        },
        getEntryCollectionAssignment: async (entryId, collectionId) => entryCollections.get(assignmentKey(entryId, collectionId)) ?? null,
        listEntriesByCollection: async (collectionId, options) => {
            const publishedOnly = (options?.status ?? 'published') === 'published';
            const assignments = [...entryCollections.values()].filter((a) => {
                if (a.collection_id !== collectionId)
                    return false;
                if (options?.categoryId && a.category_id !== options.categoryId)
                    return false;
                if (options?.featured !== undefined && a.featured !== options.featured)
                    return false;
                return true;
            });
            const rows = assignments
                .map((a) => ({ assignment: a, entry: getEntry(a.entry_id) }))
                .filter((x) => Boolean(x.entry))
                .filter((x) => !publishedOnly ||
                (x.entry.status === 'published' && x.entry.published_revision_id !== null));
            rows.sort((x, y) => {
                const dateCmp = (y.assignment.sort_date ?? '').localeCompare(x.assignment.sort_date ?? '');
                if (dateCmp !== 0)
                    return dateCmp;
                return (x.entry.title ?? '').localeCompare(y.entry.title ?? '');
            });
            return rows.map((x) => x.entry);
        },
        insertEntryTag: async (entryId, tagId) => {
            entryTags.add(entryTagKey(entryId, tagId));
        },
        deleteEntryTag: async (entryId, tagId) => {
            entryTags.delete(entryTagKey(entryId, tagId));
        },
        listTagsForEntry: async (entryId) => [...tags.values()]
            .filter((t) => entryTags.has(entryTagKey(entryId, t.id)))
            .sort((a, b) => a.label.localeCompare(b.label)),
        listEntriesByTag: async (tagId) => [...entries.values()]
            .filter((e) => entryTags.has(entryTagKey(e.id, tagId)))
            .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')),
        upsertEntryMetadataValue: async (entryId, collectionId, fieldKey, valueJson) => {
            entryMetadata.set(metadataKey(entryId, collectionId, fieldKey), valueJson);
        },
        listEntryMetadataValues: async (entryId, collectionId) => {
            const prefix = `${entryId}::${collectionId}::`;
            const rows = [];
            for (const [key, valueJson] of entryMetadata) {
                if (key.startsWith(prefix)) {
                    rows.push({ field_key: key.slice(prefix.length), value_json: valueJson });
                }
            }
            return rows;
        },
        deleteEntryMetadataValue: async (entryId, collectionId, fieldKey) => {
            entryMetadata.delete(metadataKey(entryId, collectionId, fieldKey));
        },
        // --- analytics ---
        getAnalyticsConfigJson: async () => analyticsConfigJson,
        setAnalyticsConfigJson: async (configJson) => {
            analyticsConfigJson = configJson;
        },
        // --- site theme ---
        getSiteThemeJson: async () => siteThemeJson,
        setSiteThemeJson: async (themeJson) => {
            siteThemeJson = themeJson;
        },
        // --- forms ---
        listFormDefinitions: async () => [...formDefinitions.values()].sort((a, b) => a.title.localeCompare(b.title)),
        getFormDefinition: async (id) => formDefinitions.get(id) ?? null,
        insertFormDefinition: async (row) => {
            if (formDefinitions.has(row.id))
                throw new Error(`form exists: ${row.id}`);
            formDefinitions.set(row.id, { ...row });
        },
        updateFormDefinition: async (id, patch, updatedAt) => {
            const row = formDefinitions.get(id);
            if (!row)
                return;
            if (patch.title !== undefined)
                row.title = patch.title;
            if (patch.description !== undefined)
                row.description = patch.description;
            if (patch.fieldsJson !== undefined)
                row.fields_json = patch.fieldsJson;
            if (patch.settingsJson !== undefined)
                row.settings_json = patch.settingsJson;
            row.updated_at = updatedAt;
        },
        deleteFormDefinition: async (id) => {
            formDefinitions.delete(id);
            for (const [key, response] of formResponses) {
                if (response.form_id === id)
                    formResponses.delete(key);
            }
        },
        insertFormResponse: async (row) => {
            formResponses.set(row.id, { ...row });
        },
        countRecentFormResponses: async (ip, windowSeconds) => {
            const cutoff = new Date(Date.now() - windowSeconds * 1000).toISOString();
            let count = 0;
            for (const response of formResponses.values()) {
                if (response.ip === ip && response.submitted_at > cutoff)
                    count++;
            }
            return count;
        },
        listFormResponses: async (formId) => [...formResponses.values()]
            .filter((r) => r.form_id === formId)
            .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)),
        getFormResponse: async (id) => formResponses.get(id) ?? null,
        deleteFormResponse: async (id) => {
            formResponses.delete(id);
        },
    };
    return Object.assign(persistence, { entries, revisions, media: mediaAssets });
}
export function createMemoryMediaStore() {
    const blobs = new Map();
    return {
        blobs,
        put: async (key, bytes) => {
            blobs.set(key, bytes);
        },
        get: async (key) => {
            const bytes = blobs.get(key);
            if (!bytes)
                return null;
            return {
                body: new ReadableStream({
                    start(controller) {
                        controller.enqueue(new Uint8Array(bytes));
                        controller.close();
                    },
                }),
                contentType: 'application/octet-stream',
            };
        },
    };
}
export function createMemoryStorePorts() {
    const persistence = createMemoryPersistence();
    const media = createMemoryMediaStore();
    return {
        db: persistence,
        media,
        persistence,
    };
}
export function createMemoryCmsStore(config, ports = createMemoryStorePorts()) {
    return createCmsStore(() => ports, config);
}

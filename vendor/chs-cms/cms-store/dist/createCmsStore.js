import { emptyEntryListingSnapshot, analyticsConfigSchema, cmsCollectionSchema, collectionCategorySchema, collectionFieldSchema, collectionTagSchema, defaultAnalyticsConfig, defaultSiteTheme, entryCollectionAssignmentSchema, escapeCsvFormula, formDefinitionSchema, formSettingsDefaults, pageDocPayloadSchema, portfolioCollectionDefinition, siteThemeSchema, normalizeCmsSlug, } from '@chester-hill-solutions/cms-core';
import { z } from 'zod';
import { CmsRevisionConflictError, assertCmsRevision } from './revision-guard.js';
import { streamMedia } from './streamMedia.js';
import { publishedPageSlug } from './publication.js';
import { createSiteSettingsStore } from './siteSettings.js';
import { CmsListingValidationError, parseEntryListingSnapshot, resolveEntryListingSnapshot, assertListingPublishable } from './listingSnapshot.js';
const DEFAULT_MEDIA_TYPES = {
    'image/jpeg': { extension: 'jpg', maxBytes: 5 * 1024 * 1024 },
    'image/png': { extension: 'png', maxBytes: 5 * 1024 * 1024 },
    'image/webp': { extension: 'webp', maxBytes: 5 * 1024 * 1024 },
    'image/gif': { extension: 'gif', maxBytes: 5 * 1024 * 1024 },
};
const FORM_RATE_LIMIT_WINDOW_SECONDS = 60;
const FORM_RATE_LIMIT_MAX = 5;
/** Cap on the body kept for a spam submission, which is the whole request body. */
const MAX_FORM_RESPONSE_BYTES = 4096;
export function createCmsStore(getPorts, config) {
    /**
     * `db` is the store's isolation boundary and the type requires it. This guard makes the
     * requirement hold at runtime as well, so a port built without one fails with a named
     * error instead of a `TypeError` from deep inside a query. `mediaStore` below is the
     * existing precedent for this shape.
     */
    const db = () => {
        const persistence = getPorts().db;
        if (!persistence)
            throw new Error('CMS store: no persistence configured');
        return persistence;
    };
    const siteSettings = createSiteSettingsStore(db, { defaults: config.siteSettingsDefaults, revisionAuthor: config.revisionAuthor });
    const mediaStore = () => {
        const media = getPorts().media;
        if (!media)
            throw new Error('CMS store: no media store configured');
        return media;
    };
    function isHomeEntry(entryId) {
        return config.homeEntryId != null && entryId === config.homeEntryId;
    }
    /**
     * Slug persisted on the content_entries row for a page doc.
     * The home entry is pinned to '' (site root) — never NULL — so
     * `getPageDocEntryIdBySlug('')` keeps resolving it. Other entries
     * persist a normalized slug, or NULL when they have none.
     */
    function resolveStoredSlug(entryId, rawSlug) {
        if (isHomeEntry(entryId))
            return '';
        const normalized = normalizeCmsSlug(rawSlug ?? '');
        return normalized === '' ? null : normalized;
    }
    /**
     * A non-home page doc needs a slug before it can go live: without one
     * it has no public URL, and publishing it silently would strand the
     * entry as unreachable.
     */
    function assertPageSlugPublishable(entryId, page) {
        if (publishedPageSlug(entryId, JSON.stringify(page), config.homeEntryId) === null) {
            throw new Error('This page has an invalid slug and cannot be published.');
        }
        if (!isHomeEntry(entryId) && normalizeCmsSlug(page.slug) === '') {
            throw new Error('This page needs a slug before it can be published.');
        }
    }
    async function assertPageDocPublishable(entryId, revisionId) {
        const revision = await db().getRevisionForEntry(entryId, revisionId);
        const row = await db().getContentEntryRow(entryId);
        let value;
        try {
            value = JSON.parse(revision?.payload ?? 'null');
        }
        catch {
            throw new Error('This page revision is invalid and cannot be published.');
        }
        const page = pageDocPayloadSchema.safeParse(value);
        if (page.success) {
            assertPageSlugPublishable(entryId, page.data);
        }
        else if (row?.type === 'page_doc' || (value && typeof value === 'object' && 'kind' in value && value.kind === 'pageDoc')) {
            throw new Error('This page revision is invalid and cannot be published.');
        }
    }
    async function listContentEntries() {
        return db().listContentEntries();
    }
    async function getPublishedPayloadJson(entryId) {
        return db().getPublishedPayloadJson(entryId);
    }
    async function getPublishedPageDoc(entryId) {
        try {
            const raw = await getPublishedPayloadJson(entryId);
            if (!raw)
                return null;
            const parsed = pageDocPayloadSchema.safeParse(JSON.parse(raw));
            return parsed.success ? parsed.data : null;
        }
        catch {
            return null;
        }
    }
    /** One joined read; no mutable title/slug columns or draft payloads enter public routing. */
    async function readPublishedPageDocs(slug) {
        const rows = await db().listPublishedPagePayloads(slug === undefined ? undefined : { slug, homeEntryId: config.homeEntryId });
        const pages = [];
        for (const row of rows) {
            try {
                const parsed = pageDocPayloadSchema.safeParse(JSON.parse(row.payload));
                if (!parsed.success)
                    continue;
                const listingSnapshot = parseEntryListingSnapshot(row.listingSnapshotJson);
                if (!listingSnapshot)
                    continue;
                const slug = publishedPageSlug(row.entryId, row.payload, config.homeEntryId);
                if (slug === null || (slug === '' && config.homeEntryId != null && !isHomeEntry(row.entryId)))
                    continue;
                pages.push({ entryId: row.entryId, revisionId: row.revisionId, publishedAt: row.publishedAt,
                    page: { ...parsed.data, slug }, listingSnapshot });
            }
            catch { /* Invalid stored documents are not public pages. */ }
        }
        // Old data can contain collisions. Hide every ambiguous route rather than select an
        // arbitrary winner; publishers can repair it by publishing a distinct slug.
        const counts = new Map();
        for (const { page } of pages)
            counts.set(page.slug, (counts.get(page.slug) ?? 0) + 1);
        return pages.filter(({ page }) => counts.get(page.slug) === 1);
    }
    async function listPublishedPageDocs() {
        return readPublishedPageDocs();
    }
    async function getPublishedPageDocBySlug(slug) {
        const normalized = normalizeCmsSlug(slug);
        return (await readPublishedPageDocs(normalized)).find(({ page }) => page.slug === normalized)?.page ?? null;
    }
    async function listPageDocEntries() {
        return db().listPageDocEntries();
    }
    async function getContentEntryRow(entryId) {
        return db().getContentEntryRow(entryId);
    }
    async function getEntryEditorState(entryId) {
        const entry = await db().getContentEntryWithPublishedAt(entryId);
        if (!entry)
            return null;
        let published = null;
        let draft = null;
        let publishedListing = null;
        let draftListing = null;
        if (entry.published_revision_id) {
            const p = await db().getRevisionForEntry(entryId, entry.published_revision_id);
            if (p) {
                published = config.parsePayload(JSON.parse(p.payload));
                publishedListing = parseEntryListingSnapshot(p.listingSnapshotJson);
            }
        }
        if (entry.draft_revision_id) {
            const d = await db().getRevisionForEntry(entryId, entry.draft_revision_id);
            if (d) {
                draft = config.parsePayload(JSON.parse(d.payload));
                draftListing = parseEntryListingSnapshot(d.listingSnapshotJson);
            }
        }
        const hasDraft = Boolean(entry.draft_revision_id);
        const hasPublished = Boolean(entry.published_revision_id);
        const hasUnpublishedChanges = hasDraft &&
            (!hasPublished || entry.draft_revision_id !== entry.published_revision_id);
        return {
            entry,
            published,
            draft,
            draftListing,
            publishedListing,
            meta: {
                entryExists: true,
                hasDraft,
                hasPublished,
                hasUnpublishedChanges,
                publishedAt: entry.published_at ?? null,
            },
        };
    }
    async function ensureContentEntry(entryId, type, title, slug) {
        if (await db().contentEntryExists(entryId))
            return;
        const now = new Date().toISOString();
        await db().insertContentEntry({
            id: entryId,
            type,
            slug: slug ?? null,
            title,
            status: 'draft',
            created_at: now,
            updated_at: now,
        });
    }
    async function syncContentEntryMetadata(entryId, title, slug) {
        const now = new Date().toISOString();
        await db().updateContentEntryMetadata(entryId, title, slug, now);
    }
    async function insertDraftRevisionRaw(entryId, payload, message, expectedRevisionId, metadata, listingSnapshot) {
        const id = `rev_${crypto.randomUUID()}`;
        const version = 0;
        const payloadStr = JSON.stringify(payload);
        const now = new Date().toISOString();
        const author = config.revisionAuthor?.() ?? 'admin';
        const baseRevision = expectedRevisionId ?? (await getContentEntryRow(entryId))?.published_revision_id;
        const listing = listingSnapshot ?? (baseRevision ? await getEntryListingSnapshot(entryId, baseRevision) : emptyEntryListingSnapshot());
        if (!listing)
            throw new Error('Invalid revision listing snapshot');
        const result = await db().insertRevisionAndSetDraft({
            id,
            entry_id: entryId,
            payload: payloadStr,
            listing_snapshot_json: JSON.stringify(listing),
            version,
            created_at: now,
            created_by: author,
            message,
        }, entryId, now, expectedRevisionId, metadata);
        if (!result.changes)
            throw new CmsRevisionConflictError();
        return id;
    }
    async function insertDraftRevision(entryId, payload, message, expectedRevisionId) {
        return insertDraftRevisionRaw(entryId, payload, message, expectedRevisionId);
    }
    async function publishEntry(entryId, expectedRevisionId) {
        const entry = await getContentEntryRow(entryId);
        assertCmsRevision(expectedRevisionId, entry?.draft_revision_id ?? null);
        await assertPageDocPublishable(entryId, expectedRevisionId);
        const listing = await getEntryListingSnapshot(entryId, expectedRevisionId);
        if (!listing)
            throw new Error('Invalid revision listing snapshot');
        await assertListingPublishable(db(), listing);
        const result = await db().publishEntry(entryId, expectedRevisionId, { homeEntryId: config.homeEntryId });
        if (!result.changes)
            throw new CmsRevisionConflictError();
        return { published: result.changes > 0 };
    }
    /** Publish immediately (settings-style entries with no draft step). */
    async function publishOperationalEntry(entryId, payload, message, listingSnapshot, expectedDraftRevisionId) {
        const parsed = config.parsePayload(payload);
        if (!parsed)
            throw new Error('Invalid operational payload');
        const page = pageDocPayloadSchema.safeParse(parsed);
        let listing = emptyEntryListingSnapshot();
        if (page.success) {
            assertPageSlugPublishable(entryId, page.data);
            if (listingSnapshot === undefined)
                throw new Error('Operational page publication requires an explicit listing snapshot');
            const entry = await getContentEntryRow(entryId);
            if (expectedDraftRevisionId === undefined)
                throw new CmsRevisionConflictError();
            assertCmsRevision(expectedDraftRevisionId, entry?.draft_revision_id ?? null);
            const baseRevision = expectedDraftRevisionId ?? entry?.published_revision_id;
            const previous = baseRevision ? await getEntryListingSnapshot(entryId, baseRevision) : emptyEntryListingSnapshot();
            if (!previous)
                throw new Error('Invalid published listing snapshot');
            listing = await resolveEntryListingSnapshot(db(), listingSnapshot, previous);
            await assertListingPublishable(db(), listing);
        }
        const id = `rev_${crypto.randomUUID()}`;
        const payloadStr = JSON.stringify(parsed);
        const now = new Date().toISOString();
        await db().publishOperationalEntry(entryId, {
            id,
            entry_id: entryId,
            payload: payloadStr,
            listing_snapshot_json: JSON.stringify(listing),
            version: 0,
            created_at: now,
            created_by: config.revisionAuthor?.() ?? 'admin',
            message,
        }, { homeEntryId: config.homeEntryId, ...(page.success ? { expectedDraftRevisionId } : {}) });
    }
    async function savePageDocDraft(entryId, content, expectedRevisionId, message = 'draft', listingSnapshot) {
        const payload = { kind: 'pageDoc', version: 1, ...content };
        const parsed = pageDocPayloadSchema.safeParse(payload);
        if (!parsed.success) {
            return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
        }
        const existing = await getContentEntryRow(entryId);
        assertCmsRevision(expectedRevisionId, existing?.draft_revision_id ?? null);
        const baseRevision = expectedRevisionId ?? existing?.published_revision_id;
        const previousListing = baseRevision ? await getEntryListingSnapshot(entryId, baseRevision) : emptyEntryListingSnapshot();
        if (!previousListing)
            throw new Error('Invalid revision listing snapshot');
        const listing = listingSnapshot === undefined ? previousListing : await resolveEntryListingSnapshot(db(), listingSnapshot, previousListing);
        await ensureContentEntry(entryId, 'page_doc', content.title, resolveStoredSlug(entryId, content.slug));
        const revisionId = await insertDraftRevisionRaw(entryId, parsed.data, message, expectedRevisionId, {
            type: 'page_doc', title: content.title, slug: resolveStoredSlug(entryId, content.slug),
        }, listing);
        return { ok: true, revisionId };
    }
    async function getPageDocEditorState(entryId) {
        const row = await getContentEntryRow(entryId);
        if (!row || row.type !== 'page_doc')
            return null;
        return getEntryEditorState(entryId);
    }
    async function restoreRevisionAsDraft(entryId, revisionId, expectedRevisionId) {
        const row = await db().getRevisionForEntry(entryId, revisionId);
        if (!row)
            return { ok: false, error: 'Revision not found' };
        const parsed = config.parsePayload(JSON.parse(row.payload));
        if (!parsed)
            return { ok: false, error: 'Invalid revision payload' };
        // A restore is a rollback of content, not of validation. The write path parses the
        // payload with the page doc schema and refuses anything that does not match, and the
        // public read path parses the published payload with the same schema — so a revision
        // written before the schema moved on would be reinstated as the current draft, then
        // published, and the page would read as null and 404 for every visitor.
        const page = pageDocPayloadSchema.safeParse(parsed);
        if (!page.success)
            return { ok: false, error: 'Invalid revision payload' };
        const metadata = { type: 'page_doc', title: page.data.title, slug: resolveStoredSlug(entryId, page.data.slug) };
        const listing = parseEntryListingSnapshot(row.listingSnapshotJson);
        if (!listing)
            return { ok: false, error: 'Invalid revision listing snapshot' };
        const restoredId = await insertDraftRevisionRaw(entryId, page.data, `restore:${revisionId}`, expectedRevisionId, metadata, listing);
        return { ok: true, revisionId: restoredId };
    }
    async function getEntryListingSnapshot(entryId, revisionId) {
        const row = await db().getRevisionForEntry(entryId, revisionId);
        return row ? parseEntryListingSnapshot(row.listingSnapshotJson) : null;
    }
    async function saveEntryListingDraft(entryId, snapshot, expectedRevisionId, message = 'listing draft') {
        const entry = await getContentEntryRow(entryId);
        assertCmsRevision(expectedRevisionId, entry?.draft_revision_id ?? null);
        if (!expectedRevisionId)
            return { ok: false, error: 'Save the page before changing its listing' };
        const revision = await db().getRevisionForEntry(entryId, expectedRevisionId);
        if (!revision)
            return { ok: false, error: 'Revision not found' };
        const previous = parseEntryListingSnapshot(revision.listingSnapshotJson);
        if (!previous)
            return { ok: false, error: 'Invalid revision listing snapshot' };
        const listing = await resolveEntryListingSnapshot(db(), snapshot, previous);
        const revisionId = await insertDraftRevisionRaw(entryId, JSON.parse(revision.payload), message, expectedRevisionId, undefined, listing);
        return { ok: true, revisionId };
    }
    async function getDraftListing(entryId) {
        const entry = await getContentEntryRow(entryId);
        const revisionId = entry?.draft_revision_id ?? entry?.published_revision_id;
        if (!revisionId)
            return emptyEntryListingSnapshot();
        const snapshot = await getEntryListingSnapshot(entryId, revisionId);
        if (!snapshot)
            throw new Error('Invalid revision listing snapshot');
        return snapshot;
    }
    async function getEntryRevisionPayload(entryId, revisionId) {
        const row = await db().getRevisionForEntry(entryId, revisionId);
        return row ? config.parsePayload(JSON.parse(row.payload)) : null;
    }
    async function listRevisionsForEntry(entryId) {
        return db().listRevisionsForEntry(entryId);
    }
    async function isPageDocSlugTaken(slug, excludeEntryId) {
        const row = await db().isSlugTaken(slug);
        if (!row)
            return false;
        if (excludeEntryId && row.id === excludeEntryId)
            return false;
        return true;
    }
    async function createPageDocEntry(input) {
        const slugError = config.validateNewPageSlug(input.slug);
        if (slugError)
            return { ok: false, error: slugError };
        const slug = input.slug.replace(/^\/+|\/+$/g, '');
        if (await isPageDocSlugTaken(slug)) {
            return { ok: false, error: 'A page with this slug already exists.' };
        }
        let entryId = config.entryIdFromPageSlug(slug);
        if (await getContentEntryRow(entryId)) {
            entryId = `${entryId}-${crypto.randomUUID().slice(0, 6)}`;
        }
        const content = config.newPageDoc({ title: input.title, slug });
        const payload = { kind: 'pageDoc', version: 1, ...content };
        const parsed = pageDocPayloadSchema.safeParse(payload);
        if (!parsed.success) {
            return { ok: false, error: 'Could not create page defaults.' };
        }
        const now = new Date().toISOString();
        await db().insertPageDocEntry({
            id: entryId,
            type: 'page_doc',
            slug,
            title: input.title.trim(),
            status: 'draft',
            created_at: now,
            updated_at: now,
        });
        await insertDraftRevisionRaw(entryId, parsed.data, 'create', null);
        return { ok: true, entryId };
    }
    async function listPageDocEntriesWithStatus() {
        const entries = await listPageDocEntries();
        return entries.map((entry) => {
            const hasDraft = Boolean(entry.draft_revision_id);
            const hasPublished = Boolean(entry.published_revision_id);
            const hasUnpublishedChanges = hasDraft && (!hasPublished || entry.draft_revision_id !== entry.published_revision_id);
            let statusLabel = 'Empty entry';
            if (hasUnpublishedChanges)
                statusLabel = 'Draft (unpublished changes)';
            else if (hasPublished)
                statusLabel = 'Published';
            else if (hasDraft)
                statusLabel = 'Draft only';
            return { ...entry, statusLabel };
        });
    }
    // ---------------------------------------------------------------- seo --
    async function generateSitemapXml(options) {
        const base = options.baseUrl.replace(/\/+$/, '');
        const allowed = options.entries ? new Set(options.entries.map((entry) => entry.id)) : null;
        const pages = await listPublishedPageDocs();
        const lines = [
            `<?xml version="1.0" encoding="UTF-8"?>`,
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
        ];
        for (const { entryId, page, publishedAt } of pages) {
            if ((allowed && !allowed.has(entryId)) || page.enabled !== 1 || page.noindex === 1)
                continue;
            const slug = page.slug;
            const loc = slug === '' ? `${base}/` : `${base}/${slug}`;
            lines.push(`  <url>`);
            lines.push(`    <loc>${escapeXml(loc)}</loc>`);
            if (publishedAt)
                lines.push(`    <lastmod>${escapeXml(publishedAt.slice(0, 10))}</lastmod>`);
            lines.push(`    <changefreq>${slug === '' ? 'weekly' : 'monthly'}</changefreq>`);
            lines.push(`    <priority>${slug === '' ? '1.0' : '0.8'}</priority>`);
            lines.push(`  </url>`);
        }
        lines.push(`</urlset>`);
        return lines.join('\n');
    }
    async function generateRobotsTxt(options) {
        const path = options.sitemapPath
            ? options.sitemapPath.startsWith('/')
                ? options.sitemapPath
                : `/${options.sitemapPath}`
            : '/sitemap.xml';
        return `User-agent: *\nAllow: /\nSitemap: ${options.baseUrl.replace(/\/+$/, '')}${path}`;
    }
    function escapeXml(value) {
        return value.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '&':
                    return '&amp;';
                case "'":
                    return '&apos;';
                case '"':
                    return '&quot;';
                default:
                    return c;
            }
        });
    }
    // ---------------------------------------------------------------- media --
    async function listMediaAssets(limit = 50) {
        return db().listMediaAssets(limit);
    }
    async function getMediaAssetByKey(r2Key) {
        return db().getMediaAssetByKey(r2Key);
    }
    async function uploadMediaAsset(input) {
        const types = config.mediaUploadPolicy?.types ?? DEFAULT_MEDIA_TYPES;
        const mediaType = Object.hasOwn(types, input.mime) ? types[input.mime] : undefined;
        if (!mediaType || !/^[a-z0-9]+$/.test(mediaType.extension) || !Number.isSafeInteger(mediaType.maxBytes) || mediaType.maxBytes < 1) {
            return { ok: false, error: 'Unsupported file type.' };
        }
        if (!input.bytes.byteLength)
            return { ok: false, error: 'Empty file.' };
        if (input.bytes.byteLength > mediaType.maxBytes) {
            return { ok: false, error: 'File too large.' };
        }
        if (config.mediaUploadPolicy?.requireAlt !== false && !input.alt.trim()) {
            return { ok: false, error: 'Alt text is required.' };
        }
        const id = `media_${crypto.randomUUID()}`;
        const ext = mediaType.extension;
        const r2Key = `${id}.${ext}`;
        await mediaStore().put(r2Key, input.bytes, { contentType: input.mime });
        const now = new Date().toISOString();
        const asset = {
            id,
            r2_key: r2Key,
            filename: input.filename,
            mime: input.mime,
            size_bytes: input.bytes.byteLength,
            width: input.width ?? null,
            height: input.height ?? null,
            alt: input.alt.trim(),
            created_at: now,
        };
        await db().insertMediaAsset(asset);
        return { ok: true, asset };
    }
    async function streamMediaFromR2(r2Key) {
        return streamMedia(r2Key, mediaStore());
    }
    // ------------------------------------------------------- taxonomy ---
    // --- collections ---
    async function listCollections() {
        const rows = await db().listCollections();
        return rows.map((r) => ({
            id: r.id,
            label: r.label,
            description: r.description ?? undefined,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
        }));
    }
    async function getCollection(id) {
        const row = await db().getCollection(id);
        if (!row)
            return null;
        return {
            id: row.id,
            label: row.label,
            description: row.description ?? undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
    async function createCollection(input) {
        const now = new Date().toISOString();
        const parsed = cmsCollectionSchema.safeParse({
            id: input.id,
            label: input.label,
            description: input.description,
            createdAt: now,
            updatedAt: now,
        });
        if (!parsed.success) {
            const errs = parsed.error.flatten().fieldErrors;
            return { ok: false, error: errs.id?.[0] ?? errs.label?.[0] ?? 'Invalid collection' };
        }
        try {
            await db().insertCollection({
                id: input.id,
                label: input.label,
                description: input.description ?? null,
                created_at: now,
                updated_at: now,
            });
            return { ok: true, collection: parsed.data };
        }
        catch (e) {
            return { ok: false, error: String(e) };
        }
    }
    async function updateCollection(id, input) {
        const existing = await db().getCollection(id);
        if (!existing)
            return { ok: false, error: 'Collection not found' };
        const now = new Date().toISOString();
        await db().updateCollection(id, input, now);
        return { ok: true };
    }
    async function deleteCollection(id) {
        const existing = await db().getCollection(id);
        if (!existing)
            return { ok: false, error: 'Collection not found' };
        await db().deleteCollection(id);
        return { ok: true };
    }
    // --- categories ---
    async function listCollectionCategories(collectionId) {
        const rows = await db().listCollectionCategories(collectionId);
        return rows.map((r) => ({
            id: r.id,
            collectionId: r.collection_id,
            label: r.label,
            slug: r.slug,
            description: r.description ?? undefined,
            sortOrder: r.sort_order,
        }));
    }
    async function getCollectionCategory(id) {
        const row = await db().getCollectionCategory(id);
        if (!row)
            return null;
        return {
            id: row.id,
            collectionId: row.collection_id,
            label: row.label,
            slug: row.slug,
            description: row.description ?? undefined,
            sortOrder: row.sort_order,
        };
    }
    async function createCollectionCategory(input) {
        const parsed = collectionCategorySchema.safeParse({
            id: input.id,
            collectionId: input.collectionId,
            label: input.label,
            slug: input.slug,
            description: input.description,
            sortOrder: input.sortOrder ?? 0,
        });
        if (!parsed.success) {
            const errs = parsed.error.flatten().fieldErrors;
            return { ok: false, error: errs.id?.[0] ?? errs.label?.[0] ?? 'Invalid category' };
        }
        const d = parsed.data;
        try {
            await db().insertCollectionCategory({
                id: d.id,
                collection_id: d.collectionId,
                label: d.label,
                slug: d.slug,
                description: d.description ?? null,
                sort_order: d.sortOrder,
            });
            return { ok: true, category: d };
        }
        catch (e) {
            return { ok: false, error: String(e) };
        }
    }
    async function updateCollectionCategory(id, input) {
        const existing = await db().getCollectionCategory(id);
        if (!existing)
            return { ok: false, error: 'Category not found' };
        await db().updateCollectionCategory(id, input);
        return { ok: true };
    }
    async function deleteCollectionCategory(id) {
        const existing = await db().getCollectionCategory(id);
        if (!existing)
            return { ok: false, error: 'Category not found' };
        await db().deleteCollectionCategory(id);
        return { ok: true };
    }
    // --- tags ---
    async function listTags() {
        const rows = await db().listTags();
        return rows.map((r) => ({
            id: r.id,
            label: r.label,
            slug: r.slug,
            description: r.description ?? undefined,
        }));
    }
    async function getTag(id) {
        const row = await db().getTag(id);
        if (!row)
            return null;
        return {
            id: row.id,
            label: row.label,
            slug: row.slug,
            description: row.description ?? undefined,
        };
    }
    async function createTag(input) {
        const parsed = collectionTagSchema.safeParse({
            id: input.id,
            label: input.label,
            slug: input.slug,
            description: input.description,
        });
        if (!parsed.success) {
            const errs = parsed.error.flatten().fieldErrors;
            return { ok: false, error: errs.id?.[0] ?? errs.label?.[0] ?? 'Invalid tag' };
        }
        const d = parsed.data;
        try {
            await db().insertTag({
                id: d.id,
                label: d.label,
                slug: d.slug,
                description: d.description ?? null,
            });
            return { ok: true, tag: d };
        }
        catch (e) {
            return { ok: false, error: String(e) };
        }
    }
    async function updateTag(id, input) {
        const existing = await db().getTag(id);
        if (!existing)
            return { ok: false, error: 'Tag not found' };
        await db().updateTag(id, input);
        return { ok: true };
    }
    async function deleteTag(id) {
        const existing = await db().getTag(id);
        if (!existing)
            return { ok: false, error: 'Tag not found' };
        await db().deleteTag(id);
        return { ok: true };
    }
    // --- collection fields ---
    async function listCollectionFields(collectionId) {
        const rows = await db().listCollectionFields(collectionId);
        return rows.map((r) => ({
            id: r.id,
            collectionId: r.collection_id,
            key: r.key,
            label: r.label,
            type: r.type,
            required: r.required,
            config: r.config_json ? JSON.parse(r.config_json) : {},
            sortOrder: r.sort_order,
        }));
    }
    async function getCollectionField(id) {
        const row = await db().getCollectionField(id);
        if (!row)
            return null;
        return {
            id: row.id,
            collectionId: row.collection_id,
            key: row.key,
            label: row.label,
            type: row.type,
            required: row.required,
            config: row.config_json ? JSON.parse(row.config_json) : {},
            sortOrder: row.sort_order,
        };
    }
    async function createCollectionField(input) {
        const parsed = collectionFieldSchema.safeParse({
            id: input.id,
            collectionId: input.collectionId,
            key: input.key,
            label: input.label,
            type: input.type,
            required: input.required ?? 0,
            config: input.config ?? {},
            sortOrder: input.sortOrder ?? 0,
        });
        if (!parsed.success) {
            const errs = parsed.error.flatten().fieldErrors;
            return { ok: false, error: errs.id?.[0] ?? errs.key?.[0] ?? 'Invalid field' };
        }
        const d = parsed.data;
        try {
            await db().insertCollectionField({
                id: d.id,
                collection_id: d.collectionId,
                key: d.key,
                label: d.label,
                type: d.type,
                required: d.required,
                config_json: JSON.stringify(d.config),
                sort_order: d.sortOrder,
            });
            return { ok: true, field: d };
        }
        catch (e) {
            return { ok: false, error: String(e) };
        }
    }
    async function updateCollectionField(id, input) {
        const existing = await db().getCollectionField(id);
        if (!existing)
            return { ok: false, error: 'Field not found' };
        await db().updateCollectionField(id, {
            key: input.key,
            label: input.label,
            type: input.type,
            required: input.required,
            configJson: input.config ? JSON.stringify(input.config) : undefined,
            sortOrder: input.sortOrder,
        });
        return { ok: true };
    }
    async function deleteCollectionField(id) {
        const existing = await db().getCollectionField(id);
        if (!existing)
            return { ok: false, error: 'Field not found' };
        await db().deleteCollectionField(id);
        return { ok: true };
    }
    // Entry-specific listing edits create guarded revisions, just like page edits.
    async function mutateListing(entryId, expectedRevisionId, change) {
        const entry = await getContentEntryRow(entryId);
        assertCmsRevision(expectedRevisionId, entry?.draft_revision_id ?? null);
        const snapshot = await getDraftListing(entryId);
        change(snapshot);
        return saveEntryListingDraft(entryId, snapshot, expectedRevisionId);
    }
    async function assignEntryToCollection(input, expectedRevisionId) {
        const parsed = entryCollectionAssignmentSchema.safeParse(input);
        if (!parsed.success)
            return { ok: false, error: 'Invalid assignment' };
        const d = parsed.data;
        return mutateListing(d.entryId, expectedRevisionId, snapshot => {
            const previous = snapshot.collections.find(row => row.collectionId === d.collectionId);
            const assignment = {
                collectionId: d.collectionId, collectionLabel: previous?.collectionLabel ?? d.collectionId,
                category: d.categoryId ? { id: d.categoryId, label: d.categoryId, slug: d.categoryId } : null,
                featured: d.featured, sortDate: d.sortDate ?? null, metadata: previous?.metadata ?? {},
            };
            snapshot.collections = snapshot.collections.filter(row => row.collectionId !== d.collectionId).concat(assignment);
        });
    }
    async function unassignEntryFromCollection(entryId, collectionId, expectedRevisionId) {
        return mutateListing(entryId, expectedRevisionId, snapshot => {
            snapshot.collections = snapshot.collections.filter(row => row.collectionId !== collectionId);
        });
    }
    /** Administrative read of the current draft. Public readers use published snapshots. */
    async function getEntryCollectionAssignment(entryId, collectionId) {
        const assignment = (await getDraftListing(entryId)).collections.find(row => row.collectionId === collectionId);
        return assignment ? { entryId, collectionId, categoryId: assignment.category?.id,
            featured: assignment.featured, sortDate: assignment.sortDate ?? undefined } : null;
    }
    function publishedEntryRow(row) {
        return { id: row.entryId, type: 'page_doc', title: row.page.title, slug: row.page.slug,
            status: 'published', published_revision_id: row.revisionId, draft_revision_id: row.revisionId };
    }
    async function listEntriesByCollection(collectionId, options) {
        const candidates = options?.status === 'all'
            ? await Promise.all((await listContentEntries()).map(async (entry) => ({ entry,
                listing: await getDraftListing(entry.id) })))
            : (await listPublishedPageDocs()).filter(row => row.page.enabled === 1)
                .map(row => ({ entry: publishedEntryRow(row), listing: row.listingSnapshot }));
        const matches = candidates.flatMap(({ entry, listing }) => {
            const assignment = listing.collections.find(row => row.collectionId === collectionId);
            if (!assignment || (options?.categoryId && assignment.category?.id !== options.categoryId)
                || (options?.featured !== undefined && assignment.featured !== options.featured))
                return [];
            return [{ entry, assignment }];
        }).sort((a, b) => (b.assignment.sortDate ?? '').localeCompare(a.assignment.sortDate ?? '')
            || (a.entry.title ?? '').localeCompare(b.entry.title ?? '') || a.entry.id.localeCompare(b.entry.id));
        const offset = Math.max(0, Math.trunc(options?.offset ?? 0));
        const limit = options?.limit === undefined ? matches.length : Math.max(0, Math.trunc(options.limit));
        return matches.slice(offset, offset + limit).map(row => row.entry);
    }
    async function tagEntry(entryId, tagId, expectedRevisionId) {
        return mutateListing(entryId, expectedRevisionId, snapshot => {
            if (!snapshot.tags.some(tag => tag.id === tagId))
                snapshot.tags.push({ id: tagId, label: tagId, slug: tagId });
        });
    }
    async function untagEntry(entryId, tagId, expectedRevisionId) {
        return mutateListing(entryId, expectedRevisionId, snapshot => { snapshot.tags = snapshot.tags.filter(tag => tag.id !== tagId); });
    }
    async function getEntryTags(entryId) {
        return (await getDraftListing(entryId)).tags;
    }
    async function listEntriesByTag(tagId) {
        return (await listPublishedPageDocs()).filter(row => row.page.enabled === 1
            && row.listingSnapshot.tags.some(tag => tag.id === tagId)).map(publishedEntryRow)
            .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '') || a.id.localeCompare(b.id));
    }
    async function setEntryMetadataValue(entryId, collectionId, fieldKey, value, expectedRevisionId) {
        const json = z.json().safeParse(value);
        if (!json.success)
            return { ok: false, error: 'Metadata must be JSON' };
        return mutateListing(entryId, expectedRevisionId, snapshot => {
            const assignment = snapshot.collections.find(row => row.collectionId === collectionId);
            if (!assignment)
                throw new CmsListingValidationError('Assign this entry to the collection before setting metadata');
            assignment.metadata[fieldKey] = json.data;
        });
    }
    async function getEntryMetadataValues(entryId, collectionId) {
        return (await getDraftListing(entryId)).collections.find(row => row.collectionId === collectionId)?.metadata ?? {};
    }
    async function deleteEntryMetadataValue(entryId, collectionId, fieldKey, expectedRevisionId) {
        return mutateListing(entryId, expectedRevisionId, snapshot => {
            const assignment = snapshot.collections.find(row => row.collectionId === collectionId);
            if (assignment)
                delete assignment.metadata[fieldKey];
        });
    }
    // ------------------------------------------------------- portfolio ---
    async function seedDefaultCollections() {
        const seeded = [];
        const existing = await getCollection(portfolioCollectionDefinition.collection.id);
        if (existing) {
            return { ok: true, seeded: [] };
        }
        const colResult = await createCollection({
            id: portfolioCollectionDefinition.collection.id,
            label: portfolioCollectionDefinition.collection.label,
            description: portfolioCollectionDefinition.collection.description,
        });
        if (!colResult.ok) {
            return { ok: false, error: colResult.error };
        }
        seeded.push(colResult.collection.id);
        for (const cat of portfolioCollectionDefinition.categories) {
            const result = await createCollectionCategory(cat);
            if (!result.ok)
                return { ok: false, error: result.error };
            seeded.push(result.category.id);
        }
        for (const field of portfolioCollectionDefinition.fields) {
            const result = await createCollectionField(field);
            if (!result.ok)
                return { ok: false, error: result.error };
            seeded.push(result.field.id);
        }
        return { ok: true, seeded };
    }
    async function listPortfolioEntries(options) {
        return (await listPublishedPageDocs()).flatMap(({ entryId, page, listingSnapshot }) => {
            const assignment = listingSnapshot.collections.find(row => row.collectionId === 'portfolio');
            if (!assignment || page.enabled !== 1
                || (options?.categorySlug && assignment.category?.slug !== options.categorySlug)
                || (options?.featuredOnly && assignment.featured !== 1))
                return [];
            const metadata = assignment.metadata;
            return [{ entryId, title: page.title, slug: page.slug, dek: page.dek ?? null,
                    categoryId: assignment.category?.id ?? null, categorySlug: assignment.category?.slug ?? null,
                    featured: assignment.featured === 1, sortDate: assignment.sortDate,
                    projectDate: typeof metadata.projectDate === 'string' ? metadata.projectDate : null,
                    externalUrl: typeof metadata.externalUrl === 'string' ? metadata.externalUrl : null,
                    techStack: Array.isArray(metadata.techStack) && metadata.techStack.every(item => typeof item === 'string') ? metadata.techStack : null,
                    thumbnail: typeof metadata.thumbnail === 'string' ? metadata.thumbnail : null }];
        }).sort((a, b) => (b.sortDate ?? '').localeCompare(a.sortDate ?? '')
            || a.title.localeCompare(b.title) || a.entryId.localeCompare(b.entryId));
    }
    // ---------------------------------------------------------------- analytics --
    async function getAnalyticsConfig() {
        const raw = await db().getAnalyticsConfigJson();
        if (!raw) {
            return defaultAnalyticsConfig;
        }
        try {
            const parsed = analyticsConfigSchema.safeParse(JSON.parse(raw));
            return parsed.success ? parsed.data : defaultAnalyticsConfig;
        }
        catch {
            return defaultAnalyticsConfig;
        }
    }
    async function setAnalyticsConfig(config) {
        const parsed = analyticsConfigSchema.safeParse(config);
        if (!parsed.success) {
            return { ok: false, error: 'Invalid analytics config' };
        }
        const now = new Date().toISOString();
        try {
            await db().setAnalyticsConfigJson(JSON.stringify(parsed.data), now);
            return { ok: true };
        }
        catch (e) {
            return { ok: false, error: String(e) };
        }
    }
    // ------------------------------------------------------------- site theme --
    async function getSiteTheme() {
        const raw = await db().getSiteThemeJson();
        if (!raw) {
            return defaultSiteTheme;
        }
        try {
            const parsed = siteThemeSchema.safeParse(JSON.parse(raw));
            return parsed.success ? parsed.data : defaultSiteTheme;
        }
        catch {
            return defaultSiteTheme;
        }
    }
    async function setSiteTheme(theme) {
        const parsed = siteThemeSchema.safeParse(theme);
        if (!parsed.success) {
            return { ok: false, error: 'Invalid site theme' };
        }
        const now = new Date().toISOString();
        try {
            await db().setSiteThemeJson(JSON.stringify(parsed.data), now);
            return { ok: true };
        }
        catch (e) {
            return { ok: false, error: String(e) };
        }
    }
    // ---------------------------------------------------------------- forms --
    async function listFormDefinitions() {
        return db().listFormDefinitions();
    }
    async function getFormDefinition(id) {
        return db().getFormDefinition(id);
    }
    async function createFormDefinition(input) {
        const parsed = formDefinitionSchema.safeParse({
            id: input.id,
            title: input.title,
            description: input.description,
            fields: input.fields,
            settings: input.settings,
        });
        if (!parsed.success) {
            const errs = parsed.error.flatten().fieldErrors;
            return {
                ok: false,
                error: errs.id?.[0] ?? errs.title?.[0] ?? 'Invalid form definition',
            };
        }
        const now = new Date().toISOString();
        const d = parsed.data;
        try {
            await db().insertFormDefinition({
                id: d.id,
                title: d.title,
                description: d.description ?? null,
                fields_json: JSON.stringify(d.fields),
                settings_json: JSON.stringify(d.settings),
                created_at: now,
                updated_at: now,
            });
            const row = (await db().getFormDefinition(d.id));
            return { ok: true, form: row };
        }
        catch (e) {
            return { ok: false, error: String(e) };
        }
    }
    async function updateFormDefinition(id, input) {
        const existing = await db().getFormDefinition(id);
        if (!existing)
            return { ok: false, error: 'Form definition not found' };
        const now = new Date().toISOString();
        await db().updateFormDefinition(id, {
            title: input.title,
            description: input.description,
            fieldsJson: input.fields !== undefined ? JSON.stringify(input.fields) : undefined,
            settingsJson: input.settings !== undefined ? JSON.stringify(input.settings) : undefined,
        }, now);
        return { ok: true };
    }
    async function deleteFormDefinition(id) {
        const existing = await db().getFormDefinition(id);
        if (!existing)
            return { ok: false, error: 'Form definition not found' };
        await db().deleteFormDefinition(id);
        return { ok: true };
    }
    // --- form responses ---
    async function submitFormResponse(input) {
        const definition = await getFormDefinition(input.formId);
        if (!definition) {
            return { ok: false, fieldErrors: {}, error: 'Form not found' };
        }
        // Rate limiting first: max 5 submissions per IP in 60 seconds.
        //
        // It has to come before the honeypot branch, before the schema build and before any row is
        // written, because it is the only per-IP bound on this path and every path below writes.
        // Checked later, the honeypot branch returned without ever consulting it, so a spam
        // submission was an unbounded persisted write, and a submission that failed validation
        // was never counted at all.
        if (input.ip) {
            const cnt = await db().countRecentFormResponses(input.ip, FORM_RATE_LIMIT_WINDOW_SECONDS);
            if (cnt >= FORM_RATE_LIMIT_MAX) {
                return {
                    ok: false,
                    fieldErrors: {},
                    error: 'Too many submissions. Please try again later.',
                };
            }
        }
        const fields = JSON.parse(definition.fields_json);
        const data = input.data;
        // Spam check: honeypot
        if (data._hp && typeof data._hp === 'string' && data._hp.length > 0) {
            const responseId = `resp_${crypto.randomUUID()}`;
            const now = new Date().toISOString();
            await db().insertFormResponse({
                id: responseId,
                form_id: input.formId,
                // The spam branch stores the request body, and the body is whatever the caller sent.
                // Capped, because a spam row is a record that the request happened, not a place to
                // keep an arbitrary payload.
                data_json: JSON.stringify(data).slice(0, MAX_FORM_RESPONSE_BYTES),
                submitted_at: now,
                ip: input.ip ?? null,
                spam: 1,
            });
            return { ok: true, responseId };
        }
        // Build validation schema
        const shape = {};
        for (const field of fields) {
            const isMulti = field.type === 'checkbox' && field.options && field.options.length > 0;
            if (isMulti) {
                const arr = z.array(z.string());
                if (field.required) {
                    shape[field.key] = arr.min(1, `Please select at least one option for ${field.label}`);
                }
                else {
                    shape[field.key] = arr.optional();
                }
            }
            else {
                let s;
                switch (field.type) {
                    case 'email':
                        s = z.string().email();
                        break;
                    default:
                        s = z.string();
                }
                if (field.validation?.minLength !== undefined)
                    s = s.min(field.validation.minLength);
                if (field.validation?.maxLength !== undefined)
                    s = s.max(field.validation.maxLength);
                if (field.validation?.pattern) {
                    try {
                        s = s.regex(new RegExp(field.validation.pattern));
                    }
                    catch {
                        /* skip invalid regex */
                    }
                }
                if (field.required) {
                    s = s.min(1, `${field.label} is required`);
                    shape[field.key] = s;
                }
                else {
                    shape[field.key] = s.optional().or(z.literal(''));
                }
            }
        }
        const schema = z.object(shape);
        const parsed = schema.safeParse(data);
        if (!parsed.success) {
            const flat = parsed.error.flatten().fieldErrors;
            const fieldErrors = {};
            for (const [k, v] of Object.entries(flat)) {
                if (Array.isArray(v))
                    fieldErrors[k] = v;
            }
            return { ok: false, fieldErrors };
        }
        // Store response
        const responseId = `resp_${crypto.randomUUID()}`;
        const now = new Date().toISOString();
        // Only the fields the form declares are stored. The request body is the caller's, so a
        // key the form never asked for would otherwise be persisted verbatim. The two reserved
        // keys are dropped whatever the form declares: they are transport, not content.
        //
        // `Object.fromEntries` rather than assignment into a literal, because assignment to
        // `__proto__` sets the prototype instead of adding a key.
        const cleanData = Object.fromEntries(fields
            .map((field) => field.key)
            .filter((key) => key !== '_hp' && key !== '_submitTime' && Object.hasOwn(data, key))
            .map((key) => [key, data[key]]));
        await db().insertFormResponse({
            id: responseId,
            form_id: input.formId,
            data_json: JSON.stringify(cleanData),
            submitted_at: now,
            ip: input.ip ?? null,
            spam: 0,
        });
        if (config.onFormResponse) {
            let settings = formSettingsDefaults;
            try {
                settings = { ...formSettingsDefaults, ...JSON.parse(definition.settings_json) };
            }
            catch {
                /* keep defaults on malformed settings */
            }
            try {
                await config.onFormResponse({
                    responseId,
                    formId: input.formId,
                    formTitle: definition.title,
                    settings,
                    data: cleanData,
                });
            }
            catch {
                /* notification failures must not fail the visitor's submission */
            }
        }
        return { ok: true, responseId };
    }
    async function listFormResponses(formId) {
        return db().listFormResponses(formId);
    }
    async function getFormResponse(id) {
        return db().getFormResponse(id);
    }
    async function deleteFormResponse(id) {
        const existing = await db().getFormResponse(id);
        if (!existing)
            return { ok: false, error: 'Response not found' };
        await db().deleteFormResponse(id);
        return { ok: true };
    }
    async function exportFormResponsesCsv(formId, options = {}) {
        const definition = await getFormDefinition(formId);
        if (!definition)
            return '';
        const fields = JSON.parse(definition.fields_json);
        const responses = await listFormResponses(formId);
        // Safe by default: a cell a spreadsheet would evaluate is the visitor's to write, and the
        // export is the artefact a human opens. Consumers that compare exports byte for byte pass
        // `{ escapeFormulas: false }` explicitly.
        const escapeFormulas = options.escapeFormulas ?? true;
        const esc = (v) => {
            // The formula prefix goes on before quoting, because the apostrophe needs no CSV escaping
            // and the cell may still need quoting for a comma or a quote inside it.
            const cell = escapeFormulas ? escapeCsvFormula(v) : v;
            // A bare CR is a record separator to a reader that treats it as a line ending, so it has
            // to be quoted like a comma or a newline rather than left to split the record.
            if (cell.includes(',') ||
                cell.includes('"') ||
                cell.includes('\n') ||
                cell.includes('\r')) {
                return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
        };
        const headers = ['submittedAt', 'ip', ...fields.map((f) => f.key)];
        const rows = responses
            .filter((r) => !r.spam)
            .map((r) => {
            const d = JSON.parse(r.data_json);
            return [
                r.submitted_at,
                r.ip ?? '',
                ...fields.map((f) => {
                    const val = d[f.key];
                    if (val === undefined || val === null)
                        return '';
                    if (Array.isArray(val))
                        return val.join('; ');
                    return String(val);
                }),
            ];
        });
        return [
            headers.map(esc).join(','),
            ...rows.map((r) => r.map(esc).join(',')),
        ].join('\n');
    }
    return {
        listContentEntries,
        getPublishedPayloadJson,
        getPublishedPageDoc,
        getPublishedPageDocBySlug,
        listPublishedPageDocs,
        listPageDocEntries,
        listPageDocEntriesWithStatus,
        generateSitemapXml,
        generateRobotsTxt,
        ...siteSettings,
        getContentEntryRow,
        getEntryEditorState,
        getPageDocEditorState,
        ensureContentEntry,
        syncContentEntryMetadata,
        insertDraftRevision,
        publishEntry,
        publishOperationalEntry,
        savePageDocDraft,
        restoreRevisionAsDraft,
        listRevisionsForEntry,
        getEntryRevisionPayload,
        getEntryListingSnapshot,
        saveEntryListingDraft,
        isPageDocSlugTaken,
        createPageDocEntry,
        listMediaAssets,
        getMediaAssetByKey,
        uploadMediaAsset,
        streamMediaFromR2,
        streamMedia: streamMediaFromR2,
        // portfolio
        seedDefaultCollections,
        listPortfolioEntries,
        // analytics
        getAnalyticsConfig,
        setAnalyticsConfig,
        // site theme
        getSiteTheme,
        setSiteTheme,
        // taxonomy
        listCollections,
        getCollection,
        createCollection,
        updateCollection,
        deleteCollection,
        listCollectionCategories,
        getCollectionCategory,
        createCollectionCategory,
        updateCollectionCategory,
        deleteCollectionCategory,
        listTags,
        getTag,
        createTag,
        updateTag,
        deleteTag,
        listCollectionFields,
        getCollectionField,
        createCollectionField,
        updateCollectionField,
        deleteCollectionField,
        assignEntryToCollection,
        unassignEntryFromCollection,
        getEntryCollectionAssignment,
        listEntriesByCollection,
        tagEntry,
        untagEntry,
        getEntryTags,
        listEntriesByTag,
        setEntryMetadataValue,
        getEntryMetadataValues,
        deleteEntryMetadataValue,
        // forms
        listFormDefinitions,
        getFormDefinition,
        createFormDefinition,
        updateFormDefinition,
        deleteFormDefinition,
        submitFormResponse,
        listFormResponses,
        getFormResponse,
        deleteFormResponse,
        exportFormResponsesCsv,
    };
}

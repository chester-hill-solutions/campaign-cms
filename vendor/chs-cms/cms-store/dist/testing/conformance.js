import { emptyEntryListingSnapshot, createDefaultBlock, formSettingsDefaults, pageDocPayloadSchema, } from '@chester-hill-solutions/cms-core';
import { CmsPublishedSlugConflictError } from '../publication.js';
export const conformanceTestConfig = {
    parsePayload: (raw) => {
        const parsed = pageDocPayloadSchema.safeParse(raw);
        return parsed.success ? parsed.data : null;
    },
    newPageDoc: ({ title, slug }) => ({
        slug,
        title,
        enabled: 1,
        showInNav: 1,
        navLabel: title,
        seoTitle: title,
        seoDescription: 'About page.',
        blocks: [createDefaultBlock('richText')],
    }),
    validateNewPageSlug: () => null,
    entryIdFromPageSlug: (slug) => `page-${slug}`,
    revisionAuthor: () => 'conformance',
};
function assert(condition, message) {
    if (!condition)
        throw new Error(`cms-store conformance: ${message}`);
}
/** Shared create → draft → publish → restore → upload media flow for adapter tests. */
export async function runCmsStoreConformance(store) {
    const created = await store.createPageDocEntry({ title: 'About', slug: 'about' });
    assert(created.ok, 'createPageDocEntry failed');
    const saved = await store.savePageDocDraft(created.entryId, {
        ...conformanceTestConfig.newPageDoc({ title: 'About Us', slug: 'about' }),
    }, (await store.getContentEntryRow(created.entryId))?.draft_revision_id ?? null);
    assert(saved.ok, 'savePageDocDraft failed');
    const published = await store.publishEntry(created.entryId, (await store.getContentEntryRow(created.entryId)).draft_revision_id);
    assert(published.published, 'publishEntry failed');
    const page = await store.getPublishedPageDocBySlug('about');
    assert(page, 'getPublishedPageDocBySlug returned null after publish');
    const revisions = await store.listRevisionsForEntry(created.entryId);
    assert(revisions.length > 0, 'no revisions found');
    const restored = await store.restoreRevisionAsDraft(created.entryId, revisions[0].id, (await store.getContentEntryRow(created.entryId))?.draft_revision_id ?? null);
    assert(restored.ok, 'restoreRevisionAsDraft failed');
    const entries = await store.listPageDocEntries();
    assert(entries.length > 0, 'listPageDocEntries returned empty');
    const editorState = await store.getPageDocEditorState(created.entryId);
    assert(editorState, 'getPageDocEditorState returned null');
    const png = new Uint8Array([137, 80, 78, 71]);
    const uploaded = await store.uploadMediaAsset({
        filename: 'x.png',
        mime: 'image/png',
        bytes: png.buffer,
        alt: 'test',
    });
    assert(uploaded.ok, 'uploadMediaAsset failed');
    const streamed = await store.streamMediaFromR2(uploaded.asset.r2_key);
    assert(streamed?.status === 200, 'streamMediaFromR2 did not return 200');
}
/**
 * Taxonomy + forms + analytics flow covering the ports added after the core
 * content surface. Run alongside `runCmsStoreConformance` for full coverage.
 */
export async function runCmsStoreExtendedConformance(store) {
    // taxonomy
    const seeded = await store.seedDefaultCollections();
    assert(seeded.ok, 'seedDefaultCollections failed');
    const collections = await store.listCollections();
    assert(collections.length > 0, 'listCollections returned empty after seed');
    const updatedCollection = await store.updateCollection('portfolio', {
        description: 'Updated description',
    });
    assert(updatedCollection.ok, 'updateCollection failed');
    const created = await store.createPageDocEntry({ title: 'Project A', slug: 'project-a' });
    assert(created.ok, 'createPageDocEntry (taxonomy) failed');
    const savedDraft = await store.savePageDocDraft(created.entryId, {
        ...conformanceTestConfig.newPageDoc({ title: 'Project A', slug: 'project-a' }),
    }, (await store.getContentEntryRow(created.entryId))?.draft_revision_id ?? null);
    assert(savedDraft.ok, 'savePageDocDraft (taxonomy) failed');
    const publishedEntry = await store.publishEntry(created.entryId, (await store.getContentEntryRow(created.entryId)).draft_revision_id);
    assert(publishedEntry.published, 'publishEntry (taxonomy) failed');
    const categories = await store.listCollectionCategories('portfolio');
    const assigned = await store.assignEntryToCollection({
        entryId: created.entryId,
        collectionId: 'portfolio',
        categoryId: categories[0]?.id,
        featured: 1,
        sortDate: '2026-01-01',
    }, (await store.getContentEntryRow(created.entryId)).draft_revision_id);
    await store.publishEntry(created.entryId, (await store.getContentEntryRow(created.entryId)).draft_revision_id);
    assert(assigned.ok, 'assignEntryToCollection failed');
    // draft exclusion: assigned-but-unpublished entries stay out of public listings
    const draft = await store.createPageDocEntry({ title: 'Draft Project', slug: 'draft-project' });
    assert(draft.ok, 'createPageDocEntry (draft fixture) failed');
    const assignedDraft = await store.assignEntryToCollection({
        entryId: draft.entryId,
        collectionId: 'portfolio',
        featured: 0,
    }, (await store.getContentEntryRow(draft.entryId)).draft_revision_id);
    assert(assignedDraft.ok, 'assignEntryToCollection (draft fixture) failed');
    const listedPublished = await store.listEntriesByCollection('portfolio');
    assert(listedPublished.length === 1 && listedPublished[0]?.id === created.entryId, 'listEntriesByCollection did not exclude drafts');
    const listedAll = await store.listEntriesByCollection('portfolio', { status: 'all' });
    assert(listedAll.length === 2, 'listEntriesByCollection status:"all" did not return drafts');
    const metadataSet = await store.setEntryMetadataValue(created.entryId, 'portfolio', 'techStack', ['TypeScript'], (await store.getContentEntryRow(created.entryId)).draft_revision_id);
    assert(metadataSet.ok, 'setEntryMetadataValue failed');
    const portfolio = await store.listPortfolioEntries({ featuredOnly: true });
    assert(portfolio.length === 1, 'listPortfolioEntries did not return the assigned entry');
    assert(portfolio[0].featured, 'portfolio entry not marked featured');
    const tag = await store.createTag({ id: 'tag-web', label: 'Web', slug: 'web' });
    assert(tag.ok, 'createTag failed');
    const tagged = await store.tagEntry(created.entryId, 'tag-web', (await store.getContentEntryRow(created.entryId)).draft_revision_id);
    assert(tagged.ok, 'tagEntry failed');
    const entryTags = await store.getEntryTags(created.entryId);
    assert(entryTags.length === 1, 'getEntryTags did not return the tag');
    assert((await store.listEntriesByTag('tag-web')).length === 0, 'draft tags leaked before publication');
    await store.publishEntry(created.entryId, (await store.getContentEntryRow(created.entryId)).draft_revision_id);
    const byTag = await store.listEntriesByTag('tag-web');
    assert(byTag.length === 1, 'listEntriesByTag did not return the entry');
    // analytics
    const initial = await store.getAnalyticsConfig();
    assert(initial, 'getAnalyticsConfig returned nothing');
    const analyticsSet = await store.setAnalyticsConfig(initial);
    assert(analyticsSet.ok, 'setAnalyticsConfig failed');
    const roundTripped = await store.getAnalyticsConfig();
    assert(roundTripped, 'getAnalyticsConfig failed after set');
    // site theme
    const themeInitial = await store.getSiteTheme();
    assert(themeInitial, 'getSiteTheme returned nothing');
    const themeSet = await store.setSiteTheme(themeInitial);
    assert(themeSet.ok, 'setSiteTheme failed');
    const themeRoundTripped = await store.getSiteTheme();
    assert(themeRoundTripped, 'getSiteTheme failed after set');
    // forms
    const fields = [
        {
            id: 'field-email',
            key: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            validation: {},
            sortOrder: 0,
        },
        {
            id: 'field-message',
            key: 'message',
            label: 'Message',
            type: 'textarea',
            required: false,
            validation: {},
            sortOrder: 1,
        },
    ];
    const settings = formSettingsDefaults;
    const form = await store.createFormDefinition({
        id: 'form-contact',
        title: 'Contact',
        fields,
        settings,
    });
    assert(form.ok, 'createFormDefinition failed');
    const invalid = await store.submitFormResponse({
        formId: 'form-contact',
        data: { email: 'not-an-email' },
    });
    assert(!invalid.ok, 'submitFormResponse accepted an invalid email');
    const submitted = await store.submitFormResponse({
        formId: 'form-contact',
        data: { email: 'a@example.com', message: 'hello' },
    });
    assert(submitted.ok, 'submitFormResponse failed for valid data');
    const responses = await store.listFormResponses('form-contact');
    assert(responses.length === 1, 'listFormResponses did not return the response');
    const csv = await store.exportFormResponsesCsv('form-contact');
    assert(csv.includes('a@example.com'), 'exportFormResponsesCsv missing response data');
}
/** Published URLs and sitemap candidates must only observe the selected revision. */
export async function runCmsPublicationConformance(store) {
    const created = await store.createPageDocEntry({ title: 'Public route', slug: 'publication-original' });
    assert(created.ok, 'create public route fixture');
    const opened = await store.getPageDocEditorState(created.entryId);
    assert(opened?.draft && opened.entry.draft_revision_id, 'load route draft');
    const original = opened.entry.draft_revision_id;
    await store.publishEntry(created.entryId, original);
    const { kind: _kind, version: _version, ...content } = opened.draft;
    const saved = await store.savePageDocDraft(created.entryId, { ...content,
        slug: '/publication-private/', title: 'Private route title', seoTitle: 'Private SEO',
        enabled: 0, noindex: 1,
    }, original);
    assert(saved.ok, 'save changed route');
    assert((await store.getPublishedPageDocBySlug('/publication-original/'))?.title === 'Public route', 'old route changed during draft save');
    assert(await store.getPublishedPageDocBySlug('publication-private') === null, 'new draft route leaked');
    const listed = (await store.listPublishedPageDocs()).find((row) => row.entryId === created.entryId);
    assert(listed?.revisionId === original && listed.page.slug === 'publication-original', 'public list used draft metadata');
    const xml = await store.generateSitemapXml({ baseUrl: 'https://example.test' });
    assert(xml.includes('/publication-original</loc>') && !xml.includes('publication-private'), 'sitemap used draft slug');
    // A draft rename frees the mutable row's unique slug, but the published URL is
    // still reserved until its owner publishes a different route.
    const other = await store.createPageDocEntry({ title: 'Would steal URL', slug: 'publication-original' });
    assert(other.ok, 'create alternate draft after original draft rename');
    const otherHead = (await store.getContentEntryRow(other.entryId))?.draft_revision_id;
    assert(otherHead, 'alternate head');
    const before = await store.getContentEntryRow(other.entryId);
    try {
        await store.publishEntry(other.entryId, otherHead);
        throw new Error('collision publication unexpectedly succeeded');
    }
    catch (error) {
        assert(error instanceof CmsPublishedSlugConflictError, 'collision did not report a URL conflict');
    }
    assert(JSON.stringify(await store.getContentEntryRow(other.entryId)) === JSON.stringify(before), 'collision mutated losing entry');
    await store.publishEntry(created.entryId, saved.revisionId);
    assert(await store.getPublishedPageDocBySlug('publication-original') === null, 'old route remained after publication');
    assert((await store.getPublishedPageDocBySlug('publication-private'))?.title === 'Private route title', 'published route did not switch');
    const hiddenXml = await store.generateSitemapXml({ baseUrl: 'https://example.test' });
    assert(!hiddenXml.includes('publication-private'), 'disabled/noindex page entered sitemap');
    await store.publishEntry(other.entryId, otherHead);
    assert((await store.getPublishedPageDocBySlug('publication-original'))?.title === 'Would steal URL', 'released route could not be published');
}
/** Different entry rows must not concurrently claim one immutable public URL. */
export async function runCmsPublicationRaceConformance(store) {
    for (const mode of ['guarded', 'mixed', 'operational']) {
        const slug = `publication-race-${mode}`;
        const entries = [];
        for (const suffix of ['a', 'b']) {
            const created = await store.createPageDocEntry({ title: `${mode} ${suffix}`, slug: `${slug}-${suffix}` });
            assert(created.ok, 'create publication race fixture');
            const entry = await store.getContentEntryRow(created.entryId);
            const payload = { kind: 'pageDoc', version: 1,
                ...conformanceTestConfig.newPageDoc({ title: suffix, slug: suffix === 'a' ? `/${slug}/` : slug }) };
            // Generic revision writes do not rewrite the row slug, so the two distinct
            // row reservations cannot accidentally serialize this public-route test.
            const revisionId = await store.insertDraftRevision(created.entryId, payload, 'route race', entry?.draft_revision_id ?? null);
            entries.push({ entryId: created.entryId, revisionId, payload });
        }
        const beforeCounts = await Promise.all(entries.map((entry) => store.listRevisionsForEntry(entry.entryId).then((rows) => rows.length)));
        const results = await Promise.allSettled(entries.map((entry, index) => mode === 'operational' || (mode === 'mixed' && index === 1)
            ? store.publishOperationalEntry(entry.entryId, entry.payload, 'operational route race', emptyEntryListingSnapshot(), entry.revisionId)
            : store.publishEntry(entry.entryId, entry.revisionId)));
        assert(results.filter((result) => result.status === 'fulfilled').length === 1, `${mode}: publication race did not have exactly one winner`);
        const loserIndex = results.findIndex((result) => result.status === 'rejected');
        const rejected = results[loserIndex];
        assert(rejected?.status === 'rejected' && rejected.reason instanceof CmsPublishedSlugConflictError, `${mode}: losing publication was not a URL conflict`);
        const loser = entries[loserIndex];
        assert((await store.getContentEntryRow(loser.entryId))?.published_revision_id === null, `${mode}: losing pointer changed`);
        assert((await store.listRevisionsForEntry(loser.entryId)).length === beforeCounts[loserIndex], `${mode}: losing operational publication left an orphan revision`);
        assert((await store.listPublishedPageDocs()).filter(({ page }) => page.slug === slug).length === 1, `${mode}: ambiguous URL became public`);
    }
}
/** Page content and all entry-specific listing values share one immutable revision. */
export async function runCmsListingSnapshotConformance(store) {
    await store.seedDefaultCollections();
    await store.createTag({ id: 'snapshot-tag', label: 'Original tag', slug: 'original-tag' });
    const created = await store.createPageDocEntry({ title: 'Snapshot project', slug: 'snapshot-project' });
    assert(created.ok, 'snapshot page creation failed');
    const head = async () => (await store.getContentEntryRow(created.entryId)).draft_revision_id;
    const initial = await head();
    const categories = await store.listCollectionCategories('portfolio');
    const category = categories[0];
    const snapshot = {
        version: 1,
        collections: [{ collectionId: 'portfolio', collectionLabel: 'Spoofed label',
                category: { id: category.id, label: 'Spoofed category', slug: 'spoofed' },
                featured: 1, sortDate: '2026-01-01',
                metadata: { thumbnail: '/original.jpg', techStack: ['TypeScript'], legacyField: 'retained' } }],
        tags: [{ id: 'snapshot-tag', label: 'Spoofed tag', slug: 'spoofed-tag' }],
    };
    const saved = await store.savePageDocDraft(created.entryId, { ...conformanceTestConfig.newPageDoc({ title: 'Snapshot project', slug: 'snapshot-project' }), dek: 'Published summary' }, initial, 'aggregate snapshot', snapshot);
    assert(saved.ok, 'aggregate snapshot save failed');
    assert((await store.listPortfolioEntries()).length === 0, 'unpublished assignment leaked');
    await store.publishEntry(created.entryId, saved.revisionId);
    const first = (await store.listPortfolioEntries()).find(row => row.entryId === created.entryId);
    assert(first?.categorySlug === category.slug && first.thumbnail === '/original.jpg', 'snapshot projection incorrect');
    const exact = await store.getEntryListingSnapshot(created.entryId, saved.revisionId);
    assert(exact?.collections[0]?.collectionLabel === 'Portfolio', 'catalog collection label was not resolved');
    assert(exact?.collections[0]?.category?.label === category.label, 'catalog category label was not resolved');
    assert(exact?.tags[0]?.label === 'Original tag', 'catalog tag label was not resolved');
    assert(await store.getEntryListingSnapshot('foreign-entry', saved.revisionId) === null, 'foreign snapshot exposed');
    await store.setEntryMetadataValue(created.entryId, 'portfolio', 'thumbnail', '/private.jpg', await head());
    await store.assignEntryToCollection({ entryId: created.entryId, collectionId: 'portfolio',
        featured: 0, sortDate: '2099-01-01' }, await head());
    await store.untagEntry(created.entryId, 'snapshot-tag', await head());
    const privateHead = await head();
    let conflicted = false;
    try {
        await store.setEntryMetadataValue(created.entryId, 'portfolio', 'thumbnail', '/stale.jpg', saved.revisionId);
    }
    catch {
        conflicted = true;
    }
    assert(conflicted && await head() === privateHead, 'stale listing save advanced the head');
    const beforePublish = (await store.listPortfolioEntries()).find(row => row.entryId === created.entryId);
    assert(beforePublish?.thumbnail === '/original.jpg' && beforePublish.featured, 'draft metadata/featured leaked');
    assert((await store.listEntriesByTag('snapshot-tag')).some(row => row.id === created.entryId), 'draft tag removal leaked');
    assert((await store.listEntriesByCollection('portfolio', { categoryId: category.id })).some(row => row.id === created.entryId), 'draft category removal leaked');
    await store.updateCollectionCategory(category.id, { label: 'Renamed', slug: 'renamed' });
    await store.updateTag('snapshot-tag', { label: 'Renamed tag', slug: 'renamed-tag' });
    await store.deleteCollectionCategory(category.id);
    await store.deleteTag('snapshot-tag');
    await store.deleteCollection('portfolio');
    assert((await store.listPortfolioEntries()).find(row => row.entryId === created.entryId)?.categorySlug === category.slug, 'catalog deletion erased published category');
    assert((await store.listEntriesByTag('snapshot-tag')).some(row => row.id === created.entryId), 'catalog deletion erased published tag');
    const restored = await store.restoreRevisionAsDraft(created.entryId, saved.revisionId, await head());
    assert(restored.ok, 'complete snapshot restore failed');
    const restoredSnapshot = await store.getEntryListingSnapshot(created.entryId, restored.revisionId);
    assert(JSON.stringify(restoredSnapshot) === JSON.stringify(exact), 'restore did not clone the exact listing snapshot');
    const currentPage = (await store.getEntryEditorState(created.entryId)).draft;
    const preserved = await store.savePageDocDraft(created.entryId, currentPage, restored.revisionId);
    assert(preserved.ok, 'normal page save with orphaned catalog failed');
    assert(JSON.stringify(await store.getEntryListingSnapshot(created.entryId, preserved.revisionId)) === JSON.stringify(exact), 'normal page save replaced historical listing values');
    await store.publishEntry(created.entryId, preserved.revisionId);
    assert((await store.listPortfolioEntries()).find(row => row.entryId === created.entryId)?.thumbnail === '/original.jpg', 'restored publication changed listing');
    assert((await store.listEntriesByCollection('portfolio', { limit: 0 })).length === 0, 'pagination limit applied incorrectly');
    assert((await store.listPortfolioEntries({ categorySlug: 'does-not-exist' })).length === 0, 'unknown category fell back to all entries');
    const raceHead = await head();
    const race = await Promise.allSettled([
        store.savePageDocDraft(created.entryId, { ...currentPage, title: 'Racing page change' }, raceHead),
        store.saveEntryListingDraft(created.entryId, exact, raceHead),
    ]);
    assert(race.filter(result => result.status === 'fulfilled').length === 1, 'page/listing race did not have one winner');
    assert(race.filter(result => result.status === 'rejected').length === 1, 'page/listing race did not reject stale aggregate');
    assert(JSON.stringify(await store.getEntryListingSnapshot(created.entryId, saved.revisionId)) === JSON.stringify(exact), 'concurrent saves mutated the retained snapshot');
    await store.createCollection({ id: 'required-snapshot', label: 'Required values' });
    await store.createCollectionField({ id: 'required-stack', collectionId: 'required-snapshot', key: 'stack',
        label: 'Required stack', type: 'stringList', required: 1 });
    const invalidRequired = { version: 1, tags: [], collections: [{ collectionId: 'required-snapshot',
                collectionLabel: 'Required values', category: null, featured: 0, sortDate: null, metadata: {} }] };
    const missingRequired = await store.saveEntryListingDraft(created.entryId, invalidRequired, await head());
    assert(missingRequired.ok, 'incomplete required field cannot be saved as draft');
    let publishRejected = false;
    try {
        await store.publishEntry(created.entryId, await head());
    }
    catch {
        publishRejected = true;
    }
    assert(publishRejected, 'publication accepted missing required metadata');
    const invalidTyped = { ...invalidRequired, collections: [{ ...invalidRequired.collections[0], metadata: { stack: 7 } }] };
    const typedHead = await head();
    let typeRejected = false;
    try {
        await store.saveEntryListingDraft(created.entryId, invalidTyped, typedHead);
    }
    catch {
        typeRejected = true;
    }
    assert(typeRejected && await head() === typedHead, 'invalid field type advanced draft');
    const operational = await store.createPageDocEntry({ title: 'Operational race', slug: 'snapshot-operational-race' });
    assert(operational.ok, 'operational race creation failed');
    const operationalHead = (await store.getContentEntryRow(operational.entryId)).draft_revision_id;
    const pagePayload = { kind: 'pageDoc', version: 1,
        ...conformanceTestConfig.newPageDoc({ title: 'Operational replacement', slug: 'snapshot-operational-race' }) };
    await store.publishEntry(operational.entryId, operationalHead);
    const sameEntryRace = await Promise.allSettled([
        store.savePageDocDraft(operational.entryId, { ...pagePayload, title: 'Normal newer draft' }, operationalHead),
        store.publishOperationalEntry(operational.entryId, pagePayload, 'explicit immediate page', emptyEntryListingSnapshot(), operationalHead),
    ]);
    assert(sameEntryRace.filter(result => result.status === 'fulfilled').length === 1, 'operational/normal same-entry race overwrote a newer draft');
    const operationalAfter = await store.getContentEntryRow(operational.entryId);
    const revisionsAfter = await store.listRevisionsForEntry(operational.entryId);
    assert(revisionsAfter.length === 2, 'losing operational writer left an orphan revision');
    let staleOperational = false;
    try {
        await store.publishOperationalEntry(operational.entryId, pagePayload, 'stale immediate page', emptyEntryListingSnapshot(), operationalHead);
    }
    catch {
        staleOperational = true;
    }
    assert(staleOperational, 'stale immediate page publication succeeded');
    let omittedToken = false;
    try {
        await store.publishOperationalEntry(operational.entryId, pagePayload, 'missing token', emptyEntryListingSnapshot());
    }
    catch {
        omittedToken = true;
    }
    assert(omittedToken, 'immediate page publication accepted omitted token');
    assert(JSON.stringify(await store.getContentEntryRow(operational.entryId)) === JSON.stringify(operationalAfter), 'failed immediate publication mutated pointers');
    assert((await store.listRevisionsForEntry(operational.entryId)).length === revisionsAfter.length, 'failed immediate publication inserted a revision');
}

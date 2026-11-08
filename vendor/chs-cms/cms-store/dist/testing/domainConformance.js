/**
 * The config under test: two content types, a dependency rule and a publication
 * check. The dependency stands in for the host-owned rules (a stop needs its tour)
 * without pulling tour domain knowledge into the store's package.
 */
export function domainConformanceConfig(overrides = {}) {
    let counter = 0;
    return {
        // The shipped CHECK constraint allows trip, stop, business and notice, so the
        // fixture uses that vocabulary. The memory adapter cannot enforce a CHECK, which
        // is exactly why this suite is also run against real SQL.
        contentTypes: ['trip', 'stop'],
        defaultLocale: 'en-CA',
        newId: () => `id-${++counter}`,
        // Epoch milliseconds, matching the INTEGER columns these tables use.
        now: () => 1_760_000_000_000,
        revisionAuthor: () => 'agent@example.test',
        parsePayload: (_contentType, raw) => {
            const value = raw;
            return typeof value?.title === 'string' && value.title.trim() ? value : null;
        },
        publishDependencies: (entry, payload) => entry.content_type === 'stop' && payload.trip
            ? [{ contentType: 'trip', slug: payload.trip }]
            : [],
        validateForPublish: (_entry, payload) => payload.title.length > 80 ? 'Title is too long to publish.' : null,
        ...overrides,
    };
}
export function runDomainStoreConformance(createStore, 
// Injected rather than imported at module scope: `cms-store/testing` is part of
// the packed-export smoke test, which loads it in native Node, and `bun:test` is
// not a scheme Node's ESM loader accepts.
harness) {
    const { test, expect } = harness;
    async function createEntry(store, contentType, slug, payload = { title: 'Black Gold' }) {
        const created = await store.saveDraft({
            create: { contentType, slug },
            payload,
            expectedRevisionId: null,
        });
        if (!created.ok)
            throw new Error(`conformance setup failed: ${created.error}`);
        return created;
    }
    test('creates an entry as a draft with a first revision', async () => {
        const store = createStore();
        const created = await createEntry(store, 'trip', 'black-gold');
        expect(created.ok).toBe(true);
        const view = await store.getEntry('trip', 'black-gold');
        expect(view?.entry.status).toBe('draft');
        expect(view?.draft).toEqual({ title: 'Black Gold' });
        expect(view?.published).toBeNull();
        expect(view?.hasUnpublishedChanges).toBe(true);
        expect(view?.revisions).toHaveLength(1);
        expect(view?.revisions[0].author).toBe('agent@example.test');
        expect(view?.revisions[0].message).toBe('');
    });
    test('rejects a payload that fails the host contract', async () => {
        const store = createStore();
        const result = await store.saveDraft({
            create: { contentType: 'trip', slug: 'blank' },
            payload: { title: '   ' },
            expectedRevisionId: null,
        });
        expect(result).toEqual({
            ok: false,
            code: 'VALIDATION',
            error: 'The payload does not match the content contract.',
        });
    });
    test('rejects an unknown content type', async () => {
        const store = createStore();
        const result = await store.saveDraft({
            create: { contentType: 'souvenir', slug: 'x' },
            payload: { title: 'X' },
            expectedRevisionId: null,
        });
        expect(result.ok).toBe(false);
        if (!result.ok)
            expect(result.code).toBe('VALIDATION');
    });
    test('rejects a duplicate slug, case-insensitively, with a field error', async () => {
        const store = createStore();
        await createEntry(store, 'trip', 'black-gold');
        const again = await store.saveDraft({
            create: { contentType: 'trip', slug: 'BLACK-GOLD' },
            payload: { title: 'Black Gold again' },
            expectedRevisionId: null,
        });
        expect(again.ok).toBe(false);
        if (!again.ok) {
            expect(again.code).toBe('VALIDATION');
            expect(again.fieldErrors?.slug).toEqual(['Already in use.']);
        }
    });
    test('returns null for a missing entry rather than throwing', async () => {
        const store = createStore();
        expect(await store.getEntry('trip', 'nope')).toBeNull();
        expect(await store.getEntryById('nope')).toBeNull();
    });
    test('a stale writer conflicts instead of clobbering', async () => {
        const store = createStore();
        const created = await createEntry(store, 'trip', 'black-gold');
        const first = await store.saveDraft({
            entryId: created.entryId,
            payload: { title: 'Black Gold v2' },
            expectedRevisionId: created.revisionId,
        });
        expect(first.ok).toBe(true);
        const stale = await store.saveDraft({
            entryId: created.entryId,
            payload: { title: 'Black Gold clobber' },
            expectedRevisionId: created.revisionId,
        });
        expect(stale.ok).toBe(false);
        if (!stale.ok)
            expect(stale.code).toBe('CONFLICT');
        const view = await store.getEntryById(created.entryId);
        expect(view?.draft).toEqual({ title: 'Black Gold v2' });
    });
    test('creating with a non-null expectation is refused', async () => {
        const store = createStore();
        const result = await store.saveDraft({
            create: { contentType: 'trip', slug: 'x' },
            payload: { title: 'X' },
            expectedRevisionId: 'something',
        });
        expect(result.ok).toBe(false);
        if (!result.ok)
            expect(result.code).toBe('CONFLICT');
    });
    test('saving an unknown entry reports NOT_FOUND', async () => {
        const store = createStore();
        const result = await store.saveDraft({
            entryId: 'ghost',
            payload: { title: 'Ghost' },
            expectedRevisionId: null,
        });
        expect(result.ok).toBe(false);
        if (!result.ok)
            expect(result.code).toBe('NOT_FOUND');
    });
    test('publishes a draft and moves only the published pointer', async () => {
        const store = createStore();
        const created = await createEntry(store, 'trip', 'black-gold');
        const published = await store.publish(created.entryId, {
            expectedRevisionId: created.revisionId,
        });
        expect(published).toEqual({ ok: true });
        const view = await store.getEntryById(created.entryId);
        expect(view?.entry.status).toBe('published');
        expect(view?.published).toEqual({ title: 'Black Gold' });
        expect(view?.hasUnpublishedChanges).toBe(false);
        expect(view?.entry.draft_revision_id).toBe(created.revisionId);
        expect(view?.entry.published_revision_id).toBe(created.revisionId);
    });
    test('refuses to publish while a dependency is unpublished', async () => {
        const store = createStore();
        const stop = await createEntry(store, 'stop', 'oil-museum', {
            title: 'Oil Museum',
            trip: 'black-gold',
        });
        const blocked = await store.publish(stop.entryId, { expectedRevisionId: stop.revisionId });
        expect(blocked.ok).toBe(false);
        if (!blocked.ok) {
            expect(blocked.code).toBe('PRECONDITION');
            expect(blocked.error).toContain('trip black-gold');
        }
        const tour = await createEntry(store, 'trip', 'black-gold');
        await store.publish(tour.entryId, { expectedRevisionId: tour.revisionId });
        const nowAllowed = await store.publish(stop.entryId, { expectedRevisionId: stop.revisionId });
        expect(nowAllowed).toEqual({ ok: true });
    });
    test('publishing is blocked by a host publication check', async () => {
        const store = createStore();
        const created = await createEntry(store, 'trip', 'long-title', { title: 'x'.repeat(81) });
        const blocked = await store.publish(created.entryId, {
            expectedRevisionId: created.revisionId,
        });
        expect(blocked.ok).toBe(false);
        if (!blocked.ok) {
            expect(blocked.code).toBe('VALIDATION');
            expect(blocked.error).toBe('Title is too long to publish.');
        }
    });
    test('unpublish returns an entry to draft and keeps the published revision', async () => {
        const store = createStore();
        const created = await createEntry(store, 'trip', 'black-gold');
        await store.publish(created.entryId, { expectedRevisionId: created.revisionId });
        const result = await store.unpublish(created.entryId, {
            expectedRevisionId: created.revisionId,
        });
        expect(result).toEqual({ ok: true });
        const view = await store.getEntryById(created.entryId);
        expect(view?.entry.status).toBe('draft');
        expect(view?.entry.published_revision_id).toBe(created.revisionId);
    });
    test('unpublishing something already in draft is a precondition failure', async () => {
        const store = createStore();
        const created = await createEntry(store, 'trip', 'black-gold');
        const result = await store.unpublish(created.entryId, {
            expectedRevisionId: created.revisionId,
        });
        expect(result.ok).toBe(false);
        if (!result.ok)
            expect(result.code).toBe('PRECONDITION');
    });
    test('restore appends a new draft without touching the published pointer', async () => {
        const store = createStore();
        const created = await createEntry(store, 'trip', 'black-gold', { title: 'Black Gold v1' });
        await store.publish(created.entryId, { expectedRevisionId: created.revisionId });
        const second = await store.saveDraft({
            entryId: created.entryId,
            payload: { title: 'Black Gold v2' },
            expectedRevisionId: created.revisionId,
        });
        if (!second.ok)
            throw new Error('conformance setup failed');
        const restored = await store.restoreRevision(created.entryId, created.revisionId, {
            expectedRevisionId: second.revisionId,
        });
        expect(restored.ok).toBe(true);
        if (!restored.ok)
            return;
        const view = await store.getEntryById(created.entryId);
        expect(view?.draft).toEqual({ title: 'Black Gold v1' });
        expect(view?.published).toEqual({ title: 'Black Gold v1' });
        expect(view?.entry.published_revision_id).toBe(created.revisionId);
        expect(view?.entry.draft_revision_id).toBe(restored.revisionId);
        expect(view?.revisions).toHaveLength(3);
        expect(view?.revisions[0].message).toBe('Restored version 1');
    });
    test('restoring a revision from another entry is NOT_FOUND', async () => {
        const store = createStore();
        const a = await createEntry(store, 'trip', 'a', { title: 'A' });
        const b = await createEntry(store, 'trip', 'b', { title: 'B' });
        const result = await store.restoreRevision(b.entryId, a.revisionId, {
            expectedRevisionId: b.revisionId,
        });
        expect(result.ok).toBe(false);
        if (!result.ok)
            expect(result.code).toBe('NOT_FOUND');
    });
    test('filters listings by content type and status', async () => {
        const store = createStore();
        const tour = await createEntry(store, 'trip', 'black-gold');
        await createEntry(store, 'stop', 'oil-museum');
        await store.publish(tour.entryId, { expectedRevisionId: tour.revisionId });
        const all = await store.listEntries();
        expect(all.map((entry) => entry.slug).sort()).toEqual(['black-gold', 'oil-museum']);
        expect((await store.listEntries({ contentType: 'stop' })).map((entry) => entry.slug)).toEqual([
            'oil-museum',
        ]);
        expect((await store.listEntries({ status: 'published' })).map((entry) => entry.slug)).toEqual([
            'black-gold',
        ]);
    });
}

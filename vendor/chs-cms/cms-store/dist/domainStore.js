function fail(code, error, fieldErrors) {
    return fieldErrors ? { ok: false, code, error, fieldErrors } : { ok: false, code, error };
}
/**
 * Behaviour for typed domain content over a `CmsDomainPersistence` port.
 *
 * The interface is six operations; behind it sit the revision chain, the draft
 * and published pointers, optimistic concurrency, dependency-ordered publication
 * and payload validation. Callers and tests cross this same seam.
 */
export function createDomainStore(ports, config) {
    const { domain } = ports;
    const author = () => config.revisionAuthor?.() ?? 'cms';
    const newId = () => config.newId?.() ?? crypto.randomUUID();
    const now = () => config.now?.() ?? Date.now();
    const locale = (value) => value ?? config.defaultLocale ?? 'en-CA';
    const parse = (contentType, raw) => {
        if (raw === null)
            return null;
        let value;
        try {
            value = JSON.parse(raw);
        }
        catch {
            return null;
        }
        return config.parsePayload(contentType, value);
    };
    async function loadView(entry) {
        const [draftRow, publishedRow, revisions] = await Promise.all([
            entry.draft_revision_id ? domain.getDomainRevision(entry.id, entry.draft_revision_id) : null,
            entry.published_revision_id
                ? domain.getDomainRevision(entry.id, entry.published_revision_id)
                : null,
            domain.listDomainRevisions(entry.id),
        ]);
        return {
            entry,
            draft: draftRow ? parse(entry.content_type, draftRow.payload) : null,
            published: publishedRow ? parse(entry.content_type, publishedRow.payload) : null,
            hasUnpublishedChanges: entry.draft_revision_id !== null && entry.draft_revision_id !== entry.published_revision_id,
            revisions,
        };
    }
    /**
     * Guard every write on the draft pointer. A caller that read a revision and
     * then wrote without checking would clobber whatever landed in between, so a
     * mismatch fails rather than overwrites.
     */
    function assertDraftUnchanged(entry, expected) {
        if (entry.draft_revision_id === expected)
            return null;
        return fail('CONFLICT', 'This record changed since you read it. Reload the current draft before saving.');
    }
    /**
     * Run a write that can lose a race against another writer, and report a lost race
     * as a failure rather than an exception.
     *
     * The duplicate check above is a read followed by a write, so two writers can both
     * pass it and one will then hit the UNIQUE constraint. The constraint is the real
     * arbiter; this only makes its verdict legible, and it is why the store keeps its
     * promise never to throw at a caller.
     */
    async function writeOrFail(work, conflictMessage) {
        try {
            await work();
            return null;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (/UNIQUE|constraint|duplicate/i.test(message))
                return fail('VALIDATION', conflictMessage);
            return fail('INTERNAL', 'The write could not be saved.');
        }
    }
    function assertKnownType(contentType) {
        if (config.contentTypes.includes(contentType))
            return null;
        return fail('VALIDATION', `Unknown content type: ${contentType}.`);
    }
    return {
        listEntries: (options = {}) => domain.listDomainEntries({
            contentType: options.contentType,
            status: options.status,
        }),
        getEntry: async (contentType, slug, requestedLocale) => {
            const entry = await domain.getDomainEntryBySlug(contentType, slug, locale(requestedLocale));
            return entry ? loadView(entry) : null;
        },
        getEntryById: async (entryId) => {
            const entry = await domain.getDomainEntryById(entryId);
            return entry ? loadView(entry) : null;
        },
        saveDraft: async (input) => {
            const timestamp = now();
            const payloadJson = JSON.stringify(input.payload);
            if (input.entryId && input.create) {
                return fail('VALIDATION', 'Pass either entryId or create, not both.');
            }
            if (input.create) {
                const unknown = assertKnownType(input.create.contentType);
                if (unknown)
                    return unknown;
                const parsed = parse(input.create.contentType, payloadJson);
                if (parsed === null) {
                    return fail('VALIDATION', 'The payload does not match the content contract.');
                }
                if (input.expectedRevisionId !== null) {
                    return fail('CONFLICT', 'A new record must be created with expectedRevisionId null.');
                }
                const existing = await domain.findDomainSlugOwner(input.create.contentType, input.create.slug, locale(input.create.locale));
                if (existing) {
                    return fail('VALIDATION', `That slug is already used by ${input.create.contentType} ${existing.id}.`, {
                        slug: ['Already in use.'],
                    });
                }
                const entryId = newId();
                const revisionId = newId();
                const entry = {
                    id: entryId,
                    content_type: input.create.contentType,
                    slug: input.create.slug,
                    locale: locale(input.create.locale),
                    title: input.title ?? '',
                    status: 'draft',
                    draft_revision_id: revisionId,
                    published_revision_id: null,
                    created_at: timestamp,
                    updated_at: timestamp,
                    published_at: null,
                };
                const createFailure = await writeOrFail(() => domain.insertDomainEntryWithDraft(entry, {
                    id: revisionId,
                    entry_id: entryId,
                    version: 1,
                    locale: entry.locale,
                    title: entry.title,
                    payload: payloadJson,
                    author_email: author(),
                    created_at: timestamp,
                    message: input.message ?? '',
                }, {
                    entry_id: entryId,
                    locale: entry.locale,
                    translation_group_id: newId(),
                    state: 'draft',
                    updated_at: timestamp,
                }), `That slug is already used by ${input.create.contentType} ${input.create.slug}.`);
                if (createFailure)
                    return createFailure;
                return { ok: true, entryId, revisionId };
            }
            if (!input.entryId)
                return fail('VALIDATION', 'Pass entryId to update, or create to add a record.');
            const entry = await domain.getDomainEntryById(input.entryId);
            if (!entry)
                return fail('NOT_FOUND', 'That record no longer exists.');
            const stale = assertDraftUnchanged(entry, input.expectedRevisionId);
            if (stale)
                return stale;
            const parsed = parse(entry.content_type, payloadJson);
            if (parsed === null) {
                return fail('VALIDATION', 'The payload does not match the content contract.');
            }
            const revisionId = newId();
            const version = await domain.nextDomainRevisionVersion(entry.id);
            const saveFailure = await writeOrFail(() => domain.insertDomainRevision({
                id: revisionId,
                entry_id: entry.id,
                version,
                locale: entry.locale,
                title: input.title ?? entry.title,
                payload: payloadJson,
                author_email: author(),
                created_at: timestamp,
                message: input.message ?? '',
            }), 'Another save landed at the same time. Reload and try again.');
            if (saveFailure)
                return saveFailure;
            await domain.setDomainDraftPointer(entry.id, revisionId, input.title ?? entry.title, timestamp);
            await domain.upsertDomainTranslation({
                entry_id: entry.id,
                locale: entry.locale,
                translation_group_id: entry.id,
                state: 'draft',
                updated_at: timestamp,
            });
            return { ok: true, entryId: entry.id, revisionId };
        },
        publish: async (entryId, options) => {
            const entry = await domain.getDomainEntryById(entryId);
            if (!entry)
                return fail('NOT_FOUND', 'That record no longer exists.');
            if (!entry.draft_revision_id)
                return fail('PRECONDITION', 'There is no draft to publish.');
            const stale = assertDraftUnchanged(entry, options.expectedRevisionId);
            if (stale)
                return stale;
            const draftRow = await domain.getDomainRevision(entry.id, entry.draft_revision_id);
            const payload = draftRow ? parse(entry.content_type, draftRow.payload) : null;
            if (payload === null) {
                return fail('VALIDATION', 'The draft payload does not match the content contract, so it cannot be published.');
            }
            const invalid = config.validateForPublish?.(entry, payload);
            if (invalid)
                return fail('VALIDATION', invalid);
            const dependencies = config.publishDependencies?.(entry, payload) ?? [];
            const missing = [];
            for (const dependency of dependencies) {
                const target = await domain.getDomainEntryBySlug(dependency.contentType, dependency.slug, entry.locale);
                if (!target || target.status !== 'published' || target.published_revision_id === null) {
                    missing.push(`${dependency.contentType} ${dependency.slug}`);
                }
            }
            if (missing.length > 0) {
                return fail('PRECONDITION', `Publish ${missing.join(', ')} first.`);
            }
            const timestamp = now();
            await domain.publishDomainEntry(entry.id, entry.draft_revision_id, timestamp);
            await domain.upsertDomainTranslation({
                entry_id: entry.id,
                locale: entry.locale,
                translation_group_id: entry.id,
                state: 'published',
                updated_at: timestamp,
            });
            return { ok: true };
        },
        unpublish: async (entryId, options) => {
            const entry = await domain.getDomainEntryById(entryId);
            if (!entry)
                return fail('NOT_FOUND', 'That record no longer exists.');
            const stale = assertDraftUnchanged(entry, options.expectedRevisionId);
            if (stale)
                return stale;
            if (entry.status !== 'published') {
                return fail('PRECONDITION', 'That record is not published.');
            }
            const timestamp = now();
            await domain.unpublishDomainEntry(entry.id, timestamp);
            await domain.upsertDomainTranslation({
                entry_id: entry.id,
                locale: entry.locale,
                translation_group_id: entry.id,
                state: 'draft',
                updated_at: timestamp,
            });
            return { ok: true };
        },
        restoreRevision: async (entryId, revisionId, options) => {
            const entry = await domain.getDomainEntryById(entryId);
            if (!entry)
                return fail('NOT_FOUND', 'That record no longer exists.');
            const stale = assertDraftUnchanged(entry, options.expectedRevisionId);
            if (stale)
                return stale;
            const source = await domain.getDomainRevision(entry.id, revisionId);
            if (!source)
                return fail('NOT_FOUND', 'That revision is not part of this record.');
            const payload = parse(entry.content_type, source.payload);
            if (payload === null) {
                return fail('VALIDATION', 'That revision no longer matches the content contract.');
            }
            const timestamp = now();
            const newRevisionId = newId();
            const version = await domain.nextDomainRevisionVersion(entry.id);
            await domain.insertDomainRevision({
                id: newRevisionId,
                entry_id: entry.id,
                version,
                locale: entry.locale,
                title: source.title,
                payload: source.payload,
                author_email: author(),
                created_at: timestamp,
                message: `Restored version ${source.version}`,
            });
            await domain.setDomainDraftPointer(entry.id, newRevisionId, source.title, timestamp);
            return { ok: true, revisionId: newRevisionId };
        },
    };
}

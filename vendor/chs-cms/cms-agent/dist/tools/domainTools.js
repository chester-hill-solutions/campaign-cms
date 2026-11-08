import { toolError, notFound } from '../errors.js';
import { describeDomainContentInput, getDomainEntryInput, listDomainEntriesInput, listDomainRevisionsInput, publishDomainEntryInput, restoreDomainRevisionInput, saveDomainDraftInput, unpublishDomainEntryInput, } from '../schemas.js';
import { makeTool } from './makeTool.js';
/**
 * The store's failure codes are the tool layer's codes, deliberately, so this
 * mapper passes a code through rather than translating between two vocabularies.
 * It exists for the shape of the result, not the meaning of the error: the store
 * reports field errors as a map of field to messages, and the tool contract
 * reports them as a flat list.
 */
function fromStore(result) {
    if (result.ok) {
        const { ok: _ok, ...data } = result;
        return { ok: true, data: data };
    }
    const failure = result;
    const fieldErrors = failure.fieldErrors
        ? Object.entries(failure.fieldErrors).flatMap(([field, messages]) => messages.map((message) => ({ field, message })))
        : undefined;
    return {
        ok: false,
        code: failure.code,
        error: failure.error,
        ...(fieldErrors ? { fieldErrors } : {}),
    };
}
/** A compact entry summary, so a listing does not carry every payload. */
function summarizeEntry(entry) {
    return {
        entryId: entry.id,
        contentType: entry.content_type,
        slug: entry.slug,
        title: entry.title,
        status: entry.status,
        hasDraft: entry.draft_revision_id !== null,
        published: entry.published_revision_id !== null,
        updatedAt: entry.updated_at,
    };
}
/**
 * Tools for typed domain content — a tour, a stop, a business, a notice.
 *
 * Registered only when the host supplies a domain store, so a site that publishes
 * pages and nothing else does not expose tools that would fail on every call. The
 * split mirrors the store: the page tools above need `CmsAgentStore`, these need
 * `CmsDomainStore`.
 */
export function createDomainTools(config) {
    const domain = config.domain;
    // No store, no tools. Returning an empty list rather than registering tools that
    // can only answer "not configured" keeps the tool list honest about what exists.
    if (!domain)
        return [];
    const contentTypes = config.domainContentTypes ?? [];
    return [
        makeTool({
            name: 'list_domain_entries',
            description: 'List typed content records (tours, stops, businesses, notices) with their draft and publication state. Start here, or call get_domain_entry when the slug is known.',
            inputSchema: listDomainEntriesInput,
            mutates: false,
            config,
            handler: async ({ contentType, status }) => {
                const entries = await domain.listEntries({ contentType, status });
                return { ok: true, data: { entries: entries.map(summarizeEntry) } };
            },
        }),
        makeTool({
            name: 'get_domain_entry',
            description: 'Read one typed record: its current draft payload, its published payload, and whether the draft differs. Use the returned draftRevisionId as expectedRevisionId when saving, and the payload as the base for an edit.',
            inputSchema: getDomainEntryInput,
            mutates: false,
            config,
            handler: async ({ entryId, contentType, slug }) => {
                const view = entryId
                    ? await domain.getEntryById(entryId)
                    : contentType && slug
                        ? await domain.getEntry(contentType, slug)
                        : null;
                if (!view) {
                    return notFound(entryId ? `Record "${entryId}"` : `${contentType} "${slug}"`, 'Call list_domain_entries for valid records.');
                }
                return {
                    ok: true,
                    data: {
                        ...summarizeEntry(view.entry),
                        draft: view.draft,
                        published: view.published,
                        hasUnpublishedChanges: view.hasUnpublishedChanges,
                        draftRevisionId: view.entry.draft_revision_id,
                        publishedRevisionId: view.entry.published_revision_id,
                    },
                };
            },
        }),
        makeTool({
            name: 'list_domain_revisions',
            description: 'List the revision history of a typed record, newest first. Use a revision id with restore_domain_revision to roll a draft back.',
            inputSchema: listDomainRevisionsInput,
            mutates: false,
            config,
            handler: async ({ entryId }) => {
                const view = await domain.getEntryById(entryId);
                if (!view) {
                    return notFound(`Record "${entryId}"`, 'Call list_domain_entries for valid records.');
                }
                return { ok: true, data: { entryId, revisions: view.revisions } };
            },
        }),
        makeTool({
            name: 'describe_domain_content',
            description: 'Describe the typed content this site stores: which content types exist and, where the host documents them, what each payload must contain. Call this before authoring a new record so the payload matches the contract.',
            inputSchema: describeDomainContentInput,
            mutates: false,
            config,
            handler: async ({ contentType }) => {
                const describe = config.describeContentType;
                if (contentType) {
                    if (!contentTypes.includes(contentType)) {
                        return toolError('NOT_FOUND', `Unknown content type "${contentType}"`, {
                            suggestion: `Known types: ${contentTypes.join(', ') || 'none configured'}`,
                        });
                    }
                    return {
                        ok: true,
                        data: {
                            contentType,
                            contract: describe?.(contentType) ?? null,
                            documented: Boolean(describe),
                        },
                    };
                }
                return {
                    ok: true,
                    data: {
                        contentTypes: contentTypes.map((type) => ({
                            contentType: type,
                            contract: describe?.(type) ?? null,
                        })),
                        documented: Boolean(describe),
                    },
                };
            },
        }),
        makeTool({
            name: 'save_domain_draft',
            description: 'Save a draft payload for a typed record. Pass entryId to update one, or create with a contentType and slug for a new record. Always pass the expectedRevisionId you last read — null when creating — so a concurrent edit is reported as CONFLICT instead of being overwritten. Saving never publishes.',
            inputSchema: saveDomainDraftInput,
            mutates: true,
            config,
            handler: async ({ entryId, create, payload, expectedRevisionId, title, message }) => {
                const result = await domain.saveDraft({
                    ...(entryId ? { entryId } : {}),
                    ...(create ? { create } : {}),
                    payload,
                    expectedRevisionId,
                    ...(title !== undefined ? { title } : {}),
                    ...(message !== undefined ? { message } : {}),
                });
                const mapped = fromStore(result);
                if (!mapped.ok)
                    return mapped;
                return {
                    ok: true,
                    data: {
                        ...mapped.data,
                        note: 'Saved as a draft. Nothing is public until publish_domain_entry.',
                    },
                };
            },
        }),
        makeTool({
            name: 'publish_domain_entry',
            description: 'Publish the current draft to the live site. Requires human approval. Refused with PRECONDITION when a record it depends on is unpublished, and with VALIDATION when the draft does not satisfy the content contract.',
            inputSchema: publishDomainEntryInput,
            mutates: true,
            needsApproval: true,
            config,
            handler: async ({ entryId, expectedRevisionId }) => {
                const result = await domain.publish(entryId, { expectedRevisionId });
                const mapped = fromStore(result);
                if (!mapped.ok)
                    return mapped;
                return { ok: true, data: { entryId, published: true } };
            },
        }),
        makeTool({
            name: 'unpublish_domain_entry',
            description: 'Take a published record off the live site, leaving its content intact. The published revision is kept, so publishing again restores it without re-authoring.',
            inputSchema: unpublishDomainEntryInput,
            mutates: true,
            config,
            handler: async ({ entryId, expectedRevisionId }) => {
                const result = await domain.unpublish(entryId, { expectedRevisionId });
                const mapped = fromStore(result);
                if (!mapped.ok)
                    return mapped;
                return { ok: true, data: { entryId, published: false } };
            },
        }),
        makeTool({
            name: 'restore_domain_revision',
            description: 'Copy a historical revision into the current draft (rollback). Does not publish — call publish_domain_entry afterwards to go live.',
            inputSchema: restoreDomainRevisionInput,
            mutates: true,
            config,
            handler: async ({ entryId, revisionId, expectedRevisionId }) => {
                const result = await domain.restoreRevision(entryId, revisionId, { expectedRevisionId });
                return fromStore(result);
            },
        }),
    ];
}

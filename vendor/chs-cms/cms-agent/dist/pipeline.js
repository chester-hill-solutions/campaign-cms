import { pageValidationError, toolError } from './errors';
function toPageMeta(payload) {
    const { kind: _kind, version: _version, ...content } = payload;
    return content;
}
/**
 * Load the editable base content for an entry. Order of precedence:
 * draft → published (editing live content opens a new draft) → error.
 */
export async function loadDraftForEdit(store, entryId) {
    const state = await store.getPageDocEditorState(entryId);
    if (!state) {
        return toolError('NOT_FOUND', `Entry "${entryId}" not found`, {
            suggestion: 'Call list_pages to see valid entry ids, or create_page.',
        });
    }
    const base = state.draft ?? state.published;
    if (!base) {
        return toolError('PRECONDITION', `Entry "${entryId}" has no draft or published content to edit`, { suggestion: 'Use create_page to start a new page.' });
    }
    return {
        ok: true,
        data: {
            content: toPageMeta(base),
            draftRevisionId: state.entry.draft_revision_id,
        },
    };
}
/** Optimistic concurrency: fail when the draft moved under the caller. */
export function checkExpectedRevision(currentDraftRevisionId, expectedDraftRevisionId) {
    if (expectedDraftRevisionId !== undefined &&
        expectedDraftRevisionId !== currentDraftRevisionId) {
        return toolError('CONFLICT', 'Draft changed since it was last read', {
            suggestion: 'Call get_page to load the latest draft, then retry.',
        });
    }
    return { ok: true, data: null };
}
/** Validate the full page, then persist it as the new draft revision. */
export async function validateAndSaveDraft(store, entryId, content, message) {
    const validationError = pageValidationError(content);
    if (validationError)
        return validationError;
    const saved = await store.savePageDocDraft(entryId, content, message);
    if (!saved.ok) {
        return toolError('VALIDATION', 'Draft was rejected by the store', {
            fieldErrors: Object.entries(saved.fieldErrors).flatMap(([field, messages]) => messages.map((message) => ({ field, message }))),
        });
    }
    return { ok: true, data: { entryId } };
}
/**
 * Standard write pipeline for block/meta mutations: fresh load, concurrency
 * check, pure mutation, full-page validation, save. `mutate` may return a
 * ToolError (e.g. NOT_FOUND for a missing block id) to abort.
 */
export async function applyDraftMutation(store, entryId, expectedDraftRevisionId, message, mutate) {
    const loaded = await loadDraftForEdit(store, entryId);
    if (!loaded.ok)
        return loaded;
    const revisionCheck = checkExpectedRevision(loaded.data.draftRevisionId, expectedDraftRevisionId);
    if (!revisionCheck.ok)
        return revisionCheck;
    const mutated = mutate(loaded.data.content);
    if (!mutated.ok)
        return mutated;
    const saved = await validateAndSaveDraft(store, entryId, mutated.data.content, message);
    if (!saved.ok)
        return saved;
    return { ok: true, data: { entryId, info: mutated.data.info } };
}

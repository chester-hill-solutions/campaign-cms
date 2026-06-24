import type { CmsAgentStore, PageMeta, ToolResult } from './types';
export type DraftForEdit = {
    content: PageMeta;
    /** Current draft revision id, for optimistic concurrency chaining. */
    draftRevisionId: string | null;
};
/**
 * Load the editable base content for an entry. Order of precedence:
 * draft → published (editing live content opens a new draft) → error.
 */
export declare function loadDraftForEdit(store: CmsAgentStore, entryId: string): Promise<ToolResult<DraftForEdit>>;
/** Optimistic concurrency: fail when the draft moved under the caller. */
export declare function checkExpectedRevision(currentDraftRevisionId: string | null, expectedDraftRevisionId: string | undefined): ToolResult<null>;
/** Validate the full page, then persist it as the new draft revision. */
export declare function validateAndSaveDraft(store: CmsAgentStore, entryId: string, content: PageMeta, message: string): Promise<ToolResult<{
    entryId: string;
}>>;
/**
 * Standard write pipeline for block/meta mutations: fresh load, concurrency
 * check, pure mutation, full-page validation, save. `mutate` may return a
 * ToolError (e.g. NOT_FOUND for a missing block id) to abort.
 */
export declare function applyDraftMutation<TInfo = undefined>(store: CmsAgentStore, entryId: string, expectedDraftRevisionId: string | undefined, message: string, mutate: (content: PageMeta) => ToolResult<{
    content: PageMeta;
    info: TInfo;
}>): Promise<ToolResult<{
    entryId: string;
    info: TInfo;
}>>;

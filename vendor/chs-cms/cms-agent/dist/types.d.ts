import type { ContentEntryRow, EntryEditorState, MediaAssetRow, PageDocListRow, PageDocPayload, PageMeta, RevisionListRow } from '@chester-hill-solutions/cms-core';
export type { PageMeta };
export type ToolErrorCode = 'NOT_FOUND' | 'VALIDATION' | 'CONFLICT' | 'FORBIDDEN' | 'PRECONDITION' | 'INTERNAL';
export type ToolFieldError = {
    blockId?: string;
    field: string;
    message: string;
};
export type ToolError = {
    ok: false;
    code: ToolErrorCode;
    error: string;
    fieldErrors?: ToolFieldError[];
    /** Recovery hint for the calling agent, e.g. "Call get_page and retry." */
    suggestion?: string;
    retryable?: boolean;
};
export type ToolResult<T = unknown> = {
    ok: true;
    data: T;
} | ToolError;
export type AgentCallContext = {
    toolName: string;
    actorId?: string;
    transport?: 'chat' | 'mcp' | 'http';
};
export type CmsAgentConfig = {
    /** Called before every read tool. Throw to deny (becomes FORBIDDEN). */
    assertCanRead: (ctx: AgentCallContext) => void | Promise<void>;
    /** Called before every write tool, after assertCanRead. Throw to deny. */
    assertCanMutate: (ctx: AgentCallContext) => void | Promise<void>;
    /** Default actor recorded in call context and revision audit. */
    actorId?: string;
    validateNewPageSlug: (slug: string) => string | null;
    entryIdFromPageSlug: (slug: string) => string;
    newPageDoc: (input: {
        title: string;
        slug: string;
    }) => PageMeta;
    /** Observability hook — invoked after every tool call with its result. */
    onToolComplete?: (ctx: AgentCallContext, result: ToolResult) => void;
};
/**
 * Structural subset of the cms-server store used by agent tools. The real
 * `createCmsStore(...)` return value satisfies this; tests can supply mocks.
 */
export type CmsAgentStore = {
    listPageDocEntriesWithStatus: () => Promise<PageDocListRow[]>;
    getPageDocEditorState: (entryId: string) => Promise<EntryEditorState<PageDocPayload> | null>;
    getContentEntryRow: (entryId: string) => Promise<ContentEntryRow | null>;
    listRevisionsForEntry: (entryId: string) => Promise<RevisionListRow[]>;
    listMediaAssets: (limit?: number) => Promise<MediaAssetRow[]>;
    isPageDocSlugTaken: (slug: string, excludeEntryId?: string) => Promise<boolean>;
    createPageDocEntry: (input: {
        title: string;
        slug: string;
    }) => Promise<{
        ok: true;
        entryId: string;
    } | {
        ok: false;
        error: string;
    }>;
    savePageDocDraft: (entryId: string, content: PageMeta, message?: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        fieldErrors: Record<string, string[]>;
    }>;
    publishEntry: (entryId: string) => Promise<{
        published: boolean;
    }>;
    restoreRevisionAsDraft: (entryId: string, revisionId: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    uploadMediaAsset: (input: {
        filename: string;
        mime: string;
        bytes: ArrayBuffer;
        alt: string;
        width?: number;
        height?: number;
    }) => Promise<{
        ok: true;
        asset: MediaAssetRow;
    } | {
        ok: false;
        error: string;
    }>;
};

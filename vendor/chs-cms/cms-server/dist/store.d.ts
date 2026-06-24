import { type ContentEntryRow, type EntryEditorState, type MediaAssetRow, type PageDocListRow, type PageDocPayload, type RevisionListRow } from '@chester-hill-solutions/cms-core';
/** Cloudflare bindings, resolved lazily so module import never touches `env`. */
export type CmsBindings = {
    db: D1Database;
    media?: R2Bucket;
};
export type CmsStoreConfig<TPayload extends {
    kind: string;
}> = {
    /** Parse a stored revision payload; return null when invalid. */
    parsePayload: (raw: unknown) => TPayload | null;
    /** Editor fallback for known entries that have no D1 row yet. */
    defaultPageDocForEntry?: (entryId: string) => PageDocPayload | null;
    /** Convert a legacy (non-pageDoc) payload for the block editor. */
    toPageDoc?: (payload: TPayload) => PageDocPayload | null;
    /** D1 `content_entries.type` values the block editor may convert from. */
    legacyEntryTypes?: readonly string[];
    /** Defaults for a freshly created page. */
    newPageDoc: (input: {
        title: string;
        slug: string;
    }) => Omit<PageDocPayload, 'kind' | 'version'>;
    validateNewPageSlug: (slug: string) => string | null;
    entryIdFromPageSlug: (slug: string) => string;
    /** Author recorded on revision rows (`created_by`). Defaults to 'admin'. */
    revisionAuthor?: () => string;
};
export type CmsStore<TPayload extends {
    kind: string;
}> = ReturnType<typeof createCmsStore<TPayload>>;
export declare function createCmsStore<TPayload extends {
    kind: string;
}>(getBindings: () => CmsBindings, config: CmsStoreConfig<TPayload>): {
    listContentEntries: () => Promise<ContentEntryRow[]>;
    getPublishedPayloadJson: (entryId: string) => Promise<string | null>;
    getPublishedPageDoc: (entryId: string) => Promise<PageDocPayload | null>;
    getPublishedPageDocBySlug: (slug: string) => Promise<PageDocPayload | null>;
    listPageDocEntries: () => Promise<ContentEntryRow[]>;
    listPageDocEntriesWithStatus: () => Promise<PageDocListRow[]>;
    getContentEntryRow: (entryId: string) => Promise<ContentEntryRow | null>;
    getEntryEditorState: (entryId: string) => Promise<EntryEditorState<TPayload> | null>;
    getPageDocEditorState: (entryId: string) => Promise<EntryEditorState<TPayload | PageDocPayload> | null>;
    ensureContentEntry: (entryId: string, type: string, title: string, slug?: string | null) => Promise<void>;
    syncContentEntryMetadata: (entryId: string, title: string, slug: string | null) => Promise<void>;
    insertDraftRevision: (entryId: string, payload: TPayload, message: string) => Promise<void>;
    publishEntry: (entryId: string) => Promise<{
        published: boolean;
    }>;
    publishOperationalEntry: (entryId: string, payload: TPayload, message: string) => Promise<void>;
    savePageDocDraft: (entryId: string, content: Omit<PageDocPayload, "kind" | "version">, message?: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        fieldErrors: Record<string, string[]>;
    }>;
    restoreRevisionAsDraft: (entryId: string, revisionId: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    listRevisionsForEntry: (entryId: string) => Promise<RevisionListRow[]>;
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
    listMediaAssets: (limit?: number) => Promise<MediaAssetRow[]>;
    getMediaAssetByKey: (r2Key: string) => Promise<MediaAssetRow | null>;
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
    streamMediaFromR2: (r2Key: string) => Promise<Response | null>;
};

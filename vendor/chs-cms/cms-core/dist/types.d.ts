/** Row shape of the `content_entries` table. */
export type ContentEntryRow = {
    id: string;
    type: string;
    slug: string | null;
    title: string | null;
    status: string;
    published_revision_id: string | null;
    draft_revision_id: string | null;
};
export type PageDocListRow = ContentEntryRow & {
    statusLabel: string;
};
export type EntryEditorMeta = {
    entryExists: boolean;
    hasDraft: boolean;
    hasPublished: boolean;
    hasUnpublishedChanges: boolean;
    publishedAt: string | null;
};
export type EntryEditorState<TPayload> = {
    entry: ContentEntryRow;
    published: TPayload | null;
    draft: TPayload | null;
    meta: EntryEditorMeta;
};
export type RevisionListRow = {
    id: string;
    version: number;
    created_at: string;
    message: string | null;
};
/** Row shape of the `media_assets` table. */
export type MediaAssetRow = {
    id: string;
    r2_key: string;
    filename: string;
    mime: string;
    size_bytes: number;
    width: number | null;
    height: number | null;
    alt: string;
    created_at: string;
};

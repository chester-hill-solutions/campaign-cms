/** A different entry already owns this published URL. The draft remains intact. */
export declare class CmsPublishedSlugConflictError extends Error {
    constructor();
}
/**
 * Adapter collision identity. Reserve recognizable pageDoc routes conservatively, even
 * when another document field is invalid. Public rendering still validates the full schema.
 * D1 uses the same normalization for ordinary routes and may conservatively
 * reserve additional malformed historical strings in its SQL collision guard.
 */
export declare function publishedPageSlug(entryId: string, payload: string, homeEntryId?: string): string | null;

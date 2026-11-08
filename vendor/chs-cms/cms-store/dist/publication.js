import { normalizeCmsSlug } from '@chester-hill-solutions/cms-core';
/** A different entry already owns this published URL. The draft remains intact. */
export class CmsPublishedSlugConflictError extends Error {
    constructor() {
        super('Another published page already uses this URL. Choose a different slug before publishing.');
        this.name = 'CmsPublishedSlugConflictError';
    }
}
/**
 * Adapter collision identity. Reserve recognizable pageDoc routes conservatively, even
 * when another document field is invalid. Public rendering still validates the full schema.
 * D1 uses the same normalization for ordinary routes and may conservatively
 * reserve additional malformed historical strings in its SQL collision guard.
 */
export function publishedPageSlug(entryId, payload, homeEntryId) {
    try {
        const value = JSON.parse(payload);
        if (!value || typeof value !== 'object' || !('kind' in value) || value.kind !== 'pageDoc'
            || !('version' in value) || value.version !== 1 || !('slug' in value) || typeof value.slug !== 'string')
            return null;
        if (/[\u0000-\u001f\u007f-\u009f\ud800-\udfff]/u.test(value.slug))
            return null;
        return entryId === homeEntryId ? '' : normalizeCmsSlug(value.slug);
    }
    catch {
        return null;
    }
}

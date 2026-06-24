export function normalizeCmsSlug(slug) {
    return slug.replace(/^\/+|\/+$/g, '');
}
export function cmsPagePublicPath(slug) {
    const normalized = normalizeCmsSlug(slug);
    return normalized ? `/${normalized}` : '/';
}
/**
 * A slug is reserved when it is empty, looks like an asset path, or its first
 * segment collides with one of the host app's route prefixes.
 */
export function isReservedCmsSlug(slug, reservedPrefixes) {
    const normalized = normalizeCmsSlug(slug);
    if (!normalized)
        return true;
    if (normalized.includes('.'))
        return true;
    const firstSegment = normalized.split('/')[0] ?? '';
    return reservedPrefixes.has(firstSegment);
}
export function validateNewPageSlug(slug, reservedPrefixes) {
    const normalized = normalizeCmsSlug(slug);
    if (!normalized)
        return 'Slug is required.';
    if (isReservedCmsSlug(normalized, reservedPrefixes)) {
        return 'That slug is reserved for a system route.';
    }
    if (normalized.includes('..'))
        return 'Invalid slug.';
    return null;
}

export declare function normalizeCmsSlug(slug: string): string;
export declare function cmsPagePublicPath(slug: string): string;
/**
 * A slug is reserved when it is empty, looks like an asset path, or its first
 * segment collides with one of the host app's route prefixes.
 */
export declare function isReservedCmsSlug(slug: string, reservedPrefixes: ReadonlySet<string>): boolean;
export declare function validateNewPageSlug(slug: string, reservedPrefixes: ReadonlySet<string>): string | null;

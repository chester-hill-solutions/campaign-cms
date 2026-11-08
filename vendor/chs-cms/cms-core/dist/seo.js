import { z } from 'zod';
export const pageSeoSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(320).optional(),
    keywords: z.string().max(200).optional(),
    canonical: z.string().max(2000).optional(),
    robots: z.string().max(80).default('index, follow'),
    noindex: z.boolean().default(false),
    ogTitle: z.string().max(200).optional(),
    ogDescription: z.string().max(320).optional(),
    ogImage: z.string().max(2000).optional(),
    ogUrl: z.string().max(2000).optional(),
    ogType: z.string().max(50).default('website'),
    jsonLd: z.record(z.string(), z.unknown()).optional(),
});
export const siteSeoDefaultsSchema = z.object({
    siteTitle: z.string().max(200).optional(),
    siteDescription: z.string().max(320).optional(),
    siteUrl: z.string().max(2000).optional(),
    defaultOgImage: z.string().max(2000).optional(),
});
export function buildPageSeo(input) {
    const { page, siteDefaults, requestUrl, isPreview, isCustomDomain } = input;
    const pageNoindex = page.noindex === 1;
    const forceNoindex = Boolean(isPreview || isCustomDomain === false);
    const noindex = pageNoindex || forceNoindex;
    const title = page.seoTitle?.trim() || page.title || siteDefaults?.siteTitle || '';
    const description = page.seoDescription?.trim() || siteDefaults?.siteDescription || undefined;
    const canonical = buildCanonical(page.slug, siteDefaults?.siteUrl, requestUrl);
    const ogTitle = page.seoTitle?.trim() || page.title || siteDefaults?.siteTitle || title;
    const ogDescription = page.seoDescription?.trim() ||
        siteDefaults?.siteDescription ||
        description;
    const ogImage = resolveImageUrl(page.ogImagePath?.trim() || siteDefaults?.defaultOgImage, canonical);
    const robots = noindex ? 'noindex, nofollow' : 'index, follow';
    return pageSeoSchema.parse({
        title,
        description,
        canonical,
        robots,
        noindex,
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl: canonical,
        ogType: 'website',
    });
}
function buildCanonical(slug, siteUrl, requestUrl) {
    if (siteUrl) {
        try {
            const url = new URL(siteUrl);
            if (!isPublicUrl(url))
                return undefined;
            const path = slug === '' || slug === '/' ? '/' : `/${slug.replace(/^\/+/g, '')}`;
            url.pathname = `${url.pathname.replace(/\/+$/, '')}${path}`;
            url.search = '';
            url.hash = '';
            return url.href;
        }
        catch {
            return undefined;
        }
    }
    if (!requestUrl)
        return undefined;
    try {
        const url = new URL(requestUrl);
        if (!isPublicUrl(url))
            return undefined;
        url.search = '';
        url.hash = '';
        url.pathname = url.pathname.replace(/\/+$/, '') || '/';
        return url.href;
    }
    catch {
        return undefined;
    }
}
function isPublicUrl(url) {
    return (url.protocol === 'http:' || url.protocol === 'https:') &&
        !url.username && !url.password;
}
function resolveImageUrl(image, canonical) {
    if (!image)
        return undefined;
    // A framework adapter may supply its own request origin after this step.
    if (!canonical && !/^[a-z][a-z\d+.-]*:/i.test(image))
        return image;
    try {
        const url = new URL(image, canonical);
        return isPublicUrl(url) ? url.href : undefined;
    }
    catch {
        return undefined;
    }
}
export function buildPersonSchema(person) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: person.name,
        url: person.url,
        ...(person.sameAs && person.sameAs.length > 0
            ? { sameAs: person.sameAs }
            : {}),
        ...(person.jobTitle ? { jobTitle: person.jobTitle } : {}),
    };
}

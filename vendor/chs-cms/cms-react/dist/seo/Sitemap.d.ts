export declare function generateSitemapXml({ baseUrl, entries, }: {
    baseUrl: string;
    entries: Array<{
        slug: string;
        updatedAt?: string;
        publishedAt?: string;
        noindex?: boolean;
    }>;
}): string;
export declare function generateRobotsTxt({ baseUrl, sitemapPath, }: {
    baseUrl: string;
    sitemapPath?: string;
}): string;

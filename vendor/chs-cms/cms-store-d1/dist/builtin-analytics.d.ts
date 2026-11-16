/** Aggregate, cookie-free traffic analytics using the site's existing D1 binding. */
export type BuiltinAnalyticsSummary = {
    days: number;
    totalPageViews: number;
    daily: Array<{
        day: string;
        views: number;
    }>;
    pages: Array<{
        path: string;
        views: number;
    }>;
    referrers: Array<{
        host: string;
        views: number;
    }>;
};
export declare function analyticsPath(raw: string): string | null;
export declare function analyticsReferrer(raw: string, siteOrigin: string): string;
export declare function createD1Analytics(getDatabase: () => D1Database): {
    recordPageView: (input: {
        path: string;
        referrer?: string;
        siteOrigin: string;
    }) => Promise<boolean>;
    getSummary: (days?: number) => Promise<BuiltinAnalyticsSummary>;
};
/** Same-origin ingestion; only the host's public pages are accepted. Never a reporting endpoint. */
export declare function createAnalyticsHandler(options: {
    analytics: ReturnType<typeof createD1Analytics>;
    isPublicPath: (path: string) => Promise<boolean>;
    isBot?: (userAgent: string) => boolean;
}): (request: Request) => Promise<Response>;

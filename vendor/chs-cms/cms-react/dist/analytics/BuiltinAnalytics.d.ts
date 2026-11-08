export type BuiltinAnalyticsData = {
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
/** Per-mount navigation state; no browser globals are read until a navigation is recorded. */
export declare function createBuiltinAnalyticsNavigation(): (path: string, endpoint?: string) => void;
/** One beacon per pathname, including client navigation; query/hash changes are excluded. */
export declare function BuiltinAnalyticsTracker({ path, endpoint }: {
    path: string;
    endpoint?: string;
}): null;
export declare function BuiltinAnalyticsPanel({ data }: {
    data: BuiltinAnalyticsData;
}): import("react").JSX.Element;

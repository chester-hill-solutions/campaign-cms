import type { PageDocPayload } from '@chester-hill-solutions/cms-core';
export type CmsHealthPage = {
    entryId: string;
    payload: PageDocPayload;
};
export type CmsHealthOptions = {
    publicOrigin: string;
    staticAssetPaths?: string[];
    mediaPaths?: string[];
    contactEmailConfigured?: boolean;
    adminProtected?: boolean;
};
export type CmsHealthReport = {
    checkedAt: string;
    pagesChecked: number;
    checks: Array<{
        label: string;
        status: 'pass' | 'warning';
        detail: string;
    }>;
    issues: Array<{
        kind: 'metadata' | 'link' | 'image';
        entryId: string;
        title: string;
        message: string;
    }>;
};
/** Content checks are distinct from live HTTP crawling or Lighthouse measurements. */
export declare function analyzeCmsHealth(pages: CmsHealthPage[], options: CmsHealthOptions): CmsHealthReport;
export declare function loadCmsHealth(store: {
    listContentEntries(): Promise<Array<{
        id: string;
        type: string;
    }>>;
    getPublishedPageDoc(id: string): Promise<PageDocPayload | null>;
    listMediaAssets(limit?: number): Promise<Array<{
        r2_key: string;
    }>>;
}, options: Omit<CmsHealthOptions, 'mediaPaths'>): Promise<CmsHealthReport>;

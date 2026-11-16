import { type CmsStoreConfig } from '@chester-hill-solutions/cms-store';
/** Cloudflare bindings, resolved lazily so module import never touches `env`. */
export type CmsBindings = {
    db: D1Database;
    media?: R2Bucket;
};
export declare function createCmsStoreD1<TPayload extends {
    kind: string;
}>(getBindings: () => CmsBindings, config: CmsStoreConfig<TPayload>): {
    getContentEntryRow: (entryId: string) => Promise<import("@chester-hill-solutions/cms-core").ContentEntryRow | null>;
    getEntryEditorState: (entryId: string) => Promise<import("@chester-hill-solutions/cms-core").EntryEditorState<TPayload> | null>;
    getPageDocEditorState: (entryId: string) => Promise<import("@chester-hill-solutions/cms-core").EntryEditorState<TPayload> | null>;
    ensureContentEntry: (entryId: string, type: string, title: string, slug?: string | null) => Promise<void>;
    syncContentEntryMetadata: (entryId: string, title: string, slug: string | null) => Promise<void>;
    insertDraftRevision: (entryId: string, payload: TPayload, message: string, expectedRevisionId: string | null) => Promise<string>;
    publishEntry: (entryId: string, expectedRevisionId: string) => Promise<{
        published: boolean;
    }>;
    publishOperationalEntry: (entryId: string, payload: TPayload, message: string, listingSnapshot?: import("@chester-hill-solutions/cms-core").EntryListingSnapshot, expectedDraftRevisionId?: string | null) => Promise<void>;
    savePageDocDraft: (entryId: string, content: Omit<import("@chester-hill-solutions/cms-core").PageDocPayload, "kind" | "version">, expectedRevisionId: string | null, message?: string, listingSnapshot?: import("@chester-hill-solutions/cms-core").EntryListingSnapshot) => Promise<{
        ok: true;
        revisionId: string;
    } | {
        ok: false;
        fieldErrors: Record<string, string[]>;
    }>;
    restoreRevisionAsDraft: (entryId: string, revisionId: string, expectedRevisionId: string | null) => Promise<{
        ok: true;
        revisionId: string;
    } | {
        ok: false;
        error: string;
    }>;
    listRevisionsForEntry: (entryId: string) => Promise<import("@chester-hill-solutions/cms-core").RevisionListRow[]>;
    getEntryRevisionPayload: (entryId: string, revisionId: string) => Promise<TPayload | null>;
    getEntryListingSnapshot: (entryId: string, revisionId: string) => Promise<import("@chester-hill-solutions/cms-core").EntryListingSnapshot | null>;
    saveEntryListingDraft: (entryId: string, snapshot: import("@chester-hill-solutions/cms-core").EntryListingSnapshot, expectedRevisionId: string | null, message?: string) => Promise<{
        ok: true;
        revisionId: string;
    } | {
        ok: false;
        error: string;
    }>;
    isPageDocSlugTaken: (slug: string, excludeEntryId?: string) => Promise<boolean>;
    createPageDocEntry: (input: {
        title: string;
        slug: string;
    }) => Promise<{
        ok: true;
        entryId: string;
    } | {
        ok: false;
        error: string;
    }>;
    listMediaAssets: (limit?: number) => Promise<import("@chester-hill-solutions/cms-core").MediaAssetRow[]>;
    getMediaAssetByKey: (r2Key: string) => Promise<import("@chester-hill-solutions/cms-core").MediaAssetRow | null>;
    uploadMediaAsset: (input: {
        filename: string;
        mime: string;
        bytes: ArrayBuffer;
        alt: string;
        width?: number;
        height?: number;
    }) => Promise<{
        ok: true;
        asset: import("@chester-hill-solutions/cms-core").MediaAssetRow;
    } | {
        ok: false;
        error: string;
    }>;
    streamMediaFromR2: (r2Key: string) => Promise<Response | null>;
    streamMedia: (r2Key: string) => Promise<Response | null>;
    seedDefaultCollections: () => Promise<{
        ok: true;
        seeded: string[];
    } | {
        ok: false;
        error: string;
    }>;
    listPortfolioEntries: (options?: {
        categorySlug?: string;
        featuredOnly?: boolean;
    }) => Promise<import("@chester-hill-solutions/cms-store").PortfolioEntryRow[]>;
    getAnalyticsConfig: () => Promise<import("@chester-hill-solutions/cms-core").AnalyticsConfig>;
    setAnalyticsConfig: (config: import("@chester-hill-solutions/cms-core").AnalyticsConfig) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    getSiteTheme: () => Promise<import("@chester-hill-solutions/cms-core").SiteTheme>;
    setSiteTheme: (theme: import("@chester-hill-solutions/cms-core").SiteTheme) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    listCollections: () => Promise<import("@chester-hill-solutions/cms-core").CmsCollection[]>;
    getCollection: (id: string) => Promise<import("@chester-hill-solutions/cms-core").CmsCollection | null>;
    createCollection: (input: {
        id: string;
        label: string;
        description?: string;
    }) => Promise<{
        ok: true;
        collection: import("@chester-hill-solutions/cms-core").CmsCollection;
    } | {
        ok: false;
        error: string;
    }>;
    updateCollection: (id: string, input: {
        label?: string;
        description?: string;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    deleteCollection: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    listCollectionCategories: (collectionId: string) => Promise<import("@chester-hill-solutions/cms-core").CollectionCategory[]>;
    getCollectionCategory: (id: string) => Promise<import("@chester-hill-solutions/cms-core").CollectionCategory | null>;
    createCollectionCategory: (input: {
        id: string;
        collectionId: string;
        label: string;
        slug: string;
        description?: string;
        sortOrder?: number;
    }) => Promise<{
        ok: true;
        category: import("@chester-hill-solutions/cms-core").CollectionCategory;
    } | {
        ok: false;
        error: string;
    }>;
    updateCollectionCategory: (id: string, input: {
        label?: string;
        slug?: string;
        description?: string;
        sortOrder?: number;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    deleteCollectionCategory: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    listTags: () => Promise<import("@chester-hill-solutions/cms-core").CollectionTag[]>;
    getTag: (id: string) => Promise<import("@chester-hill-solutions/cms-core").CollectionTag | null>;
    createTag: (input: {
        id: string;
        label: string;
        slug: string;
        description?: string;
    }) => Promise<{
        ok: true;
        tag: import("@chester-hill-solutions/cms-core").CollectionTag;
    } | {
        ok: false;
        error: string;
    }>;
    updateTag: (id: string, input: {
        label?: string;
        slug?: string;
        description?: string;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    deleteTag: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    listCollectionFields: (collectionId: string) => Promise<import("@chester-hill-solutions/cms-core").CollectionField[]>;
    getCollectionField: (id: string) => Promise<import("@chester-hill-solutions/cms-core").CollectionField | null>;
    createCollectionField: (input: {
        id: string;
        collectionId: string;
        key: string;
        label: string;
        type: import("@chester-hill-solutions/cms-core").CollectionFieldType;
        required?: 0 | 1;
        config?: Record<string, unknown>;
        sortOrder?: number;
    }) => Promise<{
        ok: true;
        field: import("@chester-hill-solutions/cms-core").CollectionField;
    } | {
        ok: false;
        error: string;
    }>;
    updateCollectionField: (id: string, input: {
        key?: string;
        label?: string;
        type?: import("@chester-hill-solutions/cms-core").CollectionFieldType;
        required?: 0 | 1;
        config?: Record<string, unknown>;
        sortOrder?: number;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    deleteCollectionField: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    assignEntryToCollection: (input: import("@chester-hill-solutions/cms-core").EntryCollectionAssignment, expectedRevisionId: string | null) => Promise<{
        ok: true;
        revisionId: string;
    } | {
        ok: false;
        error: string;
    }>;
    unassignEntryFromCollection: (entryId: string, collectionId: string, expectedRevisionId: string | null) => Promise<{
        ok: true;
        revisionId: string;
    } | {
        ok: false;
        error: string;
    }>;
    getEntryCollectionAssignment: (entryId: string, collectionId: string) => Promise<import("@chester-hill-solutions/cms-core").EntryCollectionAssignment | null>;
    listEntriesByCollection: (collectionId: string, options?: {
        categoryId?: string;
        featured?: 0 | 1;
        status?: "published" | "all";
        limit?: number;
        offset?: number;
    }) => Promise<import("@chester-hill-solutions/cms-core").ContentEntryRow[]>;
    tagEntry: (entryId: string, tagId: string, expectedRevisionId: string | null) => Promise<{
        ok: true;
        revisionId: string;
    } | {
        ok: false;
        error: string;
    }>;
    untagEntry: (entryId: string, tagId: string, expectedRevisionId: string | null) => Promise<{
        ok: true;
        revisionId: string;
    } | {
        ok: false;
        error: string;
    }>;
    getEntryTags: (entryId: string) => Promise<import("@chester-hill-solutions/cms-core").CollectionTag[]>;
    listEntriesByTag: (tagId: string) => Promise<import("@chester-hill-solutions/cms-core").ContentEntryRow[]>;
    setEntryMetadataValue: (entryId: string, collectionId: string, fieldKey: string, value: unknown, expectedRevisionId: string | null) => Promise<{
        ok: true;
        revisionId: string;
    } | {
        ok: false;
        error: string;
    }>;
    getEntryMetadataValues: (entryId: string, collectionId: string) => Promise<Record<string, unknown>>;
    deleteEntryMetadataValue: (entryId: string, collectionId: string, fieldKey: string, expectedRevisionId: string | null) => Promise<{
        ok: true;
        revisionId: string;
    } | {
        ok: false;
        error: string;
    }>;
    listFormDefinitions: () => Promise<import("@chester-hill-solutions/cms-store").FormDefinitionRow[]>;
    getFormDefinition: (id: string) => Promise<import("@chester-hill-solutions/cms-store").FormDefinitionRow | null>;
    createFormDefinition: (input: {
        id: string;
        title: string;
        description?: string;
        fields: import("@chester-hill-solutions/cms-core").FormFieldDefinition[];
        settings: import("@chester-hill-solutions/cms-core").FormSettings;
    }) => Promise<{
        ok: true;
        form: import("@chester-hill-solutions/cms-store").FormDefinitionRow;
    } | {
        ok: false;
        error: string;
    }>;
    updateFormDefinition: (id: string, input: {
        title?: string;
        description?: string;
        fields?: import("@chester-hill-solutions/cms-core").FormFieldDefinition[];
        settings?: import("@chester-hill-solutions/cms-core").FormSettings;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    deleteFormDefinition: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    submitFormResponse: (input: {
        formId: string;
        data: Record<string, unknown>;
        ip?: string;
    }) => Promise<{
        ok: true;
        responseId: string;
    } | {
        ok: false;
        fieldErrors: Record<string, string[]>;
        error?: string;
    }>;
    listFormResponses: (formId: string) => Promise<import("@chester-hill-solutions/cms-store").FormResponseRow[]>;
    getFormResponse: (id: string) => Promise<import("@chester-hill-solutions/cms-store").FormResponseRow | null>;
    deleteFormResponse: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    exportFormResponsesCsv: (formId: string, options?: import("@chester-hill-solutions/cms-store").ExportFormResponsesCsvOptions) => Promise<string>;
    getSiteSettings: () => Promise<import("@chester-hill-solutions/cms-core").SiteSettings>;
    setSiteSettings: (input: unknown) => Promise<{
        ok: false;
        error: string;
        settings?: undefined;
    } | {
        ok: true;
        settings: {
            version: 1;
            siteName: string;
            tagline: string;
            description: string;
            logoPath: string;
            faviconPath: string;
            socialImagePath: string;
        };
        error?: undefined;
    }>;
    listContentEntries: () => Promise<import("@chester-hill-solutions/cms-core").ContentEntryRow[]>;
    getPublishedPayloadJson: (entryId: string) => Promise<string | null>;
    getPublishedPageDoc: (entryId: string) => Promise<import("@chester-hill-solutions/cms-core").PageDocPayload | null>;
    getPublishedPageDocBySlug: (slug: string) => Promise<import("@chester-hill-solutions/cms-core").PageDocPayload | null>;
    listPublishedPageDocs: () => Promise<import("@chester-hill-solutions/cms-store").PublishedPageDoc[]>;
    listPageDocEntries: () => Promise<import("@chester-hill-solutions/cms-core").PageDocEntryRow[]>;
    listPageDocEntriesWithStatus: () => Promise<import("@chester-hill-solutions/cms-core").PageDocListRow[]>;
    generateSitemapXml: (options: {
        baseUrl: string;
        entries?: import("@chester-hill-solutions/cms-core").ContentEntryRow[];
    }) => Promise<string>;
    generateRobotsTxt: (options: {
        baseUrl: string;
        sitemapPath?: string;
    }) => Promise<string>;
} & {
    analytics: {
        recordPageView: (input: {
            path: string;
            referrer?: string;
            siteOrigin: string;
        }) => Promise<boolean>;
        getSummary: (days?: number) => Promise<import("./builtin-analytics.js").BuiltinAnalyticsSummary>;
    };
};
export { createD1Persistence } from './d1-persistence.js';
export { createD1DomainPersistence } from './d1-domain-persistence.js';
export type { D1Executor, D1StatementLike, D1ResultLike } from './d1-executor.js';
export { createR2MediaStore } from './r2-media.js';
export { createD1Analytics, createAnalyticsHandler, analyticsPath, analyticsReferrer, type BuiltinAnalyticsSummary } from './builtin-analytics.js';

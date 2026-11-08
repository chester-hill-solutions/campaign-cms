import type { ContentEntryRow, MediaAssetRow, PageDocEntryRow, RevisionListRow } from '@chester-hill-solutions/cms-core';
import type { CmsStoreConfig } from '../config.js';
import type { CmsMediaStore, CmsPersistence, CmsStorePorts, FormDefinitionRow, FormResponseRow, NewRevision } from '../ports.js';
type EntryRow = ContentEntryRow & {
    published_at: string | null;
    created_at?: string;
    updated_at?: string;
};
export declare function createMemoryPersistence(): CmsPersistence & {
    entries: Map<string, EntryRow>;
    revisions: Map<string, NewRevision & {
        entry_id: string;
    }>;
    media: Map<string, MediaAssetRow>;
};
export declare function createMemoryMediaStore(): CmsMediaStore & {
    blobs: Map<string, ArrayBuffer>;
};
export declare function createMemoryStorePorts(): CmsStorePorts & {
    persistence: ReturnType<typeof createMemoryPersistence>;
    media: ReturnType<typeof createMemoryMediaStore>;
};
export declare function createMemoryCmsStore<TPayload extends {
    kind: string;
}>(config: CmsStoreConfig<TPayload>, ports?: CmsStorePorts & {
    persistence: ReturnType<typeof createMemoryPersistence>;
    media: ReturnType<typeof createMemoryMediaStore>;
}): {
    getContentEntryRow: (entryId: string) => Promise<ContentEntryRow | null>;
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
    listRevisionsForEntry: (entryId: string) => Promise<RevisionListRow[]>;
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
    listMediaAssets: (limit?: number) => Promise<MediaAssetRow[]>;
    getMediaAssetByKey: (r2Key: string) => Promise<MediaAssetRow | null>;
    uploadMediaAsset: (input: {
        filename: string;
        mime: string;
        bytes: ArrayBuffer;
        alt: string;
        width?: number;
        height?: number;
    }) => Promise<{
        ok: true;
        asset: MediaAssetRow;
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
    } | undefined) => Promise<import("../createCmsStore.js").PortfolioEntryRow[]>;
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
    } | undefined) => Promise<ContentEntryRow[]>;
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
    listEntriesByTag: (tagId: string) => Promise<ContentEntryRow[]>;
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
    listFormDefinitions: () => Promise<FormDefinitionRow[]>;
    getFormDefinition: (id: string) => Promise<FormDefinitionRow | null>;
    createFormDefinition: (input: {
        id: string;
        title: string;
        description?: string;
        fields: import("@chester-hill-solutions/cms-core").FormFieldDefinition[];
        settings: import("@chester-hill-solutions/cms-core").FormSettings;
    }) => Promise<{
        ok: true;
        form: FormDefinitionRow;
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
    listFormResponses: (formId: string) => Promise<FormResponseRow[]>;
    getFormResponse: (id: string) => Promise<FormResponseRow | null>;
    deleteFormResponse: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    exportFormResponsesCsv: (formId: string, options?: import("../createCmsStore.js").ExportFormResponsesCsvOptions) => Promise<string>;
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
    listContentEntries: () => Promise<ContentEntryRow[]>;
    getPublishedPayloadJson: (entryId: string) => Promise<string | null>;
    getPublishedPageDoc: (entryId: string) => Promise<import("@chester-hill-solutions/cms-core").PageDocPayload | null>;
    getPublishedPageDocBySlug: (slug: string) => Promise<import("@chester-hill-solutions/cms-core").PageDocPayload | null>;
    listPublishedPageDocs: () => Promise<import("../createCmsStore.js").PublishedPageDoc[]>;
    listPageDocEntries: () => Promise<PageDocEntryRow[]>;
    listPageDocEntriesWithStatus: () => Promise<import("@chester-hill-solutions/cms-core").PageDocListRow[]>;
    generateSitemapXml: (options: {
        baseUrl: string;
        entries?: ContentEntryRow[];
    }) => Promise<string>;
    generateRobotsTxt: (options: {
        baseUrl: string;
        sitemapPath?: string;
    }) => Promise<string>;
};
export {};

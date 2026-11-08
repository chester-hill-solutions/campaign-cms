import { type EntryListingSnapshot, type AnalyticsConfig, type SiteTheme, type CmsCollection, type CollectionCategory, type CollectionField, type CollectionFieldType, type CollectionTag, type ContentEntryRow, type EntryCollectionAssignment, type EntryEditorState, type FormFieldDefinition, type FormSettings, type MediaAssetRow, type PageDocEntryRow, type PageDocListRow, type PageDocPayload, type RevisionListRow } from '@chester-hill-solutions/cms-core';
import type { CmsStoreConfig } from './config.js';
import type { CmsStorePorts, FormDefinitionRow, FormResponseRow } from './ports.js';
/**
 * Options for `exportFormResponsesCsv`.
 */
export type ExportFormResponsesCsvOptions = {
    /**
     * Prefix a cell that begins with a spreadsheet formula character with an apostrophe.
     *
     * **Defaults to `true`.** A form response is attacker-supplied text, and a spreadsheet reads
     * a leading `=`, `+`, `-` or `@` as the start of a formula. So an export of unescaped
     * responses hands whoever opens the file a way to run a formula of their choosing, and the
     * export is the artefact a human opens.
     *
     * Turning it off costs something, which is why it is an option rather than the only
     * behaviour: the apostrophe is part of the exported bytes, so a consumer that compares an
     * export byte for byte, or that re-imports the file and compares field values, sees a
     * leading `'` that was never stored.
     *
     * So the safe export is the default and the byte-comparing one is opt-in. A pipeline
     * diffing two exports, or a round trip back into the CMS, passes
     * `{ escapeFormulas: false }` and strips the prefix itself if it needs the raw value.
     */
    escapeFormulas?: boolean;
};
export type PublishedPageDoc = {
    entryId: string;
    revisionId: string;
    publishedAt: string | null;
    page: PageDocPayload;
    listingSnapshot: EntryListingSnapshot;
};
export type PortfolioEntryRow = {
    dek?: string | null;
    entryId: string;
    title: string | null;
    slug: string | null;
    categoryId: string | null;
    categorySlug?: string | null;
    featured: boolean;
    sortDate: string | null;
    projectDate?: string | null;
    externalUrl?: string | null;
    techStack?: string[] | null;
    thumbnail?: string | null;
};
export declare function createCmsStore<TPayload extends {
    kind: string;
}>(getPorts: () => CmsStorePorts, config: CmsStoreConfig<TPayload>): {
    getContentEntryRow: (entryId: string) => Promise<ContentEntryRow | null>;
    getEntryEditorState: (entryId: string) => Promise<EntryEditorState<TPayload> | null>;
    getPageDocEditorState: (entryId: string) => Promise<EntryEditorState<TPayload> | null>;
    ensureContentEntry: (entryId: string, type: string, title: string, slug?: string | null) => Promise<void>;
    syncContentEntryMetadata: (entryId: string, title: string, slug: string | null) => Promise<void>;
    insertDraftRevision: (entryId: string, payload: TPayload, message: string, expectedRevisionId: string | null) => Promise<string>;
    publishEntry: (entryId: string, expectedRevisionId: string) => Promise<{
        published: boolean;
    }>;
    publishOperationalEntry: (entryId: string, payload: TPayload, message: string, listingSnapshot?: EntryListingSnapshot, expectedDraftRevisionId?: string | null) => Promise<void>;
    savePageDocDraft: (entryId: string, content: Omit<PageDocPayload, "kind" | "version">, expectedRevisionId: string | null, message?: string, listingSnapshot?: EntryListingSnapshot) => Promise<{
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
    getEntryListingSnapshot: (entryId: string, revisionId: string) => Promise<EntryListingSnapshot | null>;
    saveEntryListingDraft: (entryId: string, snapshot: EntryListingSnapshot, expectedRevisionId: string | null, message?: string) => Promise<{
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
    }) => Promise<PortfolioEntryRow[]>;
    getAnalyticsConfig: () => Promise<AnalyticsConfig>;
    setAnalyticsConfig: (config: AnalyticsConfig) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    getSiteTheme: () => Promise<SiteTheme>;
    setSiteTheme: (theme: SiteTheme) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    listCollections: () => Promise<CmsCollection[]>;
    getCollection: (id: string) => Promise<CmsCollection | null>;
    createCollection: (input: {
        id: string;
        label: string;
        description?: string;
    }) => Promise<{
        ok: true;
        collection: CmsCollection;
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
    listCollectionCategories: (collectionId: string) => Promise<CollectionCategory[]>;
    getCollectionCategory: (id: string) => Promise<CollectionCategory | null>;
    createCollectionCategory: (input: {
        id: string;
        collectionId: string;
        label: string;
        slug: string;
        description?: string;
        sortOrder?: number;
    }) => Promise<{
        ok: true;
        category: CollectionCategory;
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
    listTags: () => Promise<CollectionTag[]>;
    getTag: (id: string) => Promise<CollectionTag | null>;
    createTag: (input: {
        id: string;
        label: string;
        slug: string;
        description?: string;
    }) => Promise<{
        ok: true;
        tag: CollectionTag;
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
    listCollectionFields: (collectionId: string) => Promise<CollectionField[]>;
    getCollectionField: (id: string) => Promise<CollectionField | null>;
    createCollectionField: (input: {
        id: string;
        collectionId: string;
        key: string;
        label: string;
        type: CollectionFieldType;
        required?: 0 | 1;
        config?: Record<string, unknown>;
        sortOrder?: number;
    }) => Promise<{
        ok: true;
        field: CollectionField;
    } | {
        ok: false;
        error: string;
    }>;
    updateCollectionField: (id: string, input: {
        key?: string;
        label?: string;
        type?: CollectionFieldType;
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
    assignEntryToCollection: (input: EntryCollectionAssignment, expectedRevisionId: string | null) => Promise<{
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
    getEntryCollectionAssignment: (entryId: string, collectionId: string) => Promise<EntryCollectionAssignment | null>;
    listEntriesByCollection: (collectionId: string, options?: {
        categoryId?: string;
        featured?: 0 | 1;
        status?: "published" | "all";
        limit?: number;
        offset?: number;
    }) => Promise<ContentEntryRow[]>;
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
    getEntryTags: (entryId: string) => Promise<CollectionTag[]>;
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
        fields: FormFieldDefinition[];
        settings: FormSettings;
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
        fields?: FormFieldDefinition[];
        settings?: FormSettings;
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
    exportFormResponsesCsv: (formId: string, options?: ExportFormResponsesCsvOptions) => Promise<string>;
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
    getPublishedPageDoc: (entryId: string) => Promise<PageDocPayload | null>;
    getPublishedPageDocBySlug: (slug: string) => Promise<PageDocPayload | null>;
    listPublishedPageDocs: () => Promise<PublishedPageDoc[]>;
    listPageDocEntries: () => Promise<PageDocEntryRow[]>;
    listPageDocEntriesWithStatus: () => Promise<PageDocListRow[]>;
    generateSitemapXml: (options: {
        baseUrl: string;
        /** Optional entry IDs to include; their mutable metadata is never public input. */
        entries?: ContentEntryRow[];
    }) => Promise<string>;
    generateRobotsTxt: (options: {
        baseUrl: string;
        sitemapPath?: string;
    }) => Promise<string>;
};

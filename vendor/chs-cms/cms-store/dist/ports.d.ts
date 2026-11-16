import type { CmsDomainPersistence } from './domainPorts.js';
import type { ContentEntryRow, MediaAssetRow, PageDocEntryRow, RevisionListRow } from '@chester-hill-solutions/cms-core';
export type NewContentEntry = {
    id: string;
    type: string;
    slug: string | null;
    title: string | null;
    status: string;
    created_at: string;
    updated_at: string;
};
export type NewRevision = {
    id: string;
    entry_id: string;
    payload: string;
    listing_snapshot_json: string;
    version: number;
    created_at: string;
    created_by: string;
    message: string;
};
/** One immutable published payload, read without consulting mutable draft metadata. */
export type PublishedPayloadRow = {
    entryId: string;
    revisionId: string;
    publishedAt: string | null;
    payload: string;
    listingSnapshotJson: string;
};
export type PublishedPagePayloadFilter = {
    slug: string;
    homeEntryId?: string;
};
export type PublicationContext = {
    homeEntryId?: string;
    expectedDraftRevisionId?: string | null;
};
export type DraftMetadata = {
    type: string;
    title: string;
    slug: string | null;
};
export type CollectionRow = {
    id: string;
    label: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};
export type CollectionCategoryRow = {
    id: string;
    collection_id: string;
    label: string;
    slug: string;
    description: string | null;
    sort_order: number;
};
export type TagRow = {
    id: string;
    label: string;
    slug: string;
    description: string | null;
};
export type CollectionFieldRow = {
    id: string;
    collection_id: string;
    key: string;
    label: string;
    type: string;
    required: 0 | 1;
    config_json: string | null;
    sort_order: number;
};
export type EntryCollectionRow = {
    entry_id: string;
    collection_id: string;
    category_id: string | null;
    featured: 0 | 1;
    sort_date: string | null;
};
export type EntryMetadataValueRow = {
    field_key: string;
    value_json: string;
};
export type FormDefinitionRow = {
    id: string;
    title: string;
    description: string | null;
    fields_json: string;
    settings_json: string;
    created_at: string;
    updated_at: string;
};
export type FormResponseRow = {
    id: string;
    form_id: string;
    data_json: string;
    submitted_at: string;
    ip: string | null;
    spam: number;
};
export type CmsMediaObject = {
    body: ReadableStream;
    contentType?: string;
    etag?: string;
};
/** Object storage port (R2, S3-compatible, etc.). */
export type CmsMediaStore = {
    put(key: string, bytes: ArrayBuffer, meta: {
        contentType: string;
    }): Promise<void>;
    get(key: string): Promise<CmsMediaObject | null>;
};
/**
 * Database port — dialect-specific SQL lives in adapters only. Update methods
 * use COALESCE semantics: an omitted patch field keeps the stored value.
 * Insert methods throw on constraint violations; createCmsStore turns those
 * into `{ ok: false, error }` results.
 */
export type CmsPersistence = {
    listContentEntries(): Promise<ContentEntryRow[]>;
    getRevisionPayloadById(id: string): Promise<string | null>;
    getPublishedPayloadJson(entryId: string): Promise<string | null>;
    listPublishedPagePayloads(filter?: PublishedPagePayloadFilter): Promise<PublishedPayloadRow[]>;
    getPageDocEntryIdBySlug(slug: string): Promise<string | null>;
    getContentEntryRow(entryId: string): Promise<ContentEntryRow | null>;
    getContentEntryWithPublishedAt(entryId: string): Promise<(ContentEntryRow & {
        published_at: string | null;
    }) | null>;
    listPageDocEntries(): Promise<PageDocEntryRow[]>;
    contentEntryExists(entryId: string): Promise<boolean>;
    nextRevisionVersion(entryId: string): Promise<number>;
    insertContentEntry(row: NewContentEntry): Promise<void>;
    updateContentEntryMetadata(entryId: string, title: string, slug: string | null, updatedAt: string): Promise<void>;
    setContentEntryType(entryId: string, type: string): Promise<void>;
    /** Atomically guard the draft head, insert a revision and update its metadata. */
    insertRevisionAndSetDraft(rev: NewRevision, entryId: string, updatedAt: string, expectedRevisionId: string | null, metadata?: DraftMetadata): Promise<{
        changes: number;
    }>;
    publishEntry(entryId: string, expectedRevisionId: string, context?: PublicationContext): Promise<{
        changes: number;
    }>;
    /** Insert `rev` (version assigned by the adapter) and publish it in one step. */
    publishOperationalEntry(entryId: string, rev: NewRevision, context?: PublicationContext): Promise<void>;
    getRevisionForEntry(entryId: string, revisionId: string): Promise<{
        payload: string;
        listingSnapshotJson: string;
    } | null>;
    listRevisionsForEntry(entryId: string): Promise<RevisionListRow[]>;
    isSlugTaken(slug: string): Promise<{
        id: string;
    } | null>;
    insertPageDocEntry(row: NewContentEntry): Promise<void>;
    listMediaAssets(limit: number): Promise<MediaAssetRow[]>;
    getMediaAssetByKey(key: string): Promise<MediaAssetRow | null>;
    insertMediaAsset(row: MediaAssetRow): Promise<void>;
    listCollections(): Promise<CollectionRow[]>;
    getCollection(id: string): Promise<CollectionRow | null>;
    insertCollection(row: CollectionRow): Promise<void>;
    updateCollection(id: string, patch: {
        label?: string;
        description?: string;
    }, updatedAt: string): Promise<void>;
    deleteCollection(id: string): Promise<void>;
    listCollectionCategories(collectionId: string): Promise<CollectionCategoryRow[]>;
    getCollectionCategory(id: string): Promise<CollectionCategoryRow | null>;
    insertCollectionCategory(row: CollectionCategoryRow): Promise<void>;
    updateCollectionCategory(id: string, patch: {
        label?: string;
        slug?: string;
        description?: string;
        sortOrder?: number;
    }): Promise<void>;
    deleteCollectionCategory(id: string): Promise<void>;
    listTags(): Promise<TagRow[]>;
    getTag(id: string): Promise<TagRow | null>;
    insertTag(row: TagRow): Promise<void>;
    updateTag(id: string, patch: {
        label?: string;
        slug?: string;
        description?: string;
    }): Promise<void>;
    deleteTag(id: string): Promise<void>;
    listCollectionFields(collectionId: string): Promise<CollectionFieldRow[]>;
    getCollectionField(id: string): Promise<CollectionFieldRow | null>;
    insertCollectionField(row: CollectionFieldRow): Promise<void>;
    updateCollectionField(id: string, patch: {
        key?: string;
        label?: string;
        type?: string;
        required?: 0 | 1;
        configJson?: string;
        sortOrder?: number;
    }): Promise<void>;
    deleteCollectionField(id: string): Promise<void>;
    upsertEntryCollectionAssignment(row: EntryCollectionRow): Promise<void>;
    deleteEntryCollectionAssignment(entryId: string, collectionId: string): Promise<void>;
    getEntryCollectionAssignment(entryId: string, collectionId: string): Promise<EntryCollectionRow | null>;
    listEntriesByCollection(collectionId: string, options?: {
        categoryId?: string;
        featured?: 0 | 1;
        status?: 'published' | 'all';
    }): Promise<ContentEntryRow[]>;
    insertEntryTag(entryId: string, tagId: string): Promise<void>;
    deleteEntryTag(entryId: string, tagId: string): Promise<void>;
    listTagsForEntry(entryId: string): Promise<TagRow[]>;
    listEntriesByTag(tagId: string): Promise<ContentEntryRow[]>;
    upsertEntryMetadataValue(entryId: string, collectionId: string, fieldKey: string, valueJson: string): Promise<void>;
    listEntryMetadataValues(entryId: string, collectionId: string): Promise<EntryMetadataValueRow[]>;
    deleteEntryMetadataValue(entryId: string, collectionId: string, fieldKey: string): Promise<void>;
    getAnalyticsConfigJson(): Promise<string | null>;
    setAnalyticsConfigJson(configJson: string, updatedAt: string): Promise<void>;
    getSiteThemeJson(): Promise<string | null>;
    setSiteThemeJson(themeJson: string, updatedAt: string): Promise<void>;
    listFormDefinitions(): Promise<FormDefinitionRow[]>;
    getFormDefinition(id: string): Promise<FormDefinitionRow | null>;
    insertFormDefinition(row: FormDefinitionRow): Promise<void>;
    updateFormDefinition(id: string, patch: {
        title?: string;
        description?: string;
        fieldsJson?: string;
        settingsJson?: string;
    }, updatedAt: string): Promise<void>;
    deleteFormDefinition(id: string): Promise<void>;
    insertFormResponse(row: FormResponseRow): Promise<void>;
    countRecentFormResponses(ip: string, windowSeconds: number): Promise<number>;
    listFormResponses(formId: string): Promise<FormResponseRow[]>;
    getFormResponse(id: string): Promise<FormResponseRow | null>;
    deleteFormResponse(id: string): Promise<void>;
};
export type CmsStorePorts = {
    db: CmsPersistence;
    media?: CmsMediaStore;
    /**
     * Typed domain content. Optional, so a site that publishes only pages keeps
     * working unchanged; `createDomainStore` is what requires it.
     */
    domain?: CmsDomainPersistence;
};

import type { CmsCollection, CollectionCategory, CollectionField, CollectionFieldConfig, CollectionFieldType } from '@chester-hill-solutions/cms-core';
export type CollectionDetailProps = {
    collection: CmsCollection;
    categories: CollectionCategory[];
    fields: CollectionField[];
    onUpdateCollection: (id: string, input: {
        label?: string;
        description?: string;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    onCreateCategory: (input: {
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
    onUpdateCategory: (id: string, input: {
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
    onDeleteCategory: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    onCreateField: (input: {
        id: string;
        collectionId: string;
        key: string;
        label: string;
        type: CollectionFieldType;
        required?: 0 | 1;
        config?: CollectionFieldConfig;
        sortOrder?: number;
    }) => Promise<{
        ok: true;
        field: CollectionField;
    } | {
        ok: false;
        error: string;
    }>;
    onUpdateField: (id: string, input: {
        key?: string;
        label?: string;
        type?: CollectionFieldType;
        required?: 0 | 1;
        config?: CollectionFieldConfig;
        sortOrder?: number;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    onDeleteField: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    loading?: boolean;
    error?: string | null;
};
export declare function CollectionDetail({ collection, categories, fields, onUpdateCollection, onCreateCategory, onUpdateCategory, onDeleteCategory, onCreateField, onUpdateField, onDeleteField, loading, error, }: CollectionDetailProps): import("react").JSX.Element;

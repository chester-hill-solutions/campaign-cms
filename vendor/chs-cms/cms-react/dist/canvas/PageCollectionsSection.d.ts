import type { CollectionFieldConfig, CollectionFieldType } from '@chester-hill-solutions/cms-core';
export type CollectionOption = {
    id: string;
    label: string;
};
export type CategoryOption = {
    id: string;
    label: string;
};
export type CollectionFieldInput = {
    id: string;
    key: string;
    label: string;
    type: CollectionFieldType;
    required?: boolean;
    config?: CollectionFieldConfig;
};
/** Host-loaded assignment state for one collection. */
export type AssignmentView = {
    categoryId?: string;
    featured: boolean;
    sortDate?: string;
};
export type PageCollectionsSectionProps = {
    collections: CollectionOption[];
    /** Current assignment per collectionId — absent means unassigned. */
    assignments: Record<string, AssignmentView>;
    categoriesByCollectionId: Record<string, CategoryOption[]>;
    fieldsByCollectionId: Record<string, CollectionFieldInput[]>;
    metadataByCollectionId: Record<string, Record<string, unknown>>;
    pending?: boolean;
    onAssign: (collectionId: string) => void;
    onAssignmentChange: (collectionId: string, view: AssignmentView) => void;
    onUnassign: (collectionId: string) => void;
    onSetMetadataValue: (collectionId: string, fieldKey: string, value: unknown) => void;
};
/**
 * Assign the page to collections and edit its per-collection metadata
 * (e.g. portfolio project date, external URL, tech stack). Fully controlled:
 * hosts load state from their store and persist through the callbacks,
 * which map 1:1 onto cms-store operations.
 */
export declare function PageCollectionsSection({ collections, assignments, categoriesByCollectionId, fieldsByCollectionId, metadataByCollectionId, pending, onAssign, onAssignmentChange, onUnassign, onSetMetadataValue, }: PageCollectionsSectionProps): import("react").JSX.Element | null;

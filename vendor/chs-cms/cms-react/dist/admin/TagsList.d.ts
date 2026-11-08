import type { CollectionTag } from '@chester-hill-solutions/cms-core';
export type TagsListProps = {
    tags: CollectionTag[];
    onCreate: (input: {
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
    onUpdate: (id: string, input: {
        label?: string;
        slug?: string;
        description?: string;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    onDelete: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    loading?: boolean;
    error?: string | null;
};
export declare function TagsList({ tags, onCreate, onUpdate, onDelete, loading, error, }: TagsListProps): import("react").JSX.Element;

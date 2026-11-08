import type { CmsCollection } from '@chester-hill-solutions/cms-core';
export type CollectionListProps = {
    collections: CmsCollection[];
    onCreate: (input: {
        id: string;
        label: string;
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
export declare function CollectionList({ collections, onCreate, onDelete, loading, error, }: CollectionListProps): import("react").JSX.Element;

import { type ReactNode } from 'react';
import { type PageCollectionsSectionProps } from './PageCollectionsSection';
import type { PageMeta } from '@chester-hill-solutions/cms-core';
export type RevisionRow = {
    id: string;
    version: number;
    created_at: string;
    message: string | null;
};
type Props = {
    open: boolean;
    onClose: () => void;
    content: PageMeta;
    onChange: (next: PageMeta) => void;
    pageErrors: string[];
    revisions: RevisionRow[];
    restorePending: boolean;
    onRestoreRevision: (revisionId: string) => void;
    onApplyTemplate?: () => void;
    /** Lock the slug field (e.g. the home page, which always lives at '/'). */
    slugLocked?: boolean;
    /** Actual host route, which may differ from the slug-derived default. */
    publicPath?: string;
    /** Collection assignment + metadata editing; hidden when the host doesn't pass it. */
    collections?: PageCollectionsSectionProps;
    /** Host actions adjacent to collection settings (e.g. open collection management). */
    collectionActions?: ReactNode;
    /** Host guidance about revision history or restoration limits. */
    revisionNotice?: ReactNode;
};
/** Slide-over drawer for page meta, SEO, navigation, collections, and revision history. */
export declare function PageSettingsDrawer({ open, onClose, content, onChange, pageErrors, revisions, restorePending, onRestoreRevision, onApplyTemplate, slugLocked, publicPath: hostPublicPath, collections, collectionActions, revisionNotice, }: Props): import("react").JSX.Element | null;
export {};

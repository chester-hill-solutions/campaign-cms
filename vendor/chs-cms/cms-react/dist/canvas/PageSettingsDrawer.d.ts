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
    onApplyTemplate: () => void;
};
/** Slide-over drawer for page meta, SEO, navigation, and revision history. */
export declare function PageSettingsDrawer({ open, onClose, content, onChange, pageErrors, revisions, restorePending, onRestoreRevision, onApplyTemplate, }: Props): import("react").JSX.Element | null;
export {};

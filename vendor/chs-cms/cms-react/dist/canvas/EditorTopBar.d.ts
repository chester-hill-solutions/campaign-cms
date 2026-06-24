import type { EntryEditorMeta } from '@chester-hill-solutions/cms-core';
import type { AutosaveStatus } from './useAutosave';
export type Viewport = 'desktop' | 'mobile';
type Props = {
    title: string;
    meta: EntryEditorMeta;
    publicPath: string | null;
    pagesListHref?: string | null;
    saveStatus: AutosaveStatus;
    saveError: string | null;
    dirty: boolean;
    pageErrorCount: number;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    viewport: Viewport;
    onViewportChange: (viewport: Viewport) => void;
    onOpenPageSettings: () => void;
    publishPending: boolean;
    onPublish: () => void;
    publishMessage: string | null;
};
/** Sticky editor header: title, save state, undo/redo, viewport, publish. */
export declare function EditorTopBar({ title, meta, publicPath, pagesListHref, saveStatus, saveError, dirty, pageErrorCount, canUndo, canRedo, onUndo, onRedo, viewport, onViewportChange, onOpenPageSettings, publishPending, onPublish, publishMessage, }: Props): import("react").JSX.Element;
export {};

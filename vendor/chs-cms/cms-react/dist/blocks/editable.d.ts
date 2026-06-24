import type { PageBlock } from '@chester-hill-solutions/cms-core';
/**
 * Edit context for the admin page builder canvas. On the public site this
 * context is absent and every editable primitive renders plain content,
 * keeping the public DOM identical to the pre-builder output.
 */
export type BlockEditApi = {
    updateBlock: (block: PageBlock) => void;
};
export declare const BlockEditProvider: import("react").Provider<BlockEditApi | null>;
export declare function useBlockEdit(): BlockEditApi | null;
type EditableTextProps = {
    value: string;
    /** Produce the next block from the edited value. Only called in edit mode. */
    update: (value: string) => PageBlock;
    placeholder?: string;
    multiline?: boolean;
    className?: string;
    /** Stable id used to restore focus after structural edits (list items). */
    editableId?: string;
    onEnterKey?: () => void;
    onBackspaceEmpty?: () => void;
};
/**
 * Inline-editable text. Renders the plain value on the public site; a
 * contentEditable region (inheriting the surrounding typography) in the
 * builder canvas.
 */
export declare function EditableText({ value, update, ...rest }: EditableTextProps): import("react").JSX.Element;
type EditableMarkdownProps = {
    value: string;
    /** Produce the next block from the edited markdown. Only called in edit mode. */
    update: (markdown: string) => PageBlock;
};
/**
 * Markdown body. Public site renders via CmsMarkdownBody; the builder canvas
 * lazy-loads a TipTap editor that round-trips to the same markdown subset.
 */
export declare function EditableMarkdown({ value, update }: EditableMarkdownProps): import("react").JSX.Element;
/**
 * Hover controls for items inside a block (cards, sections, stats…).
 * Place inside a `relative` container with the `group/item` class.
 */
export declare function ItemControls({ label, index, count, min, onMove, onRemove, }: {
    label: string;
    index: number;
    count: number;
    min?: number;
    onMove: (toIndex: number) => void;
    onRemove: () => void;
}): import("react").JSX.Element;
/** Dashed "add item" button shown at the end of editable item collections. */
export declare function AddItemButton({ label, onAdd, className, }: {
    label: string;
    onAdd: () => void;
    className?: string;
}): import("react").JSX.Element;
/** Reorder an array immutably. */
export declare function moveItem<T>(items: T[], from: number, to: number): T[];
export {};

import { type PageMeta } from '@chester-hill-solutions/cms-core';
type Props = {
    content: PageMeta;
    onChange: (next: PageMeta) => void;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onOpenSettings: () => void;
    onDelete: (blockId: string) => void;
    errorsByBlock: ReadonlyMap<string, string[]>;
};
/**
 * The inline-editable page canvas. Renders real block views wrapped in
 * selection chrome, with insert points between blocks and drag reordering.
 */
export declare function EditorCanvas({ content, onChange, selectedId, onSelect, onOpenSettings, onDelete, errorsByBlock, }: Props): import("react").JSX.Element;
export {};

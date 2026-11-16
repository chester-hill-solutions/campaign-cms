import { type PageBlock } from '@chester-hill-solutions/cms-core';
type BlockType = PageBlock['type'];
export declare const BLOCK_TYPE_HINTS: Partial<Record<BlockType, string>>;
type Props = {
    onPick: (type: BlockType) => void;
    onClose: () => void;
    align?: 'start' | 'end';
};
/** Searchable, keyboard-navigable block palette popover. */
export declare function InsertMenu({ onPick, onClose, align }: Props): import("react").JSX.Element;
export {};

import { type PageBlock } from '@chester-hill-solutions/cms-core';
type BlockType = PageBlock['type'];
type Props = {
    onPick: (type: BlockType) => void;
    onClose: () => void;
};
/** Searchable, keyboard-navigable block palette popover. */
export declare function InsertMenu({ onPick, onClose }: Props): import("react").JSX.Element;
export {};

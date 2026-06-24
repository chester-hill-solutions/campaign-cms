import type { PageBlock } from '@chester-hill-solutions/cms-core';
type Props = {
    block: PageBlock;
    index: number;
    count: number;
    selected: boolean;
    errors?: string[];
    onSelect: () => void;
    onOpenSettings: () => void;
    onMove: (direction: -1 | 1) => void;
    onDuplicate: () => void;
    onDelete: () => void;
    children: React.ReactNode;
};
/**
 * Canvas wrapper for one block: hover/selection outline, label chip, and a
 * floating toolbar with move / duplicate / settings / delete plus drag handle.
 */
export declare function BlockChrome({ block, index, count, selected, errors, onSelect, onOpenSettings, onMove, onDuplicate, onDelete, children, }: Props): import("react").JSX.Element;
export {};

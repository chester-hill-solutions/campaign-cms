import type { PageBlock } from './blockSchemas.js';
/** Kind of nested item shown under a block in the structure navigator. */
export type BlockItemKind = 'card' | 'accordionSection' | 'stat' | 'timelineItem' | 'column' | 'listItem';
export type BlockTreeChild = {
    key: string;
    label: string;
    itemKind: BlockItemKind;
    itemId?: string;
    itemIndex: number;
};
/** Pure helper: items nested under a block for the structure navigator. */
export declare function getBlockTreeChildren(block: PageBlock): BlockTreeChild[];

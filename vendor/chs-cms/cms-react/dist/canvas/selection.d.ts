import { type BlockItemKind, type PageBlock } from '@chester-hill-solutions/cms-core';
export type { BlockItemKind };
export type BlockSelection = {
    blockId: string;
    itemKind?: BlockItemKind;
    itemId?: string;
    itemIndex?: number;
};
export declare function isItemSelection(selection: BlockSelection | null | undefined): selection is BlockSelection & {
    itemKind: BlockItemKind;
    itemIndex: number;
};
export declare function selectionEquals(a: BlockSelection | null | undefined, b: BlockSelection | null | undefined): boolean;
/** Drop or rebind selection when blocks/items disappear after an edit. */
export declare function reconcileSelection(blocks: readonly PageBlock[], selection: BlockSelection | null | undefined): BlockSelection | null;

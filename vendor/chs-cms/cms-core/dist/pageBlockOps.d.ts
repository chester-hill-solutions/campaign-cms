import { type PageBlock, type PageDocPayload } from './blockSchemas';
import { type BlockFactoryDefaults } from './blockFactory';
export type PageMeta = Omit<PageDocPayload, 'kind' | 'version'>;
/** Insert a fresh default block at the given index. Returns the new block too. */
export declare function insertBlockAt(content: PageMeta, type: PageBlock['type'], index: number, defaults?: BlockFactoryDefaults): {
    content: PageMeta;
    block: PageBlock;
};
export declare function duplicateBlockInPage(content: PageMeta, blockId: string): PageMeta;
export declare function removeBlockFromPage(content: PageMeta, blockId: string): PageMeta;
export declare function updateBlockInPage(content: PageMeta, block: PageBlock): PageMeta;
export declare function reorderBlocksInPage(content: PageMeta, fromIndex: number, toIndex: number): PageMeta;
/** Move a block one step up or down. */
export declare function moveBlockInPage(content: PageMeta, blockId: string, direction: -1 | 1): PageMeta;

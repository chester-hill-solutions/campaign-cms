import { type PageBlock } from './blockSchemas';
/** Host-tunable defaults used when inserting fresh blocks in the editor. */
export type BlockFactoryDefaults = {
    /** Placeholder `src` for new image blocks (schema requires a non-empty path). */
    imagePlaceholderSrc?: string;
};
export declare function createDefaultBlock(type: PageBlock['type'], defaults?: BlockFactoryDefaults): PageBlock;

import type { PageBlock } from '@chester-hill-solutions/cms-core';
type BlockType = PageBlock['type'];
/** Lucide icon component for each palette block type. */
export declare const BLOCK_TYPE_ICONS: Record<BlockType, React.ComponentType<{
    className?: string;
}>>;
export {};

import type { PageBlock } from '@chester-hill-solutions/cms-core';
import type { BlockSelection } from './selection';
type Props = {
    block: PageBlock;
    selection: BlockSelection;
    onChange: (block: PageBlock) => void;
};
export declare function itemSettingsLabel(block: PageBlock, selection: BlockSelection): string;
/** Settings form for a selected nested item under a multi-item block. */
export declare function BlockItemSettings({ block, selection, onChange }: Props): import("react").JSX.Element | null;
export {};

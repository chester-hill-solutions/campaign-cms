import type { PageBlock } from '@chester-hill-solutions/cms-core';
type SettingsProps = {
    block: PageBlock;
    onChange: (block: PageBlock) => void;
};
/**
 * Non-text settings for the selected block. Text content is edited inline on
 * the canvas; this panel covers images, links, enums, and app-block fields.
 */
export declare function BlockTypeSettings({ block, onChange }: SettingsProps): import("react").JSX.Element;
export {};

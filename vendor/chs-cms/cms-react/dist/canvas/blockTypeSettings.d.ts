import type { PageBlock } from '@chester-hill-solutions/cms-core';
type SettingsProps = {
    block: PageBlock;
    onChange: (block: PageBlock) => void;
    /** Saved form-builder definitions; enables the contactForm picker when provided. */
    forms?: FormSummary[];
};
export type FormSummary = {
    id: string;
    title: string;
};
/**
 * Non-text settings for the selected block. Text content is edited inline on
 * the canvas; this panel covers images, links, enums, and app-block fields.
 */
export declare function BlockTypeSettings({ block, onChange, forms }: SettingsProps): import("react").JSX.Element;
export {};

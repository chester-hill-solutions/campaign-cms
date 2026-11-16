import type { PageBlock } from '@chester-hill-solutions/cms-core';
type Props = {
    block: PageBlock;
    errors?: string[];
    onChange: (block: PageBlock) => void;
    /** When set, opens/scrolls to the matching item panel (e.g. a card). */
    focusItemIndex?: number;
    /** When set, scrolls to a named part marker if present. */
    focusPartKey?: string;
};
/** Shared settings fields for a selected block (type-specific + layout). */
export declare function BlockSettingsBody({ block, errors, onChange, focusItemIndex, focusPartKey, }: Props): import("react").JSX.Element;
export {};

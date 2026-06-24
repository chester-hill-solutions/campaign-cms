import type { PageBlock } from '@chester-hill-solutions/cms-core';
type Props = {
    block: PageBlock;
    errors?: string[];
    onChange: (block: PageBlock) => void;
    onClose: () => void;
};
/** Floating settings inspector for the selected block. */
export declare function BlockSettingsPanel({ block, errors, onChange, onClose }: Props): import("react").JSX.Element;
export {};

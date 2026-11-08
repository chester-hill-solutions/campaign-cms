import type { PageBlock } from '@chester-hill-solutions/cms-core';
import { type FormSummary } from './blockTypeSettings';
import type { BlockSelection } from './selection';
type Props = {
    block: PageBlock | null;
    selection?: BlockSelection | null;
    errors?: string[];
    onChange: (block: PageBlock) => void;
    onClose: () => void;
    /** @default 'docked' */
    variant?: 'docked' | 'floating';
    /** Saved form-builder definitions; enables the contactForm picker when provided. */
    forms?: FormSummary[];
};
/** Settings inspector for the selected block or nested item. */
export declare function BlockSettingsPanel({ block, selection, errors, onChange, onClose, variant, forms, }: Props): import("react").JSX.Element;
export {};

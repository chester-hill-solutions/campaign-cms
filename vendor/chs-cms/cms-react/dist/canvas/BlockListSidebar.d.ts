import { type PageMeta } from '@chester-hill-solutions/cms-core';
import { type BlockSelection } from './blockChildren';
type Props = {
    content: PageMeta;
    selection: BlockSelection | null;
    onSelect: (selection: BlockSelection | null) => void;
    onChange: (next: PageMeta) => void;
    errorsByBlock: ReadonlyMap<string, string[]>;
    /** Hide inline settings when the host renders a separate block inspector. */
    showSettings?: boolean;
    /** When provided, shows a collapse toggle beside the header title. */
    onCollapse?: () => void;
    className?: string;
};
/**
 * Always-visible left rail: page block outline on top, settings for the
 * current selection below.
 */
export declare function BlockListSidebar({ content, selection, onSelect, onChange, errorsByBlock, showSettings, onCollapse, className, }: Props): import("react").JSX.Element;
export {};

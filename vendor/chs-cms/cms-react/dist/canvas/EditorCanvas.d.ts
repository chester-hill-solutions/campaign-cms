import { type PageMeta } from '@chester-hill-solutions/cms-core';
import { type AppBlockRenderers } from '../blocks/BlockRenderer';
import type { BlockSelection } from './selection';
type Props<TContext = unknown> = {
    content: PageMeta;
    onChange: (next: PageMeta) => void;
    onSelect: (selection: BlockSelection | null) => void;
    onOpenSettings: () => void;
    onDelete: (blockId: string) => void;
    errorsByBlock: ReadonlyMap<string, string[]>;
    /** Full selection (including nested item) for canvas item highlight. */
    selection?: BlockSelection | null;
    /** Host app-block renderers (forms, collection grids, …). When provided, the canvas shows live previews. */
    appBlocks?: AppBlockRenderers<TContext>;
    appContext?: TContext;
};
/**
 * The inline-editable page canvas. Renders real block views wrapped in
 * selection chrome, with insert points between blocks and drag reordering.
 */
export declare function EditorCanvas<TContext = unknown>({ content, onChange, onSelect, onOpenSettings, onDelete, errorsByBlock, selection, appBlocks, appContext, }: Props<TContext>): import("react").JSX.Element;
export {};

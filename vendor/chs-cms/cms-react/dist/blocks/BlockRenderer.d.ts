import { APP_BLOCK_TYPES, type PageBlock } from '@chester-hill-solutions/cms-core';
export type AppBlockType = (typeof APP_BLOCK_TYPES)[number];
/**
 * Host-supplied renderers for app blocks (forms, event lists, donate embeds…).
 * Generic block types are rendered by this package; app blocks need live data
 * and components from the host app.
 */
export type AppBlockRenderers<TContext = unknown> = {
    [K in AppBlockType]?: React.ComponentType<{
        block: Extract<PageBlock, {
            type: K;
        }>;
        context: TContext | undefined;
    }>;
};
export declare function isAppBlockType(type: PageBlock['type']): type is AppBlockType;
export type BlockRendererProps<TContext = unknown> = {
    blocks: PageBlock[];
    appContext?: TContext;
    appBlocks?: AppBlockRenderers<TContext>;
};
export declare function renderBlockView<TContext>(block: PageBlock, appContext?: TContext, appBlocks?: AppBlockRenderers<TContext>): import("react").JSX.Element | null;
export declare function BlockRenderer<TContext>({ blocks, appContext, appBlocks, }: BlockRendererProps<TContext>): import("react").JSX.Element;
export declare function BlockPreview<TContext>({ block, appContext, appBlocks, }: {
    block: PageBlock;
    appContext?: TContext;
    appBlocks?: AppBlockRenderers<TContext>;
}): import("react").JSX.Element;

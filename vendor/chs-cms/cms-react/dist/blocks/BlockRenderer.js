import { jsx as _jsx } from "react/jsx-runtime";
import { APP_BLOCK_TYPES } from '@chester-hill-solutions/cms-core';
import { blockLayoutClasses } from './layoutClasses';
import { AccordionBlockView } from './AccordionBlockView';
import { CardGridBlockView } from './CardGridBlockView';
import { CalloutBlockView, CustomHtmlBlockView, EmbedBlockView, QuoteBlockView, StatGridBlockView, TimelineBlockView, } from './ContentBlockViews';
import { CtaStripBlockView } from './CtaStripBlockView';
import { HeroBlockView } from './HeroBlockView';
import { ColumnsBlockView, DividerBlockView, SectionHeaderBlockView, SpacerBlockView, TwoUpBlockView, } from './LayoutBlockViews';
import { ImageBlockView, ListBlockView } from './MiscBlockViews';
import { RichTextBlockView } from './RichTextBlockView';
import { TableBlockView } from './TableBlockView';
const APP_BLOCK_TYPE_SET = new Set(APP_BLOCK_TYPES);
export function isAppBlockType(type) {
    return APP_BLOCK_TYPE_SET.has(type);
}
function renderAppBlock(block, appContext, appBlocks) {
    const Component = appBlocks?.[block.type];
    if (!Component)
        return null;
    return _jsx(Component, { block: block, context: appContext });
}
export function renderBlockView(block, appContext, appBlocks) {
    switch (block.type) {
        case 'hero':
            return _jsx(HeroBlockView, { block: block });
        case 'richText':
            return _jsx(RichTextBlockView, { block: block });
        case 'cardGrid':
            return _jsx(CardGridBlockView, { block: block });
        case 'table':
            return _jsx(TableBlockView, { block: block });
        case 'accordion':
            return _jsx(AccordionBlockView, { block: block });
        case 'ctaStrip':
            return _jsx(CtaStripBlockView, { block: block });
        case 'quote':
            return _jsx(QuoteBlockView, { block: block });
        case 'image':
            return _jsx(ImageBlockView, { block: block });
        case 'columns':
            return _jsx(ColumnsBlockView, { block: block });
        case 'list':
            return _jsx(ListBlockView, { block: block });
        case 'divider':
            return _jsx(DividerBlockView, { block: block });
        case 'sectionHeader':
            return _jsx(SectionHeaderBlockView, { block: block });
        case 'twoUp':
            return _jsx(TwoUpBlockView, { block: block });
        case 'statGrid':
            return _jsx(StatGridBlockView, { block: block });
        case 'timeline':
            return _jsx(TimelineBlockView, { block: block });
        case 'callout':
            return _jsx(CalloutBlockView, { block: block });
        case 'embed':
            return _jsx(EmbedBlockView, { block: block });
        case 'customHtml':
            return _jsx(CustomHtmlBlockView, { block: block });
        case 'spacer':
            return _jsx(SpacerBlockView, { block: block });
        case 'contactForm':
        case 'eventsList':
        case 'eventsTeaser':
        case 'bioLinks':
        case 'donateEmbed':
        case 'collectionGrid':
            return renderAppBlock(block, appContext, appBlocks);
        default: {
            const _exhaustive = block;
            return _exhaustive;
        }
    }
}
export function BlockRenderer({ blocks, appContext, appBlocks, }) {
    return (_jsx("div", { className: "cms-blocks @container w-full min-w-0 grid grid-cols-1 gap-2", children: blocks.map((block) => (_jsx("div", { className: `cms-block ${blockLayoutClasses(block.layout)}`, "data-block-id": block.id, "data-block-type": block.type, "data-background": block.layout.background, "data-width": block.layout.width, "data-spacing": block.layout.spacing, "data-align": block.layout.align, "data-accent": block.layout.accent, children: renderBlockView(block, appContext, appBlocks) }, block.id))) }));
}
export function BlockPreview({ block, appContext, appBlocks, }) {
    return (_jsx("div", { className: "@container w-full min-w-0", children: _jsx("div", { className: `cms-block ${blockLayoutClasses(block.layout)}`, "data-block-id": block.id, "data-block-type": block.type, "data-background": block.layout.background, "data-width": block.layout.width, "data-spacing": block.layout.spacing, "data-align": block.layout.align, "data-accent": block.layout.accent, children: renderBlockView(block, appContext, appBlocks) }) }));
}

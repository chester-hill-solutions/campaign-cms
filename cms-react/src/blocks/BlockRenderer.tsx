import { APP_BLOCK_TYPES, type PageBlock } from '@campaign/cms-core'

import { blockLayoutClasses } from './layoutClasses'
import { AccordionBlockView } from './AccordionBlockView'
import { CardGridBlockView } from './CardGridBlockView'
import {
  CalloutBlockView,
  CustomHtmlBlockView,
  EmbedBlockView,
  QuoteBlockView,
  StatGridBlockView,
  TimelineBlockView,
} from './ContentBlockViews'
import { CtaStripBlockView } from './CtaStripBlockView'
import { HeroBlockView } from './HeroBlockView'
import {
  ColumnsBlockView,
  DividerBlockView,
  SectionHeaderBlockView,
  SpacerBlockView,
  TwoUpBlockView,
} from './LayoutBlockViews'
import { ImageBlockView, ListBlockView } from './MiscBlockViews'
import { RichTextBlockView } from './RichTextBlockView'
import { TableBlockView } from './TableBlockView'

export type AppBlockType = (typeof APP_BLOCK_TYPES)[number]

/**
 * Host-supplied renderers for app blocks (forms, event lists, donate embeds…).
 * Generic block types are rendered by this package; app blocks need live data
 * and components from the host app.
 */
export type AppBlockRenderers<TContext = unknown> = {
  [K in AppBlockType]?: React.ComponentType<{
    block: Extract<PageBlock, { type: K }>
    context: TContext | undefined
  }>
}

const APP_BLOCK_TYPE_SET: ReadonlySet<PageBlock['type']> = new Set(APP_BLOCK_TYPES)

export function isAppBlockType(type: PageBlock['type']): type is AppBlockType {
  return APP_BLOCK_TYPE_SET.has(type)
}

export type BlockRendererProps<TContext = unknown> = {
  blocks: PageBlock[]
  appContext?: TContext
  appBlocks?: AppBlockRenderers<TContext>
}

function renderAppBlock<TContext>(
  block: Extract<PageBlock, { type: AppBlockType }>,
  appContext: TContext | undefined,
  appBlocks: AppBlockRenderers<TContext> | undefined,
) {
  const Component = appBlocks?.[block.type] as
    | React.ComponentType<{ block: PageBlock; context: TContext | undefined }>
    | undefined
  if (!Component) return null
  return <Component block={block} context={appContext} />
}

export function renderBlockView<TContext>(
  block: PageBlock,
  appContext?: TContext,
  appBlocks?: AppBlockRenderers<TContext>,
) {
  switch (block.type) {
    case 'hero':
      return <HeroBlockView block={block} />
    case 'richText':
      return <RichTextBlockView block={block} />
    case 'cardGrid':
      return <CardGridBlockView block={block} />
    case 'table':
      return <TableBlockView block={block} />
    case 'accordion':
      return <AccordionBlockView block={block} />
    case 'ctaStrip':
      return <CtaStripBlockView block={block} />
    case 'quote':
      return <QuoteBlockView block={block} />
    case 'image':
      return <ImageBlockView block={block} />
    case 'columns':
      return <ColumnsBlockView block={block} />
    case 'list':
      return <ListBlockView block={block} />
    case 'divider':
      return <DividerBlockView block={block} />
    case 'sectionHeader':
      return <SectionHeaderBlockView block={block} />
    case 'twoUp':
      return <TwoUpBlockView block={block} />
    case 'statGrid':
      return <StatGridBlockView block={block} />
    case 'timeline':
      return <TimelineBlockView block={block} />
    case 'callout':
      return <CalloutBlockView block={block} />
    case 'embed':
      return <EmbedBlockView block={block} />
    case 'customHtml':
      return <CustomHtmlBlockView block={block} />
    case 'spacer':
      return <SpacerBlockView block={block} />
    case 'contactForm':
    case 'eventsList':
    case 'eventsTeaser':
    case 'bioLinks':
    case 'donateEmbed':
      return renderAppBlock(block, appContext, appBlocks)
    default: {
      const _exhaustive: never = block
      return _exhaustive
    }
  }
}

export function BlockRenderer<TContext>({
  blocks,
  appContext,
  appBlocks,
}: BlockRendererProps<TContext>) {
  return (
    <div className="@container w-full min-w-0 grid gap-2">
      {blocks.map((block) => (
        <div key={block.id} className={blockLayoutClasses(block.layout)}>
          {renderBlockView(block, appContext, appBlocks)}
        </div>
      ))}
    </div>
  )
}

export function BlockPreview<TContext>({
  block,
  appContext,
  appBlocks,
}: {
  block: PageBlock
  appContext?: TContext
  appBlocks?: AppBlockRenderers<TContext>
}) {
  return (
    <div className="@container w-full min-w-0">
      <div className={blockLayoutClasses(block.layout)}>
        {renderBlockView(block, appContext, appBlocks)}
      </div>
    </div>
  )
}

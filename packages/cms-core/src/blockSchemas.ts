import { z } from 'zod'

/** Constrained on-brand layout options shared by every block. */
export const blockLayoutSchema = z.object({
  width: z.enum(['contained', 'wide', 'full']),
  background: z.enum(['none', 'card', 'accent', 'brand-gradient']),
  spacing: z.enum(['tight', 'normal', 'loose']),
  align: z.enum(['left', 'center']),
})

export type BlockLayout = z.infer<typeof blockLayoutSchema>

export const DEFAULT_BLOCK_LAYOUT: BlockLayout = {
  width: 'contained',
  background: 'none',
  spacing: 'normal',
  align: 'left',
}

export const blockCtaSchema = z.object({
  label: z.string().min(1).max(120),
  href: z.string().min(1).max(2000),
  external: z.boolean().optional(),
})

export type BlockCta = z.infer<typeof blockCtaSchema>

const blockBaseSchema = z.object({
  id: z.string().min(1).max(64),
  layout: blockLayoutSchema.default(DEFAULT_BLOCK_LAYOUT),
})

export const heroBlockSchema = blockBaseSchema.extend({
  type: z.literal('hero'),
  kicker: z.string().max(80).optional(),
  heading: z.string().min(1).max(200),
  subhead: z.string().max(500).optional(),
  body: z.string().max(2000).optional(),
  primaryCta: blockCtaSchema.optional(),
  secondaryCta: blockCtaSchema.optional(),
  tertiaryCta: blockCtaSchema.optional(),
  portraitSrc: z.string().max(500).optional(),
  portraitAlt: z.string().max(200).optional(),
  backgroundSrc: z.string().max(500).optional(),
  imagePosition: z.enum(['left', 'right']).optional(),
  mobileImagePosition: z.enum(['top', 'bottom']).optional(),
})

export const richTextBlockSchema = blockBaseSchema.extend({
  type: z.literal('richText'),
  markdown: z.string().min(1).max(50000),
  anchorId: z.string().max(80).optional(),
})

export const cardGridItemSchema = z.object({
  id: z.string().min(1).max(64),
  title: z.string().min(1).max(200),
  body: z.string().max(2000).optional(),
  expandBody: z.string().max(5000).optional(),
  iconSrc: z.string().max(500).optional(),
  imageSrc: z.string().max(500).optional(),
})

export const cardGridBlockSchema = blockBaseSchema.extend({
  type: z.literal('cardGrid'),
  heading: z.string().max(200).optional(),
  subheading: z.string().max(500).optional(),
  columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  cards: z.array(cardGridItemSchema).min(1).max(20),
})

export const tableBlockSchema = blockBaseSchema.extend({
  type: z.literal('table'),
  heading: z.string().max(200).optional(),
  headers: z.array(z.string().min(1).max(200)).min(1).max(10),
  rows: z.array(z.array(z.string().max(500)).min(1).max(10)).max(50),
  footnote: z.string().max(2000).optional(),
  mobileCollapse: z.boolean().optional(),
  mobileSummary: z.string().max(500).optional(),
})

export const accordionSectionSchema = z.object({
  id: z.string().min(1).max(64),
  title: z.string().min(1).max(200),
  markdown: z.string().min(1).max(10000),
  imageSrc: z.string().max(500).optional(),
})

export const accordionBlockSchema = blockBaseSchema.extend({
  type: z.literal('accordion'),
  heading: z.string().max(200).optional(),
  sections: z.array(accordionSectionSchema).min(1).max(20),
})

export const ctaStripBlockSchema = blockBaseSchema.extend({
  type: z.literal('ctaStrip'),
  headline: z.string().min(1).max(200),
  body: z.string().max(1000).optional(),
  primaryCta: blockCtaSchema.optional(),
  secondaryCta: blockCtaSchema.optional(),
})

export const quoteBlockSchema = blockBaseSchema.extend({
  type: z.literal('quote'),
  text: z.string().min(1).max(2000),
  attribution: z.string().max(200).optional(),
})

export const imageBlockSchema = blockBaseSchema.extend({
  type: z.literal('image'),
  src: z.string().min(1).max(500),
  alt: z.string().min(1).max(200),
  caption: z.string().max(500).optional(),
})

export const columnsBlockSchema = blockBaseSchema.extend({
  type: z.literal('columns'),
  columnCount: z.union([z.literal(2), z.literal(3)]),
  columns: z.array(z.object({ markdown: z.string().min(1).max(10000) })).min(2).max(3),
})

export const listBlockSchema = blockBaseSchema.extend({
  type: z.literal('list'),
  heading: z.string().max(200).optional(),
  ordered: z.boolean().optional(),
  items: z.array(z.string().min(1).max(1000)).min(1).max(50),
})

export const dividerBlockSchema = blockBaseSchema.extend({
  type: z.literal('divider'),
})

export const sectionHeaderBlockSchema = blockBaseSchema.extend({
  type: z.literal('sectionHeader'),
  anchorId: z.string().max(80).optional(),
  kicker: z.string().max(80).optional(),
  heading: z.string().min(1).max(200),
  dek: z.string().max(500).optional(),
  body: z.string().max(2000).optional(),
  level: z.enum(['h2', 'h3']).optional(),
})

export const twoUpBlockSchema = blockBaseSchema.extend({
  type: z.literal('twoUp'),
  kicker: z.string().max(80).optional(),
  heading: z.string().max(200).optional(),
  bodyMarkdown: z.string().max(10000).optional(),
  imageSrc: z.string().max(500).optional(),
  imageAlt: z.string().max(200).optional(),
  imageCaption: z.string().max(500).optional(),
  imagePosition: z.enum(['left', 'right']).optional(),
  primaryCta: blockCtaSchema.optional(),
  secondaryCta: blockCtaSchema.optional(),
})

export const statGridItemSchema = z.object({
  id: z.string().min(1).max(64),
  value: z.string().min(1).max(120),
  label: z.string().min(1).max(200),
  note: z.string().max(500).optional(),
  source: z.string().max(500).optional(),
})

export const statGridBlockSchema = blockBaseSchema.extend({
  type: z.literal('statGrid'),
  heading: z.string().max(200).optional(),
  subheading: z.string().max(500).optional(),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  stats: z.array(statGridItemSchema).min(1).max(12),
})

export const timelineItemSchema = z.object({
  id: z.string().min(1).max(64),
  phase: z.string().max(80).optional(),
  title: z.string().min(1).max(200),
  bodyMarkdown: z.string().max(5000).optional(),
  dateLabel: z.string().max(120).optional(),
})

export const timelineBlockSchema = blockBaseSchema.extend({
  type: z.literal('timeline'),
  heading: z.string().max(200).optional(),
  items: z.array(timelineItemSchema).min(1).max(20),
})

export const calloutBlockSchema = blockBaseSchema.extend({
  type: z.literal('callout'),
  tone: z.enum(['neutral', 'info', 'warning', 'success']).default('neutral'),
  heading: z.string().max(200).optional(),
  markdown: z.string().min(1).max(10000),
})

export const embedBlockSchema = blockBaseSchema.extend({
  type: z.literal('embed'),
  title: z.string().min(1).max(200),
  src: z.string().min(1).max(2000),
  provider: z.string().max(80).optional(),
  aspectRatio: z.enum(['16:9', '4:3', '1:1', 'auto']).default('16:9'),
  caption: z.string().max(500).optional(),
})

export const customHtmlBlockSchema = blockBaseSchema.extend({
  type: z.literal('customHtml'),
  label: z.string().max(120).optional(),
  html: z.string().min(1).max(50000),
  notes: z.string().max(1000).optional(),
})

export const spacerBlockSchema = blockBaseSchema.extend({
  type: z.literal('spacer'),
  size: z.enum(['small', 'medium', 'large']).default('medium'),
})

export const contactFormBlockSchema = blockBaseSchema.extend({
  type: z.literal('contactForm'),
  kicker: z.string().max(80).optional(),
  heading: z.string().min(1).max(200),
  subtext: z.string().max(1000).optional(),
})

export const eventsListBlockSchema = blockBaseSchema.extend({
  type: z.literal('eventsList'),
  heading: z.string().max(200).optional(),
})

export const eventsTeaserBlockSchema = blockBaseSchema.extend({
  type: z.literal('eventsTeaser'),
  heading: z.string().max(200).optional(),
  maxItems: z.number().int().min(1).max(10).optional(),
  showViewAllLink: z.boolean().optional(),
})

export const bioLinksBlockSchema = blockBaseSchema.extend({
  type: z.literal('bioLinks'),
})

export const donateEmbedBlockSchema = blockBaseSchema.extend({
  type: z.literal('donateEmbed'),
  heading: z.string().max(200).optional(),
})

export const pageBlockSchema = z.discriminatedUnion('type', [
  heroBlockSchema,
  richTextBlockSchema,
  cardGridBlockSchema,
  tableBlockSchema,
  accordionBlockSchema,
  ctaStripBlockSchema,
  quoteBlockSchema,
  imageBlockSchema,
  columnsBlockSchema,
  listBlockSchema,
  dividerBlockSchema,
  sectionHeaderBlockSchema,
  twoUpBlockSchema,
  statGridBlockSchema,
  timelineBlockSchema,
  calloutBlockSchema,
  embedBlockSchema,
  customHtmlBlockSchema,
  spacerBlockSchema,
  contactFormBlockSchema,
  eventsListBlockSchema,
  eventsTeaserBlockSchema,
  bioLinksBlockSchema,
  donateEmbedBlockSchema,
])

export type PageBlock = z.infer<typeof pageBlockSchema>
export type HeroBlock = z.infer<typeof heroBlockSchema>
export type RichTextBlock = z.infer<typeof richTextBlockSchema>
export type CardGridBlock = z.infer<typeof cardGridBlockSchema>
export type TableBlock = z.infer<typeof tableBlockSchema>
export type AccordionBlock = z.infer<typeof accordionBlockSchema>
export type CtaStripBlock = z.infer<typeof ctaStripBlockSchema>
export type QuoteBlock = z.infer<typeof quoteBlockSchema>
export type ImageBlock = z.infer<typeof imageBlockSchema>
export type ColumnsBlock = z.infer<typeof columnsBlockSchema>
export type ListBlock = z.infer<typeof listBlockSchema>
export type DividerBlock = z.infer<typeof dividerBlockSchema>
export type SectionHeaderBlock = z.infer<typeof sectionHeaderBlockSchema>
export type TwoUpBlock = z.infer<typeof twoUpBlockSchema>
export type StatGridBlock = z.infer<typeof statGridBlockSchema>
export type TimelineBlock = z.infer<typeof timelineBlockSchema>
export type CalloutBlock = z.infer<typeof calloutBlockSchema>
export type EmbedBlock = z.infer<typeof embedBlockSchema>
export type CustomHtmlBlock = z.infer<typeof customHtmlBlockSchema>
export type SpacerBlock = z.infer<typeof spacerBlockSchema>
export type ContactFormBlock = z.infer<typeof contactFormBlockSchema>
export type EventsListBlock = z.infer<typeof eventsListBlockSchema>
export type EventsTeaserBlock = z.infer<typeof eventsTeaserBlockSchema>
export type BioLinksBlock = z.infer<typeof bioLinksBlockSchema>
export type DonateEmbedBlock = z.infer<typeof donateEmbedBlockSchema>

export const pageDocPayloadSchema = z.object({
  kind: z.literal('pageDoc'),
  version: z.literal(1),
  slug: z.string().min(0).max(80),
  title: z.string().min(1).max(200),
  dek: z.string().max(500).optional(),
  enabled: z.union([z.literal(0), z.literal(1)]),
  showInNav: z.union([z.literal(0), z.literal(1)]),
  navLabel: z.string().min(1).max(80),
  navOrder: z.number().int().min(0).max(999).optional(),
  seoTitle: z.string().min(1).max(200),
  seoDescription: z.string().min(1).max(320),
  noindex: z.union([z.literal(0), z.literal(1)]).optional(),
  ogImagePath: z.string().max(500).optional(),
  blocks: z.array(pageBlockSchema).min(1).max(100),
})

export type PageDocPayload = z.infer<typeof pageDocPayloadSchema>

export function createBlockId(prefix = 'blk'): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

export const BLOCK_TYPE_LABELS: Record<PageBlock['type'], string> = {
  hero: 'Hero',
  richText: 'Rich text',
  cardGrid: 'Card grid',
  table: 'Table',
  accordion: 'Accordion',
  ctaStrip: 'CTA strip',
  quote: 'Quote',
  image: 'Image',
  columns: 'Columns',
  list: 'List',
  divider: 'Divider',
  sectionHeader: 'Section header',
  twoUp: 'Two-up',
  statGrid: 'Stat grid',
  timeline: 'Timeline',
  callout: 'Callout',
  embed: 'Embed',
  customHtml: 'Custom HTML',
  spacer: 'Spacer',
  contactForm: 'Contact form',
  eventsList: 'Events list',
  eventsTeaser: 'Events teaser',
  bioLinks: 'Bio links',
  donateEmbed: 'Donate embed',
}

export const LAYOUT_BLOCK_TYPES = [
  'sectionHeader',
  'twoUp',
  'columns',
  'spacer',
  'divider',
] as const satisfies readonly PageBlock['type'][]

export const CONTENT_BLOCK_TYPES = [
  'hero',
  'richText',
  'cardGrid',
  'statGrid',
  'table',
  'accordion',
  'timeline',
  'callout',
  'quote',
  'image',
  'list',
  'ctaStrip',
  'embed',
  'customHtml',
] as const satisfies readonly PageBlock['type'][]

export const APP_BLOCK_TYPES = [
  'contactForm',
  'eventsList',
  'eventsTeaser',
  'bioLinks',
  'donateEmbed',
] as const satisfies readonly PageBlock['type'][]

/**
 * Every block type in the pageBlock union, grouped order. Single source of
 * truth for registries (factory, renderer, settings, agent tools) — kept in
 * sync with the schema union by blockTypeSync.test.ts.
 */
export const ALL_BLOCK_TYPES = [
  ...LAYOUT_BLOCK_TYPES,
  ...CONTENT_BLOCK_TYPES,
  ...APP_BLOCK_TYPES,
] as const satisfies readonly PageBlock['type'][]

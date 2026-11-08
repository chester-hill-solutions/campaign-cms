import { z } from 'zod';
import { blockAccentSchema } from './theme.js';
/** Constrained on-brand layout options shared by every block. */
export const blockLayoutSchema = z.object({
    width: z.enum(['contained', 'wide', 'full']),
    background: z.enum(['none', 'card', 'accent', 'brand-gradient']),
    spacing: z.enum(['tight', 'normal', 'loose']),
    align: z.enum(['left', 'center']),
    /** Which brand accent to use when background is accent | brand-gradient. */
    accent: blockAccentSchema.optional(),
});
export const DEFAULT_BLOCK_LAYOUT = {
    width: 'contained',
    background: 'none',
    spacing: 'normal',
    align: 'left',
};
/** Constrained item-container options for multi-item blocks (grids, columns, lists). */
export const containerLayoutSchema = z.object({
    gap: z.enum(['tight', 'normal', 'loose']).default('normal'),
    arrangement: z.enum(['grid', 'list']).default('grid'),
    alignItems: z.enum(['start', 'center', 'stretch']).default('stretch'),
});
export const DEFAULT_CONTAINER_LAYOUT = {
    gap: 'normal',
    arrangement: 'grid',
    alignItems: 'stretch',
};
/** Gap + cross-axis align only (columns and list blocks — no arrangement). */
export const stackContainerLayoutSchema = z.object({
    gap: z.enum(['tight', 'normal', 'loose']).default('normal'),
    alignItems: z.enum(['start', 'center', 'stretch']).default('stretch'),
});
export const DEFAULT_STACK_CONTAINER_LAYOUT = {
    gap: 'normal',
    alignItems: 'stretch',
};
export const blockCtaSchema = z.object({
    label: z.string().min(1).max(120),
    href: z.string().min(1).max(2000),
    external: z.boolean().optional(),
});
const blockBaseSchema = z.object({
    id: z.string().min(1).max(64),
    layout: blockLayoutSchema.default(DEFAULT_BLOCK_LAYOUT),
});
export const heroBlockSchema = blockBaseSchema.extend({
    type: z.literal('hero'),
    kicker: z.string().max(80).optional(),
    heading: z.string().min(1).max(200),
    headingAccent: z.string().max(100).optional(),
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
});
export const richTextBlockSchema = blockBaseSchema.extend({
    type: z.literal('richText'),
    markdown: z.string().min(1).max(50000),
    anchorId: z.string().max(80).optional(),
});
export const cardGridItemSchema = z.object({
    id: z.string().min(1).max(64),
    title: z.string().min(1).max(200),
    body: z.string().max(2000).optional(),
    expandBody: z.string().max(5000).optional(),
    iconSrc: z.string().max(500).optional(),
    imageSrc: z.string().max(500).optional(),
});
export const cardGridBlockSchema = blockBaseSchema.extend({
    type: z.literal('cardGrid'),
    heading: z.string().max(200).optional(),
    subheading: z.string().max(500).optional(),
    columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    cards: z.array(cardGridItemSchema).min(1).max(20),
    container: containerLayoutSchema.default(DEFAULT_CONTAINER_LAYOUT),
});
export const tableBlockSchema = blockBaseSchema.extend({
    type: z.literal('table'),
    heading: z.string().max(200).optional(),
    headers: z.array(z.string().min(1).max(200)).min(1).max(10),
    rows: z.array(z.array(z.string().max(500)).min(1).max(10)).max(50),
    footnote: z.string().max(2000).optional(),
    mobileCollapse: z.boolean().optional(),
    mobileSummary: z.string().max(500).optional(),
});
export const accordionSectionSchema = z.object({
    id: z.string().min(1).max(64),
    title: z.string().min(1).max(200),
    markdown: z.string().min(1).max(10000),
    imageSrc: z.string().max(500).optional(),
});
export const accordionBlockSchema = blockBaseSchema.extend({
    type: z.literal('accordion'),
    heading: z.string().max(200).optional(),
    sections: z.array(accordionSectionSchema).min(1).max(20),
});
export const ctaStripBlockSchema = blockBaseSchema.extend({
    type: z.literal('ctaStrip'),
    headline: z.string().min(1).max(200),
    body: z.string().max(1000).optional(),
    primaryCta: blockCtaSchema.optional(),
    secondaryCta: blockCtaSchema.optional(),
});
export const quoteBlockSchema = blockBaseSchema.extend({
    type: z.literal('quote'),
    text: z.string().min(1).max(2000),
    attribution: z.string().max(200).optional(),
});
export const imageBlockSchema = blockBaseSchema.extend({
    type: z.literal('image'),
    src: z.string().min(1).max(500),
    alt: z.string().min(1).max(200),
    caption: z.string().max(500).optional(),
});
export const columnsBlockSchema = blockBaseSchema.extend({
    type: z.literal('columns'),
    columnCount: z.union([z.literal(2), z.literal(3)]),
    columns: z.array(z.object({ markdown: z.string().min(1).max(10000) })).min(2).max(3),
    container: stackContainerLayoutSchema.default(DEFAULT_STACK_CONTAINER_LAYOUT),
});
export const listBlockSchema = blockBaseSchema.extend({
    type: z.literal('list'),
    heading: z.string().max(200).optional(),
    ordered: z.boolean().optional(),
    items: z.array(z.string().min(1).max(1000)).min(1).max(50),
    container: stackContainerLayoutSchema.default(DEFAULT_STACK_CONTAINER_LAYOUT),
});
export const dividerBlockSchema = blockBaseSchema.extend({
    type: z.literal('divider'),
});
export const sectionHeaderBlockSchema = blockBaseSchema.extend({
    type: z.literal('sectionHeader'),
    anchorId: z.string().max(80).optional(),
    kicker: z.string().max(80).optional(),
    heading: z.string().min(1).max(200),
    dek: z.string().max(500).optional(),
    body: z.string().max(2000).optional(),
    level: z.enum(['h2', 'h3']).optional(),
});
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
});
export const statGridItemSchema = z.object({
    id: z.string().min(1).max(64),
    value: z.string().min(1).max(120),
    label: z.string().min(1).max(200),
    note: z.string().max(500).optional(),
    source: z.string().max(500).optional(),
});
export const statGridBlockSchema = blockBaseSchema.extend({
    type: z.literal('statGrid'),
    heading: z.string().max(200).optional(),
    subheading: z.string().max(500).optional(),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
    stats: z.array(statGridItemSchema).min(1).max(12),
    container: containerLayoutSchema.default(DEFAULT_CONTAINER_LAYOUT),
});
export const timelineItemSchema = z.object({
    id: z.string().min(1).max(64),
    phase: z.string().max(80).optional(),
    title: z.string().min(1).max(200),
    bodyMarkdown: z.string().max(5000).optional(),
    dateLabel: z.string().max(120).optional(),
});
export const timelineBlockSchema = blockBaseSchema.extend({
    type: z.literal('timeline'),
    heading: z.string().max(200).optional(),
    items: z.array(timelineItemSchema).min(1).max(20),
});
export const calloutBlockSchema = blockBaseSchema.extend({
    type: z.literal('callout'),
    tone: z.enum(['neutral', 'info', 'warning', 'success']).default('neutral'),
    heading: z.string().max(200).optional(),
    markdown: z.string().min(1).max(10000),
});
export const embedBlockSchema = blockBaseSchema.extend({
    type: z.literal('embed'),
    title: z.string().min(1).max(200),
    src: z.string().min(1).max(2000),
    provider: z.string().max(80).optional(),
    aspectRatio: z.enum(['16:9', '4:3', '1:1', 'auto']).default('16:9'),
    caption: z.string().max(500).optional(),
});
/**
 * The longest custom HTML this repository will store, and the longest `sanitizeCustomHtml`
 * will return. Matches `customHtmlBlockSchema`'s own bound, so a value that passed the schema
 * cannot still be refused by the filter for length.
 */
export const CUSTOM_HTML_MAX_LENGTH = 50000;
/**
 * Tags `customHtml` may contain.
 *
 * Declared here rather than beside the filter, because the block schema is what says what a
 * custom HTML block is allowed to be. A sanitizer with its own private list is a list that
 * nobody reads when a block changes.
 *
 * `svg` and `math` are absent on purpose. Foreign-content parsing is where mutation XSS lives:
 * a subtree that re-parses differently in the browser than in the filter is the whole attack,
 * and the cheapest refusal is to not accept the namespace.
 */
export const CUSTOM_HTML_ALLOWED_TAGS = new Set([
    // Sections and grouping.
    'div', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav', 'figure', 'figcaption',
    // Flow content.
    'p', 'hr', 'pre', 'blockquote', 'ol', 'ul', 'li', 'dl', 'dt', 'dd',
    // Headings.
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Inline text.
    'a', 'em', 'strong', 'b', 'i', 'u', 's', 'small', 'mark', 'sub', 'sup', 'abbr', 'cite', 'q',
    'time', 'code', 'kbd', 'samp', 'var', 'ins', 'del', 'br', 'wbr', 'span',
    // Tables.
    'table', 'caption', 'colgroup', 'col', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    // Media.
    'img', 'picture', 'source', 'video', 'audio',
    // Disclosure.
    'details', 'summary',
]);
/**
 * Attributes `customHtml` may carry, for any allowed tag.
 *
 * An allowlist rather than a denylist, so `onerror`, `style`, `srcdoc`, `formaction`, `ping`
 * and `data` are refused by absence instead of by being remembered. `class` and `id` are here
 * because the CMS's own stylesheets target them.
 */
export const CUSTOM_HTML_ALLOWED_ATTRIBUTES = new Set([
    // Global.
    'id', 'class', 'title', 'lang', 'dir', 'translate', 'hidden', 'role',
    // Accessibility, which carry no behaviour of their own.
    'alt',
    // Links.
    'href', 'target', 'rel', 'download', 'hreflang',
    // Media.
    'src', 'srcset', 'sizes', 'width', 'height', 'loading', 'decoding', 'poster', 'preload',
    'controls', 'loop', 'muted', 'playsinline', 'autoplay',
    // Tables.
    'colspan', 'rowspan', 'scope', 'headers', 'abbr',
    // Ordered lists.
    'start', 'reversed', 'value', 'type',
    // Quotes and time.
    'cite', 'datetime',
    // Disclosure.
    'open',
]);
/**
 * Attributes whose value is a URL, so their value gets a scheme check.
 *
 * Only names in `CUSTOM_HTML_ALLOWED_ATTRIBUTES` reach the check, so this list is a
 * completeness note rather than a second gate.
 */
export const CUSTOM_HTML_URL_ATTRIBUTES = new Set([
    'href', 'src', 'srcset', 'poster', 'cite',
]);
/**
 * URL schemes `customHtml` may use.
 *
 * Everything else is refused, including `javascript:` and `vbscript:`. A scheme absent from
 * this set cannot reach the output whatever the tag.
 */
export const CUSTOM_HTML_ALLOWED_URL_SCHEMES = new Set([
    'http', 'https', 'mailto', 'tel',
]);
/**
 * Elements whose content is dropped along with the element.
 *
 * Keeping the text of a `script` or `style` is how a filter ends up emitting its payload as
 * visible text, and keeping the children of `svg` or `object` is how a filter ends up
 * reconstructing a subtree it never checked.
 */
export const CUSTOM_HTML_DROP_WITH_CONTENT = new Set([
    'script', 'style', 'template', 'svg', 'math', 'iframe', 'object', 'embed', 'applet', 'frame',
    'frameset', 'noscript', 'noembed', 'noframes', 'xmp', 'plaintext', 'listing', 'title',
    'textarea', 'head', 'base', 'link', 'meta',
]);
export const customHtmlBlockSchema = blockBaseSchema.extend({
    type: z.literal('customHtml'),
    label: z.string().max(120).optional(),
    /** Bounded by `CUSTOM_HTML_MAX_LENGTH`, and filtered by `sanitizeCustomHtml` on render. */
    html: z.string().min(1).max(CUSTOM_HTML_MAX_LENGTH),
    notes: z.string().max(1000).optional(),
});
export const spacerBlockSchema = blockBaseSchema.extend({
    type: z.literal('spacer'),
    size: z.enum(['small', 'medium', 'large']).default('medium'),
});
export const contactFormBlockSchema = blockBaseSchema.extend({
    type: z.literal('contactForm'),
    kicker: z.string().max(80).optional(),
    heading: z.string().min(1).max(200),
    subtext: z.string().max(1000).optional(),
    formId: z.string().max(80).optional(),
});
export const eventsListBlockSchema = blockBaseSchema.extend({
    type: z.literal('eventsList'),
    heading: z.string().max(200).optional(),
});
export const eventsTeaserBlockSchema = blockBaseSchema.extend({
    type: z.literal('eventsTeaser'),
    heading: z.string().max(200).optional(),
    maxItems: z.number().int().min(1).max(10).optional(),
    showViewAllLink: z.boolean().optional(),
});
export const bioLinksBlockSchema = blockBaseSchema.extend({
    type: z.literal('bioLinks'),
});
export const donateEmbedBlockSchema = blockBaseSchema.extend({
    type: z.literal('donateEmbed'),
    heading: z.string().max(200).optional(),
});
export const collectionGridBlockSchema = blockBaseSchema.extend({
    type: z.literal('collectionGrid'),
    collectionId: z.string().min(1).max(80),
    heading: z.string().max(200).optional(),
    subheading: z.string().max(500).optional(),
    columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(3),
    categoryId: z.string().max(80).optional(),
    showFeaturedOnly: z.boolean().default(false),
    maxItems: z.number().int().min(1).max(50).optional(),
    container: containerLayoutSchema.default(DEFAULT_CONTAINER_LAYOUT),
    /**
     * Card presentation for app-level renderers:
     * `summary` = text-detail card (title, meta, excerpt link),
     * `overlay` = image-led card with the title over full-bleed art.
     */
    cardStyle: z.enum(['summary', 'overlay']),
});
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
    collectionGridBlockSchema,
]);
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
});
export function createBlockId(prefix = 'blk') {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}
export const BLOCK_TYPE_LABELS = {
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
    collectionGrid: 'Collection grid',
};
export const LAYOUT_BLOCK_TYPES = [
    'sectionHeader',
    'twoUp',
    'columns',
    'spacer',
    'divider',
];
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
];
/**
 * Blocks with behavior supplied by the consuming site. These remain part of
 * the shared, portable block catalog; "app" describes the renderer adapter
 * boundary, not ownership by a single product. Consumers should preserve and
 * expose these blocks even when they do not yet provide a public renderer.
 */
export const APP_BLOCK_TYPES = [
    'contactForm',
    'eventsList',
    'eventsTeaser',
    'bioLinks',
    'donateEmbed',
    'collectionGrid',
];
/**
 * Every block type in the pageBlock union, grouped order. Single source of
 * truth for registries (factory, renderer, settings, agent tools) — kept in
 * sync with the schema union by blockTypeSync.test.ts.
 */
export const ALL_BLOCK_TYPES = [
    ...LAYOUT_BLOCK_TYPES,
    ...CONTENT_BLOCK_TYPES,
    ...APP_BLOCK_TYPES,
];

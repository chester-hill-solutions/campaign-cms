import {
  createBlockId,
  DEFAULT_BLOCK_LAYOUT,
  type PageBlock,
} from './blockSchemas'

/** Host-tunable defaults used when inserting fresh blocks in the editor. */
export type BlockFactoryDefaults = {
  /** Placeholder `src` for new image blocks (schema requires a non-empty path). */
  imagePlaceholderSrc?: string
}

const FALLBACK_IMAGE_PLACEHOLDER = '/favicon.ico'

export function createDefaultBlock(
  type: PageBlock['type'],
  defaults: BlockFactoryDefaults = {},
): PageBlock {
  const id = createBlockId()
  const layout = { ...DEFAULT_BLOCK_LAYOUT }

  switch (type) {
    case 'hero':
      return {
        id,
        type: 'hero',
        layout,
        heading: 'Page heading',
        subhead: 'Optional subhead',
        imagePosition: 'right',
        mobileImagePosition: 'bottom',
      }
    case 'richText':
      return { id, type: 'richText', layout, markdown: '## Section\n\nEdit this content.' }
    case 'cardGrid':
      return {
        id,
        type: 'cardGrid',
        layout,
        columns: 2,
        cards: [{ id: createBlockId('card'), title: 'Card title', body: 'Card body' }],
      }
    case 'table':
      return {
        id,
        type: 'table',
        layout,
        headers: ['Column A', 'Column B'],
        rows: [['Row 1', 'Value']],
        mobileCollapse: true,
      }
    case 'accordion':
      return {
        id,
        type: 'accordion',
        layout,
        sections: [
          {
            id: createBlockId('sec'),
            title: 'Section title',
            markdown: 'Section content.',
          },
        ],
      }
    case 'ctaStrip':
      return {
        id,
        type: 'ctaStrip',
        layout: { ...layout, background: 'card' },
        headline: 'Call to action',
        body: 'Optional supporting text.',
        primaryCta: { label: 'Primary action', href: '/contact' },
      }
    case 'quote':
      return { id, type: 'quote', layout, text: 'Quote text here.' }
    case 'image':
      return {
        id,
        type: 'image',
        layout,
        src: defaults.imagePlaceholderSrc ?? FALLBACK_IMAGE_PLACEHOLDER,
        alt: 'Describe the image',
      }
    case 'columns':
      return {
        id,
        type: 'columns',
        layout,
        columnCount: 2,
        columns: [{ markdown: 'Column 1' }, { markdown: 'Column 2' }],
      }
    case 'list':
      return { id, type: 'list', layout, items: ['First item', 'Second item'] }
    case 'divider':
      return { id, type: 'divider', layout }
    case 'sectionHeader':
      return {
        id,
        type: 'sectionHeader',
        layout,
        heading: 'Section heading',
        dek: 'Optional subtitle for this section.',
      }
    case 'twoUp':
      return {
        id,
        type: 'twoUp',
        layout,
        heading: 'Two-up section',
        bodyMarkdown: 'Edit this content. Add an image and CTAs as needed.',
        imagePosition: 'right',
      }
    case 'statGrid':
      return {
        id,
        type: 'statGrid',
        layout,
        columns: 2,
        stats: [
          {
            id: createBlockId('stat'),
            value: '$0',
            label: 'Example metric',
            note: 'Optional note.',
          },
        ],
      }
    case 'timeline':
      return {
        id,
        type: 'timeline',
        layout,
        heading: 'Timeline',
        items: [
          {
            id: createBlockId('tl'),
            title: 'First milestone',
            phase: 'Phase 1',
            bodyMarkdown: 'Describe this milestone.',
          },
        ],
      }
    case 'callout':
      return {
        id,
        type: 'callout',
        layout,
        tone: 'info',
        heading: 'Important note',
        markdown: 'Use callouts for commitments, warnings, or source notes.',
      }
    case 'embed':
      return {
        id,
        type: 'embed',
        layout,
        title: 'Embedded content',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        aspectRatio: '16:9',
      }
    case 'customHtml':
      return {
        id,
        type: 'customHtml',
        layout,
        label: 'Custom HTML block',
        html: '<p>Advanced HTML for trusted editors only.</p>',
      }
    case 'spacer':
      return { id, type: 'spacer', layout, size: 'medium' }
    case 'contactForm':
      return {
        id,
        type: 'contactForm',
        layout,
        kicker: 'Stay in touch',
        heading: 'Sign up for updates',
        subtext: 'Add your email to hear from the campaign.',
      }
    case 'eventsList':
      return { id, type: 'eventsList', layout, heading: 'Upcoming events' }
    case 'eventsTeaser':
      return { id, type: 'eventsTeaser', layout, heading: 'Upcoming events', maxItems: 2 }
    case 'bioLinks':
      return { id, type: 'bioLinks', layout }
    case 'donateEmbed':
      return { id, type: 'donateEmbed', layout, heading: 'Support the campaign' }
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}

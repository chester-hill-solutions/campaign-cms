# Block types reference

All blocks share `id`, `type`, and `layout` (`width`: `default` | `wide` | `full`, `padding`: `default` | `none`).

## Layout blocks

| Type | Key fields |
|------|------------|
| `hero` | `heading`, `kicker`, `dek`, `primaryCta`, `secondaryCta`, `tertiaryCta`, `portraitSrc`, `portraitAlt`, `backgroundSrc`, `imagePosition`, `mobileImagePosition` |
| `columns` | `columns[]` with `heading`, `bodyMarkdown` |
| `twoUp` | `left`, `right` (each: `heading`, `bodyMarkdown`, `imageSrc`) |
| `divider` | `style`: `line` \| `space` |
| `spacer` | `size`: `sm` \| `md` \| `lg` |

## Content blocks

| Type | Key fields |
|------|------------|
| `richText` | `bodyMarkdown` |
| `quote` | `quote`, `attribution` |
| `list` | `style`: `bullet` \| `number`, `items[]` |
| `callout` | `tone`, `heading`, `bodyMarkdown` |
| `sectionHeader` | `heading`, `dek` |
| `table` | `caption`, `headers[]`, `rows[][]` |
| `accordion` | `items[]` with `heading`, `bodyMarkdown` |
| `timeline` | `items[]` with `date`, `heading`, `body` |
| `image` | `src`, `alt`, `caption`, `width`, `height` |
| `embed` | `url`, `caption`, `aspectRatio` |
| `customHtml` | `html` (sanitized on render) |

## Marketing blocks

| Type | Key fields |
|------|------------|
| `cardGrid` | `heading`, `cards[]` with `title`, `body`, `imageSrc`, `cta` |
| `statGrid` | `heading`, `stats[]` with `value`, `label`, `detail` |
| `ctaStrip` | `heading`, `body`, `primaryCta`, `secondaryCta` |

## App blocks (host-rendered)

| Type | Key fields |
|------|------------|
| `contactForm` | `heading`, `dek`, `submitLabel` |
| `eventsList` | `heading`, `emptyMessage` |
| `eventsTeaser` | `heading`, `maxEvents`, `ctaLabel` |
| `bioLinks` | `heading`, `dek` |
| `donateEmbed` | `heading`, `embedUrl`, `disclaimer` |

CTA shape (shared): `{ label: string, href: string, variant?: 'primary' | 'secondary' | 'ghost' }`

## Default block factory

`createDefaultBlock(type, defaults?)` in `@campaign/cms-core` creates editor-ready blocks. Customize `imagePlaceholderSrc` via `BlockFactoryDefaults`.

## Validation

`pageDocPayloadSchema` validates full pages. `validatePageDoc()` maps Zod errors to block ids for the editor UI.

See source: `packages/cms-core/src/blockSchemas.ts`

# Block types reference

All blocks share `id`, `type`, and `layout`. Layout fields: `width` (`contained` | `wide` | `full`), `background` (`none` | `card` | `accent` | `brand-gradient`), `spacing` (`tight` | `normal` | `loose`), `align` (`left` | `center`).

Field names below match the Zod schemas in `packages/cms-core/src/blockSchemas.ts` exactly — they are the names agents and API clients must use.

## Layout blocks

| Type | Key fields |
|------|------------|
| `sectionHeader` | `heading`, `kicker`, `dek`, `body`, `anchorId`, `level` (`h2` \| `h3`) |
| `twoUp` | `kicker`, `heading`, `bodyMarkdown`, `imageSrc`, `imageAlt`, `imageCaption`, `imagePosition` (`left` \| `right`), `primaryCta`, `secondaryCta` |
| `columns` | `columnCount` (2 \| 3), `columns[]` with `markdown` |
| `divider` | layout only — no extra fields |
| `spacer` | `size` (`small` \| `medium` \| `large`) |

## Content blocks

| Type | Key fields |
|------|------------|
| `richText` | `markdown`, `anchorId` |
| `quote` | `text`, `attribution` |
| `list` | `heading`, `ordered` (boolean), `items[]` (strings) |
| `callout` | `tone` (`neutral` \| `info` \| `warning` \| `success`), `heading`, `markdown` |
| `table` | `heading`, `headers[]`, `rows[][]`, `footnote`, `mobileCollapse`, `mobileSummary` |
| `accordion` | `heading`, `sections[]` with `id`, `title`, `markdown`, `imageSrc` |
| `timeline` | `heading`, `items[]` with `id`, `phase`, `title`, `bodyMarkdown`, `dateLabel` |
| `image` | `src`, `alt`, `caption` |
| `embed` | `title`, `src`, `provider`, `aspectRatio` (`16:9` \| `4:3` \| `1:1` \| `auto`), `caption` |
| `customHtml` | `label`, `html` (sanitized on render), `notes` |
| `hero` | `heading`, `kicker`, `subhead`, `body`, `primaryCta`, `secondaryCta`, `tertiaryCta`, `portraitSrc`, `portraitAlt`, `backgroundSrc`, `imagePosition` (`left` \| `right`), `mobileImagePosition` (`top` \| `bottom`) |

## Marketing blocks

| Type | Key fields |
|------|------------|
| `cardGrid` | `heading`, `subheading`, `columns` (1–4), `cards[]` with `id`, `title`, `body`, `expandBody`, `iconSrc`, `imageSrc` |
| `statGrid` | `heading`, `subheading`, `columns` (2–4), `stats[]` with `id`, `value`, `label`, `note`, `source` |
| `ctaStrip` | `headline`, `body`, `primaryCta`, `secondaryCta` |

## App blocks (host-rendered)

| Type | Key fields |
|------|------------|
| `contactForm` | `kicker`, `heading`, `subtext` |
| `eventsList` | `heading` |
| `eventsTeaser` | `heading`, `maxItems` (1–10), `showViewAllLink` |
| `bioLinks` | layout only — no extra fields |
| `donateEmbed` | `heading` |

CTA shape (shared): `{ label: string, href: string, external?: boolean }`

## Default block factory

`createDefaultBlock(type, defaults?)` in `@campaign/cms-core` creates editor-ready blocks. Customize `imagePlaceholderSrc` via `BlockFactoryDefaults`.

## Validation

`pageDocPayloadSchema` validates full pages. `validatePageDoc()` maps Zod errors to block ids for the editor UI.

`ALL_BLOCK_TYPES` exports every type in the union; `blockTypeSync.test.ts` keeps it aligned with the schema.

See source: `packages/cms-core/src/blockSchemas.ts`

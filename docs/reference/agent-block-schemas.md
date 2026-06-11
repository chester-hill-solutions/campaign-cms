# Agent block schemas

<!-- GENERATED FILE — do not edit by hand. -->
<!-- Regenerate: UPDATE_AGENT_DOCS=1 npm test -w @campaign/cms-agent -->

Canonical field reference for agent tools, derived from the Zod schemas in `packages/cms-core/src/blockSchemas.ts`. At runtime, prefer the `get_block_types` tool — it returns this same data.

All blocks share `id`, `type`, and `layout` (`width`, `background`, `spacing`, `align`). The fields below are per type; **bold** fields are required.

## `hero` — Hero (content)

kicker, **heading**, subhead, body, primaryCta, secondaryCta, tertiaryCta, portraitSrc, portraitAlt, backgroundSrc, imagePosition, mobileImagePosition

## `richText` — Rich text (content)

**markdown**, anchorId

## `cardGrid` — Card grid (content)

heading, subheading, **columns**, **cards**

## `table` — Table (content)

heading, **headers**, **rows**, footnote, mobileCollapse, mobileSummary

## `accordion` — Accordion (content)

heading, **sections**

## `ctaStrip` — CTA strip (content)

**headline**, body, primaryCta, secondaryCta

## `quote` — Quote (content)

**text**, attribution

## `image` — Image (content)

**src**, **alt**, caption

## `columns` — Columns (layout)

**columnCount**, **columns**

## `list` — List (content)

heading, ordered, **items**

## `divider` — Divider (layout)

_layout only — no extra fields_

## `sectionHeader` — Section header (layout)

anchorId, kicker, **heading**, dek, body, level

## `twoUp` — Two-up (layout)

kicker, heading, bodyMarkdown, imageSrc, imageAlt, imageCaption, imagePosition, primaryCta, secondaryCta

## `statGrid` — Stat grid (content)

heading, subheading, **columns**, **stats**

## `timeline` — Timeline (content)

heading, **items**

## `callout` — Callout (content)

tone, heading, **markdown**

## `embed` — Embed (content)

**title**, **src**, provider, aspectRatio, caption

## `customHtml` — Custom HTML (content)

label, **html**, notes

## `spacer` — Spacer (layout)

size

## `contactForm` — Contact form (app)

kicker, **heading**, subtext

## `eventsList` — Events list (app)

heading

## `eventsTeaser` — Events teaser (app)

heading, maxItems, showViewAllLink

## `bioLinks` — Bio links (app)

_layout only — no extra fields_

## `donateEmbed` — Donate embed (app)

heading

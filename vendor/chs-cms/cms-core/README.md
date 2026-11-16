# @chester-hill-solutions/cms-core

Framework-agnostic CMS primitives: Zod schemas, block operations, validation, and slug utilities.

## Install

```bash
npm install @chester-hill-solutions/cms-core
```

## Runtime compatibility

Version 0.5.1 fixes extensionless internal imports in the compiled ESM output.
The root export and `/blocks`, `/pages`, `/content`, and `/seo` can be imported
directly by Node without a bundler or TypeScript loader.

| Package export | Runtime |
|---|---|
| `cms-core` and its public subpaths | Native Node ESM, Bun, browser/Workers bundlers |
| `cms-store` and `/testing` | Native Node ESM, Bun, browser/Workers bundlers |
| `cms-store-d1` root | Native Node ESM imports; operations require host-provided D1/R2 bindings |
| `cms-store-d1/testing` | Bun, because the SQLite helper imports `bun:sqlite` |
| `cms-store-postgres` and `/schema` | Native Node ESM with declared peers installed; imports do not connect to Postgres or S3 |
| `cms-react` root | Browser and SSR bundlers; direct native Node ESM import is currently unsupported |

After building the CMS packages, run `node scripts/check-cms-runtime.mjs` from
the repository root. It packs the server packages, stages their exact workspace
versions together, and imports the supported exports in native Node. Only
third-party dependencies resolve from the local dependency installation; CMS
dependencies resolve from the unpacked artifacts.

## Exports

### Schemas & types

- `pageDocPayloadSchema`, `pageBlockSchema`, per-block schemas (`heroBlockSchema`, …)
- Types: `PageDocPayload`, `PageBlock`, `HeroBlock`, …
- Hero blocks support an optional `headingAccent` phrase, kept separate from the main heading so hosts can style it with their own accent token.
- `ALL_BLOCK_TYPES`, `LAYOUT_BLOCK_TYPES`, `CONTENT_BLOCK_TYPES`, `APP_BLOCK_TYPES`, `BLOCK_TYPE_LABELS`, `DEFAULT_BLOCK_LAYOUT`, `DEFAULT_CONTAINER_LAYOUT`, `DEFAULT_STACK_CONTAINER_LAYOUT`
- `ALL_BLOCK_TYPES` is the shared, forward-compatible palette. `APP_BLOCK_TYPES` marks blocks whose live behavior comes from a host adapter; it does not mean those blocks are product-specific. Consumers should preserve their schemas and settings and keep them available as drafts when a host integration is not ready.
- Container layout schemas: `containerLayoutSchema` (grids), `stackContainerLayoutSchema` (columns/list) — gap, arrangement, alignItems

### Page metadata

`buildPageSeo` uses the page's sharing fields and site defaults. Supply
`requestUrl` or `siteDefaults.siteUrl` to resolve relative sharing images to
absolute HTTP(S) URLs. Request-derived canonicals omit queries, fragments and
trailing slashes. Invalid or credential-bearing image URLs are omitted. Without
a URL context, relative images remain available for a framework adapter to resolve.
Hosts remain responsible for public path mounts (such as a home page at `/`),
locale, indexing policy and private-route metadata.

### Block factory

```ts
import { createDefaultBlock } from '@chester-hill-solutions/cms-core'

createDefaultBlock('richText')
createDefaultBlock('image', { imagePlaceholderSrc: '/placeholder.webp' })
```

### Page operations

```ts
import {
  insertBlockAt,
  duplicateBlockInPage,
  removeBlockFromPage,
  updateBlockInPage,
  reorderBlocksInPage,
  moveBlockInPage,
} from '@chester-hill-solutions/cms-core'
```

### Validation

```ts
import { validatePageDoc } from '@chester-hill-solutions/cms-core'

const result = validatePageDoc(pageDoc)
// { valid: true } | { valid: false, errors: [{ blockId, field, message }] }
```

### Slugs & entries

```ts
import {
  normalizeCmsSlug,
  cmsPagePublicPath,
  isReservedCmsSlug,
  validateNewPageSlug,
  defaultNewPageDoc,
  entryIdFromPageSlug,
} from '@chester-hill-solutions/cms-core'
```

### Utilities

- `mediaPublicPath(r2Key)` → `/media/{key}`
- `createBlockId()` — unique block id generator

### Untrusted content

`escapeCsvFormula` and `sanitizeCustomHtml` are the two places a value that arrived from
outside gets read back by software that will not treat it as text.

- `escapeCsvFormula(value)` — prefix a CSV cell with an apostrophe when it begins with a
  spreadsheet formula character
- `sanitizeCustomHtml(html)` — filter custom HTML down to an allowlist declared beside
  `customHtmlBlockSchema`
- `sanitizeBlock(block)` / `sanitizeBlocks(blocks)` — the same filter, applied to a block's
  `html` field

`sanitizeCustomHtml` was three regular-expression replacements before 0.4.0. It removed a closed
`script` element, an `on*` handler, and a `javascript:` URL in `href`, `src` or `xlink:href`.
Measured against 21 vectors, 7 passed through unchanged: `formaction`, a `form`'s `action`, an
`object`'s `data`, a `data-*` attribute, `vbscript:`, an unclosed `script`, and a CSS
`expression`. It is now an allowlist over a real parse, which is `0 of 21`.

The allowlist is `CUSTOM_HTML_ALLOWED_TAGS` and `CUSTOM_HTML_ALLOWED_ATTRIBUTES`, declared in
`blockSchemas.ts` next to the block that declares what custom HTML may contain. The filter takes
a block as well as a string, so a block type added later with an `html` field is covered without
a second edit.

This module was `sanitizeHtml.ts` before 0.4.0 and is now `untrusted.ts`, because it holds the
CSV escaping too. The package's entry point is unchanged; only a deep import of
`cms-core/dist/sanitizeHtml` breaks.

Runs on `htmlparser2` rather than a DOM, because `cms-core` reaches `cms-store-d1` on Cloudflare
Workers, which has no `DOMParser` and no `window`.

## Defaults

Every default this package exports. A gate checks that these names match the names the
package exports, so a constant added without a row here fails the build.

| Constant | Type | Shape |
|---|---|---|
| `DEFAULT_BLOCK_LAYOUT` | `BlockLayout` | `width: 'contained'`, `background: 'none'`, `spacing: 'normal'`, `align: 'left'` |
| `DEFAULT_CONTAINER_LAYOUT` | `ContainerLayout` | `gap: 'normal'`, `arrangement: 'grid'`, `alignItems: 'stretch'` |
| `DEFAULT_STACK_CONTAINER_LAYOUT` | `StackContainerLayout` | `gap: 'normal'`, `alignItems: 'stretch'`. Gap and cross-axis align only, for columns and list blocks, which have no arrangement |

These are the layouts `createDefaultBlock` applies. Full definitions and the schemas that
validate them are in `src/blockSchemas.ts`.

## Tests

```bash
npm test --workspace @chester-hill-solutions/cms-core
```

## Dependencies

- `zod` ^4.x only — no React, no Cloudflare

## Public site settings

`siteSettingsSchema`, `SiteSettings`, and `defaultSiteSettings` define public site identity: name, tagline, description, logo, favicon, and fallback sharing image. Image references accept local absolute paths or HTTP(S) URLs, excluding executable/data URLs and credentials. Settings contain no secret or delivery configuration.

## Entry listing snapshots

`entryListingSnapshotSchema`, `EntryListingSnapshot` and
`emptyEntryListingSnapshot()` describe version-1 entry-specific collection
membership, frozen category/tag labels, featured/sort values and JSON metadata.
The snapshot is stored alongside the PageDoc payload in the existing revision;
it does not change PageDoc version 1. Store consumers save/publish both parts with
one expected draft revision token. See [the store contract](../cms-store/README.md#complete-entry-listing-revisions)
for mutation, migration and historical-data behavior.

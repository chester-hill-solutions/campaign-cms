# @campaign/cms-core

Framework-agnostic CMS primitives: Zod schemas, block operations, validation, and slug utilities.

## Install

```bash
npm install @campaign/cms-core
```

## Exports

### Schemas & types

- `pageDocPayloadSchema`, `pageBlockSchema`, per-block schemas (`heroBlockSchema`, …)
- Types: `PageDocPayload`, `PageBlock`, `HeroBlock`, …
- `APP_BLOCK_TYPES`, `BLOCK_TYPE_LABELS`, `DEFAULT_BLOCK_LAYOUT`

### Block factory

```ts
import { createDefaultBlock } from '@campaign/cms-core'

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
} from '@campaign/cms-core'
```

### Validation

```ts
import { validatePageDoc } from '@campaign/cms-core'

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
} from '@campaign/cms-core'
```

### Utilities

- `sanitizeCustomHtml(html)` — client-safe HTML sanitization
- `mediaPublicPath(r2Key)` → `/media/{key}`
- `createBlockId()` — unique block id generator

## Tests

```bash
npm test --workspace @campaign/cms-core
```

## Dependencies

- `zod` ^4.x only — no React, no Cloudflare

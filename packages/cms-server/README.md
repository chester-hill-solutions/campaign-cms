# @campaign/cms-server

D1 and R2 persistence for Campaign CMS. Cloudflare bindings are injected by the host — this package never imports `cloudflare:workers`.

## Install

```bash
npm install @campaign/cms-server @campaign/cms-core
```

## Usage

```ts
import { createCmsStore } from '@campaign/cms-server'

export const store = createCmsStore(
  () => ({ db: env.DB, media: env.MEDIA }),
  {
    parsePayload,
    newPageDoc,
    validateNewPageSlug,
    entryIdFromPageSlug,
  },
)

export const { getPublishedPageDocBySlug, savePageDocDraft, publishEntry } = store
```

See [Store API reference](../../docs/reference/store-api.md) for all methods.

## Configuration

| Option | Required | Description |
|--------|----------|-------------|
| `parsePayload` | Yes | Parse revision JSON to typed payload |
| `newPageDoc` | Yes | Defaults for new pages |
| `validateNewPageSlug` | Yes | Return error string or null |
| `entryIdFromPageSlug` | Yes | D1 entry id from slug |
| `defaultPageDocForEntry` | No | Fallback when no D1 row |
| `toPageDoc` | No | Legacy → pageDoc converter |
| `legacyEntryTypes` | No | Entry types eligible for conversion |

## Media

Requires `media: R2Bucket` in bindings for upload/stream methods. Omit `media` only if you use static assets and skip the media library.

## Types

Requires `@cloudflare/workers-types` in the host project for `D1Database` and `R2Bucket`.

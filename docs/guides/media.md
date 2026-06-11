# Media library

Images uploaded through the admin editor are stored in R2 with metadata in D1.

## Flow

1. Editor opens `MediaPicker` → calls `CmsMediaApi.list()`
2. User uploads file → `CmsMediaApi.upload({ filename, mime, base64, alt })`
3. Store writes to R2 (`media_{uuid}.{ext}`) and inserts `media_assets` row
4. Block `src` set to `/media/{r2_key}` via `mediaPublicPath(r2_key)`
5. Browser requests `/media/{r2_key}` → Worker streams from R2

## Worker handler

```ts
// src/server.ts
if (url.pathname.startsWith('/media/')) {
  const key = decodeURIComponent(url.pathname.slice('/media/'.length))
  if (key) {
    const { streamMediaFromR2 } = await import('./lib/cms/content.server')
    const response = await streamMediaFromR2(key)
    if (response) return response
  }
  return new Response('Not found', { status: 404 })
}
```

## Store methods

| Method | Purpose |
|--------|---------|
| `listMediaAssets()` | All assets, newest first |
| `getMediaAssetByKey(r2Key)` | Single asset metadata |
| `uploadMediaAsset(input)` | Write R2 + D1 |
| `streamMediaFromR2(r2Key)` | `Response` with correct `Content-Type` |

Requires `media` binding in `createCmsStore`. Without R2, upload methods throw.

## Upload input

```ts
{
  filename: string
  mime: string
  base64: string   // raw base64, no data: prefix
  alt?: string
}
```

## Public URLs

Always use `mediaPublicPath(r2Key)` from `@campaign/cms-core`:

```ts
mediaPublicPath('media_abc123.webp') // → '/media/media_abc123.webp'
```

Do not hotlink R2 URLs directly — the Worker handler sets cache headers and access control.

## Local development

R2 local simulation works through Wrangler's Miniflare bindings. Uploaded files persist in `.wrangler/state/` during dev.

## Without media library

Sites that only reference static `/public` assets can omit `mediaApi` from `CmsUiProvider`. Editors enter image paths manually in block settings; `MediaPicker` shows a fallback message.

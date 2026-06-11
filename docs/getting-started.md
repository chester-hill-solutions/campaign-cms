# Getting started

This guide walks through adding Campaign CMS to a new TanStack Start site on Cloudflare Workers.

## Prerequisites

- Node.js 20+
- A Cloudflare account with Workers, D1, and R2 enabled
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI

## 1. Add packages

Install the four packages in your host app (or clone this repo and use `file:` paths):

```json
{
  "dependencies": {
    "@campaign/cms-core": "file:../campaign-cms/packages/cms-core",
    "@campaign/cms-react": "file:../campaign-cms/packages/cms-react",
    "@campaign/cms-server": "file:../campaign-cms/packages/cms-server"
  },
  "devDependencies": {
    "@campaign/cms-setup": "file:../campaign-cms/packages/cms-setup"
  }
}
```

Clone the repo next to your campaign site, or install from GitHub and copy the `packages/` paths you need:

```bash
git clone https://github.com/chester-hill-solutions/campaign-cms.git
```

## 2. Initialize migrations and bindings

```bash
npm exec campaign-cms init
wrangler d1 create YOUR_DB_NAME
wrangler r2 bucket create YOUR_BUCKET_NAME
npm exec campaign-cms wrangler   # merge printed snippet into wrangler.jsonc
wrangler d1 migrations apply YOUR_DB_NAME --local
```

Your `wrangler.jsonc` needs:

- `DB` — D1 binding (`migrations_dir: "migrations"`)
- `MEDIA` — R2 binding for uploaded images

## 3. Create the CMS store

Create `src/lib/cms/content.server.ts`:

```ts
import { env } from 'cloudflare:workers'
import { pageDocPayloadSchema } from '@campaign/cms-core'
import { createCmsStore } from '@campaign/cms-server'
import { defaultNewPageDoc, entryIdFromPageSlug, validateNewPageSlug } from './pageDocEntry'

function parsePayload(raw: unknown) {
  const parsed = pageDocPayloadSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

const store = createCmsStore(() => ({ db: env.DB, media: env.MEDIA }), {
  parsePayload,
  newPageDoc: defaultNewPageDoc,
  validateNewPageSlug,
  entryIdFromPageSlug,
})

export const {
  getPublishedPageDocBySlug,
  getPageDocEditorState,
  savePageDocDraft,
  publishEntry,
  createPageDocEntry,
  listPageDocEntriesWithStatus,
  streamMediaFromR2,
  uploadMediaAsset,
  listMediaAssets,
} = store
```

Wrap slug validation and SEO defaults in host files — see [host integration](./guides/host-integration.md).

## 4. Serve media from R2

In `src/server.ts`, before the TanStack handler:

```ts
if (url.pathname.startsWith('/media/')) {
  const key = decodeURIComponent(url.pathname.slice('/media/'.length))
  const { streamMediaFromR2 } = await import('./lib/cms/content.server')
  const response = await streamMediaFromR2(key)
  if (response) return response
  return new Response('Not found', { status: 404 })
}
```

## 5. Add a public CMS route

Create a catch-all route (e.g. `src/routes/$.tsx`) that:

1. Normalizes the URL slug
2. Rejects reserved paths (`admin`, `api`, `media`, …)
3. Loads `getPublishedPageDocBySlug(slug)`
4. Renders `PageDocPage` with `BlockRenderer`

See [public pages](./guides/public-pages.md).

## 6. Configure styling

In your main CSS file:

```css
@import "tailwindcss";
@source "../../node_modules/@campaign/cms-react/src";
@import "@campaign/cms-react/styles/cms-tokens.css";
```

Or point `@source` at a sibling `campaign-cms` checkout. Override CSS variables in your theme to match campaign branding.

## 7. Add the admin editor (optional)

Wire `EditorCanvas`, `EditorTopBar`, and `CmsUiProvider` with a `mediaApi` backed by authenticated server functions. See [admin editor](./guides/admin-editor.md).

**Authentication is host-owned.** Campaign CMS does not ship login or CSRF — your site provides those before calling store methods.

## 8. Seed content

Insert a published `pageDoc` revision in D1, or run the seed script from [examples/minimal-site](../examples/minimal-site/scripts/seed-local.mjs).

## Next steps

- Run the [minimal-site example](../examples/minimal-site/)
- Read [architecture](./architecture.md) for the full picture
- Register [app blocks](./guides/app-blocks.md) for forms, events, donate embeds

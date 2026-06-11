# Campaign CMS setup

This site uses the `@campaign/cms-*` packages: a block-based page builder backed by
Cloudflare D1 (content) and R2 (media).

## 1. Provision Cloudflare resources

```bash
wrangler d1 create __DB_NAME__
wrangler r2 bucket create __BUCKET_NAME__
```

Copy the printed `database_id` into the wrangler snippet below.

## 2. Wrangler bindings

Merge `wrangler-snippet.jsonc` (next to this file, or from
`packages/cms-setup/templates/`) into your `wrangler.jsonc`. The CMS expects:

- `DB` — D1 database for content entries, revisions, and media metadata
- `MEDIA` — R2 bucket for uploaded media files

## 3. Apply migrations

The `campaign-cms init` command copied the CMS migrations into `migrations/`.

```bash
wrangler d1 migrations apply __DB_NAME__ --local    # local dev
wrangler d1 migrations apply __DB_NAME__ --remote   # production
```

## 4. Wire the host app

1. **Server store** — create a CMS store with your bindings and payload schema:

   ```ts
   import { createCmsStore } from '@campaign/cms-server'
   import { env } from 'cloudflare:workers'

   export const store = createCmsStore(() => ({ db: env.DB, media: env.MEDIA }), {
     parsePayload, // zod-based parser for your revision payload union
     newPageDoc,
     validateNewPageSlug,
     entryIdFromPageSlug,
   })
   ```

2. **Public rendering** — wrap `BlockRenderer` with `CmsUiProvider`:

   ```tsx
   import { BlockRenderer, CmsUiProvider } from '@campaign/cms-react'

   <CmsUiProvider config={cmsUiConfig}>
     <BlockRenderer blocks={page.blocks} appBlocks={appBlocks} />
   </CmsUiProvider>
   ```

3. **Admin editor** — render `EditorCanvas`, `EditorTopBar`, `BlockSettingsPanel`,
   and `PageSettingsDrawer` inside a `CmsUiProvider` that also supplies a
   `mediaApi` backed by your authenticated server functions.

4. **App blocks** — register campaign-specific blocks (forms, donate embeds, etc.)
   via the `appBlocks` prop on `BlockRenderer`.

## 5. Styling

The components use Tailwind classes plus a small set of CSS variables. Either:

- import `@campaign/cms-react/styles/cms-tokens.css` for the defaults, or
- define the `--ink`, `--ink-muted`, `--accent-*`, `--surface-*` variables in your
  own theme.

Add the package sources to Tailwind content scanning in your main CSS file:

```css
@source "../../packages/cms-react/src";
```

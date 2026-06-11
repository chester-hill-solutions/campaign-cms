# Host integration

How to wire Campaign CMS into a TanStack Start + Cloudflare Workers host app.

## File layout (recommended)

```
src/
  lib/cms/
    content.server.ts    # createCmsStore + re-exports
    media.server.ts      # re-export streamMediaFromR2, upload, list
    cmsPagePath.ts       # reserved slugs wrapper
    pageDocEntry.ts      # SEO defaults + slug validation wrapper
    schemas.ts           # host payload union (pageDoc + legacy kinds)
    cmsUi.ts             # CmsUiProvider config (client-safe)
  components/
    blocks/
      appBlockRegistry.tsx
  pages/
    PageDocPage.tsx
  routes/
    $.tsx                # public CMS pages
    admin.pages.$entryId.tsx
  server/
    adminServerFns.ts    # createServerFn wrappers + auth
    publicContentFns.ts
  server.ts              # /media/* handler + TanStack entry
```

## createCmsStore configuration

```ts
import { createCmsStore } from '@campaign/cms-server'
import type { PageDocPayload } from '@campaign/cms-core'

createCmsStore(() => ({ db: env.DB, media: env.MEDIA }), {
  // Required
  parsePayload: (raw) => revisionPayloadSchema.safeParse(raw).data ?? null,
  newPageDoc: ({ title, slug }) => defaultNewPageDoc({ title, slug }),
  validateNewPageSlug: (slug) => coreValidateNewPageSlug(slug, RESERVED),
  entryIdFromPageSlug: (slug) => `page_${slug.replace(/\//g, '-')}`,

  // Optional — editor fallbacks
  defaultPageDocForEntry: (entryId) => DEFAULTS[entryId] ?? null,
  toPageDoc: (payload) => legacyPayloadToPageDoc(payload),
  legacyEntryTypes: ['cms_page', 'home_content'],
})
```

### parsePayload

Return `null` for invalid JSON. The host typically validates against a Zod union of all revision kinds your site supports. The store uses this for every read/write.

For page-doc-only sites, `pageDocPayloadSchema.safeParse(raw)` is enough.

### validateNewPageSlug

Wrap `@campaign/cms-core`'s `validateNewPageSlug(slug, reservedPrefixes)` with your route prefixes:

```ts
const CMS_RESERVED_PATH_PREFIXES = new Set([
  'admin', 'api', 'media', 'donate', 'events', 'volunteer',
])
```

### entryIdFromPageSlug

Default from cms-core: `page_{slug-with-dashes}`. Override if your naming convention differs.

## Slug utilities

```ts
// cmsPagePath.ts
import {
  cmsPagePublicPath,
  normalizeCmsSlug,
  isReservedCmsSlug as coreIsReserved,
} from '@campaign/cms-core'

export const CMS_RESERVED_PATH_PREFIXES = new Set(['admin', 'api', 'media'])

export function isReservedCmsSlug(slug: string) {
  return coreIsReserved(slug, CMS_RESERVED_PATH_PREFIXES)
}

export { cmsPagePublicPath, normalizeCmsSlug }
```

## Server functions pattern

Campaign CMS does not ship TanStack `createServerFn` wrappers. The host wraps store methods:

```ts
import { createServerFn } from '@tanstack/react-start'
import { savePageDocDraft } from '../lib/cms/content.server'
import { requireAdmin } from './adminAuth'

export const adminSavePageDocFn = createServerFn({ method: 'POST' })
  .validator((data: { entryId: string; payload: unknown; csrfToken: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(data.csrfToken)
    return savePageDocDraft(data.entryId, data.payload)
  })
```

See [store API](../reference/store-api.md) for all store methods to wrap.

## Vite / SSR config

```ts
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: ['react', 'react-dom', /^@tanstack\//, /^@campaign\//],
  },
})
```

## Vitest (if testing host components that render CMS UI)

Dedupe React when packages resolve from a sibling path:

```ts
resolve: {
  dedupe: ['react', 'react-dom'],
  alias: {
    react: path.resolve(dirname, '../node_modules/react'),
    'react-dom': path.resolve(dirname, '../node_modules/react-dom'),
  },
},
```

## Reference implementations

- **Minimal:** [examples/minimal-site](../../examples/minimal-site/)
- **Production:** [frank-domenic](https://github.com/chester-hill-solutions/frank-domenic) `website/src/lib/cms/`

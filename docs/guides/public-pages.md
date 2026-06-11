# Public pages

Rendering published CMS content on the public site.

## PageDocPage component

A thin page shell wrapping `BlockRenderer`:

```tsx
import { BlockRenderer, CmsUiProvider } from '@campaign/cms-react'
import type { PageDocPayload } from '@campaign/cms-core'
import { cmsUiConfig } from '../lib/cms/cmsUi'
import { appBlocks } from '../components/blocks/appBlockRegistry'

export function PageDocPage({ page }: { page: PageDocPayload }) {
  return (
    <main className="page-wrap mx-auto max-w-5xl px-4 py-10">
      <CmsUiProvider config={cmsUiConfig}>
        <BlockRenderer blocks={page.blocks} appBlocks={appBlocks} />
      </CmsUiProvider>
    </main>
  )
}
```

## CmsUiProvider (public)

Minimum config for public rendering:

```ts
export const cmsUiConfig: CmsUiConfig = {
  heroFallbackPortrait: {
    src: '/candidate-portrait.webp',
    alt: 'Candidate name',
  },
  blockDefaults: {
    imagePlaceholderSrc: '/placeholder.webp',
  },
}
```

`mediaApi` is not needed on public pages.

## Catch-all route

```tsx
export const Route = createFileRoute('/$')({
  loader: async ({ params }) => {
    const slug = normalizeCmsSlug(params._splat ?? '')
    if (!slug || isReservedCmsSlug(slug)) throw notFound()

    const page = await getPublishedPageDocBySlug(slug)
    if (!page || page.enabled !== 1) throw notFound()

    return page
  },
  head: ({ loaderData: page }) => ({
    meta: [
      { title: page?.seoTitle },
      { name: 'description', content: page?.seoDescription },
    ],
  }),
  component: () => {
    const page = Route.useLoaderData()
    return <PageDocPage page={page} />
  },
})
```

## SEO fields

Each `pageDoc` carries:

| Field | Use |
|-------|-----|
| `seoTitle` | `<title>`, og:title |
| `seoDescription` | meta description, og:description |
| `noindex` | When `1`, add `robots: noindex` |
| `slug` | Canonical URL via `cmsPagePublicPath(slug)` |

## Enabled gate

`enabled: 0` pages return 404 on the public site even if published. Use this for draft policy planks before launch.

## App blocks on public pages

Pass `appContext` for blocks that need live data:

```tsx
<BlockRenderer
  blocks={page.blocks}
  appBlocks={appBlocks}
  appContext={{ eventsPayload, volunteerCode }}
/>
```

If an app block type has no renderer registered, it renders nothing (no error).

## Markdown fallback

Sites migrating from legacy `cmsPage` payloads may still render markdown pages separately. New pages should use `pageDoc` exclusively.

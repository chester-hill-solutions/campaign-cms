# Architecture

Campaign CMS is a four-package monorepo. Each package has a narrow boundary so host apps inject campaign-specific behavior without forking the editor.

## Package diagram

```mermaid
flowchart TB
  subgraph host [Host campaign site]
    Routes[TanStack routes]
    Auth[Admin auth + CSRF]
    AppBlocks[appBlocks registry]
    StoreWrap[content.server.ts]
  end

  subgraph cms-react [@campaign/cms-react]
    Renderer[BlockRenderer]
    Canvas[EditorCanvas]
    UI[CmsUiProvider]
  end

  subgraph cms-server [@campaign/cms-server]
    Store[createCmsStore]
  end

  subgraph cms-core [@campaign/cms-core]
    Schemas[blockSchemas + Zod]
    Ops[pageBlockOps]
  end

  subgraph cloudflare [Cloudflare]
    D1[(D1)]
    R2[(R2)]
  end

  Routes --> Renderer
  Routes --> Canvas
  Canvas --> UI
  Renderer --> UI
  StoreWrap --> Store
  Auth --> StoreWrap
  AppBlocks --> Renderer
  Store --> Schemas
  Store --> D1
  Store --> R2
  Canvas --> Ops
  Renderer --> Schemas
```

## Data model

### D1 tables

**`content_entries`** — one row per editable entity (page, home content, events config, …).

| Column | Purpose |
|--------|---------|
| `id` | Stable entry id (`page-about`, `page_platform-parks-rec`, …) |
| `type` | `page_doc`, `cms_page`, `home_content`, … |
| `slug` | Public URL slug (nullable for non-page entries) |
| `published_revision_id` | Points at live content |
| `draft_revision_id` | Points at unpublished edits |

**`content_revisions`** — append-only JSON payloads.

Each revision stores a full payload blob. Publish copies the draft revision id to `published_revision_id`.

**`media_assets`** — metadata for R2 objects (filename, mime, dimensions, alt text).

### Page document payload

The primary content shape is `pageDoc`:

```ts
{
  kind: 'pageDoc',
  version: 1,
  slug: 'about',
  title: 'About',
  seoTitle: 'About | Candidate Name',
  seoDescription: '...',
  enabled: 1,
  showInNav: 1,
  navLabel: 'About',
  blocks: PageBlock[]
}
```

Each block has `id`, `type`, `layout` (width/padding), and type-specific fields validated by Zod in `@campaign/cms-core`.

## Request flows

### Public page view

1. Route loader calls `getPublishedPageDocBySlug(slug)`
2. Store joins `content_entries` → `content_revisions` on `published_revision_id`
3. Payload parsed with host `parsePayload`
4. `BlockRenderer` maps each block to a React view
5. App blocks delegate to host `appBlocks` registry

### Admin edit + publish

1. Editor route loads `getPageDocEditorState(entryId)` (draft + published + meta)
2. `EditorCanvas` mutates blocks client-side via `pageBlockOps`
3. `useAutosave` debounces calls to host `savePageDocDraft` server fn
4. Publish calls `publishEntry(entryId)` — sets `published_revision_id = draft_revision_id`

### Media upload

1. `MediaPicker` calls host `CmsMediaApi.upload` (authenticated)
2. Host server fn calls `uploadMediaAsset` → writes R2 + D1 row
3. Block `src` fields store `/media/{r2_key}` paths
4. Public requests hit `/media/*` → `streamMediaFromR2`

## Dependency injection points

| Concern | Where configured |
|---------|------------------|
| Cloudflare bindings | `createCmsStore(() => ({ db, media }))` |
| Payload schema union | Host `parsePayload` |
| Reserved URL slugs | Host wraps `validateNewPageSlug` |
| New page SEO defaults | Host wraps `defaultNewPageDoc` |
| Hero fallback image | `CmsUiProvider.heroFallbackPortrait` |
| Image block placeholder | `CmsUiProvider.blockDefaults` |
| Media library API | `CmsUiProvider.mediaApi` |
| Campaign blocks | `BlockRenderer.appBlocks` |

## What stays in the host

- Authentication, sessions, CSRF
- Forms, Stripe, webhooks, email
- Site chrome (header, footer, analytics)
- Legacy payload converters (`homeContent` → `pageDoc`)
- Sitemap, robots, structured data
- Campaign-specific app block views

## Source distribution

Packages export TypeScript source (`"exports": "./src/index.ts"`). The host bundler (Vite) compiles them. Add `@campaign/*` to SSR `noExternal` in Vite config.

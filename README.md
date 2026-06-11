# Campaign CMS

Block-based CMS and visual page builder for political campaign sites. Built for **Cloudflare Workers** (D1 + R2), **TanStack Start**, and React 19.

Published by [Chester Hill Solutions](https://github.com/chester-hill-solutions).

## Why this exists

Campaign sites share the same content problems: policy pages, hero sections, event teasers, donation embeds, and an admin who needs to edit copy without touching code. Campaign CMS extracts the reusable stack — schemas, persistence, block renderer, and admin canvas — so each new site wires campaign-specific pieces (forms, Stripe, branding) instead of rebuilding the editor.

## Packages

| Package | npm name | Role |
|---------|----------|------|
| [cms-core](./packages/cms-core) | `@campaign/cms-core` | Zod block schemas, page/block operations, validation, slugs |
| [cms-server](./packages/cms-server) | `@campaign/cms-server` | `createCmsStore()` — D1 draft/publish + R2 media |
| [cms-react](./packages/cms-react) | `@campaign/cms-react` | Public `BlockRenderer`, admin editor canvas, `MediaPicker` |
| [cms-setup](./packages/cms-setup) | `@campaign/cms-setup` | `campaign-cms init` CLI — migrations + setup checklist |

## Quick start

### 1. Install in a host app

From git (recommended until packages are on npm):

```bash
git clone https://github.com/chester-hill-solutions/campaign-cms.git
cd campaign-cms
npm install
```

### 2. Bootstrap Cloudflare resources

```bash
npm exec campaign-cms init
wrangler d1 create my-campaign-cms
wrangler r2 bucket create my-campaign-media
# Merge bindings from: npm exec campaign-cms wrangler
wrangler d1 migrations apply my-campaign-cms --local
```

### 3. Wire the store and renderer

See **[Getting started](./docs/getting-started.md)** and the runnable **[minimal-site example](./examples/minimal-site/)**.

```ts
import { createCmsStore } from '@campaign/cms-server'
import { BlockRenderer, CmsUiProvider } from '@campaign/cms-react'
```

## Documentation

| Doc | Contents |
|-----|----------|
| [Getting started](./docs/getting-started.md) | End-to-end setup checklist |
| [Architecture](./docs/architecture.md) | Package boundaries, data model, request flow |
| [Host integration](./docs/guides/host-integration.md) | Store config, routes, media handler |
| [Public pages](./docs/guides/public-pages.md) | `BlockRenderer`, `CmsUiProvider`, SEO |
| [Admin editor](./docs/guides/admin-editor.md) | Canvas, autosave, publish, media API |
| [App blocks](./docs/guides/app-blocks.md) | Campaign-specific block types |
| [Styling](./docs/guides/styling.md) | Tailwind, CSS tokens, theme overrides |
| [Media](./docs/guides/media.md) | R2 uploads, `/media/*` streaming |
| [Block types reference](./docs/reference/block-types.md) | All 23 block schemas |
| [Store API reference](./docs/reference/store-api.md) | Every `createCmsStore` method |

## Example

**[examples/minimal-site](./examples/minimal-site/)** — a stripped-down TanStack Start app with one seeded CMS page, public rendering, and an admin editor route (no auth — for learning only).

```bash
cd examples/minimal-site
npm install
npm run setup:local
npm run seed:local
npm run dev
# → http://localhost:3000/about  (public page)
# → http://localhost:3000/admin/pages/page-about  (editor)
```

Production reference: [frank-domenic](https://github.com/chester-hill-solutions/frank-domenic) (private campaign site using these packages).

## Development

```bash
npm install
npm test              # all packages
npm run typecheck
```

## License

MIT — see [LICENSE](./LICENSE).

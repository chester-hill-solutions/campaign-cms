# Minimal site example

A runnable TanStack Start app with a single page editor at `/` — the fastest way to try Campaign CMS.

## Prerequisites

- Node.js 20+
- Cloudflare Wrangler

## Setup

From the **campaign-cms repo root**:

```bash
npm install
npm run example:setup
npm run example:seed
npm run example:dev    # http://localhost:3001
```

Or from `examples/minimal-site`:

```bash
npm install
npm run setup:local
npm run seed:local
npm run dev            # http://localhost:3001
```

## What you get

Open **http://localhost:3001** — a seeded campaign About page in the page builder:

- Drag-and-drop blocks, inline editing, block settings panel
- Page settings drawer (SEO, slug, nav)
- Autosave to local D1, publish button
- Desktop / mobile width preview toggle

**No authentication** — this is a local demo only.

Published preview (after hitting Publish): **http://localhost:3001/about**

## What to read in the source

| File | Shows |
|------|-------|
| `src/pages/PageEditor.tsx` | Editor wiring — canvas, autosave, publish, drawers |
| `src/lib/cms/content.server.ts` | `createCmsStore` wiring |
| `scripts/seed-about.json` | Sample pageDoc payload (hero uses Unsplash stock photos) |
| `src/lib/cms/stockImages.ts` | Demo portrait / background / placeholder URLs |
| `src/server/cmsFns.ts` | TanStack `createServerFn` wrappers |

Reference production site: [frank-domenic](https://github.com/chester-hill-solutions/frank-domenic).

# Minimal site example

A runnable TanStack Start app with a single page editor at `/` — the fastest way to try Campaign CMS.

## Prerequisites

- Node.js 22 (matching CI)
- Cloudflare Wrangler

## Setup

From the **campaign-cms repo root**:

```bash
npm ci --legacy-peer-deps
npm run example:setup
npm run example:seed
npm run example:dev    # http://localhost:3001
```

Or from `examples/minimal-site`:

```bash
npm ci --legacy-peer-deps
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
| `src/lib/cms/content.server.ts` | `createCmsStoreD1` wiring |
| `scripts/seed-about.json` | Sample pageDoc payload (hero uses Unsplash stock photos) |
| `src/lib/cms/stockImages.ts` | Demo portrait / background / placeholder URLs |
| `src/server/cmsFns.ts` | TanStack `createServerFn` wrappers |

Reference production site: [frank-domenic](https://github.com/chester-hill-solutions/frank-domenic).

## Current package contracts

The example uses the checked-in [CMS artifacts](../../vendor/chs-cms/provenance.json),
including the runtime-neutral store and D1/R2 adapter. It does not install the removed
`cms-server` package. See [the migration notes](../../docs/guides/current-package-integration.md).

The editor sends its opened draft revision on every save and publish. A stale editor
keeps local edits, pauses autosave and disables publication until an explicit reload.
The public-page link follows the published payload's slug, so a draft rename cannot
change that link before publication. Agent writes retain the `agent` audit author.

Run setup before seed: migration 0007 requires a complete listing snapshot for every
revision, and the local seed now writes that snapshot. These commands use local D1
only. The example still has no authentication and must not be deployed as an admin
interface without the host's own access controls.

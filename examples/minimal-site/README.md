# Minimal site example

A runnable TanStack Start app demonstrating Campaign CMS with:

- D1-backed `pageDoc` storage
- Public block rendering at `/about`
- Admin page builder at `/admin/pages/page-about` (**no auth — demo only**)

## Prerequisites

- Node.js 20+
- Cloudflare Wrangler

## Setup

From the **campaign-cms repo root**:

```bash
npm install
cd examples/minimal-site
npm install
npm run setup:local    # apply D1 migrations locally
npm run seed:local     # insert sample About page
npm run dev            # http://localhost:3001
```

## URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3001/about | Public CMS page |
| http://localhost:3001/admin/pages/page-about | Page builder (unauthenticated) |

## What to read in the source

| File | Shows |
|------|-------|
| `src/lib/cms/content.server.ts` | `createCmsStore` wiring |
| `src/lib/cms/cmsPagePath.ts` | Reserved slug prefixes |
| `src/lib/cms/pageDocEntry.ts` | SEO defaults for new pages |
| `src/server/cmsFns.ts` | TanStack `createServerFn` wrappers |
| `src/server.ts` | `/media/*` R2 streaming |
| `src/pages/PageDocPage.tsx` | Public `BlockRenderer` |
| `src/routes/admin.pages.$entryId.tsx` | Editor canvas + autosave + publish |

## Production checklist

Before deploying a real campaign site:

1. Add admin authentication and CSRF (see [admin editor guide](../../docs/guides/admin-editor.md))
2. Replace direct server fn calls with authenticated wrappers
3. Add `mediaApi` to `CmsUiProvider` for image uploads
4. Register [app blocks](../../docs/guides/app-blocks.md) for forms, events, donate
5. Use a catch-all route (`routes/$.tsx`) instead of a fixed `/about` route

Reference production site: [frank-domenic](https://github.com/chester-hill-solutions/frank-domenic).

# Campaign CMS

Reusable CMS and page-builder packages for campaign sites on Cloudflare (D1 + R2) and TanStack Start.

## Packages

| Package | Description |
|---------|-------------|
| `@campaign/cms-core` | Block schemas (Zod), block factory, page/block ops, validation, slug utilities |
| `@campaign/cms-server` | `createCmsStore(bindings, config)` — D1 content/revisions + R2 media |
| `@campaign/cms-react` | `BlockRenderer`, admin editor canvas, `MediaPicker`, `CmsUiProvider` |
| `@campaign/cms-setup` | `campaign-cms init` — copies D1 migrations and setup docs into a host app |

## Development

```bash
npm install
npm test
npm run typecheck
```

## Use in a campaign site

Install from git (or a published registry) and wire bindings + app blocks in the host app. See `packages/cms-setup/templates/CMS_SETUP.md` for the full checklist.

**Local sibling checkout** (e.g. `WebProjects/campaign-cms` next to `WebProjects/frank-domenic`):

```json
{
  "dependencies": {
    "@campaign/cms-core": "file:../../campaign-cms/packages/cms-core",
    "@campaign/cms-react": "file:../../campaign-cms/packages/cms-react",
    "@campaign/cms-server": "file:../../campaign-cms/packages/cms-server"
  }
}
```

Then run `npm install` in the host repo root.

```bash
npm exec campaign-cms init
```

# @campaign/cms-setup

CLI for bootstrapping Campaign CMS in a new host app.

## Install

```bash
npm install --save-dev @campaign/cms-setup
```

## Commands

### `campaign-cms init [dir]`

Copies into the target directory (default: current directory):

- `migrations/0001_cms_core.sql` — content entries + revisions
- `migrations/0002_media_assets.sql` — media metadata
- `CMS_SETUP.md` — host wiring checklist

Existing files are never overwritten. If migrations already exist, new files are skipped.

```bash
npm exec campaign-cms init
```

### `campaign-cms wrangler`

Prints a `wrangler.jsonc` snippet with `DB` and `MEDIA` bindings. Merge into your config and replace placeholders.

## After init

```bash
wrangler d1 create YOUR_DB
wrangler r2 bucket create YOUR_BUCKET
wrangler d1 migrations apply YOUR_DB --local
```

Then follow [Getting started](../../docs/getting-started.md).

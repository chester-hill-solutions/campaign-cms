# @chester-hill-solutions/cms-setup

CLI for bootstrapping Campaign CMS in a TanStack Start / Cloudflare Workers host app.

**Install:** [docs/USING-PACKAGES.md](../../docs/USING-PACKAGES.md)

```bash
bun add -D @chester-hill-solutions/cms-setup@^0.3.0
```

## Importing the schema

This package owns the fourteen tables the CMS stores its data in, and 0.3.0 gives them an entry
point. A host that manages its own schema, and any test that needs the tables to exist, imports
the DDL rather than reaching into `sql/`:

```ts
import { cmsDialectDdl, cmsSchemaSql } from '@chester-hill-solutions/cms-setup'

// One string, for a driver that runs a script in a single call.
await sql.unsafe(cmsSchemaSql('postgres'))

// Or one migration at a time, so a failure names the file that caused it.
for (const migration of cmsDialectDdl('d1')) {
  await db.run(migration.sql)
}
```

Two dialects: `d1` and `postgres`. The SQL genuinely differs between them — `datetime('now')`
against `(now()::text)` — and both are asserted to declare the same tables and columns, so a
change to one that does not reach the other fails here rather than at apply time in one of them.

Until 0.3.0 there was no entry point at all, so `cms-store-d1` and `cms-store-postgres` each read
these files with a relative filesystem path into a sibling package's internals. Those paths have
been replaced by the import.

`cmsTables`, `compareShapes` and `describeShapeDifference` are exported too, for a package that
needs to check a schema rather than apply one. `compareShapes` reports differences in both
directions, so a copy that grows a column its owner does not have is caught, not just one that
loses a column.

## Commands

### `cms-setup init [dir]`

Copies into the target directory (default: current directory):

- `migrations/0001_cms_core.sql` — content entries + revisions
- `migrations/0002_media_assets.sql` — media metadata
- `CMS_SETUP.md` — host wiring checklist

Existing files are never overwritten.

```bash
bunx cms-setup init
```

### `cms-setup wrangler`

Prints a `wrangler.jsonc` snippet with `DB` and `MEDIA` bindings.

## After init

```bash
wrangler d1 create YOUR_DB
wrangler r2 bucket create YOUR_BUCKET
wrangler d1 migrations apply YOUR_DB --local
```

Then follow the generated `CMS_SETUP.md` to wire `@chester-hill-solutions/cms-store-d1` and `@chester-hill-solutions/cms-react`.

## Complete entry listing revisions

The `0007_entry_listing_snapshots.sql` migration adds the required listing snapshot to `content_revisions`. Apply it once through the host's migration tracker before enabling the matching store release. New installations apply the whole ordered migration chain; upgrades apply only unapplied migrations. Re-running the SQL directly is not supported. The setup CLI copies by semantic basename, so hosts with different migration numbering should not copy a second snapshot migration under another number.

Cutover must stop old writers first: old adapters and direct SQL revision inserts without an explicit snapshot are rejected. Upgrade every writer, including automation and import jobs, together. D1 enforces non-null inserts/updates with triggers; Postgres uses a non-null column without a default.

Only currently referenced draft/published revisions inherit legacy listing tables. Both receive the same observable legacy state when their heads differ: the old schema did not retain two versions. Historical unreferenced revisions receive an empty snapshot; restoration cannot reconstruct metadata that never existed. Missing collection/tag definitions are ignored; missing categories become null. Valid metadata retains JSON types and malformed JSON is preserved as a string, matching legacy reads. Snapshot schema validation still fails closed for out-of-contract legacy values; inspect an upgrade rehearsal before production. Later changes to collection/category/tag definitions do not alter frozen publications.

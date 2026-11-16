# @chester-hill-solutions/cms-store-d1

Cloudflare D1 + R2 adapter for [`@chester-hill-solutions/cms-store`](../cms-store). The SQL here matches the `cms-setup` D1 migrations.

**Install:** [docs/USING-PACKAGES.md](../../docs/USING-PACKAGES.md)

## Usage

```ts
import { createCmsStoreD1 } from '@chester-hill-solutions/cms-store-d1'

const store = createCmsStoreD1(
  () => ({ db: env.DB, media: env.MEDIA }),
  config,
)
```

Bindings are resolved lazily so module import never touches `env`.

## Testing

`@chester-hill-solutions/cms-store-d1/testing` exports:

This testing entry point requires Bun because `createLocalD1` imports
`bun:sqlite`. The production root has no Bun dependency and can be imported by
native Node ESM without constructing Workers bindings.

| Export | What it is |
|---|---|
| `createLocalD1(ddl)` | a **real SQLite** engine (`bun:sqlite`) behind a D1-shaped `prepare`/`bind`/`run`/`all`/`first`/`batch` surface |
| `readD1Ddl()` | the shipped migrations, read from `packages/cms-setup/sql` |
| `createInMemoryR2Bucket()` | an in-memory object store — media only |

The suite runs this adapter's SQL against actual SQLite and both shared conformance flows from
`@chester-hill-solutions/cms-store/testing`. It previously ran against a 747-line matcher that
pattern-matched SQL substrings and never executed a query, so any assertion written against it proved the
matcher was self-consistent.

**What local SQLite does not prove:** Cloudflare's distributed layer — replication, the D1 query planner, Workers
runtime integration. Those are unreachable from a unit test in any engine; they are untested rather than fine.

**Where a double remains:** the R2 bucket. Object storage is not SQL and there is no local R2 emulator, so media
coverage means the adapter's code path runs — not that R2 integration is correct.

**One deliberate difference from production:** `createLocalD1` enables `PRAGMA foreign_keys`, which Cloudflare
documents as D1's default being `OFF`. The port documents that inserts throw on constraint violations, so a suite
that cannot observe a refused insert cannot observe the contract.

## Draft revision guards

Editor writes require the draft revision ID read with the document. `null` means
an entry has no draft yet; it does not disable the guard. A stale save or restore
throws `CmsRevisionConflictError` without adding a revision or changing entry
metadata. Preserve the editor's local content and require an explicit reload.

```ts
const saved = await store.savePageDocDraft(entryId, content, openedDraftRevisionId, 'editor save')
if (saved.ok) openedDraftRevisionId = saved.revisionId
await store.publishEntry(entryId, openedDraftRevisionId)
await store.restoreRevisionAsDraft(entryId, historicalRevisionId, openedDraftRevisionId)
```

Publication checks the exact supplied draft. Restoring a page also restores its
metadata in the same guarded write. Persistence adapters must atomically guard
and write the revision plus metadata: D1 uses a conditional insert in a batch;
Postgres locks the entry in a transaction. Revision versions are allocated inside
that operation. Low-level `insertDraftRevision` also requires the expected head.
Operational settings publication remains a separate immediate-write API.

## Built-in aggregate analytics

`createD1Analytics` uses the existing D1 binding. It creates its own table lazily, without an external service, key, or separate analytics migration. Importing the module does not resolve bindings. Failed initialization can be retried on the next call.

```ts
import {
  createD1Analytics,
  createAnalyticsHandler,
} from '@chester-hill-solutions/cms-store-d1'

const analytics = createD1Analytics(() => env.DB)
const handleAnalytics = createAnalyticsHandler({
  analytics,
  isPublicPath: async (path) => {
    const page = await store.getPublishedPageDocBySlug(path.slice(1))
    return page != null && page.enabled === 1
  },
  // Optional: replace the built-in common-bot filter with your site's classifier.
  // isBot: isbot,
})

// Mount this POST-only handler at /api/cms/analytics.
const response = await handleAnalytics(request)

// Call from an authenticated administration endpoint, never a public route.
const summary = await analytics.getSummary(7) // or 30
```

Mount the tracker and reporting panel from `@chester-hill-solutions/cms-react` as shown in that package's README. The host must provide its published-page lookup, protect reporting with its existing admin authentication, and keep the ingestion route same-origin. For sites with multiple public document types, include every published type in `isPublicPath`. The lower-level `recordPageView` does not itself check publication and should not be exposed directly to requests.

Only UTC date, normalized pathname, referrer hostname (or `Direct`/`Internal`), and aggregate count are stored. Query strings, fragments, IP addresses, user agents, cookies, full referrer URLs and visitor identifiers are excluded. A page view is a navigation event, not a unique visitor. The tracker and handler respect Do Not Track. Internal referrers are omitted from the referrer ranking, but their views remain in totals.

The handler requires an exact matching `Origin` on POST, skips common bots, validates at most 2 KiB of streamed JSON, excludes admin/API/media/assets routes, and checks publication before writing. The optional `isBot` callback replaces the default filter. These checks reduce noise; they are not authentication or a guarantee against same-origin automation. Add the host's normal abuse controls if needed. Referrer attribution is hostname-only; subsequent client navigation is `Internal`.

Reports include zero-filled 7/30-day series ending today in UTC, total page views and the top ten pages/referrers. Invalid window values fall back to seven days. Summary reads remove aggregates older than the last 90 UTC calendar dates. Inactive sites retain old rows until a summary is requested; there is no background cleanup scheduler. Counts begin when the tracker is enabled and no historical traffic is imported. Binding/SQL errors reject rather than being reported as zero traffic.

Run the actual SQL and ingestion boundary tests with Bun and its native SQLite:

```bash
bun test packages/cms-store-d1/src/builtin-analytics.test.ts
```

## Published URL compatibility (0.7.0)

Upgrade with `cms-store` 0.7.0. Public URL lookup and sitemap candidates now come
from immutable published payloads. Filtered lookup scans O(N) database rows in
one join but transfers only matching payloads for full validation. Autosaved row slugs
remain private until publication. Duplicate historical published URLs fail closed.

The publication UPDATE and operational revision INSERT guard against another
published payload owning the same normalized slug. The collision predicate runs
inside the SQLite write/batch transaction. `CmsPublishedSlugConflictError` leaves
the losing draft/publication pointers unchanged and adds no operational revision.
All writers must upgrade; there is no schema migration or database unique index
covering old code/direct SQL. See [store migration notes](../cms-store/README.md#published-urls-and-sitemap-candidates-070)
and [ADR-0012](../../docs/adr/0012-cms-published-url-isolation.md).

## Upgrade to complete listing revisions

Upgrade `cms-core`, `cms-store`, this adapter and `cms-setup` together. Apply the
setup package's `0007_entry_listing_snapshots.sql` migration before switching all
writers; it adds and backfills the required snapshot column without changing
PageDoc JSON. D1 triggers reject older revision writers that omit a snapshot.
Entry assignment/tag/metadata helpers now require an expected revision token and
create a draft revision. Public listings use published snapshots exclusively.
Current heads inherit legacy listing values; older history starts empty.
See [ADR 0013](../../docs/adr/0013-cms-entry-listing-snapshots.md) for writer cutover,
operational publication and rollback limits.

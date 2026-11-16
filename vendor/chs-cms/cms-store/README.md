# @chester-hill-solutions/cms-store

Runtime-neutral CMS store: persistence/media **ports** plus the shared `createCmsStore` orchestration (entries, draft/publish revisions, pageDoc storage, media library, taxonomy, forms, analytics, SEO helpers).

Dialect-specific SQL lives in adapters only:

- [`@chester-hill-solutions/cms-store-d1`](../cms-store-d1) — Cloudflare D1 + R2
- [`@chester-hill-solutions/cms-store-postgres`](../cms-store-postgres) — Postgres + S3-compatible media

**Install:** [docs/USING-PACKAGES.md](../../docs/USING-PACKAGES.md)

## Usage

```ts
import { createCmsStore, type CmsPersistence, type CmsMediaStore } from '@chester-hill-solutions/cms-store'

const store = createCmsStore(() => ({ db: myPersistence, media: myMediaStore }), config)
```

Most hosts should use an adapter package instead of implementing `CmsPersistence` directly.

## Exporting form responses

`exportFormResponsesCsv` escapes spreadsheet formulas by default:

```ts
// Each cell that begins = + - @ tab or carriage return gets a leading apostrophe. The default.
const csv = await store.exportFormResponsesCsv(formId)

// Byte-identical to what is stored, for a pipeline that diffs two exports.
const raw = await store.exportFormResponsesCsv(formId, { escapeFormulas: false })
```

**Why the option exists.** A form response is attacker-supplied text, and a spreadsheet reads a
leading `=`, `+`, `-` or `@` as the start of a formula. So an unescaped export hands whoever
opens the file a way to run a formula of their choosing. The apostrophe is the spreadsheet's own
marker for "the rest of this cell is text", and it is consumed on open, so the reader shows the
original value.

**Why it is on by default.** The export is the artefact a human opens, and the values in it are
the visitor's to choose. Escaping is therefore the default, and the byte-identical export is
the opt-in: a consumer that compares two exports byte for byte, or that re-imports the file
and compares field values against what it sent, sees a leading `'` that was never stored.

**This changed the default.** Before this change the export was unescaped unless the caller
asked otherwise, so a consumer that relied on the old default now receives escaped bytes.
Pass `{ escapeFormulas: false }` to get the previous output back.

So the decision belongs to whoever knows the consumer. A browser download or an emailed
attachment wants the default. A pipeline diffing two exports wants it off. A round trip back into
the CMS wants it off, and should strip the prefix itself if it needs the raw value.

The prefix is an apostrophe rather than a strip because stripping a leading `-` turns a negative
number into a positive one. A character the reader can see through costs less than a sign that
is gone.

## Testing

`@chester-hill-solutions/cms-store/testing` exports an in-memory adapter and shared conformance flows that every adapter must pass:

```ts
import {
  createMemoryCmsStore,
  conformanceTestConfig,
  runCmsStoreConformance,
  runCmsStoreExtendedConformance,
  runCmsPublicationConformance,
  runCmsPublicationRaceConformance,
} from '@chester-hill-solutions/cms-store/testing'

const store = createMemoryCmsStore(conformanceTestConfig)
await runCmsStoreConformance(store)          // content + media flow
await runCmsStoreExtendedConformance(store)  // taxonomy + analytics + forms
await runCmsPublicationConformance(store)   // public URLs + sitemap + URL ownership
await runCmsPublicationRaceConformance(store) // competing publication paths
```

### Which adapters actually run them

| Adapter | `bun run test` | Backed by |
|---|---|---|
| `cms-store` (memory) | all four flows | a `Map`, proving shared orchestration rather than SQL |
| `cms-store-d1` | all four flows | actual SQLite (`bun:sqlite`) against shipped migrations |
| `cms-store-postgres` | separate integration gate | real PostgreSQL 17/18 CI services; local integration can use Testcontainers or an isolated loopback database |

The D1 adapter's local engine is stricter than production in one respect: it enables
`PRAGMA foreign_keys`, which Cloudflare documents as D1's default being `OFF`. That is
deliberate — the port documents that inserts throw on constraint violations, so a suite
that cannot observe a refused insert cannot observe the contract.

See [docs/reference/store-api.md](../../docs/reference/store-api.md) for the full store API.

### Media upload policy

`mediaUploadPolicy` configures the accepted MIME types, their canonical storage
extensions and per-type byte limits. The default accepts JPEG, PNG, WebP and GIF
up to 5 MiB, with required alt text. Empty files are rejected. Every upload uses
a fresh UUID key; replacing a file never overwrites an existing asset.

```ts
mediaUploadPolicy: {
  types: {
    'image/png': { extension: 'png', maxBytes: 5 * 1024 * 1024 },
    'audio/mpeg': { extension: 'mp3', maxBytes: 25 * 1024 * 1024 },
  },
  requireAlt: true,
}
```

The host validates file contents, limits HTTP request bodies, and authorizes
asset delivery. A storage upload policy does not make assets public or implement
product-specific ownership rules. Labels, transcripts and listening approval
remain separate concerns of the consuming application.

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

## Built-in CMS health

`loadCmsHealth(store, { publicOrigin, staticAssetPaths?, contactEmailConfigured?, adminProtected? })`
audits published page documents with no external service or tracking key. It checks search
metadata, internal page destinations and image references against the media inventory and
an optional static-asset registry. Disabled pages and unpublished drafts are excluded.
`analyzeCmsHealth(pages, options)` exposes the same pure audit for other adapters.

Render the report with `BuiltinSiteHealthPanel` from `cms-react`. Protect reporting with
the host's admin authentication. The audit does not fetch external URLs, verify actual
object delivery, test email delivery, or provide Lighthouse scores; advanced crawls and
performance measurements remain a separate optional service.

## Owner access guard

`checkCmsAdminAccess(request, options)` supplies a small HTTP Basic owner guard for hosts without an existing admin identity layer. Resolve its password from a secret binding and call it before every admin page, private server function, reporting endpoint and mutation; return any response it produces immediately. A `null` result permits the request. The username defaults to `admin` and can be configured by the host.

```ts
import { checkCmsAdminAccess } from '@chester-hill-solutions/cms-store'

const denied = await checkCmsAdminAccess(request, {
  password: env.CMS_OWNER_PASSWORD,
  username: 'admin',
})
if (denied) return denied
```

Missing/empty passwords fail closed, production requests require HTTPS, and UTF-8 credentials are compared through fixed-length SHA-256 digests. Mutations require an exact matching `Origin`; clients outside a browser must supply that header too. Error responses disable caching. `localDevelopment: true` explicitly permits credential-free loopback URLs (`localhost`, `127.0.0.1`, `[::1]`) while retaining the mutation origin check. Never enable that flag from request input. The helper introduces no accounts, secrets, or deployment configuration and does not replace a host's existing identity provider.

## Basic site settings

Every store exposes `getSiteSettings()` and `setSiteSettings(input)`. Pass `siteSettingsDefaults` in the store configuration for host-specific defaults. Reads do not create rows; saves validate the complete document and publish an operational revision under the reserved `cms-site-settings` entry. Existing D1 and Postgres adapters need no migration. Settings stay separate from page documents and preserve prior revisions. Saves take effect immediately and use the operational settings API's last-save-wins semantics. Protect writes with host admin authentication; reads contain public identity only.

`createSiteSettingsStore(getPersistence, { defaults, revisionAuthor })` exposes the same facade for integrations that do not need the full store.

## Published URLs and sitemap candidates (0.7.0)

```ts
const published = await store.listPublishedPageDocs()
// [{ entryId, revisionId, publishedAt, page }], with only published page values.
const page = await store.getPublishedPageDocBySlug('about')
const sitemap = await store.generateSitemapXml({ baseUrl: 'https://example.com' })
```

Autosaved slug/title changes do not move the public page or change sitemap
candidates. Lookup compares normalized published payload slugs; the configured
home entry resolves at root. Historical duplicates fail closed rather than
selecting an arbitrary owner. The list includes disabled/noindex documents for
hosts to apply their route policy; sitemap generation excludes both.

Publication guards URL ownership as well as the expected revision. Catch
`CmsPublishedSlugConflictError` separately from `CmsRevisionConflictError`; keep
local work and show the error message so the editor can change the slug. Both
normal and operational publication reserve URLs atomically, including disabled
published pages. The old URL becomes available only after its owner publishes a
new slug. Renames do not create redirects automatically.

Upgrade store and adapter together. Custom `CmsPersistence` implementations must
add `listPublishedPagePayloads(filter?)` and the collision guard on both publication
paths, forwarding `PublicationContext.homeEntryId`. Public joins must check that
the pointed revision belongs to its entry. `publishedPageSlug` exports the narrow
route identity parser used by adapters. Older writers/direct SQL bypass this
contract, so upgrade all writers before relying on it.

The optional persistence filter `{ slug, homeEntryId }` selects all matching
published candidates in SQL, including duplicates. Lookup still scans O(N)
database rows without a published-slug index, but transfers and fully validates
only candidates; sitemap enumeration loads every published snapshot once.
There are no N+1 queries or shared document cache. Administrative list
rows remain draft-aware and must not supply public URLs. The complete listing revision release below also isolates collection assignments,
tags and listing metadata until publication. See [ADR-0012](../../docs/adr/0012-cms-published-url-isolation.md).

### Complete entry listing revisions

Page content and entry-specific collection values now share a revision. Pass the
complete `EntryListingSnapshot` (from `cms-core`) as the fifth argument to
`savePageDocDraft(entryId, content, expectedRevisionId, message, listingSnapshot)`.
Omitting it preserves the exact expected head snapshot. `getEntryListingSnapshot`
requires entry and revision IDs; editor state exposes `draftListing` and
`publishedListing`. `saveEntryListingDraft(entryId, snapshot, expectedRevisionId)`
clones the current payload into a guarded revision. Restore copies both values.
Assignment/tag/metadata mutation helpers now require an expected revision ID and
return the new revision ID; these are draft writes. Public collection/tag/portfolio
lists read only complete published snapshots. `status:'all'` remains an explicit
administrative draft view. Operational PageDoc publication requires a complete
fourth snapshot argument and fifth caller expected-draft token; its final atomic guard
rejects a newer draft. Settings-style operational payloads use empty snapshots.

Apply the new `cms-setup` migration before upgrading every writer. It captures current
legacy metadata for current draft/published heads and gives older historical revisions
an explicit empty snapshot. It cannot reconstruct historical metadata. The column
has no default and rejects old revision inserts that omit it. Suspend editing for
cutover; old metadata writes target abandoned tables. Never deploy an old reader as
rollback after new snapshot publications. See [ADR 0013](../../docs/adr/0013-cms-entry-listing-snapshots.md)
for compatibility, validation and the O(N) public listing projection limits.

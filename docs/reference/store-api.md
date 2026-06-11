# Store API reference

Methods returned by `createCmsStore(getBindings, config)`.

## Content reads

### `getPublishedPageDoc(entryId: string): Promise<PageDocPayload | null>`

Published pageDoc for an entry id.

### `getPublishedPageDocBySlug(slug: string): Promise<PageDocPayload | null>`

Published pageDoc by public slug. Primary loader for public routes.

### `getPublishedPayloadJson(entryId: string): Promise<string | null>`

Raw published revision JSON string.

### `listContentEntries(): Promise<ContentEntryRow[]>`

All content entries.

### `listPageDocEntries(): Promise<ContentEntryRow[]>`

Entries with `type = 'page_doc'`.

### `listPageDocEntriesWithStatus(): Promise<PageDocListRow[]>`

Page list with human-readable status labels for admin UI.

### `getContentEntryRow(entryId: string): Promise<ContentEntryRow | null>`

Single entry metadata row.

## Editor state

### `getEntryEditorState(entryId): Promise<EntryEditorState<TPayload> | null>`

Draft + published payloads with meta (ids, timestamps, hasDraft, hasPublished).

### `getPageDocEditorState(entryId): Promise<EntryEditorState<PageDocPayload> | null>`

Like `getEntryEditorState` but converts legacy entry types via `config.toPageDoc`. Falls back to `defaultPageDocForEntry`.

## Writes

### `savePageDocDraft(entryId, payload): Promise<{ ok: true } | { ok: false, fieldErrors }>`

Validates with `pageDocPayloadSchema`, ensures entry exists, inserts draft revision, syncs slug/title metadata.

### `insertDraftRevision(entryId, payload, message?): Promise<string>`

Generic draft insert for any parsed payload type. Returns revision id.

### `publishEntry(entryId): Promise<{ published: boolean }>`

Sets `published_revision_id = draft_revision_id` and `status = 'published'`.

### `publishOperationalEntry(entryId, payload): Promise<void>`

Parse, insert revision, and publish in one step (for non-page config entries).

### `createPageDocEntry({ title, slug }): Promise<{ ok: true, entryId } | { ok: false, error }>`

Creates new `page_doc` entry + initial draft revision.

### `restoreRevisionAsDraft(entryId, revisionId): Promise<{ ok: boolean, error? }>`

Copies a historical revision into the current draft.

## Revisions

### `listRevisionsForEntry(entryId): Promise<RevisionListRow[]>`

Revision history for the page settings drawer.

## Slugs

### `isPageDocSlugTaken(slug, excludeEntryId?): Promise<boolean>`

Check slug collision before create/rename.

## Media

### `listMediaAssets(limit?: number): Promise<MediaAssetRow[]>`

Default limit 50, newest first.

### `getMediaAssetByKey(r2Key): Promise<MediaAssetRow | null>`

### `uploadMediaAsset({ filename, mime, bytes, alt }): Promise<UploadResult>`

Writes R2 object + D1 row. Max 5 MB; JPEG/PNG/WebP/GIF only.

### `streamMediaFromR2(r2Key): Promise<Response | null>`

Stream object for `/media/*` handler. Sets long-cache headers.

## Low-level

### `ensureContentEntry(id, type, title?, slug?)`

Insert entry row if missing.

### `syncContentEntryMetadata(entryId, title, slug)`

Update entry title/slug from pageDoc fields.

## Types

Exported from `@campaign/cms-core`: `ContentEntryRow`, `PageDocListRow`, `EntryEditorMeta`, `EntryEditorState`, `RevisionListRow`, `MediaAssetRow`.

Config types exported from `@campaign/cms-server`: `CmsBindings`, `CmsStoreConfig`, `CmsStore`.

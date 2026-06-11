import {
  pageDocPayloadSchema,
  type ContentEntryRow,
  type EntryEditorState,
  type MediaAssetRow,
  type PageDocListRow,
  type PageDocPayload,
  type RevisionListRow,
} from '@campaign/cms-core'

/** Cloudflare bindings, resolved lazily so module import never touches `env`. */
export type CmsBindings = {
  db: D1Database
  media?: R2Bucket
}

export type CmsStoreConfig<TPayload extends { kind: string }> = {
  /** Parse a stored revision payload; return null when invalid. */
  parsePayload: (raw: unknown) => TPayload | null
  /** Editor fallback for known entries that have no D1 row yet. */
  defaultPageDocForEntry?: (entryId: string) => PageDocPayload | null
  /** Convert a legacy (non-pageDoc) payload for the block editor. */
  toPageDoc?: (payload: TPayload) => PageDocPayload | null
  /** D1 `content_entries.type` values the block editor may convert from. */
  legacyEntryTypes?: readonly string[]
  /** Defaults for a freshly created page. */
  newPageDoc: (input: { title: string; slug: string }) => Omit<PageDocPayload, 'kind' | 'version'>
  validateNewPageSlug: (slug: string) => string | null
  entryIdFromPageSlug: (slug: string) => string
}

export type CmsStore<TPayload extends { kind: string }> = ReturnType<
  typeof createCmsStore<TPayload>
>

export function createCmsStore<TPayload extends { kind: string }>(
  getBindings: () => CmsBindings,
  config: CmsStoreConfig<TPayload>,
) {
  const db = () => getBindings().db
  const mediaBucket = (): R2Bucket => {
    const bucket = getBindings().media
    if (!bucket) throw new Error('CMS store: no R2 media binding configured')
    return bucket
  }

  async function listContentEntries(): Promise<ContentEntryRow[]> {
    const { results } = await db()
      .prepare(
        `SELECT id, type, slug, title, status, published_revision_id, draft_revision_id
         FROM content_entries ORDER BY id ASC`,
      )
      .all<ContentEntryRow>()
    return results ?? []
  }

  async function getRevisionPayloadById(revisionId: string): Promise<string | null> {
    const row = await db()
      .prepare(`SELECT payload FROM content_revisions WHERE id = ?`)
      .bind(revisionId)
      .first<{ payload: string }>()
    return row?.payload ?? null
  }

  async function getPublishedPayloadJson(entryId: string): Promise<string | null> {
    const row = await db()
      .prepare(
        `SELECT r.payload AS payload
         FROM content_entries e
         JOIN content_revisions r ON r.id = e.published_revision_id
         WHERE e.id = ?`,
      )
      .bind(entryId)
      .first<{ payload: string }>()
    return row?.payload ?? null
  }

  async function getPublishedPageDoc(entryId: string): Promise<PageDocPayload | null> {
    try {
      const raw = await getPublishedPayloadJson(entryId)
      if (!raw) return null
      const parsed = pageDocPayloadSchema.safeParse(JSON.parse(raw))
      return parsed.success ? parsed.data : null
    } catch {
      return null
    }
  }

  async function getPublishedPageDocBySlug(slug: string): Promise<PageDocPayload | null> {
    try {
      const row = await db()
        .prepare(`SELECT id FROM content_entries WHERE type = 'page_doc' AND slug = ? LIMIT 1`)
        .bind(slug)
        .first<{ id: string }>()
      if (!row) return null
      return getPublishedPageDoc(row.id)
    } catch {
      return null
    }
  }

  async function listPageDocEntries(): Promise<ContentEntryRow[]> {
    const { results } = await db()
      .prepare(
        `SELECT id, type, slug, title, status, published_revision_id, draft_revision_id
         FROM content_entries WHERE type = 'page_doc' ORDER BY title ASC`,
      )
      .all<ContentEntryRow>()
    return results ?? []
  }

  async function getContentEntryRow(entryId: string): Promise<ContentEntryRow | null> {
    const row = await db()
      .prepare(
        `SELECT id, type, slug, title, status, published_revision_id, draft_revision_id
         FROM content_entries WHERE id = ?`,
      )
      .bind(entryId)
      .first<ContentEntryRow>()
    return row ?? null
  }

  async function getEntryEditorState(
    entryId: string,
  ): Promise<EntryEditorState<TPayload> | null> {
    const entry = await db()
      .prepare(
        `SELECT id, type, slug, title, status, published_revision_id, draft_revision_id, published_at
         FROM content_entries WHERE id = ?`,
      )
      .bind(entryId)
      .first<ContentEntryRow & { published_at: string | null }>()
    if (!entry) return null

    let published: TPayload | null = null
    let draft: TPayload | null = null

    if (entry.published_revision_id) {
      const p = await getRevisionPayloadById(entry.published_revision_id)
      if (p) published = config.parsePayload(JSON.parse(p))
    }

    if (entry.draft_revision_id) {
      const d = await getRevisionPayloadById(entry.draft_revision_id)
      if (d) draft = config.parsePayload(JSON.parse(d))
    }

    const hasDraft = Boolean(entry.draft_revision_id)
    const hasPublished = Boolean(entry.published_revision_id)
    const hasUnpublishedChanges =
      hasDraft &&
      (!hasPublished || entry.draft_revision_id !== entry.published_revision_id)

    return {
      entry,
      published,
      draft,
      meta: {
        entryExists: true,
        hasDraft,
        hasPublished,
        hasUnpublishedChanges,
        publishedAt: entry.published_at ?? null,
      },
    }
  }

  async function nextRevisionVersion(entryId: string): Promise<number> {
    const row = await db()
      .prepare(
        `SELECT COALESCE(MAX(version), 0) AS v FROM content_revisions WHERE entry_id = ?`,
      )
      .bind(entryId)
      .first<{ v: number }>()
    return (row?.v ?? 0) + 1
  }

  async function ensureContentEntry(
    entryId: string,
    type: string,
    title: string,
    slug?: string | null,
  ): Promise<void> {
    const existing = await db()
      .prepare(`SELECT id FROM content_entries WHERE id = ?`)
      .bind(entryId)
      .first()
    if (existing) return

    const now = new Date().toISOString()
    await db()
      .prepare(
        `INSERT INTO content_entries (id, type, slug, title, status, published_revision_id, draft_revision_id, created_at, updated_at, published_at)
         VALUES (?, ?, ?, ?, 'draft', NULL, NULL, ?, ?, NULL)`,
      )
      .bind(entryId, type, slug ?? null, title, now, now)
      .run()
  }

  async function syncContentEntryMetadata(
    entryId: string,
    title: string,
    slug: string | null,
  ): Promise<void> {
    const now = new Date().toISOString()
    await db()
      .prepare(`UPDATE content_entries SET title = ?, slug = ?, updated_at = ? WHERE id = ?`)
      .bind(title, slug, now, entryId)
      .run()
  }

  async function insertDraftRevisionRaw(
    entryId: string,
    payload: unknown,
    message: string,
  ): Promise<void> {
    const id = `rev_${crypto.randomUUID()}`
    const version = await nextRevisionVersion(entryId)
    const payloadStr = JSON.stringify(payload)
    const now = new Date().toISOString()

    await db().batch([
      db()
        .prepare(
          `INSERT INTO content_revisions (id, entry_id, payload, version, created_at, created_by, message)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(id, entryId, payloadStr, version, now, 'admin', message),
      db()
        .prepare(
          `UPDATE content_entries SET draft_revision_id = ?, updated_at = datetime('now') WHERE id = ?`,
        )
        .bind(id, entryId),
    ])
  }

  async function insertDraftRevision(
    entryId: string,
    payload: TPayload,
    message: string,
  ): Promise<void> {
    return insertDraftRevisionRaw(entryId, payload, message)
  }

  async function publishEntry(entryId: string): Promise<{ published: boolean }> {
    const result = await db()
      .prepare(
        `UPDATE content_entries SET
           published_revision_id = draft_revision_id,
           status = 'published',
           published_at = datetime('now'),
           updated_at = datetime('now')
         WHERE id = ? AND draft_revision_id IS NOT NULL`,
      )
      .bind(entryId)
      .run()
    return { published: (result.meta.changes ?? 0) > 0 }
  }

  /** Publish immediately (settings-style entries with no draft step). */
  async function publishOperationalEntry(
    entryId: string,
    payload: TPayload,
    message: string,
  ): Promise<void> {
    const parsed = config.parsePayload(payload)
    if (!parsed) throw new Error('Invalid operational payload')
    const id = `rev_${crypto.randomUUID()}`
    const payloadStr = JSON.stringify(parsed)
    const now = new Date().toISOString()

    await db().batch([
      db()
        .prepare(
          `INSERT INTO content_revisions (id, entry_id, payload, version, created_at, created_by, message)
           VALUES (?, ?, ?, COALESCE((SELECT MAX(version) + 1 FROM content_revisions WHERE entry_id = ?), 1), ?, 'admin', ?)`,
        )
        .bind(id, entryId, payloadStr, entryId, now, message),
      db()
        .prepare(
          `UPDATE content_entries SET
             published_revision_id = ?,
             draft_revision_id = ?,
             status = 'published',
             published_at = datetime('now'),
             updated_at = datetime('now')
           WHERE id = ?`,
        )
        .bind(id, id, entryId),
    ])
  }

  async function savePageDocDraft(
    entryId: string,
    content: Omit<PageDocPayload, 'kind' | 'version'>,
  ): Promise<{ ok: true } | { ok: false; fieldErrors: Record<string, string[]> }> {
    const payload: PageDocPayload = { kind: 'pageDoc', version: 1, ...content }
    const parsed = pageDocPayloadSchema.safeParse(payload)
    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }
    await ensureContentEntry(entryId, 'page_doc', content.title, content.slug || null)
    await db()
      .prepare(`UPDATE content_entries SET type = 'page_doc' WHERE id = ?`)
      .bind(entryId)
      .run()
    await syncContentEntryMetadata(entryId, content.title, content.slug || null)
    await insertDraftRevisionRaw(entryId, parsed.data, 'draft')
    return { ok: true }
  }

  async function getPageDocEditorState(
    entryId: string,
  ): Promise<EntryEditorState<TPayload | PageDocPayload> | null> {
    const row = await getContentEntryRow(entryId)
    if (!row) {
      const fallback = config.defaultPageDocForEntry?.(entryId) ?? null
      if (!fallback) return null
      return {
        entry: {
          id: entryId,
          type: 'page_doc',
          slug: fallback.slug,
          title: fallback.title,
          status: 'draft',
          published_revision_id: null,
          draft_revision_id: null,
        },
        published: null,
        draft: fallback,
        meta: {
          entryExists: false,
          hasDraft: false,
          hasPublished: false,
          hasUnpublishedChanges: false,
          publishedAt: null,
        },
      }
    }

    if (row.type === 'page_doc') {
      return getEntryEditorState(entryId)
    }

    const legacyTypes = new Set(
      config.legacyEntryTypes ?? ['cms_page', 'home_content', 'bio_links', 'events'],
    )
    if (!legacyTypes.has(row.type)) return null

    const state = await getEntryEditorState(entryId)
    if (!state) return null

    const convert = (payload: TPayload | null): PageDocPayload | null => {
      if (!payload) return null
      return config.toPageDoc?.(payload) ?? null
    }

    return {
      ...state,
      published: convert(state.published),
      draft: convert(state.draft),
    }
  }

  async function restoreRevisionAsDraft(
    entryId: string,
    revisionId: string,
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    const row = await db()
      .prepare(`SELECT payload FROM content_revisions WHERE id = ? AND entry_id = ?`)
      .bind(revisionId, entryId)
      .first<{ payload: string }>()
    if (!row) return { ok: false, error: 'Revision not found' }

    const parsed = config.parsePayload(JSON.parse(row.payload))
    if (!parsed) return { ok: false, error: 'Invalid revision payload' }

    await insertDraftRevisionRaw(entryId, parsed, `restore:${revisionId}`)
    return { ok: true }
  }

  async function listRevisionsForEntry(entryId: string): Promise<RevisionListRow[]> {
    const { results } = await db()
      .prepare(
        `SELECT id, version, created_at, message FROM content_revisions
         WHERE entry_id = ? ORDER BY version DESC LIMIT 50`,
      )
      .bind(entryId)
      .all<RevisionListRow>()
    return results ?? []
  }

  async function isPageDocSlugTaken(
    slug: string,
    excludeEntryId?: string,
  ): Promise<boolean> {
    const row = await db()
      .prepare(`SELECT id FROM content_entries WHERE slug = ? LIMIT 1`)
      .bind(slug)
      .first<{ id: string }>()
    if (!row) return false
    if (excludeEntryId && row.id === excludeEntryId) return false
    return true
  }

  async function createPageDocEntry(input: {
    title: string
    slug: string
  }): Promise<{ ok: true; entryId: string } | { ok: false; error: string }> {
    const slugError = config.validateNewPageSlug(input.slug)
    if (slugError) return { ok: false, error: slugError }

    const slug = input.slug.replace(/^\/+|\/+$/g, '')
    if (await isPageDocSlugTaken(slug)) {
      return { ok: false, error: 'A page with this slug already exists.' }
    }

    let entryId = config.entryIdFromPageSlug(slug)
    if (await getContentEntryRow(entryId)) {
      entryId = `${entryId}-${crypto.randomUUID().slice(0, 6)}`
    }

    const content = config.newPageDoc({ title: input.title, slug })
    const payload: PageDocPayload = { kind: 'pageDoc', version: 1, ...content }
    const parsed = pageDocPayloadSchema.safeParse(payload)
    if (!parsed.success) {
      return { ok: false, error: 'Could not create page defaults.' }
    }

    const now = new Date().toISOString()
    await db()
      .prepare(
        `INSERT INTO content_entries (id, type, slug, title, status, published_revision_id, draft_revision_id, created_at, updated_at, published_at)
         VALUES (?, 'page_doc', ?, ?, 'draft', NULL, NULL, ?, ?, NULL)`,
      )
      .bind(entryId, slug, input.title.trim(), now, now)
      .run()

    await insertDraftRevisionRaw(entryId, parsed.data, 'create')
    return { ok: true, entryId }
  }

  async function listPageDocEntriesWithStatus(): Promise<PageDocListRow[]> {
    const entries = await listPageDocEntries()
    return entries.map((entry) => {
      const hasDraft = Boolean(entry.draft_revision_id)
      const hasPublished = Boolean(entry.published_revision_id)
      const hasUnpublishedChanges =
        hasDraft && (!hasPublished || entry.draft_revision_id !== entry.published_revision_id)

      let statusLabel = 'Empty entry'
      if (hasUnpublishedChanges) statusLabel = 'Draft (unpublished changes)'
      else if (hasPublished) statusLabel = 'Published'
      else if (hasDraft) statusLabel = 'Draft only'

      return { ...entry, statusLabel }
    })
  }

  // ---------------------------------------------------------------- media --

  async function listMediaAssets(limit = 50): Promise<MediaAssetRow[]> {
    const { results } = await db()
      .prepare(
        `SELECT id, r2_key, filename, mime, size_bytes, width, height, alt, created_at
         FROM media_assets ORDER BY created_at DESC LIMIT ?`,
      )
      .bind(limit)
      .all<MediaAssetRow>()
    return results ?? []
  }

  async function getMediaAssetByKey(r2Key: string): Promise<MediaAssetRow | null> {
    const row = await db()
      .prepare(`SELECT * FROM media_assets WHERE r2_key = ? LIMIT 1`)
      .bind(r2Key)
      .first<MediaAssetRow>()
    return row ?? null
  }

  async function uploadMediaAsset(input: {
    filename: string
    mime: string
    bytes: ArrayBuffer
    alt: string
    width?: number
    height?: number
  }): Promise<{ ok: true; asset: MediaAssetRow } | { ok: false; error: string }> {
    const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
    const MAX_BYTES = 5 * 1024 * 1024

    if (!ALLOWED_MIME.has(input.mime)) {
      return { ok: false, error: 'Unsupported file type. Use JPEG, PNG, WebP, or GIF.' }
    }
    if (input.bytes.byteLength > MAX_BYTES) {
      return { ok: false, error: 'File too large (max 5 MB).' }
    }
    if (!input.alt.trim()) {
      return { ok: false, error: 'Alt text is required.' }
    }

    const id = `media_${crypto.randomUUID()}`
    const ext = input.filename.split('.').pop()?.toLowerCase() ?? 'bin'
    const r2Key = `${id}.${ext}`

    await mediaBucket().put(r2Key, input.bytes, {
      httpMetadata: { contentType: input.mime },
    })

    const now = new Date().toISOString()
    await db()
      .prepare(
        `INSERT INTO media_assets (id, r2_key, filename, mime, size_bytes, width, height, alt, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        r2Key,
        input.filename,
        input.mime,
        input.bytes.byteLength,
        input.width ?? null,
        input.height ?? null,
        input.alt.trim(),
        now,
      )
      .run()

    return {
      ok: true,
      asset: {
        id,
        r2_key: r2Key,
        filename: input.filename,
        mime: input.mime,
        size_bytes: input.bytes.byteLength,
        width: input.width ?? null,
        height: input.height ?? null,
        alt: input.alt.trim(),
        created_at: now,
      },
    }
  }

  async function streamMediaFromR2(r2Key: string): Promise<Response | null> {
    const object = await mediaBucket().get(r2Key)
    if (!object) return null

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('ETag', object.httpEtag)

    return new Response(object.body, { headers })
  }

  return {
    listContentEntries,
    getPublishedPayloadJson,
    getPublishedPageDoc,
    getPublishedPageDocBySlug,
    listPageDocEntries,
    listPageDocEntriesWithStatus,
    getContentEntryRow,
    getEntryEditorState,
    getPageDocEditorState,
    ensureContentEntry,
    syncContentEntryMetadata,
    insertDraftRevision,
    publishEntry,
    publishOperationalEntry,
    savePageDocDraft,
    restoreRevisionAsDraft,
    listRevisionsForEntry,
    isPageDocSlugTaken,
    createPageDocEntry,
    listMediaAssets,
    getMediaAssetByKey,
    uploadMediaAsset,
    streamMediaFromR2,
  }
}

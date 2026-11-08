import { CmsRevisionConflictError, CmsPublishedSlugConflictError, publishedPageSlug } from '@chester-hill-solutions/cms-store';
/**
 * The application owns the clock. SQLite's `datetime('now')` returns
 * `YYYY-MM-DD HH:MM:SS`, which is not the ISO 8601 text the other rows in the same
 * table hold, so a column written that way is not comparable with one written here.
 * `cms-store-postgres` resolves its timestamps the same way; see `isoNow` there.
 */
function isoNow() {
    return new Date().toISOString();
}
/**
 * @param getDb the D1 binding. Typed as `D1Executor` — the slice of the binding API this
 *   file actually calls — rather than `D1Database`, so the local SQLite adapter used by the
 *   tests satisfies the same contract instead of being cast into it. See `d1-executor.ts`.
 */
// Same normalized identity as publishedPageSlug for ordinary routes; conservative
// reservations also tolerate malformed historical strings. CASE protects every
// JSON extraction from corrupt historical payloads. The guarded write runs in SQLite's
// serialized write transaction, not after a separate application-level collision check.
const NO_PUBLISHED_SLUG_COLLISION = `NOT EXISTS (
  SELECT 1 FROM content_entries other
  JOIN content_revisions r ON r.id = other.published_revision_id AND r.entry_id = other.id
  WHERE other.id <> ? AND
    CASE WHEN json_valid(r.payload) THEN
      CASE WHEN json_extract(r.payload, '$.kind') = 'pageDoc'
        AND json_extract(r.payload, '$.version') = 1
        AND json_type(r.payload, '$.slug') = 'text'
      THEN CASE WHEN other.id = ? THEN '' ELSE trim(json_extract(r.payload, '$.slug'), '/') END END
    END = ?
)`;
export function createD1Persistence(getDb) {
    const db = getDb;
    return {
        // --- content entries + revisions ---
        async listContentEntries() {
            const { results } = await db()
                .prepare(`SELECT id, type, slug, title, status, published_revision_id, draft_revision_id
           FROM content_entries ORDER BY id ASC`)
                .all();
            return results ?? [];
        },
        async getRevisionPayloadById(id) {
            const row = await db()
                .prepare(`SELECT payload FROM content_revisions WHERE id = ?`)
                .bind(id)
                .first();
            return row?.payload ?? null;
        },
        async getPublishedPayloadJson(entryId) {
            const row = await db()
                .prepare(`SELECT r.payload AS payload
           FROM content_entries e
           JOIN content_revisions r ON r.id = e.published_revision_id AND r.entry_id = e.id
           WHERE e.id = ?`)
                .bind(entryId)
                .first();
            return row?.payload ?? null;
        },
        async listPublishedPagePayloads(filter) {
            const query = `SELECT e.id AS entryId, r.id AS revisionId, e.published_at AS publishedAt, r.payload, r.listing_snapshot_json AS listingSnapshotJson
        FROM content_entries e JOIN content_revisions r
          ON r.id = e.published_revision_id AND r.entry_id = e.id`;
            const predicate = ` WHERE CASE WHEN json_valid(r.payload) THEN
        CASE WHEN json_type(r.payload, '$.slug') = 'text'
          THEN CASE WHEN e.id = ? THEN '' ELSE trim(json_extract(r.payload, '$.slug'), '/') END
        END END = ?`;
            const statement = filter
                ? db().prepare(query + predicate + ` ORDER BY e.id ASC`).bind(filter.homeEntryId ?? null, filter.slug)
                : db().prepare(query + ` ORDER BY e.id ASC`);
            const { results } = await statement.all();
            return results ?? [];
        },
        async getPageDocEntryIdBySlug(slug) {
            const row = await db()
                .prepare(`SELECT id FROM content_entries WHERE type = 'page_doc' AND slug = ? LIMIT 1`)
                .bind(slug)
                .first();
            return row?.id ?? null;
        },
        async getContentEntryRow(entryId) {
            const row = await db()
                .prepare(`SELECT id, type, slug, title, status, published_revision_id, draft_revision_id
           FROM content_entries WHERE id = ?`)
                .bind(entryId)
                .first();
            return row ?? null;
        },
        async getContentEntryWithPublishedAt(entryId) {
            const row = await db()
                .prepare(`SELECT id, type, slug, title, status, published_revision_id, draft_revision_id, published_at
           FROM content_entries WHERE id = ?`)
                .bind(entryId)
                .first();
            return row ?? null;
        },
        async listPageDocEntries() {
            const { results } = await db()
                .prepare(`SELECT id, type, slug, title, status, published_revision_id, draft_revision_id,
                  published_at, updated_at
           FROM content_entries WHERE type = 'page_doc' ORDER BY title ASC`)
                .all();
            return results ?? [];
        },
        async contentEntryExists(entryId) {
            const row = await db()
                .prepare(`SELECT id FROM content_entries WHERE id = ?`)
                .bind(entryId)
                .first();
            return Boolean(row);
        },
        async nextRevisionVersion(entryId) {
            const row = await db()
                .prepare(`SELECT COALESCE(MAX(version), 0) AS v FROM content_revisions WHERE entry_id = ?`)
                .bind(entryId)
                .first();
            return (row?.v ?? 0) + 1;
        },
        async insertContentEntry(row) {
            await db()
                .prepare(`INSERT INTO content_entries (id, type, slug, title, status, published_revision_id, draft_revision_id, created_at, updated_at, published_at)
           VALUES (?, ?, ?, ?, 'draft', NULL, NULL, ?, ?, NULL)`)
                .bind(row.id, row.type, row.slug, row.title, row.created_at, row.updated_at)
                .run();
        },
        async updateContentEntryMetadata(entryId, title, slug, updatedAt) {
            await db()
                .prepare(`UPDATE content_entries SET title = ?, slug = ?, updated_at = ? WHERE id = ?`)
                .bind(title, slug, updatedAt, entryId)
                .run();
        },
        async setContentEntryType(entryId, type) {
            if (type === 'page_doc') {
                await db()
                    .prepare(`UPDATE content_entries SET type = 'page_doc' WHERE id = ?`)
                    .bind(entryId)
                    .run();
                return;
            }
            await db()
                .prepare(`UPDATE content_entries SET type = ? WHERE id = ?`)
                .bind(type, entryId)
                .run();
        },
        async insertRevisionAndSetDraft(rev, entryId, updatedAt, expectedRevisionId, metadata) {
            const results = await db().batch([
                db().prepare(`INSERT INTO content_revisions (id, entry_id, payload, listing_snapshot_json, version, created_at, created_by, message)
          SELECT ?, ?, ?, ?, COALESCE((SELECT MAX(version) + 1 FROM content_revisions WHERE entry_id = ?), 1), ?, ?, ?
          FROM content_entries WHERE id = ? AND draft_revision_id IS ?`)
                    .bind(rev.id, entryId, rev.payload, rev.listing_snapshot_json, entryId, rev.created_at, rev.created_by, rev.message, entryId, expectedRevisionId),
                db().prepare(`UPDATE content_entries SET draft_revision_id = ?, updated_at = ?,
          type = CASE WHEN ? THEN ? ELSE type END,
          title = CASE WHEN ? THEN ? ELSE title END,
          slug = CASE WHEN ? THEN ? ELSE slug END
          WHERE id = ? AND EXISTS (SELECT 1 FROM content_revisions WHERE id = ? AND entry_id = ?)`)
                    .bind(rev.id, updatedAt, metadata ? 1 : 0, metadata?.type ?? null, metadata ? 1 : 0, metadata?.title ?? null, metadata ? 1 : 0, metadata?.slug ?? null, entryId, rev.id, entryId),
            ]);
            return { changes: results[0]?.meta.changes ?? 0 };
        },
        async publishEntry(entryId, expectedRevisionId, context) {
            const revision = await db().prepare(`SELECT payload, listing_snapshot_json AS listingSnapshotJson FROM content_revisions WHERE id = ? AND entry_id = ?`)
                .bind(expectedRevisionId, entryId).first();
            const slug = revision ? publishedPageSlug(entryId, revision.payload, context?.homeEntryId) : null;
            const now = isoNow();
            const results = await db().batch([
                db().prepare(`UPDATE content_entries SET
          published_revision_id = ?, status = 'published', published_at = ?, updated_at = ?
          WHERE id = ? AND draft_revision_id = ?
            AND EXISTS (SELECT 1 FROM content_revisions WHERE id = ? AND entry_id = ?)
            AND (? IS NULL OR ${NO_PUBLISHED_SLUG_COLLISION})`)
                    .bind(expectedRevisionId, now, now, entryId, expectedRevisionId, expectedRevisionId, entryId, slug, entryId, context?.homeEntryId ?? null, slug),
                db().prepare(`SELECT draft_revision_id FROM content_entries WHERE id = ?`).bind(entryId),
            ]);
            const changes = results[0]?.meta.changes ?? 0;
            const current = results[1]?.results[0];
            if (!changes && revision && slug !== null && current?.draft_revision_id === expectedRevisionId) {
                throw new CmsPublishedSlugConflictError();
            }
            return { changes };
        },
        async publishOperationalEntry(entryId, rev, context) {
            if (context && 'expectedDraftRevisionId' in context && context.expectedDraftRevisionId === undefined)
                throw new CmsRevisionConflictError();
            const now = isoNow();
            const slug = publishedPageSlug(entryId, rev.payload, context?.homeEntryId);
            const results = await db().batch([
                db().prepare(`INSERT INTO content_revisions (id, entry_id, payload, listing_snapshot_json, version, created_at, created_by, message)
          SELECT ?, ?, ?, ?, COALESCE((SELECT MAX(version) + 1 FROM content_revisions WHERE entry_id = ?), 1), ?, ?, ?
          FROM content_entries WHERE id = ? AND (? = 0 OR draft_revision_id IS ?)
            AND (? IS NULL OR ${NO_PUBLISHED_SLUG_COLLISION})`)
                    .bind(rev.id, entryId, rev.payload, rev.listing_snapshot_json, entryId, rev.created_at, rev.created_by, rev.message, entryId, context && 'expectedDraftRevisionId' in context ? 1 : 0, context?.expectedDraftRevisionId ?? null, slug, entryId, context?.homeEntryId ?? null, slug),
                db().prepare(`UPDATE content_entries SET published_revision_id = ?, draft_revision_id = ?,
          status = 'published', published_at = ?, updated_at = ?
          WHERE id = ? AND EXISTS (SELECT 1 FROM content_revisions WHERE id = ? AND entry_id = ?)`)
                    .bind(rev.id, rev.id, now, now, entryId, rev.id, entryId),
                db().prepare(`SELECT id, draft_revision_id FROM content_entries WHERE id = ?`).bind(entryId),
            ]);
            if (!(results[0]?.meta.changes)) {
                if (!(results[2]?.results.length))
                    throw new Error('Operational entry not found');
                const current = results[2]?.results[0];
                if (context && 'expectedDraftRevisionId' in context && current?.draft_revision_id !== context.expectedDraftRevisionId)
                    throw new CmsRevisionConflictError();
                if (slug !== null)
                    throw new CmsPublishedSlugConflictError();
                throw new Error('Operational publication failed');
            }
        },
        async getRevisionForEntry(entryId, revisionId) {
            const row = await db()
                .prepare(`SELECT payload, listing_snapshot_json AS listingSnapshotJson FROM content_revisions WHERE id = ? AND entry_id = ?`)
                .bind(revisionId, entryId)
                .first();
            return row ?? null;
        },
        async listRevisionsForEntry(entryId) {
            const { results } = await db()
                .prepare(`SELECT id, version, created_at, message FROM content_revisions
           WHERE entry_id = ? ORDER BY version DESC LIMIT 50`)
                .bind(entryId)
                .all();
            return results ?? [];
        },
        async isSlugTaken(slug) {
            const row = await db()
                .prepare(`SELECT id FROM content_entries WHERE slug = ? LIMIT 1`)
                .bind(slug)
                .first();
            return row ?? null;
        },
        async insertPageDocEntry(row) {
            await db()
                .prepare(`INSERT INTO content_entries (id, type, slug, title, status, published_revision_id, draft_revision_id, created_at, updated_at, published_at)
           VALUES (?, 'page_doc', ?, ?, 'draft', NULL, NULL, ?, ?, NULL)`)
                .bind(row.id, row.slug, row.title, row.created_at, row.updated_at)
                .run();
        },
        // --- media assets ---
        async listMediaAssets(limit) {
            const { results } = await db()
                .prepare(`SELECT id, r2_key, filename, mime, size_bytes, width, height, alt, created_at
           FROM media_assets ORDER BY created_at DESC LIMIT ?`)
                .bind(limit)
                .all();
            return results ?? [];
        },
        async getMediaAssetByKey(key) {
            const row = await db()
                .prepare(`SELECT * FROM media_assets WHERE r2_key = ? LIMIT 1`)
                .bind(key)
                .first();
            return row ?? null;
        },
        async insertMediaAsset(row) {
            await db()
                .prepare(`INSERT INTO media_assets (id, r2_key, filename, mime, size_bytes, width, height, alt, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
                .bind(row.id, row.r2_key, row.filename, row.mime, row.size_bytes, row.width, row.height, row.alt, row.created_at)
                .run();
        },
        // --- taxonomy: collections ---
        async listCollections() {
            const { results } = await db()
                .prepare(`SELECT id, label, description, created_at, updated_at
           FROM cms_collections ORDER BY label ASC`)
                .all();
            return results ?? [];
        },
        async getCollection(id) {
            const row = await db()
                .prepare(`SELECT id, label, description, created_at, updated_at
           FROM cms_collections WHERE id = ?`)
                .bind(id)
                .first();
            return row ?? null;
        },
        async insertCollection(row) {
            await db()
                .prepare(`INSERT INTO cms_collections (id, label, description, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?)`)
                .bind(row.id, row.label, row.description, row.created_at, row.updated_at)
                .run();
        },
        async updateCollection(id, patch, updatedAt) {
            await db()
                .prepare(`UPDATE cms_collections SET
             label = COALESCE(?, label),
             description = COALESCE(?, description),
             updated_at = ?
           WHERE id = ?`)
                .bind(patch.label ?? null, patch.description ?? null, updatedAt, id)
                .run();
        },
        async deleteCollection(id) {
            await db().prepare(`DELETE FROM cms_collections WHERE id = ?`).bind(id).run();
        },
        // --- taxonomy: categories ---
        async listCollectionCategories(collectionId) {
            const { results } = await db()
                .prepare(`SELECT id, collection_id, label, slug, description, sort_order
           FROM cms_collection_categories WHERE collection_id = ? ORDER BY sort_order ASC`)
                .bind(collectionId)
                .all();
            return results ?? [];
        },
        async getCollectionCategory(id) {
            const row = await db()
                .prepare(`SELECT id, collection_id, label, slug, description, sort_order
           FROM cms_collection_categories WHERE id = ?`)
                .bind(id)
                .first();
            return row ?? null;
        },
        async insertCollectionCategory(row) {
            await db()
                .prepare(`INSERT INTO cms_collection_categories (id, collection_id, label, slug, description, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`)
                .bind(row.id, row.collection_id, row.label, row.slug, row.description, row.sort_order)
                .run();
        },
        async updateCollectionCategory(id, patch) {
            await db()
                .prepare(`UPDATE cms_collection_categories SET
             label = COALESCE(?, label),
             slug = COALESCE(?, slug),
             description = COALESCE(?, description),
             sort_order = COALESCE(?, sort_order)
           WHERE id = ?`)
                .bind(patch.label ?? null, patch.slug ?? null, patch.description ?? null, patch.sortOrder ?? null, id)
                .run();
        },
        async deleteCollectionCategory(id) {
            await db().prepare(`DELETE FROM cms_collection_categories WHERE id = ?`).bind(id).run();
        },
        // --- taxonomy: tags ---
        async listTags() {
            const { results } = await db()
                .prepare(`SELECT id, label, slug, description
           FROM cms_tags ORDER BY label ASC`)
                .all();
            return results ?? [];
        },
        async getTag(id) {
            const row = await db()
                .prepare(`SELECT id, label, slug, description FROM cms_tags WHERE id = ?`)
                .bind(id)
                .first();
            return row ?? null;
        },
        async insertTag(row) {
            await db()
                .prepare(`INSERT INTO cms_tags (id, label, slug, description) VALUES (?, ?, ?, ?)`)
                .bind(row.id, row.label, row.slug, row.description)
                .run();
        },
        async updateTag(id, patch) {
            await db()
                .prepare(`UPDATE cms_tags SET
             label = COALESCE(?, label),
             slug = COALESCE(?, slug),
             description = COALESCE(?, description)
           WHERE id = ?`)
                .bind(patch.label ?? null, patch.slug ?? null, patch.description ?? null, id)
                .run();
        },
        async deleteTag(id) {
            await db().prepare(`DELETE FROM cms_tags WHERE id = ?`).bind(id).run();
        },
        // --- taxonomy: collection fields ---
        async listCollectionFields(collectionId) {
            const { results } = await db()
                .prepare(`SELECT id, collection_id, key, label, type, required, config_json, sort_order
           FROM cms_collection_fields WHERE collection_id = ? ORDER BY sort_order ASC`)
                .bind(collectionId)
                .all();
            return results ?? [];
        },
        async getCollectionField(id) {
            const row = await db()
                .prepare(`SELECT id, collection_id, key, label, type, required, config_json, sort_order
           FROM cms_collection_fields WHERE id = ?`)
                .bind(id)
                .first();
            return row ?? null;
        },
        async insertCollectionField(row) {
            await db()
                .prepare(`INSERT INTO cms_collection_fields (id, collection_id, key, label, type, required, config_json, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
                .bind(row.id, row.collection_id, row.key, row.label, row.type, row.required, row.config_json, row.sort_order)
                .run();
        },
        async updateCollectionField(id, patch) {
            await db()
                .prepare(`UPDATE cms_collection_fields SET
             key = COALESCE(?, key),
             label = COALESCE(?, label),
             type = COALESCE(?, type),
             required = COALESCE(?, required),
             config_json = COALESCE(?, config_json),
             sort_order = COALESCE(?, sort_order)
           WHERE id = ?`)
                .bind(patch.key ?? null, patch.label ?? null, patch.type ?? null, patch.required ?? null, patch.configJson ?? null, patch.sortOrder ?? null, id)
                .run();
        },
        async deleteCollectionField(id) {
            await db().prepare(`DELETE FROM cms_collection_fields WHERE id = ?`).bind(id).run();
        },
        // --- taxonomy: entry assignments, tags, metadata ---
        async upsertEntryCollectionAssignment(row) {
            await db()
                .prepare(`INSERT OR REPLACE INTO cms_entry_collections
             (entry_id, collection_id, category_id, featured, sort_date)
           VALUES (?, ?, ?, ?, ?)`)
                .bind(row.entry_id, row.collection_id, row.category_id, row.featured, row.sort_date)
                .run();
        },
        async deleteEntryCollectionAssignment(entryId, collectionId) {
            await db()
                .prepare(`DELETE FROM cms_entry_collections WHERE entry_id = ? AND collection_id = ?`)
                .bind(entryId, collectionId)
                .run();
        },
        async getEntryCollectionAssignment(entryId, collectionId) {
            const row = await db()
                .prepare(`SELECT entry_id, collection_id, category_id, featured, sort_date
           FROM cms_entry_collections WHERE entry_id = ? AND collection_id = ?`)
                .bind(entryId, collectionId)
                .first();
            return row ?? null;
        },
        async listEntriesByCollection(collectionId, options) {
            let sql = `SELECT e.id, e.type, e.slug, e.title, e.status, e.published_revision_id, e.draft_revision_id
                 FROM content_entries e
                 JOIN cms_entry_collections ec ON ec.entry_id = e.id
                 WHERE ec.collection_id = ?`;
            const binds = [collectionId];
            if ((options?.status ?? 'published') === 'published') {
                sql += ` AND e.status = 'published' AND e.published_revision_id IS NOT NULL`;
            }
            if (options?.categoryId) {
                sql += ` AND ec.category_id = ?`;
                binds.push(options.categoryId);
            }
            if (options?.featured !== undefined) {
                sql += ` AND ec.featured = ?`;
                binds.push(options.featured);
            }
            sql += ` ORDER BY ec.sort_date DESC, e.title ASC`;
            const { results } = await db().prepare(sql).bind(...binds).all();
            return results ?? [];
        },
        async insertEntryTag(entryId, tagId) {
            await db()
                .prepare(`INSERT OR IGNORE INTO cms_entry_tags (entry_id, tag_id) VALUES (?, ?)`)
                .bind(entryId, tagId)
                .run();
        },
        async deleteEntryTag(entryId, tagId) {
            await db()
                .prepare(`DELETE FROM cms_entry_tags WHERE entry_id = ? AND tag_id = ?`)
                .bind(entryId, tagId)
                .run();
        },
        async listTagsForEntry(entryId) {
            const { results } = await db()
                .prepare(`SELECT t.id, t.label, t.slug, t.description
           FROM cms_tags t
           JOIN cms_entry_tags et ON et.tag_id = t.id
           WHERE et.entry_id = ? ORDER BY t.label ASC`)
                .bind(entryId)
                .all();
            return results ?? [];
        },
        async listEntriesByTag(tagId) {
            const { results } = await db()
                .prepare(`SELECT e.id, e.type, e.slug, e.title, e.status, e.published_revision_id, e.draft_revision_id
           FROM content_entries e
           JOIN cms_entry_tags et ON et.entry_id = e.id
           WHERE et.tag_id = ? ORDER BY e.title ASC`)
                .bind(tagId)
                .all();
            return results ?? [];
        },
        async upsertEntryMetadataValue(entryId, collectionId, fieldKey, valueJson) {
            await db()
                .prepare(`INSERT OR REPLACE INTO cms_entry_metadata_values
             (entry_id, collection_id, field_key, value_json)
           VALUES (?, ?, ?, ?)`)
                .bind(entryId, collectionId, fieldKey, valueJson)
                .run();
        },
        async listEntryMetadataValues(entryId, collectionId) {
            const { results } = await db()
                .prepare(`SELECT field_key, value_json
           FROM cms_entry_metadata_values
           WHERE entry_id = ? AND collection_id = ?`)
                .bind(entryId, collectionId)
                .all();
            return results ?? [];
        },
        async deleteEntryMetadataValue(entryId, collectionId, fieldKey) {
            await db()
                .prepare(`DELETE FROM cms_entry_metadata_values
           WHERE entry_id = ? AND collection_id = ? AND field_key = ?`)
                .bind(entryId, collectionId, fieldKey)
                .run();
        },
        // --- analytics ---
        async getAnalyticsConfigJson() {
            const row = await db()
                .prepare(`SELECT config_json FROM analytics_config WHERE id = 1`)
                .first();
            return row?.config_json ?? null;
        },
        async setAnalyticsConfigJson(configJson, updatedAt) {
            await db()
                .prepare(`INSERT OR REPLACE INTO analytics_config (id, config_json, updated_at)
           VALUES (?, ?, ?)`)
                .bind(1, configJson, updatedAt)
                .run();
        },
        // --- site theme ---
        async getSiteThemeJson() {
            const row = await db()
                .prepare(`SELECT theme_json FROM site_theme WHERE id = 1`)
                .first();
            return row?.theme_json ?? null;
        },
        async setSiteThemeJson(themeJson, updatedAt) {
            await db()
                .prepare(`INSERT OR REPLACE INTO site_theme (id, theme_json, updated_at)
           VALUES (?, ?, ?)`)
                .bind(1, themeJson, updatedAt)
                .run();
        },
        // --- forms ---
        async listFormDefinitions() {
            const { results } = await db()
                .prepare(`SELECT * FROM form_definitions ORDER BY title ASC`)
                .all();
            return results ?? [];
        },
        async getFormDefinition(id) {
            const row = await db()
                .prepare(`SELECT * FROM form_definitions WHERE id = ?`)
                .bind(id)
                .first();
            return row ?? null;
        },
        async insertFormDefinition(row) {
            await db()
                .prepare(`INSERT INTO form_definitions (id, title, description, fields_json, settings_json, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`)
                .bind(row.id, row.title, row.description, row.fields_json, row.settings_json, row.created_at, row.updated_at)
                .run();
        },
        async updateFormDefinition(id, patch, updatedAt) {
            const sets = ['updated_at = ?'];
            const binds = [updatedAt];
            if (patch.title !== undefined) {
                sets.push('title = ?');
                binds.push(patch.title);
            }
            if (patch.description !== undefined) {
                sets.push('description = ?');
                binds.push(patch.description);
            }
            if (patch.fieldsJson !== undefined) {
                sets.push('fields_json = ?');
                binds.push(patch.fieldsJson);
            }
            if (patch.settingsJson !== undefined) {
                sets.push('settings_json = ?');
                binds.push(patch.settingsJson);
            }
            binds.push(id);
            await db()
                .prepare(`UPDATE form_definitions SET ${sets.join(', ')} WHERE id = ?`)
                .bind(...binds)
                .run();
        },
        async deleteFormDefinition(id) {
            await db().prepare(`DELETE FROM form_definitions WHERE id = ?`).bind(id).run();
        },
        async insertFormResponse(row) {
            await db()
                .prepare(`INSERT INTO form_responses (id, form_id, data_json, submitted_at, ip, spam)
           VALUES (?, ?, ?, ?, ?, ?)`)
                .bind(row.id, row.form_id, row.data_json, row.submitted_at, row.ip, row.spam)
                .run();
        },
        async countRecentFormResponses(ip, windowSeconds) {
            // Both sides of this comparison must be the same text format. `submitted_at` holds
            // the caller's ISO 8601 value, so the bound is computed here in the same format
            // rather than by `datetime('now', '-N seconds')`, which returns
            // `YYYY-MM-DD HH:MM:SS`. Comparing those two sorts on the space at index 10 and
            // reduces the window to a calendar day. See docs/PACKAGE-CONVENTIONS.md.
            const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
            const recent = await db()
                .prepare(`SELECT COUNT(*) as cnt FROM form_responses
           WHERE ip = ? AND submitted_at > ?`)
                .bind(ip, since)
                .first();
            return recent?.cnt ?? 0;
        },
        async listFormResponses(formId) {
            const { results } = await db()
                .prepare(`SELECT * FROM form_responses WHERE form_id = ? ORDER BY submitted_at DESC`)
                .bind(formId)
                .all();
            return results ?? [];
        },
        async getFormResponse(id) {
            const row = await db()
                .prepare(`SELECT * FROM form_responses WHERE id = ?`)
                .bind(id)
                .first();
            return row ?? null;
        },
        async deleteFormResponse(id) {
            await db().prepare(`DELETE FROM form_responses WHERE id = ?`).bind(id).run();
        },
    };
}

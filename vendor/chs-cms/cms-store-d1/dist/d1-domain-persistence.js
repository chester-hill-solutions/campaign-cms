/** Column list, written once so a `SELECT *` cannot pick up a column the row type lacks. */
const ENTRY_COLUMNS = `id, content_type, slug, locale, title, status,
  draft_revision_id, published_revision_id, created_at, updated_at, published_at`;
const REVISION_COLUMNS = `id, entry_id, version, locale, title, payload,
  author_email, created_at, message`;
/**
 * D1 implementation of the typed domain-content port.
 *
 * Three things differ from `createD1Persistence`, and each is deliberate.
 *
 * **Timestamps are numbers.** These tables store INTEGER epoch milliseconds, so
 * nothing here formats a date. The clock belongs to the caller (`cms-store` passes
 * epoch milliseconds in), which is the same rule the page persistence follows with
 * `isoNow` for a different column type.
 *
 * **Slug lookups are case-insensitive.** The table's UNIQUE constraint is
 * case-sensitive in SQLite, so `Black-Gold` and `black-gold` could both be stored.
 * Every read here compares with `COLLATE NOCASE` and `createDomainStore` refuses a
 * duplicate before inserting, which makes the two agree on what "taken" means. The
 * constraint remains the backstop for a write that races the check.
 *
 * **Multi-row writes use `batch`.** D1 runs a batch as one implicit transaction, so
 * an entry cannot exist without its first revision.
 */
export function createD1DomainPersistence(getDb) {
    const db = getDb;
    /** Bind only when there is something to bind: `bind()` with no arguments is not free. */
    const query = (sql, binds) => {
        const statement = db().prepare(sql);
        return (binds.length > 0 ? statement.bind(...binds) : statement).all();
    };
    return {
        async listDomainEntries(options = {}) {
            const conditions = [];
            const binds = [];
            if (options.contentType) {
                conditions.push('content_type = ?');
                binds.push(options.contentType);
            }
            if (options.status) {
                conditions.push('status = ?');
                binds.push(options.status);
            }
            if (options.locale) {
                conditions.push('locale = ?');
                binds.push(options.locale);
            }
            const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
            const { results } = await query(`SELECT ${ENTRY_COLUMNS} FROM cms_content_entries${where} ORDER BY slug ASC`, binds);
            return results ?? [];
        },
        async getDomainEntryById(entryId) {
            const row = await db()
                .prepare(`SELECT ${ENTRY_COLUMNS} FROM cms_content_entries WHERE id = ?`)
                .bind(entryId)
                .first();
            return row ?? null;
        },
        async getDomainEntryBySlug(contentType, slug, locale) {
            const row = await db()
                .prepare(`SELECT ${ENTRY_COLUMNS} FROM cms_content_entries
           WHERE content_type = ? AND slug = ? COLLATE NOCASE AND locale = ?`)
                .bind(contentType, slug, locale)
                .first();
            return row ?? null;
        },
        async findDomainSlugOwner(contentType, slug, locale) {
            const row = await db()
                .prepare(`SELECT id FROM cms_content_entries
           WHERE content_type = ? AND slug = ? COLLATE NOCASE AND locale = ?`)
                .bind(contentType, slug, locale)
                .first();
            return row ?? null;
        },
        async insertDomainEntry(row) {
            await db()
                .prepare(`INSERT INTO cms_content_entries
             (id, content_type, slug, locale, title, status, draft_revision_id,
              published_revision_id, created_at, updated_at, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
                .bind(row.id, row.content_type, row.slug, row.locale, row.title, row.status, row.draft_revision_id, row.published_revision_id, row.created_at, row.updated_at, row.published_at)
                .run();
        },
        async setDomainDraftPointer(entryId, revisionId, title, updatedAt) {
            await db()
                .prepare(`UPDATE cms_content_entries SET draft_revision_id = ?, title = ?, updated_at = ?
           WHERE id = ?`)
                .bind(revisionId, title, updatedAt, entryId)
                .run();
        },
        async publishDomainEntry(entryId, revisionId, updatedAt) {
            await db()
                .prepare(`UPDATE cms_content_entries SET
             published_revision_id = ?, status = 'published', published_at = ?, updated_at = ?
           WHERE id = ?`)
                .bind(revisionId, updatedAt, updatedAt, entryId)
                .run();
        },
        async unpublishDomainEntry(entryId, updatedAt) {
            // The published revision is deliberately left in place: unpublishing takes the
            // record off the site, it does not discard what was published.
            await db()
                .prepare(`UPDATE cms_content_entries SET status = 'draft', updated_at = ? WHERE id = ?`)
                .bind(updatedAt, entryId)
                .run();
        },
        async getDomainRevision(entryId, revisionId) {
            const row = await db()
                .prepare(`SELECT ${REVISION_COLUMNS} FROM cms_content_revisions WHERE entry_id = ? AND id = ?`)
                .bind(entryId, revisionId)
                .first();
            return row ?? null;
        },
        async listDomainRevisions(entryId) {
            const { results } = await db()
                .prepare(`SELECT id, version, created_at, message, author_email AS author
           FROM cms_content_revisions WHERE entry_id = ? ORDER BY version DESC`)
                .bind(entryId)
                .all();
            return results ?? [];
        },
        async nextDomainRevisionVersion(entryId) {
            const row = await db()
                .prepare(`SELECT COALESCE(MAX(version), 0) + 1 AS version FROM cms_content_revisions WHERE entry_id = ?`)
                .bind(entryId)
                .first();
            return row?.version ?? 1;
        },
        async insertDomainRevision(row) {
            await db()
                .prepare(`INSERT INTO cms_content_revisions
             (id, entry_id, version, locale, title, payload, author_email, created_at, message)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
                .bind(row.id, row.entry_id, row.version, row.locale, row.title, row.payload, row.author_email, row.created_at, row.message)
                .run();
        },
        async upsertDomainTranslation(row) {
            await db()
                .prepare(`INSERT INTO cms_domain_translations
             (entry_id, locale, translation_group_id, state, updated_at)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT (entry_id, locale) DO UPDATE SET
             translation_group_id = excluded.translation_group_id,
             state = excluded.state,
             updated_at = excluded.updated_at`)
                .bind(row.entry_id, row.locale, row.translation_group_id, row.state, row.updated_at)
                .run();
        },
        async insertDomainEntryWithDraft(entry, rev, translation) {
            // One batch, so a failure on the revision cannot leave an entry with no draft.
            await db().batch([
                db()
                    .prepare(`INSERT INTO cms_content_entries
               (id, content_type, slug, locale, title, status, draft_revision_id,
                published_revision_id, created_at, updated_at, published_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
                    .bind(entry.id, entry.content_type, entry.slug, entry.locale, entry.title, entry.status, entry.draft_revision_id, entry.published_revision_id, entry.created_at, entry.updated_at, entry.published_at),
                db()
                    .prepare(`INSERT INTO cms_content_revisions
               (id, entry_id, version, locale, title, payload, author_email, created_at, message)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
                    .bind(rev.id, rev.entry_id, rev.version, rev.locale, rev.title, rev.payload, rev.author_email, rev.created_at, rev.message),
                db()
                    .prepare(`INSERT INTO cms_domain_translations
               (entry_id, locale, translation_group_id, state, updated_at)
             VALUES (?, ?, ?, ?, ?)`)
                    .bind(translation.entry_id, translation.locale, translation.translation_group_id, translation.state, translation.updated_at),
            ]);
        },
    };
}

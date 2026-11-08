import { emptyEntryListingSnapshot, pageDocPayloadSchema } from '@chester-hill-solutions/cms-core'

/** Local demo seed; a complete revision includes its immutable listing snapshot. */
export function createSeedSql(raw) {
  const payload = pageDocPayloadSchema.parse(raw)
  const quote = value => JSON.stringify(value).replaceAll("'", "''")
  return `INSERT OR REPLACE INTO content_entries
  (id, type, slug, title, status, published_revision_id, draft_revision_id, created_at, updated_at, published_at)
VALUES ('page-about', 'page_doc', 'about', 'About', 'published', 'rev_seed_about', 'rev_seed_about', datetime('now'), datetime('now'), datetime('now'));

INSERT OR REPLACE INTO content_revisions
  (id, entry_id, payload, listing_snapshot_json, version, created_at, created_by, message, parent_revision_id)
VALUES ('rev_seed_about', 'page-about', '${quote(payload)}', '${quote(emptyEntryListingSnapshot())}', 1, datetime('now'), 'seed', 'initial', NULL);`
}

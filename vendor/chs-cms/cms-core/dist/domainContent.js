/**
 * Typed domain content: the structured records a site owns — a tour, a stop, a
 * business, a notice — as opposed to the free-form pages built from blocks.
 *
 * Pages and domain content are two parallel families that share one database but
 * not one set of tables. Pages live in `content_entries` / `content_revisions`
 * and carry a `PageDocPayload`. Domain content lives in `cms_content_entries` /
 * `cms_content_revisions` and carries a host-defined payload per content type.
 * Both use the same pointer model: an entry holds a draft revision id and a
 * published revision id, and only a publish moves the published pointer.
 *
 * This module holds the contracts. The behaviour lives in `cms-store`, and the
 * dialect-specific SQL in the store adapters.
 */
/**
 * The content types the CMS understands out of the box.
 *
 * This is the default vocabulary, not a closed set: a host may serve a subset,
 * and the store does not enforce membership beyond the types it is configured
 * with. The `cms_content_entries.content_type` CHECK constraint in the D1 schema
 * is the one place the set is enforced in storage, so widening it is a migration.
 */
export const domainContentTypes = ['trip', 'stop', 'business', 'notice'];
export function isDomainContentType(value) {
    return typeof value === 'string' && domainContentTypes.includes(value);
}
/** Publication state of an entry, mirroring the `status` column. */
export const domainEntryStatuses = ['draft', 'published'];

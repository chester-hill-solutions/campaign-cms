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
export declare const domainContentTypes: readonly ["trip", "stop", "business", "notice"];
export type DomainContentType = (typeof domainContentTypes)[number];
export declare function isDomainContentType(value: unknown): value is DomainContentType;
/** Publication state of an entry, mirroring the `status` column. */
export declare const domainEntryStatuses: readonly ["draft", "published"];
export type DomainEntryStatus = (typeof domainEntryStatuses)[number];
/** Row shape of the `cms_content_entries` table. */
export type DomainContentEntryRow = {
    id: string;
    content_type: string;
    slug: string;
    locale: string;
    /** NOT NULL in the DDL; an untitled record stores ''. */
    title: string;
    status: string;
    draft_revision_id: string | null;
    published_revision_id: string | null;
    /**
     * Epoch milliseconds, not an ISO string. These three tables use INTEGER
     * timestamps while the page tables use TEXT; the domain tables are the newer
     * shape and the difference is real, so the contract follows the schema rather
     * than smoothing it over.
     */
    created_at: number;
    updated_at: number;
    published_at: number | null;
};
/** Row shape of the `cms_content_revisions` table. */
export type DomainContentRevisionRow = {
    id: string;
    entry_id: string;
    version: number;
    locale: string;
    /** NOT NULL DEFAULT '' — added to the table after the first entries existed. */
    title: string;
    payload: string;
    author_email: string;
    created_at: number;
    message: string;
};
/** A revision as listed in an editor or an agent's history view. */
export type DomainRevisionListRow = {
    id: string;
    version: number;
    created_at: number;
    message: string;
    author: string;
};
/**
 * Localization state for an entry, from `cms_domain_translations`. The store
 * keeps `updated_at` in step with the entry; `state` mirrors publication.
 */
export type DomainTranslationRow = {
    entry_id: string;
    locale: string;
    translation_group_id: string;
    state: string;
    updated_at: number;
};
/**
 * A loaded entry with its resolved payloads. `draft` and `published` are the
 * parsed payloads, or null when that side has no revision yet. A payload that
 * fails the host's parser resolves to null rather than throwing, matching how
 * the page store treats an unreadable revision.
 */
export type DomainEntry<TPayload = Record<string, unknown>> = {
    entry: DomainContentEntryRow;
    draft: TPayload | null;
    published: TPayload | null;
    /** True when a draft exists and differs from the published revision. */
    hasUnpublishedChanges: boolean;
};

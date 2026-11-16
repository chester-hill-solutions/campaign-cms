import type { DomainContentEntryRow, DomainRevisionListRow } from '@chester-hill-solutions/cms-core';
import type { CmsDomainPersistence } from './domainPorts.js';
/**
 * The result vocabulary shared with the agent tool layer.
 *
 * Deliberately the same codes `@chester-hill-solutions/cms-agent` returns from
 * its tools, so a tool that wraps a store call passes the code through instead of
 * translating between two error languages. `VALIDATION` carries `fieldErrors`
 * when the failure is field-scoped; `PRECONDITION` is for a write that is
 * well-formed but not yet allowed (an unpublished dependency, say), which is the
 * distinction an agent needs in order to decide whether to fix its input or to
 * do something else first.
 */
export type DomainStoreErrorCode = 'NOT_FOUND' | 'VALIDATION' | 'CONFLICT' | 'PRECONDITION' | 'FORBIDDEN' | 'INTERNAL';
export type DomainStoreFailure = {
    ok: false;
    code: DomainStoreErrorCode;
    error: string;
    fieldErrors?: Record<string, string[]>;
};
export type DomainStoreResult<T = Record<never, never>> = ({
    ok: true;
} & T) | DomainStoreFailure;
/** An entry that must be published before another one may be. */
export type DomainDependency = {
    contentType: string;
    slug: string;
};
export type DomainStoreConfig<TPayload = Record<string, unknown>> = {
    /** Content types this store serves. Not enforced against storage. */
    contentTypes: readonly string[];
    /**
     * Parse and validate a stored revision payload for a content type. Return null
     * when the payload is unusable, which is how a bad revision is reported rather
     * than thrown. The host owns this because only it knows the contract.
     */
    parsePayload: (contentType: string, raw: unknown) => TPayload | null;
    /**
     * Entries that must already be published before this one may be published.
     *
     * The rule itself is domain knowledge and stays with the host: a stop needs
     * its tour, a tour needs its stops. The store only enforces the shape, so the
     * same dependency check serves every site.
     */
    publishDependencies?: (entry: DomainContentEntryRow, payload: TPayload) => readonly DomainDependency[];
    /**
     * Extra publication checks beyond parsing. Return an error message to block
     * the publish, or null to allow it.
     */
    validateForPublish?: (entry: DomainContentEntryRow, payload: TPayload) => string | null;
    /** Author recorded on revision rows. */
    revisionAuthor?: () => string;
    /** Id source. Injectable so tests are deterministic. */
    newId?: () => string;
    /** Clock, in epoch milliseconds to match the INTEGER timestamp columns. */
    now?: () => number;
    /** Default locale for lookups and new entries. */
    defaultLocale?: string;
};
export type DomainEntryView<TPayload> = {
    entry: DomainContentEntryRow;
    draft: TPayload | null;
    published: TPayload | null;
    hasUnpublishedChanges: boolean;
    revisions: DomainRevisionListRow[];
};
export type SaveDraftInput<TPayload> = {
    /** Update this entry. Mutually exclusive with `create`. */
    entryId?: string;
    /** Create an entry with this identity. Mutually exclusive with `entryId`. */
    create?: {
        contentType: string;
        slug: string;
        locale?: string;
    };
    title?: string;
    payload: TPayload;
    /**
     * The draft revision id the caller believes is current, or null to assert that
     * no draft exists yet. A mismatch is a CONFLICT, so a stale writer cannot
     * silently discard a newer edit.
     */
    expectedRevisionId: string | null;
    message?: string | null;
};
export type CmsDomainStore<TPayload = Record<string, unknown>> = {
    listEntries: (options?: {
        contentType?: string;
        status?: 'draft' | 'published';
    }) => Promise<DomainContentEntryRow[]>;
    getEntry: (contentType: string, slug: string, locale?: string) => Promise<DomainEntryView<TPayload> | null>;
    getEntryById: (entryId: string) => Promise<DomainEntryView<TPayload> | null>;
    saveDraft: (input: SaveDraftInput<TPayload>) => Promise<DomainStoreResult<{
        entryId: string;
        revisionId: string;
    }>>;
    publish: (entryId: string, options: {
        expectedRevisionId: string;
    }) => Promise<DomainStoreResult>;
    unpublish: (entryId: string, options: {
        expectedRevisionId: string;
    }) => Promise<DomainStoreResult>;
    restoreRevision: (entryId: string, revisionId: string, options: {
        expectedRevisionId: string | null;
    }) => Promise<DomainStoreResult<{
        revisionId: string;
    }>>;
};
/**
 * Behaviour for typed domain content over a `CmsDomainPersistence` port.
 *
 * The interface is six operations; behind it sit the revision chain, the draft
 * and published pointers, optimistic concurrency, dependency-ordered publication
 * and payload validation. Callers and tests cross this same seam.
 */
export declare function createDomainStore<TPayload = Record<string, unknown>>(ports: {
    domain: CmsDomainPersistence;
}, config: DomainStoreConfig<TPayload>): CmsDomainStore<TPayload>;

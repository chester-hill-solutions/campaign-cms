import type { FormSettings, PageDocPayload, SiteSettings } from '@chester-hill-solutions/cms-core';
import type { createCmsStore } from './createCmsStore.js';
export type FormResponseEvent = {
    responseId: string;
    formId: string;
    formTitle: string;
    settings: FormSettings;
    data: Record<string, unknown>;
};
export type CmsStoreConfig<TPayload extends {
    kind: string;
}> = {
    /** Public site identity defaults; persisted settings take precedence. */
    siteSettingsDefaults?: SiteSettings;
    /** Override upload MIME types and size limits; keys always use canonical extensions and fresh UUIDs. */
    mediaUploadPolicy?: {
        types: Readonly<Record<string, {
            extension: string;
            maxBytes: number;
        }>>;
        requireAlt?: boolean;
    };
    /** Parse a stored revision payload; return null when invalid. */
    parsePayload: (raw: unknown) => TPayload | null;
    /** Defaults for a freshly created page. */
    newPageDoc: (input: {
        title: string;
        slug: string;
    }) => Omit<PageDocPayload, 'kind' | 'version'>;
    validateNewPageSlug: (slug: string) => string | null;
    entryIdFromPageSlug: (slug: string) => string;
    /**
     * Entry id of the site's home page. Its slug is pinned to '' (the site
     * root): draft saves store '' rather than NULL so slug lookups keep
     * resolving, and it is exempt from the publish-time slug requirement.
     */
    homeEntryId?: string;
    /** Author recorded on revision rows (`created_by`). Defaults to 'admin'. */
    revisionAuthor?: () => string;
    /**
     * Called after a valid, non-spam form response is stored (e.g. to send a
     * notification email). Failures are swallowed so they never fail the
     * visitor's submission.
     */
    onFormResponse?: (event: FormResponseEvent) => Promise<void> | void;
};
export type CmsStore<TPayload extends {
    kind: string;
}> = ReturnType<typeof createCmsStore<TPayload>>;

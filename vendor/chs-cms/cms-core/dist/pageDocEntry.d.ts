import { type PageDocPayload } from './blockSchemas';
export declare const DYNAMIC_PAGE_ENTRY_PREFIX: "page-";
/** True for known fixed pageDoc entry ids and dynamically created `page-*` ids. */
export declare function isPageDocEntryId(entryId: string, knownEntryIds: ReadonlySet<string>): boolean;
export declare function entryIdFromPageSlug(slug: string): string;
export type NewPageSeoDefaults = {
    /** e.g. (title) => `${title} | Candidate Name` */
    seoTitle: (title: string) => string;
    seoDescription: (title: string) => string;
};
export declare function defaultNewPageDoc(input: {
    title: string;
    slug: string;
    navLabel?: string;
}, seo: NewPageSeoDefaults): Omit<PageDocPayload, 'kind' | 'version'>;

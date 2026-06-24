import type { PageMeta } from './pageBlockOps';
export type PageDocValidation = {
    ok: boolean;
    byBlock: ReadonlyMap<string, string[]>;
    page: string[];
};
/**
 * Client-side validation matching the server's save schema, with zod issues
 * mapped to block ids so errors can badge the offending canvas blocks.
 */
export declare function validatePageDoc(content: PageMeta): PageDocValidation;

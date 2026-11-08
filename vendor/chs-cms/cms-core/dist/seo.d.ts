import { z } from 'zod';
import type { PageDocPayload } from './blockSchemas.js';
export declare const pageSeoSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    keywords: z.ZodOptional<z.ZodString>;
    canonical: z.ZodOptional<z.ZodString>;
    robots: z.ZodDefault<z.ZodString>;
    noindex: z.ZodDefault<z.ZodBoolean>;
    ogTitle: z.ZodOptional<z.ZodString>;
    ogDescription: z.ZodOptional<z.ZodString>;
    ogImage: z.ZodOptional<z.ZodString>;
    ogUrl: z.ZodOptional<z.ZodString>;
    ogType: z.ZodDefault<z.ZodString>;
    jsonLd: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const siteSeoDefaultsSchema: z.ZodObject<{
    siteTitle: z.ZodOptional<z.ZodString>;
    siteDescription: z.ZodOptional<z.ZodString>;
    siteUrl: z.ZodOptional<z.ZodString>;
    defaultOgImage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PageSeo = z.infer<typeof pageSeoSchema>;
export type SiteSeoDefaults = z.infer<typeof siteSeoDefaultsSchema>;
export declare function buildPageSeo(input: {
    page: PageDocPayload;
    siteDefaults?: SiteSeoDefaults;
    requestUrl?: string | URL;
    isPreview?: boolean;
    isCustomDomain?: boolean;
}): PageSeo;
export declare function buildPersonSchema(person: {
    name: string;
    url: string;
    sameAs?: string[];
    jobTitle?: string;
}): Record<string, unknown>;

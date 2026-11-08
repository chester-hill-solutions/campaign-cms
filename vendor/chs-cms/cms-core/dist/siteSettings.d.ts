import { z } from 'zod';
export declare const siteSettingsSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    siteName: z.ZodString;
    tagline: z.ZodString;
    description: z.ZodString;
    logoPath: z.ZodString;
    faviconPath: z.ZodString;
    socialImagePath: z.ZodString;
}, z.core.$strict>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export declare const defaultSiteSettings: SiteSettings;

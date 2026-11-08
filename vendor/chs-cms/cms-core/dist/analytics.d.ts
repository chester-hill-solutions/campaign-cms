import { z } from 'zod';
export declare const analyticsProviderSchema: z.ZodEnum<{
    cloudflare: "cloudflare";
    ga4: "ga4";
    gtm: "gtm";
    custom: "custom";
}>;
export type AnalyticsProvider = z.infer<typeof analyticsProviderSchema>;
export declare const analyticsScriptSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    src: z.ZodOptional<z.ZodString>;
    inlineScript: z.ZodOptional<z.ZodString>;
    loadMode: z.ZodDefault<z.ZodEnum<{
        async: "async";
        defer: "defer";
        blocking: "blocking";
    }>>;
    position: z.ZodDefault<z.ZodEnum<{
        head: "head";
        body_end: "body_end";
    }>>;
}, z.core.$strip>;
export type AnalyticsScript = z.infer<typeof analyticsScriptSchema>;
export declare const analyticsConfigSchema: z.ZodObject<{
    cloudflare: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        siteTag: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    ga4: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        trackingId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    gtm: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        containerId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    customScripts: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        src: z.ZodOptional<z.ZodString>;
        inlineScript: z.ZodOptional<z.ZodString>;
        loadMode: z.ZodDefault<z.ZodEnum<{
            async: "async";
            defer: "defer";
            blocking: "blocking";
        }>>;
        position: z.ZodDefault<z.ZodEnum<{
            head: "head";
            body_end: "body_end";
        }>>;
    }, z.core.$strip>>>;
    events: z.ZodDefault<z.ZodObject<{
        pageView: z.ZodDefault<z.ZodBoolean>;
        formSubmit: z.ZodDefault<z.ZodBoolean>;
        linkClick: z.ZodDefault<z.ZodBoolean>;
        scrollDepth: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AnalyticsConfig = z.infer<typeof analyticsConfigSchema>;
export declare const defaultAnalyticsConfig: AnalyticsConfig;

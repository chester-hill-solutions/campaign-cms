import { z } from 'zod';
export const analyticsProviderSchema = z.enum(['cloudflare', 'ga4', 'gtm', 'custom']);
export const analyticsScriptSchema = z.object({
    id: z.string().min(1).max(64),
    label: z.string().min(1).max(120),
    src: z.string().max(2000).optional(),
    inlineScript: z.string().max(10000).optional(),
    loadMode: z.enum(['async', 'defer', 'blocking']).default('async'),
    position: z.enum(['head', 'body_end']).default('head'),
});
/**
 * The characters a provider identifier is allowed to use.
 *
 * A GA4 measurement id (`G-XXXXXXXXXX`) and a GTM container id (`GTM-XXXXXX`) are opaque
 * tokens, so there is no reason for them to carry anything else. The character set is a
 * control rather than a formatting preference: the renderers interpolate these values into a
 * JavaScript string literal inside an inline `<script>` body, and a value carrying a quote
 * would close the literal and append a statement of its own.
 */
const ANALYTICS_ID_PATTERN = /^[A-Za-z0-9_-]{1,50}$/;
export const analyticsConfigSchema = z.object({
    cloudflare: z.object({
        enabled: z.boolean().default(true),
        siteTag: z.string().max(100).optional(),
    }).default(() => ({ enabled: true })),
    ga4: z.object({
        enabled: z.boolean().default(false),
        trackingId: z.string().max(50).regex(ANALYTICS_ID_PATTERN).optional(),
    }).default(() => ({ enabled: false })),
    gtm: z.object({
        enabled: z.boolean().default(false),
        containerId: z.string().max(50).regex(ANALYTICS_ID_PATTERN).optional(),
    }).default(() => ({ enabled: false })),
    customScripts: z.array(analyticsScriptSchema).max(10).default(() => []),
    events: z.object({
        pageView: z.boolean().default(true),
        formSubmit: z.boolean().default(true),
        linkClick: z.boolean().default(true),
        scrollDepth: z.boolean().default(false),
    }).default(() => ({ pageView: true, formSubmit: true, linkClick: true, scrollDepth: false })),
});
export const defaultAnalyticsConfig = {
    cloudflare: { enabled: true },
    ga4: { enabled: false },
    gtm: { enabled: false },
    customScripts: [],
    events: { pageView: true, formSubmit: true, linkClick: true, scrollDepth: false },
};

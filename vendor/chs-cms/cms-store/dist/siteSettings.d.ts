import { type SiteSettings } from '@chester-hill-solutions/cms-core';
import type { CmsPersistence } from './ports.js';
export declare const SITE_SETTINGS_ENTRY_ID = "cms-site-settings";
type SettingsPersistence = Pick<CmsPersistence, 'getPublishedPayloadJson' | 'getContentEntryRow' | 'insertContentEntry' | 'publishOperationalEntry'>;
/** Reuses operational revisions on either adapter. No binding access until a method is called. */
export declare function createSiteSettingsStore(getPersistence: () => SettingsPersistence, options?: {
    defaults?: SiteSettings;
    revisionAuthor?: () => string;
}): {
    getSiteSettings: () => Promise<SiteSettings>;
    setSiteSettings: (input: unknown) => Promise<{
        ok: false;
        error: string;
        settings?: undefined;
    } | {
        ok: true;
        settings: {
            version: 1;
            siteName: string;
            tagline: string;
            description: string;
            logoPath: string;
            faviconPath: string;
            socialImagePath: string;
        };
        error?: undefined;
    }>;
};
export {};

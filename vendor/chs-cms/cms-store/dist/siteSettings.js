import { emptyEntryListingSnapshot, defaultSiteSettings, siteSettingsSchema } from '@chester-hill-solutions/cms-core';
export const SITE_SETTINGS_ENTRY_ID = 'cms-site-settings';
/** Reuses operational revisions on either adapter. No binding access until a method is called. */
export function createSiteSettingsStore(getPersistence, options = {}) {
    const defaults = siteSettingsSchema.parse(options.defaults ?? defaultSiteSettings);
    async function getSiteSettings() {
        const raw = await getPersistence().getPublishedPayloadJson(SITE_SETTINGS_ENTRY_ID);
        if (raw) {
            try {
                const parsed = siteSettingsSchema.safeParse(JSON.parse(raw));
                if (parsed.success)
                    return parsed.data;
            }
            catch { /* Invalid stored content falls back to the host's public defaults. */ }
        }
        return { ...defaults };
    }
    async function setSiteSettings(input) {
        const parsed = siteSettingsSchema.safeParse(input);
        if (!parsed.success)
            return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid site settings' };
        const db = getPersistence();
        const now = new Date().toISOString();
        const existing = await db.getContentEntryRow(SITE_SETTINGS_ENTRY_ID);
        if (existing && existing.type !== 'site_settings')
            throw new Error('Site settings entry is already in use');
        if (!existing) {
            try {
                await db.insertContentEntry({ id: SITE_SETTINGS_ENTRY_ID, type: 'site_settings', slug: null,
                    title: 'Site settings', status: 'draft', created_at: now, updated_at: now });
            }
            catch (error) {
                // Another request may have created this same settings entry first.
                if ((await db.getContentEntryRow(SITE_SETTINGS_ENTRY_ID))?.type !== 'site_settings')
                    throw error;
            }
        }
        await db.publishOperationalEntry(SITE_SETTINGS_ENTRY_ID, {
            id: `rev_${crypto.randomUUID()}`, entry_id: SITE_SETTINGS_ENTRY_ID,
            listing_snapshot_json: JSON.stringify(emptyEntryListingSnapshot()),
            payload: JSON.stringify(parsed.data), version: 0, created_at: now,
            created_by: options.revisionAuthor?.() ?? 'admin', message: 'Update site settings',
        });
        return { ok: true, settings: parsed.data };
    }
    return { getSiteSettings, setSiteSettings };
}

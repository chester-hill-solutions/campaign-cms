import { z } from 'zod';
/** Public image references only; no script/data URLs, protocol-relative URLs or control characters. */
const imagePath = z.string().trim().max(2048).refine((value) => {
    if (!value)
        return true;
    if (/[\\\s\u0000-\u001f\u007f]/.test(value))
        return false;
    if (value.startsWith('/') && !value.startsWith('//'))
        return true;
    try {
        const url = new URL(value);
        return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password;
    }
    catch {
        return false;
    }
}, 'Use a site image path or an HTTP(S) image URL');
export const siteSettingsSchema = z.object({
    version: z.literal(1),
    siteName: z.string().trim().min(1, 'Enter a site name').max(120),
    tagline: z.string().trim().max(160),
    description: z.string().trim().max(320),
    logoPath: imagePath,
    faviconPath: imagePath,
    socialImagePath: imagePath,
}).strict();
export const defaultSiteSettings = {
    version: 1, siteName: 'Your site', tagline: '', description: '',
    logoPath: '', faviconPath: '', socialImagePath: '',
};

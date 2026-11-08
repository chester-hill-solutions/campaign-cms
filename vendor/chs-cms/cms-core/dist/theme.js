import { z } from 'zod';
/** Hex (#rgb / #rrggbb / #rrggbbaa) or rgb()/hsl() — safe for injection into <style>. */
const cssColorSchema = z
    .string()
    .min(1)
    .max(64)
    .regex(/^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\))$/, 'Invalid CSS color');
/** Font-stack whitelist (no braces/semicolons that could break out of a CSS value). */
const fontStackSchema = z
    .string()
    .min(1)
    .max(200)
    .regex(/^[A-Za-z0-9 ,\-_'".]+$/, 'Invalid font stack');
/**
 * Base colors editable per theme. Derived tokens (--ink-muted, --line-strong,
 * --border-subtle) are generated in themeToCss from these bases.
 */
export const themeColorSetSchema = z.object({
    ink: cssColorSchema,
    surfacePage: cssColorSchema,
    surfaceCard: cssColorSchema,
    surfaceElevated: cssColorSchema,
    surfaceCardStrong: cssColorSchema,
    /** Maps to --accent-orange (primary brand accent). */
    accent: cssColorSchema,
    /** Maps to --accent-red. */
    accentAlt: cssColorSchema,
    /** Maps to --accent-green. */
    accentTertiary: cssColorSchema,
    /** Maps to --primary-dark. Defaults to ink when omitted at parse time. */
    primaryDark: cssColorSchema.optional(),
    /** Maps to --primary-light. Defaults to surfacePage when omitted. */
    primaryLight: cssColorSchema.optional(),
    /** Maps to --secondary-dark. */
    secondaryDark: cssColorSchema.optional(),
});
export const themeFontsSchema = z.object({
    body: fontStackSchema,
    heading: fontStackSchema.optional(),
});
export const siteThemeSchema = z.object({
    version: z.literal(1),
    light: themeColorSetSchema,
    dark: themeColorSetSchema.optional(),
    fonts: themeFontsSchema,
});
/** Matches packages/cms-react/styles/cms-tokens.css :root defaults. */
export const defaultSiteTheme = {
    version: 1,
    light: {
        ink: '#1f2421',
        surfacePage: '#fafaf7',
        surfaceCard: '#ffffff',
        surfaceElevated: '#f1f1ec',
        surfaceCardStrong: '#e8e8e2',
        accent: '#d9651f',
        accentAlt: '#b3402e',
        accentTertiary: '#1f3d2b',
        primaryDark: '#1f2421',
        primaryLight: '#fafaf7',
        secondaryDark: '#2c2c26',
    },
    fonts: {
        body: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    },
};
export const blockAccentSchema = z.enum(['primary', 'alt', 'tertiary']);

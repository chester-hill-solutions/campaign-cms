import { z } from 'zod';
/**
 * Base colors editable per theme. Derived tokens (--ink-muted, --line-strong,
 * --border-subtle) are generated in themeToCss from these bases.
 */
export declare const themeColorSetSchema: z.ZodObject<{
    ink: z.ZodString;
    surfacePage: z.ZodString;
    surfaceCard: z.ZodString;
    surfaceElevated: z.ZodString;
    surfaceCardStrong: z.ZodString;
    accent: z.ZodString;
    accentAlt: z.ZodString;
    accentTertiary: z.ZodString;
    primaryDark: z.ZodOptional<z.ZodString>;
    primaryLight: z.ZodOptional<z.ZodString>;
    secondaryDark: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ThemeColorSet = z.infer<typeof themeColorSetSchema>;
export declare const themeFontsSchema: z.ZodObject<{
    body: z.ZodString;
    heading: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ThemeFonts = z.infer<typeof themeFontsSchema>;
export declare const siteThemeSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    light: z.ZodObject<{
        ink: z.ZodString;
        surfacePage: z.ZodString;
        surfaceCard: z.ZodString;
        surfaceElevated: z.ZodString;
        surfaceCardStrong: z.ZodString;
        accent: z.ZodString;
        accentAlt: z.ZodString;
        accentTertiary: z.ZodString;
        primaryDark: z.ZodOptional<z.ZodString>;
        primaryLight: z.ZodOptional<z.ZodString>;
        secondaryDark: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    dark: z.ZodOptional<z.ZodObject<{
        ink: z.ZodString;
        surfacePage: z.ZodString;
        surfaceCard: z.ZodString;
        surfaceElevated: z.ZodString;
        surfaceCardStrong: z.ZodString;
        accent: z.ZodString;
        accentAlt: z.ZodString;
        accentTertiary: z.ZodString;
        primaryDark: z.ZodOptional<z.ZodString>;
        primaryLight: z.ZodOptional<z.ZodString>;
        secondaryDark: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    fonts: z.ZodObject<{
        body: z.ZodString;
        heading: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SiteTheme = z.infer<typeof siteThemeSchema>;
/** Matches packages/cms-react/styles/cms-tokens.css :root defaults. */
export declare const defaultSiteTheme: SiteTheme;
export type BlockAccent = 'primary' | 'alt' | 'tertiary';
export declare const blockAccentSchema: z.ZodEnum<{
    primary: "primary";
    alt: "alt";
    tertiary: "tertiary";
}>;

import { type SiteTheme } from '@chester-hill-solutions/cms-core';
export type ThemeStyleProps = {
    /** When omitted, emits defaultSiteTheme CSS (same as cms-tokens.css :root). */
    theme?: SiteTheme;
};
/**
 * Injects per-site design tokens as CSS custom properties.
 * Hosts should render this once in the document head (public site and admin preview).
 */
export declare function ThemeStyle({ theme }: ThemeStyleProps): import("react").JSX.Element;

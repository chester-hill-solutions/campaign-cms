import type { SiteTheme } from './theme.js';
/**
 * Emit CSS custom properties for a site theme.
 * Hosts inject the result via <ThemeStyle> (or any <style> tag).
 * Var names match cms-tokens.css so existing Tailwind utilities keep working.
 */
export declare function themeToCss(theme?: SiteTheme): string;

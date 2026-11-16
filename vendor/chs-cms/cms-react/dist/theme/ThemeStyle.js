import { jsx as _jsx } from "react/jsx-runtime";
import { themeToCss } from '@chester-hill-solutions/cms-core';
/**
 * Injects per-site design tokens as CSS custom properties.
 * Hosts should render this once in the document head (public site and admin preview).
 */
export function ThemeStyle({ theme }) {
    return (_jsx("style", { "data-cms-theme": "", 
        // themeToCss only emits schema-validated colors/fonts.
        dangerouslySetInnerHTML: { __html: themeToCss(theme) } }));
}

import { defaultSiteTheme } from './theme.js';
function resolveColors(set) {
    return {
        ink: set.ink,
        surfacePage: set.surfacePage,
        surfaceCard: set.surfaceCard,
        surfaceElevated: set.surfaceElevated,
        surfaceCardStrong: set.surfaceCardStrong,
        accent: set.accent,
        accentAlt: set.accentAlt,
        accentTertiary: set.accentTertiary,
        primaryDark: set.primaryDark ?? set.ink,
        primaryLight: set.primaryLight ?? set.surfacePage,
        secondaryDark: set.secondaryDark ?? set.ink,
    };
}
function colorDeclarations(set) {
    const c = resolveColors(set);
    return [
        `--ink: ${c.ink}`,
        `--ink-muted: color-mix(in oklab, ${c.ink} 66%, #6b6b6b)`,
        `--surface-page: ${c.surfacePage}`,
        `--surface-card: ${c.surfaceCard}`,
        `--surface-elevated: ${c.surfaceElevated}`,
        `--surface-card-strong: ${c.surfaceCardStrong}`,
        `--line-strong: color-mix(in oklab, ${c.ink} 18%, transparent)`,
        `--border-subtle: color-mix(in oklab, var(--line-strong) 45%, transparent)`,
        `--accent-orange: ${c.accent}`,
        `--accent-red: ${c.accentAlt}`,
        `--accent-green: ${c.accentTertiary}`,
        `--primary-dark: ${c.primaryDark}`,
        `--primary-light: ${c.primaryLight}`,
        `--secondary-dark: ${c.secondaryDark}`,
    ].join('; ');
}
function fontDeclarations(fonts) {
    const parts = [`--font-body: ${fonts.body}`];
    if (fonts.heading) {
        parts.push(`--font-heading: ${fonts.heading}`);
    }
    else {
        parts.push(`--font-heading: ${fonts.body}`);
    }
    return parts.join('; ');
}
function declarations(set, fonts) {
    return `${colorDeclarations(set)}; ${fontDeclarations(fonts)}`;
}
/**
 * Emit CSS custom properties for a site theme.
 * Hosts inject the result via <ThemeStyle> (or any <style> tag).
 * Var names match cms-tokens.css so existing Tailwind utilities keep working.
 */
export function themeToCss(theme = defaultSiteTheme) {
    const lightDecls = declarations(theme.light, theme.fonts);
    const chunks = [`:root { ${lightDecls}; }`];
    if (theme.dark) {
        const darkDecls = declarations(theme.dark, theme.fonts);
        chunks.push(`@media (prefers-color-scheme: dark) { :root { ${darkDecls}; } }`);
        chunks.push(`[data-theme="dark"] { ${darkDecls}; }`);
    }
    return chunks.join('\n');
}

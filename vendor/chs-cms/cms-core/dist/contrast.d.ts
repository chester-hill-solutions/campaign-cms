/**
 * Whether a theme's colours can actually be read.
 *
 * ## Why this lives here
 *
 * Because `themeColorSetSchema` validates the *shape* of a colour — a string, matching a
 * pattern — and not whether it can be read against the surface it sits on. A CMS that lets
 * someone pick a page's colours without checking the result hands every consumer the
 * problem, and each of them writes their own copy of this arithmetic.
 *
 * It is the same reasoning that put `applicationFeeAmountFor` in `payments-connect`: a
 * formula every consumer would otherwise re-derive belongs once, next to the thing whose
 * correctness depends on it. Here that thing is the theme.
 *
 * Framework-agnostic on purpose: no React, no DOM, no colour library. WCAG's definition is
 * short enough that quoting a package for it would be a dependency to learn a formula from.
 */
/** WCAG 2.2 AA for body text. */
export declare const AA_BODY = 4.5;
/** WCAG 2.2 AA for large text — 24px, or 18.66px and bold. */
export declare const AA_LARGE = 3;
/** A pair that could not be read, and a pair that could be read but is worth saying. */
export interface ContrastFinding {
    /** `ink on surfacePage` — which two colours, named as the schema names them. */
    readonly pair: string;
    readonly ratio: number;
    /** `refused` cannot ship; `warning` is a judgement the theme's owner may overrule. */
    readonly level: 'refused' | 'warning';
    readonly because: string;
}
/**
 * Contrast between two hex colours, as a ratio from 1 to 21.
 *
 * The order of the arguments does not matter: the lighter of the two goes on top, so the
 * result is never below 1. Computing it the other way round gives a meaningful-looking
 * number under 1, which is how a threshold ends up written against the wrong sign.
 */
export declare function contrastRatio(foreground: string, background: string): number;
/**
 * Relative luminance, 0 for black and 1 for white.
 *
 * The piecewise sRGB transfer function looks arbitrary and is not: the display curve is
 * linear below 0.04045 and a power curve above it. 0.04045 is the constant WCAG 2.2 states;
 * the older 0.03928 is the same threshold to fewer digits and differs nowhere that matters at
 * eight-bit input.
 *
 * Throws on anything that is not `#rgb` or `#rrggbb`. Returning a number for a colour that
 * could not be parsed would make every comparison false in a way that looks like a verdict.
 */
export declare function relativeLuminance(colour: string): number;
/**
 * Everything about a colour set that would make it hard to read, worst first.
 *
 * `refused` for a pair under its floor and `warning` for one that clears AA for large text
 * but not for body — a mid-tone accent used for a 24px price, which is a real pattern and a
 * defensible one.
 */
export declare function checkColorContrast(colours: Record<string, string | undefined>, options?: {
    readonly accentFloor?: number;
}): ContrastFinding[];
/**
 * `checkColorContrast` over a `SiteTheme`'s light colour set.
 *
 * Thin on purpose: the pair table and the arithmetic are the package's, and a consumer with a
 * whole theme should not have to reach into `theme.light` to use them.
 *
 * `accentFloor` is forwarded rather than fixed, because a consumer whose accent is only ever
 * large display type has a legitimate reason to judge it at 3:1 and no way to say so through a
 * wrapper that swallows the option. A wrapper that hides the one knob it has is worse than no
 * wrapper.
 */
export declare function checkThemeContrast(theme: {
    light: Record<string, string | undefined>;
}, options?: {
    readonly accentFloor?: number;
}): ContrastFinding[];

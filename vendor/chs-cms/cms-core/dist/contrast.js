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
export const AA_BODY = 4.5;
/** WCAG 2.2 AA for large text — 24px, or 18.66px and bold. */
export const AA_LARGE = 3;
/**
 * Contrast between two hex colours, as a ratio from 1 to 21.
 *
 * The order of the arguments does not matter: the lighter of the two goes on top, so the
 * result is never below 1. Computing it the other way round gives a meaningful-looking
 * number under 1, which is how a threshold ends up written against the wrong sign.
 */
export function contrastRatio(foreground, background) {
    const a = relativeLuminance(foreground);
    const b = relativeLuminance(background);
    const [lighter, darker] = a > b ? [a, b] : [b, a];
    return (lighter + 0.05) / (darker + 0.05);
}
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
export function relativeLuminance(colour) {
    const [r, g, b] = parseHex(colour).map(channelOf);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** One sRGB channel, 0-255 in, 0-1 linearised out. */
function channelOf(value) {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
/**
 * `#rgb` or `#rrggbb` as three 0-255 channels.
 *
 * The three-digit form is expanded to six before anything else looks at it, so there is one
 * path rather than two.
 */
function parseHex(colour) {
    const hex = colour.trim().replace(/^#/, '');
    const digits = hex.length === 3 ? hex.split('').map((n) => n + n).join('') : hex;
    if (!/^[0-9a-f]{6}$/i.test(digits)) {
        throw new Error(`not a hex colour: ${colour}`);
    }
    return [
        Number.parseInt(digits.slice(0, 2), 16),
        Number.parseInt(digits.slice(2, 4), 16),
        Number.parseInt(digits.slice(4, 6), 16),
    ];
}
/**
 * The colour pairs a page actually sets text in, with the floor each one has to clear.
 *
 * ## Why the accent appears twice, in both directions
 *
 * Because an accent is used two ways and they are not the same question. As *text* on a page
 * it is a link or a price, judged against the surface behind it. As a *fill* — a button —
 * it carries `primaryLight` on top of it, and that pair has to clear the bar too. A palette
 * can pass one and fail the other comfortably: a mid-tone orange is readable as a link on
 * white and unreadable as a button with white text on it.
 *
 * ## Why `surfaceElevated` and `surfaceCardStrong` are absent
 *
 * Because they hold no text of their own in the surfaces this package ships. They are
 * borders and fills, and judging a contrast between two colours nothing is set in produces a
 * finding nobody can act on.
 */
const PAIRS = [
    ['ink', 'surfacePage', 'body text on the page', AA_BODY],
    ['ink', 'surfaceCard', 'body text on a card', AA_BODY],
    ['accent', 'surfacePage', 'a link or price on the page', AA_BODY],
    ['primaryLight', 'accent', 'a button label on the accent fill', AA_BODY],
];
/** At or above this, nothing is reported. */
const QUIET_AT = AA_BODY;
/**
 * Everything about a colour set that would make it hard to read, worst first.
 *
 * `refused` for a pair under its floor and `warning` for one that clears AA for large text
 * but not for body — a mid-tone accent used for a 24px price, which is a real pattern and a
 * defensible one.
 */
export function checkColorContrast(colours, options = {}) {
    const accentFloor = options.accentFloor ?? AA_BODY;
    const findings = [];
    for (const [fg, bg, what, floor] of PAIRS) {
        const fgValue = colours[fg];
        const bgValue = colours[bg];
        // An absent colour is not a contrast problem. `primaryLight` is optional in the schema
        // and `themeToCss` substitutes `surfacePage` for it, so this branch is the difference
        // between reporting a theme that is fine and reporting one that is not configured.
        if (fgValue === undefined || bgValue === undefined)
            continue;
        const required = fg === 'accent' && bg === 'surfacePage' ? accentFloor : floor;
        const ratio = contrastRatio(fgValue, bgValue);
        if (ratio >= QUIET_AT)
            continue;
        const rounded = Math.round(ratio * 100) / 100;
        findings.push({
            pair: `${fg} on ${bg}`,
            ratio: rounded,
            level: ratio < required ? 'refused' : 'warning',
            because: ratio < required
                ? `${what} is ${rounded.toFixed(2)}:1, under ${required}:1`
                : `${what} is ${rounded.toFixed(2)}:1 — enough for large text, not for small`,
        });
    }
    return findings.sort((a, b) => a.ratio - b.ratio);
}
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
export function checkThemeContrast(theme, options = {}) {
    return checkColorContrast(theme.light, options);
}

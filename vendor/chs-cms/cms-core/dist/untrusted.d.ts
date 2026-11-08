import { CUSTOM_HTML_ALLOWED_ATTRIBUTES, CUSTOM_HTML_ALLOWED_TAGS, CUSTOM_HTML_ALLOWED_URL_SCHEMES, CUSTOM_HTML_DROP_WITH_CONTENT, CUSTOM_HTML_MAX_LENGTH, CUSTOM_HTML_URL_ATTRIBUTES } from './blockSchemas.js';
export { CUSTOM_HTML_ALLOWED_ATTRIBUTES, CUSTOM_HTML_ALLOWED_TAGS, CUSTOM_HTML_ALLOWED_URL_SCHEMES, CUSTOM_HTML_DROP_WITH_CONTENT, CUSTOM_HTML_MAX_LENGTH, CUSTOM_HTML_URL_ATTRIBUTES, };
/**
 * The characters a spreadsheet treats as the start of a formula.
 *
 * All six, because the set is not the two that come to mind. `=` is obvious. `+` and `-` are
 * how a negative number becomes an expression. `@` is how Lotus and later Excel read a
 * formula. Tab and carriage return are the other two, and either is enough on its own, so a
 * value that looks like plain text can still be made to compute.
 */
export declare const CSV_FORMULA_PREFIXES: ReadonlySet<string>;
/**
 * Make a CSV cell inert when a spreadsheet opens it, by prefixing an apostrophe.
 *
 * The apostrophe is the reader's own marker for "the rest of this cell is text", so it is
 * consumed on open and does not show in the cell. That is also the whole trade-off: the value
 * is no longer byte-identical to what was stored, so a round trip through a spreadsheet adds a
 * character that must be stripped before the value is compared. This is why
 * `escapeCsvFormula` is opt-in on export rather than always on.
 *
 * Prefixed rather than stripped, because stripping a leading `-` turns a negative number into
 * a positive one and silently corrupts a value the sender meant. A leading apostrophe costs a
 * character a reader can see through; a stripped sign costs data.
 *
 * @param value the cell's text, before CSV quoting
 * @returns the cell text, prefixed when it began with a formula character
 */
export declare function escapeCsvFormula(value: string): string;
/**
 * Encode a value as a JavaScript string literal, for an inline `<script>` body.
 *
 * Two contexts, and each needs its own escape. Inside the literal, `JSON.stringify` handles
 * the quotes, the backslashes and the newlines. Outside it, the element's content is raw
 * text: the browser reads it until it sees `</script`, so a `<` in the value would end the
 * element early and everything after it would be markup rather than script. Escaping it as
 * `<` keeps the script text and the markup apart.
 *
 * The result is a complete literal, quotes included, so it is interpolated as
 * `gtag('config', ${literal})` rather than dropped inside quotes of its own.
 */
export declare function encodeJsStringLiteral(value: string): string;
/**
 * Serialise a value as JSON for the body of a `<script type="application/ld+json">` element.
 *
 * `JSON.stringify` escapes the quotes and backslashes, but it leaves `<` alone, and the parser
 * ends a script element at the first `</script`. A `jsonLd` value carrying that string would
 * close the element and turn the rest of the payload into markup. `\u003c` is the same character
 * to a JSON reader and a plain `<` to the HTML tokenizer, so the two stay apart. U+2028 and
 * U+2029 are line terminators to a JavaScript parser but not to JSON, so they are escaped too.
 */
export declare function encodeJsonForScript(value: unknown): string;
export type SanitizeHtmlOptions = {
    /** Replaces `CUSTOM_HTML_ALLOWED_TAGS`. */
    tags?: ReadonlySet<string>;
    /** Replaces `CUSTOM_HTML_ALLOWED_ATTRIBUTES`. */
    attributes?: ReadonlySet<string>;
    /** Replaces `CUSTOM_HTML_MAX_LENGTH`. */
    maxLength?: number;
};
/**
 * Filter stored custom HTML down to the CMS's own allowlist.
 *
 * The output is rebuilt from the parse tree, so it holds only the tags, attributes and text
 * that passed. Elements in `CUSTOM_HTML_DROP_WITH_CONTENT` take their content with them.
 * Comments, doctypes and processing instructions are dropped: none of them carry meaning in a
 * page body, and a conditional comment is a parser disagreement waiting to be exploited.
 *
 * A tag outside the allowlist loses the tag and keeps its text, so a `<blink>` loses the blink
 * and not the sentence inside it.
 *
 * The allowlist is the one declared beside `customHtmlBlockSchema`, so a change to what a
 * custom HTML block may contain is made in the same place as the block that declares it.
 *
 * Output longer than `maxLength` is truncated at a character boundary, which can leave a
 * partial final tag. That is deliberate: a truncated tag cannot execute, and a bound that can
 * be exceeded by one tag is not a bound.
 *
 * The function this replaces was three regular-expression replacements. It removed a closed
 * `script` element, an `on*` handler, and a `javascript:` URL in `href`, `src` or `xlink:href`.
 * Measured against 21 vectors, 7 passed through unchanged: `formaction`, a `form`'s `action`,
 * an `object`'s `data`, a `data-*` attribute, `vbscript:`, an unclosed `script`, and a CSS
 * `expression`.
 */
export declare function sanitizeCustomHtml(html: string, options?: SanitizeHtmlOptions): string;
/**
 * Filter a block's `html` field, if it has one.
 *
 * A block is the unit the CMS stores and renders, so the filter takes a block and finds the
 * HTML itself. A block type added later with an `html` field is covered by this without a
 * second edit, which is the reason it takes a block rather than a string.
 *
 * A block with no `html` string is returned unchanged, so this is safe to map over every block
 * in a page document.
 */
export declare function sanitizeBlock<T>(block: T): T;
/**
 * Filter every block in a page document's block list, including blocks nested in a `blocks`
 * field, so a custom HTML block inside a section is filtered on the same pass as one at the
 * top level.
 */
export declare function sanitizeBlocks<T>(blocks: readonly T[]): T[];

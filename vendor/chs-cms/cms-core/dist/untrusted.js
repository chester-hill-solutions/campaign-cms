/**
 * Untrusted values on the way out of this repository.
 *
 * A few exports, in one module, because they all answer the same question. A value that
 * arrived from outside gets read back by software that will not treat it as text: a
 * spreadsheet reads a CSV cell, a browser reads an HTML string, a browser reads a script
 * body. None is an obvious execution surface until the content is shaped for one.
 *
 * `escapeCsvFormula` is for cells. `sanitizeCustomHtml` is for the CMS's `customHtml` block.
 * `encodeJsStringLiteral` is for a value interpolated into an inline `<script>` body.
 *
 * They re-serialise rather than delete. Each parses its input and rebuilds it from what
 * survived, so the output is made of the tokens that were allowed and nothing else. None
 * claims to stop every possible attack; each names the allowlist it enforces, and the
 * adversarial tests name the vectors they cover.
 */
import { Parser } from 'htmlparser2';
import { CUSTOM_HTML_ALLOWED_ATTRIBUTES, CUSTOM_HTML_ALLOWED_TAGS, CUSTOM_HTML_ALLOWED_URL_SCHEMES, CUSTOM_HTML_DROP_WITH_CONTENT, CUSTOM_HTML_MAX_LENGTH, CUSTOM_HTML_URL_ATTRIBUTES, } from './blockSchemas.js';
export { CUSTOM_HTML_ALLOWED_ATTRIBUTES, CUSTOM_HTML_ALLOWED_TAGS, CUSTOM_HTML_ALLOWED_URL_SCHEMES, CUSTOM_HTML_DROP_WITH_CONTENT, CUSTOM_HTML_MAX_LENGTH, CUSTOM_HTML_URL_ATTRIBUTES, };
// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------
/**
 * The characters a spreadsheet treats as the start of a formula.
 *
 * All six, because the set is not the two that come to mind. `=` is obvious. `+` and `-` are
 * how a negative number becomes an expression. `@` is how Lotus and later Excel read a
 * formula. Tab and carriage return are the other two, and either is enough on its own, so a
 * value that looks like plain text can still be made to compute.
 */
export const CSV_FORMULA_PREFIXES = new Set([
    '=',
    '+',
    '-',
    '@',
    '\t',
    '\r',
]);
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
export function escapeCsvFormula(value) {
    if (value.length === 0)
        return value;
    // The first character by code unit. A cell starting with a multi-byte character cannot start
    // with any of the six, so there is nothing to decode before this test.
    const first = value.charAt(0);
    if (!CSV_FORMULA_PREFIXES.has(first))
        return value;
    return `'${value}`;
}
// ---------------------------------------------------------------------------
// JavaScript
// ---------------------------------------------------------------------------
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
export function encodeJsStringLiteral(value) {
    return JSON.stringify(value).replace(/</g, '\\u003c');
}
/**
 * Serialise a value as JSON for the body of a `<script type="application/ld+json">` element.
 *
 * `JSON.stringify` escapes the quotes and backslashes, but it leaves `<` alone, and the parser
 * ends a script element at the first `</script`. A `jsonLd` value carrying that string would
 * close the element and turn the rest of the payload into markup. `\u003c` is the same character
 * to a JSON reader and a plain `<` to the HTML tokenizer, so the two stay apart. U+2028 and
 * U+2029 are line terminators to a JavaScript parser but not to JSON, so they are escaped too.
 */
export function encodeJsonForScript(value) {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}
// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------
/** Void elements, which take no closing tag. */
const VOID_TAGS = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);
const ESCAPE_TEXT = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const ESCAPE_ATTR = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
};
/** Escape a text run. Only `<` and `&` can matter here, and `>` is escaped for tidiness. */
function escapeText(value) {
    return value.replace(/[&<>]/g, (c) => ESCAPE_TEXT[c] ?? c);
}
/** Escape an attribute value for a double-quoted attribute. */
function escapeAttr(value) {
    return value.replace(/[&<>"]/g, (c) => ESCAPE_ATTR[c] ?? c);
}
/**
 * Remove the characters a browser ignores when it works out a URL's scheme.
 *
 * `java&#9;script:` and `java&#10;script:` are one URL to a browser and two different strings
 * to every other reader, so the scheme test has to see what the browser will see. This strips
 * every C0 control and space, which is the set a browser skips when parsing a scheme.
 */
function collapseForScheme(value) {
    // eslint-disable-next-line no-control-regex
    return value.replace(/[\u0000-\u0020\u007F]/g, '');
}
/**
 * Whether a URL may appear in the output.
 *
 * Relative references are allowed, including fragments and protocol-relative paths. An
 * absolute URL must name a scheme in `CUSTOM_HTML_ALLOWED_URL_SCHEMES`, with one exception:
 * base64 `data:` images, because inlining a small image is a real authoring need. Every other
 * `data:` URL is refused, which is what keeps `data:text/html` and `data:image/svg+xml` out,
 * both of which execute.
 */
function isAllowedUrl(rawValue) {
    const collapsed = collapseForScheme(rawValue).toLowerCase();
    if (collapsed === '')
        return false;
    if (collapsed.startsWith('#'))
        return true;
    if (collapsed.startsWith('/') || collapsed.startsWith('./') || collapsed.startsWith('../')) {
        return true;
    }
    const colon = collapsed.indexOf(':');
    if (colon === -1)
        return true;
    // A colon after a slash or a question mark belongs to the path, not to a scheme, so
    // `/redirect?next=a:b` is a relative URL and not a `next` scheme.
    const slash = collapsed.indexOf('/');
    const query = collapsed.indexOf('?');
    if (slash !== -1 && slash < colon)
        return true;
    if (query !== -1 && query < colon)
        return true;
    const scheme = collapsed.slice(0, colon);
    if (CUSTOM_HTML_ALLOWED_URL_SCHEMES.has(scheme))
        return true;
    if (scheme === 'data') {
        return /^data:image\/(?:png|jpeg|jpg|gif|webp|avif);base64,[a-z0-9+/=]+$/.test(collapsed);
    }
    return false;
}
/**
 * `srcset` is a comma-separated list of `url descriptor` candidates, so every candidate's URL
 * is checked rather than the string as a whole.
 */
function isAllowedSrcset(value) {
    const candidates = value.split(',');
    if (candidates.length === 0)
        return false;
    for (const candidate of candidates) {
        const url = candidate.trim().split(/\s+/)[0] ?? '';
        if (url === '')
            return false;
        if (!isAllowedUrl(url))
            return false;
    }
    return true;
}
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
export function sanitizeCustomHtml(html, options = {}) {
    const tags = options.tags ?? CUSTOM_HTML_ALLOWED_TAGS;
    const attributes = options.attributes ?? CUSTOM_HTML_ALLOWED_ATTRIBUTES;
    const maxLength = options.maxLength ?? CUSTOM_HTML_MAX_LENGTH;
    let out = '';
    // The stack of tags whose subtree is currently being dropped. Empty means nothing is being
    // dropped. A stack rather than a flag, because an `<svg>` inside a dropped `<object>` must not
    // end the drop, and a stray `</div>` inside a dropped subtree must not end it early either.
    const dropStack = [];
    const parser = new Parser({
        onopentag(name, rawAttributes) {
            const tag = name.toLowerCase();
            if (dropStack.length > 0) {
                // Already dropping. Void elements have no content, so they do not deepen the stack.
                if (!VOID_TAGS.has(tag))
                    dropStack.push(tag);
                return;
            }
            if (CUSTOM_HTML_DROP_WITH_CONTENT.has(tag)) {
                dropStack.push(tag);
                return;
            }
            if (!tags.has(tag))
                return;
            let attrs = '';
            for (const [rawName, rawValue] of Object.entries(rawAttributes)) {
                const attr = rawName.toLowerCase();
                // An allowlist, so `onerror`, `style`, `srcdoc`, `formaction`, `ping` and `data` are
                // refused by absence rather than by being remembered.
                if (!attributes.has(attr))
                    continue;
                const value = rawValue ?? '';
                if (CUSTOM_HTML_URL_ATTRIBUTES.has(attr)) {
                    const allowed = attr === 'srcset' ? isAllowedSrcset(value) : isAllowedUrl(value);
                    if (!allowed)
                        continue;
                }
                attrs += ` ${attr}="${escapeAttr(value)}"`;
            }
            // A void element is written self-closing so the output is unambiguous when it is
            // re-parsed, which is the parser disagreement this function exists to avoid.
            write(VOID_TAGS.has(tag) ? `<${tag}${attrs} />` : `<${tag}${attrs}>`);
        },
        ontext(text) {
            if (dropStack.length > 0)
                return;
            write(escapeText(text));
        },
        onclosetag(name) {
            const tag = name.toLowerCase();
            if (dropStack.length > 0) {
                if (tag === dropStack[dropStack.length - 1])
                    dropStack.pop();
                return;
            }
            if (VOID_TAGS.has(tag))
                return;
            if (!tags.has(tag))
                return;
            write(`</${tag}>`);
        },
    }, { decodeEntities: true });
    function write(text) {
        if (out.length >= maxLength)
            return;
        out += text;
    }
    parser.write(html);
    parser.end();
    if (out.length > maxLength)
        out = out.slice(0, maxLength);
    return out;
}
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
export function sanitizeBlock(block) {
    if (block === null || typeof block !== 'object')
        return block;
    const candidate = block;
    if (typeof candidate.html !== 'string')
        return block;
    return { ...block, html: sanitizeCustomHtml(candidate.html) };
}
/**
 * Filter every block in a page document's block list, including blocks nested in a `blocks`
 * field, so a custom HTML block inside a section is filtered on the same pass as one at the
 * top level.
 */
export function sanitizeBlocks(blocks) {
    return blocks.map((block) => {
        const filtered = sanitizeBlock(block);
        const nested = filtered.blocks;
        if (Array.isArray(nested)) {
            return { ...filtered, blocks: sanitizeBlocks(nested) };
        }
        return filtered;
    });
}

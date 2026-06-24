import { type Extensions } from '@tiptap/core';
/**
 * TipTap extensions constrained to the markdown subset that
 * `CmsMarkdownBody` can render on the public site: h2/h3 headings,
 * paragraphs, bold, italic, links, flat lists, blockquotes, and tables.
 */
export declare function cmsEditorExtensions(): Extensions;
/**
 * Normalize serialized markdown back into the subset `CmsMarkdownBody`
 * understands: `- ` bullets and no escape backslashes (the public renderer
 * prints backslashes literally; campaign copy never needs them).
 */
export declare function normalizeCmsMarkdown(markdown: string): string;
/** Parse markdown into the editor model and serialize it back (for tests). */
export declare function roundTripMarkdown(markdown: string): string;

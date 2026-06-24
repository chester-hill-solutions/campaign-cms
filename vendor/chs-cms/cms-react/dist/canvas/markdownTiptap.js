import { Editor } from '@tiptap/core';
import { TableKit } from '@tiptap/extension-table';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
/**
 * TipTap extensions constrained to the markdown subset that
 * `CmsMarkdownBody` can render on the public site: h2/h3 headings,
 * paragraphs, bold, italic, links, flat lists, blockquotes, and tables.
 */
export function cmsEditorExtensions() {
    return [
        StarterKit.configure({
            heading: { levels: [2, 3] },
            code: false,
            codeBlock: false,
            strike: false,
            underline: false,
            horizontalRule: false,
            link: {
                openOnClick: false,
                autolink: true,
            },
        }),
        TableKit.configure({
            table: { resizable: false },
        }),
        // breaks:true keeps single newlines as hard breaks, matching the
        // whitespace-pre-line rendering used by CmsMarkdownBody paragraphs.
        Markdown.configure({
            markedOptions: { gfm: true, breaks: true },
        }),
    ];
}
/**
 * Normalize serialized markdown back into the subset `CmsMarkdownBody`
 * understands: `- ` bullets and no escape backslashes (the public renderer
 * prints backslashes literally; campaign copy never needs them).
 */
export function normalizeCmsMarkdown(markdown) {
    return markdown
        .replace(/^(\s*)[*+] /gm, '$1- ')
        .replace(/\\([\\`*_{}[\]()#+\-.!>|~&])/g, '$1')
        .replace(/[ \t]+$/gm, '')
        .trim();
}
/** Parse markdown into the editor model and serialize it back (for tests). */
export function roundTripMarkdown(markdown) {
    const editor = new Editor({
        extensions: cmsEditorExtensions(),
        content: markdown,
        contentType: 'markdown',
    });
    const out = normalizeCmsMarkdown(editor.getMarkdown());
    editor.destroy();
    return out;
}

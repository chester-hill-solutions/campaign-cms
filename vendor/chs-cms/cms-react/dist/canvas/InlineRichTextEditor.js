import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { Bold, Heading2, Heading3, Italic, Link as LinkIcon, List, ListOrdered, Pilcrow, TextQuote, } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cmsEditorExtensions, normalizeCmsMarkdown } from './markdownTiptap';
function ToolbarButton({ label, active, onRun, children, }) {
    return (_jsx("button", { type: "button", "aria-label": label, title: label, "aria-pressed": active, className: `focus-ring inline-flex h-7 w-7 items-center justify-center rounded ${active
            ? 'bg-accent-orange text-primary-dark'
            : 'text-ink-muted hover:bg-surface-elevated hover:text-ink'}`, onMouseDown: (e) => e.preventDefault(), onClick: (e) => {
            e.stopPropagation();
            onRun();
        }, children: children }));
}
function RichTextToolbar({ editor }) {
    const state = useEditorState({
        editor,
        selector: (ctx) => ({
            bold: ctx.editor.isActive('bold'),
            italic: ctx.editor.isActive('italic'),
            link: ctx.editor.isActive('link'),
            h2: ctx.editor.isActive('heading', { level: 2 }),
            h3: ctx.editor.isActive('heading', { level: 3 }),
            paragraph: ctx.editor.isActive('paragraph'),
            bulletList: ctx.editor.isActive('bulletList'),
            orderedList: ctx.editor.isActive('orderedList'),
            blockquote: ctx.editor.isActive('blockquote'),
        }),
    });
    const iconClass = 'h-4 w-4';
    return (_jsxs("div", { className: "pb-richtext-toolbar absolute -top-9 left-0 z-30 flex items-center gap-0.5 rounded-lg border border-border-subtle bg-surface-card p-0.5 shadow-lg", role: "toolbar", "aria-label": "Text formatting", children: [_jsx(ToolbarButton, { label: "Bold", active: state.bold, onRun: () => editor.chain().focus().toggleBold().run(), children: _jsx(Bold, { className: iconClass, "aria-hidden": "true" }) }), _jsx(ToolbarButton, { label: "Italic", active: state.italic, onRun: () => editor.chain().focus().toggleItalic().run(), children: _jsx(Italic, { className: iconClass, "aria-hidden": "true" }) }), _jsx(ToolbarButton, { label: "Link", active: state.link, onRun: () => {
                    if (state.link) {
                        editor.chain().focus().unsetLink().run();
                        return;
                    }
                    const href = window.prompt('Link URL (e.g. /contact or https://…)');
                    if (!href)
                        return;
                    editor.chain().focus().setLink({ href }).run();
                }, children: _jsx(LinkIcon, { className: iconClass, "aria-hidden": "true" }) }), _jsx("span", { className: "mx-0.5 h-5 w-px bg-border-subtle", "aria-hidden": "true" }), _jsx(ToolbarButton, { label: "Paragraph", active: state.paragraph, onRun: () => editor.chain().focus().setParagraph().run(), children: _jsx(Pilcrow, { className: iconClass, "aria-hidden": "true" }) }), _jsx(ToolbarButton, { label: "Heading 2", active: state.h2, onRun: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), children: _jsx(Heading2, { className: iconClass, "aria-hidden": "true" }) }), _jsx(ToolbarButton, { label: "Heading 3", active: state.h3, onRun: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), children: _jsx(Heading3, { className: iconClass, "aria-hidden": "true" }) }), _jsx("span", { className: "mx-0.5 h-5 w-px bg-border-subtle", "aria-hidden": "true" }), _jsx(ToolbarButton, { label: "Bullet list", active: state.bulletList, onRun: () => editor.chain().focus().toggleBulletList().run(), children: _jsx(List, { className: iconClass, "aria-hidden": "true" }) }), _jsx(ToolbarButton, { label: "Numbered list", active: state.orderedList, onRun: () => editor.chain().focus().toggleOrderedList().run(), children: _jsx(ListOrdered, { className: iconClass, "aria-hidden": "true" }) }), _jsx(ToolbarButton, { label: "Quote", active: state.blockquote, onRun: () => editor.chain().focus().toggleBlockquote().run(), children: _jsx(TextQuote, { className: iconClass, "aria-hidden": "true" }) })] }));
}
export default function InlineRichTextEditor({ value, onChange }) {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const lastEmittedRef = useRef(null);
    const editor = useEditor({
        extensions: cmsEditorExtensions(),
        content: value,
        contentType: 'markdown',
        immediatelyRender: false,
        editorProps: {
            attributes: { class: 'pb-richtext' },
        },
        onUpdate: ({ editor: e }) => {
            const markdown = normalizeCmsMarkdown(e.getMarkdown());
            lastEmittedRef.current = markdown;
            onChangeRef.current(markdown);
        },
    });
    // Sync external value changes (undo/redo, revision restore) while unfocused.
    useEffect(() => {
        if (!editor || editor.isFocused)
            return;
        if (value === lastEmittedRef.current)
            return;
        const current = normalizeCmsMarkdown(editor.getMarkdown());
        if (current !== value) {
            editor.commands.setContent(value, {
                contentType: 'markdown',
                emitUpdate: false,
            });
            lastEmittedRef.current = value;
        }
    }, [editor, value]);
    const focused = useEditorState({
        editor,
        selector: (ctx) => ctx.editor?.isFocused ?? false,
    });
    return (_jsxs("div", { className: "pb-richtext-wrap relative", children: [focused && editor ? _jsx(RichTextToolbar, { editor: editor }) : null, _jsx(EditorContent, { editor: editor })] }));
}

import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import { Suspense, createContext, lazy, useContext, useEffect, useRef, } from 'react';
import { CmsMarkdownBody } from '../CmsMarkdownBody';
import { useCmsText } from '../context';
/** Stop bubble to block chrome and select a nested canvas item. */
export function selectCanvasItem(edit, selection, event) {
    event?.stopPropagation();
    edit?.selectItem?.(selection);
}
const BlockEditContext = createContext(null);
export const BlockEditProvider = BlockEditContext.Provider;
export function useBlockEdit() {
    return useContext(BlockEditContext);
}
/** Whether a nested item should show structure-selection chrome. */
export function isCanvasItemSelected(edit, blockId, opts) {
    if (!edit || edit.selectedBlockId !== blockId)
        return false;
    if (opts.itemId != null && edit.selectedItemId != null) {
        return edit.selectedItemId === opts.itemId;
    }
    if (typeof opts.itemIndex === 'number' &&
        typeof edit.selectedItemIndex === 'number') {
        return edit.selectedItemIndex === opts.itemIndex;
    }
    return false;
}
export const CANVAS_ITEM_SELECTED_CLASS = 'ring-2 ring-accent-orange ring-offset-2 ring-offset-surface-page';
function readEditableText(el, multiline) {
    if (!multiline)
        return el.textContent ?? '';
    let out = '';
    el.childNodes.forEach((node) => {
        if (node.nodeName === 'BR')
            out += '\n';
        else
            out += node.textContent ?? '';
    });
    return out;
}
function EditableTextInner({ value, onChange, placeholder, multiline = false, className, editableId, onEnterKey, onBackspaceEmpty, }) {
    const text = useCmsText();
    const ref = useRef(null);
    // Sync external value changes (undo/redo, revision restore) while not focused.
    useEffect(() => {
        const el = ref.current;
        if (!el || document.activeElement === el)
            return;
        if (readEditableText(el, multiline) !== value) {
            el.textContent = value;
        }
    });
    return (_jsx("span", { ref: ref, role: "textbox", "aria-multiline": multiline, "aria-label": text(placeholder ?? 'Text'), tabIndex: 0, contentEditable: true, suppressContentEditableWarning: true, spellCheck: true, "data-placeholder": placeholder ? text(placeholder) : undefined, "data-editable-id": editableId, className: `pb-editable ${className ?? ''}`, onInput: (e) => onChange(readEditableText(e.currentTarget, multiline)), onKeyDown: (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (multiline) {
                    document.execCommand('insertLineBreak');
                    onChange(readEditableText(e.currentTarget, multiline));
                }
                else if (onEnterKey) {
                    onEnterKey();
                }
                else {
                    e.currentTarget.blur();
                }
                return;
            }
            if (e.key === 'Escape') {
                e.currentTarget.blur();
                return;
            }
            if (e.key === 'Backspace' &&
                onBackspaceEmpty &&
                readEditableText(e.currentTarget, multiline) === '') {
                e.preventDefault();
                onBackspaceEmpty();
            }
        }, onPaste: (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            const insert = multiline ? text : text.replace(/\s*\n\s*/g, ' ');
            document.execCommand('insertText', false, insert);
            onChange(readEditableText(e.currentTarget, multiline));
        } }));
}
/**
 * Inline-editable text. Renders the plain value on the public site; a
 * contentEditable region (inheriting the surrounding typography) in the
 * builder canvas.
 */
export function EditableText({ value, update, ...rest }) {
    const edit = useBlockEdit();
    if (!edit)
        return _jsx(_Fragment, { children: value });
    return (_jsx(EditableTextInner, { value: value, onChange: (next) => edit.updateBlock(update(next)), ...rest }));
}
const InlineRichTextEditor = lazy(() => import('../canvas/InlineRichTextEditor'));
/**
 * Markdown body. Public site renders via CmsMarkdownBody; the builder canvas
 * lazy-loads a TipTap editor that round-trips to the same markdown subset.
 */
export function EditableMarkdown({ value, update }) {
    const edit = useBlockEdit();
    if (!edit)
        return _jsx(CmsMarkdownBody, { markdown: value });
    return (_jsx(Suspense, { fallback: _jsx(CmsMarkdownBody, { markdown: value }), children: _jsx(InlineRichTextEditor, { value: value, onChange: (markdown) => edit.updateBlock(update(markdown)) }) }));
}
/**
 * Hover controls for items inside a block (cards, sections, stats…).
 * Place inside a `relative` container with the `group/item` class.
 */
export function ItemControls({ label, index, count, min = 1, onMove, onRemove, }) {
    const text = useCmsText();
    const buttonClass = 'focus-ring inline-flex h-6 w-6 items-center justify-center rounded border border-border-subtle bg-surface-card text-ink-muted hover:text-ink disabled:opacity-30';
    return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stops bubbling to block select only
    _jsxs("span", { className: "pb-item-controls absolute -top-2.5 right-2 z-20 hidden gap-1 rounded-md bg-surface-card/95 p-0.5 shadow-sm group-focus-within/item:inline-flex group-hover/item:inline-flex", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { type: "button", className: buttonClass, "aria-label": text(`Move ${label} up`), disabled: index === 0, onClick: () => onMove(index - 1), children: _jsx(ArrowUp, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: buttonClass, "aria-label": text(`Move ${label} down`), disabled: index >= count - 1, onClick: () => onMove(index + 1), children: _jsx(ArrowDown, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: `${buttonClass} hover:text-accent-red`, "aria-label": text(`Remove ${label}`), disabled: count <= min, onClick: onRemove, children: _jsx(X, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) })] }));
}
/** Dashed "add item" button shown at the end of editable item collections. */
export function AddItemButton({ label, onAdd, className, }) {
    const text = useCmsText();
    return (_jsxs("button", { type: "button", className: `focus-ring inline-flex items-center gap-1.5 self-start rounded-lg border border-dashed border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-muted hover:border-accent-orange hover:text-ink ${className ?? ''}`, onClick: (e) => {
            e.stopPropagation();
            onAdd();
        }, children: [_jsx(Plus, { className: "h-3.5 w-3.5", "aria-hidden": "true" }), text(label)] }));
}
/** Reorder an array immutably. */
export function moveItem(items, from, to) {
    if (to < 0 || to >= items.length)
        return items;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    if (moved === undefined)
        return items;
    next.splice(to, 0, moved);
    return next;
}

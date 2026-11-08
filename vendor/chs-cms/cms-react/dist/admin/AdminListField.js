import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useCmsText } from '../context';
/** Controlled repeater for host-defined structured lists. */
export function AdminListField({ label, itemLabel, value, onChange, createItem, getItemKey, getItemLabel, renderItem, hint, name, addLabel, emptyLabel, moveUpLabel, moveDownLabel, removeLabel, }) {
    const text = useCmsText();
    const items = [...value];
    function updateItem(index, item) {
        onChange(items.map((current, currentIndex) => currentIndex === index ? item : current));
    }
    function moveItem(index, direction) {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= items.length)
            return;
        const next = [...items];
        [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
        onChange(next);
    }
    return (_jsxs("section", { className: "grid gap-3", "aria-label": text(label), children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { className: "grid gap-1", children: [_jsx("h3", { className: "m-0 text-sm font-semibold text-ink", children: text(label) }), hint ? _jsx("p", { className: "m-0 text-xs leading-relaxed text-ink-muted", children: text(hint) }) : null] }), _jsxs("button", { type: "button", className: "focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-elevated", onClick: () => onChange([...items, createItem()]), children: [_jsx(Plus, { size: 14, "aria-hidden": "true" }), " ", text(addLabel ?? 'Add {{item}}', { item: itemLabel.toLocaleLowerCase() })] })] }), name ? _jsx("input", { type: "hidden", name: name, value: JSON.stringify(items) }) : null, _jsxs("div", { className: "grid gap-2", children: [items.map((item, index) => {
                        const title = getItemLabel?.(item, index)?.trim() || `${itemLabel} ${index + 1}`;
                        return (_jsxs("fieldset", { className: "relative m-0 grid gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-3 pt-2", children: [_jsx("legend", { className: "max-w-full break-words px-1 text-xs font-semibold text-ink-muted", children: title }), _jsxs("div", { className: "flex flex-wrap items-center justify-end gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-grid size-11 shrink-0 place-items-center rounded text-ink-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-40", "aria-label": moveUpLabel ? text(moveUpLabel(title)) : text('Move {{item}} up', { item: title }), disabled: index === 0, onClick: () => moveItem(index, -1), children: _jsx(ArrowUp, { size: 14, "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "focus-ring inline-grid size-11 shrink-0 place-items-center rounded text-ink-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-40", "aria-label": moveDownLabel ? text(moveDownLabel(title)) : text('Move {{item}} down', { item: title }), disabled: index === items.length - 1, onClick: () => moveItem(index, 1), children: _jsx(ArrowDown, { size: 14, "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "focus-ring inline-grid size-11 shrink-0 place-items-center rounded text-ink-muted hover:text-accent-red", "aria-label": removeLabel ? text(removeLabel(title)) : text('Remove {{item}}', { item: title }), onClick: () => onChange(items.filter((_, itemIndex) => itemIndex !== index)), children: _jsx(Trash2, { size: 14, "aria-hidden": "true" }) })] }), renderItem({ item, index, onChange: (next) => updateItem(index, next) })] }, getItemKey(item, index)));
                    }), !items.length ? _jsx("p", { className: "m-0 rounded-lg border border-dashed border-border-subtle px-3 py-4 text-center text-sm text-ink-muted", children: text(emptyLabel ?? 'No {{item}} items yet.', { item: itemLabel.toLocaleLowerCase() }) }) : null] })] }));
}

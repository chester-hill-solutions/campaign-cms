import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Link2, X } from 'lucide-react';
import { useCmsText } from '../context';
/** Searchable multi-relationship picker with an ordered, removable selection. */
export function AdminRelationshipField({ label, hint, options, value, onChange, name, addLabel = 'Add', searchLabel = 'Search', searchPlaceholder = 'Search available items', availableLabel = 'Available items', chooseLabel = 'Choose an item', selectedLabel = `${label} selected`, emptyLabel = 'No items selected', unavailableLabel = 'Unavailable record', moveUpLabel, moveDownLabel, removeLabel, }) {
    const text = useCmsText();
    const generatedId = useId();
    const searchId = `${generatedId}-search`;
    const selectId = `${generatedId}-select`;
    const [query, setQuery] = useState('');
    const [candidate, setCandidate] = useState('');
    const optionsById = useMemo(() => new Map(options.map((option) => [option.id, option])), [options]);
    const selectedIds = [...new Set(value)];
    const selectedSet = new Set(selectedIds);
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const availableOptions = options.filter((option) => !option.disabled && !selectedSet.has(option.id) &&
        `${option.label} ${option.description ?? ''} ${option.id}`.toLocaleLowerCase().includes(normalizedQuery));
    const selectedOptions = selectedIds.map((id) => optionsById.get(id) ?? { id, label: id });
    function move(index, direction) {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= selectedIds.length)
            return;
        const next = [...selectedIds];
        [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
        onChange(next);
    }
    function addSelected() {
        if (!candidate || selectedSet.has(candidate))
            return;
        onChange([...selectedIds, candidate]);
        setCandidate('');
    }
    return (_jsxs("section", { className: "grid gap-3", "aria-label": text(label), children: [_jsxs("div", { className: "grid gap-1", children: [_jsx("h3", { className: "m-0 text-sm font-semibold text-ink", children: text(label) }), hint ? _jsx("p", { className: "m-0 text-xs leading-relaxed text-ink-muted", children: text(hint) }) : null] }), name ? _jsx("input", { type: "hidden", name: name, value: JSON.stringify(selectedIds) }) : null, _jsxs("div", { className: "grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end", children: [_jsxs("label", { className: "admin-field", children: [_jsx("span", { className: "admin-field__label", children: text(searchLabel) }), _jsx("input", { id: searchId, type: "search", value: query, placeholder: text(searchPlaceholder), className: "admin-field__input focus-ring min-h-11 text-base sm:text-sm", onChange: (event) => {
                                    setQuery(event.currentTarget.value);
                                    setCandidate('');
                                } })] }), _jsxs("label", { className: "admin-field", children: [_jsx("span", { className: "admin-field__label", children: text(availableLabel) }), _jsxs("select", { id: selectId, value: candidate, className: "admin-field__input focus-ring min-h-11 text-base sm:text-sm", onChange: (event) => setCandidate(event.currentTarget.value), children: [_jsx("option", { value: "", children: text(chooseLabel) }), availableOptions.map((option) => (_jsx("option", { value: option.id, children: option.label }, option.id)))] })] }), _jsxs("button", { type: "button", className: "focus-ring inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-50", disabled: !candidate, onClick: addSelected, children: [_jsx(Link2, { size: 14, "aria-hidden": "true" }), " ", text(addLabel)] })] }), _jsxs("ol", { className: "m-0 grid list-none gap-1.5 p-0", "aria-label": text(selectedLabel), children: [selectedOptions.map((option, index) => (_jsxs("li", { className: "grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-2 sm:flex sm:items-center rounded-lg border border-border-subtle bg-surface-elevated px-2.5 py-2", children: [_jsx("span", { className: "w-6 shrink-0 text-center text-[0.7rem] font-semibold text-ink-muted", "aria-hidden": "true", children: String(index + 1).padStart(2, '0') }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block break-words text-sm font-medium sm:truncate text-ink", children: option.label }), option.description ? _jsx("span", { className: "block break-words text-xs text-ink-muted sm:truncate", children: option.description }) : null, !optionsById.has(option.id) ? _jsxs("span", { className: "block text-xs text-ink-muted", children: [text(unavailableLabel), " \u00B7 ", option.id] }) : null] }), _jsxs("div", { className: "col-start-2 flex shrink-0 items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-grid size-11 shrink-0 place-items-center rounded text-ink-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-40", "aria-label": moveUpLabel ? text(moveUpLabel(option.label)) : text('Move {{item}} up', { item: option.label }), disabled: index === 0, onClick: () => move(index, -1), children: _jsx(ArrowUp, { size: 15, "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "focus-ring inline-grid size-11 shrink-0 place-items-center rounded text-ink-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-40", "aria-label": moveDownLabel ? text(moveDownLabel(option.label)) : text('Move {{item}} down', { item: option.label }), disabled: index === selectedOptions.length - 1, onClick: () => move(index, 1), children: _jsx(ArrowDown, { size: 15, "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "focus-ring inline-grid size-11 shrink-0 place-items-center rounded text-ink-muted hover:text-accent-red", "aria-label": removeLabel ? text(removeLabel(option.label)) : text('Remove {{item}}', { item: option.label }), onClick: () => onChange(selectedIds.filter((id) => id !== option.id)), children: _jsx(X, { size: 15, "aria-hidden": "true" }) })] })] }, option.id))), !selectedOptions.length ? _jsx("li", { className: "rounded-lg border border-dashed border-border-subtle px-3 py-4 text-center text-sm text-ink-muted", children: text(emptyLabel) }) : null] })] }));
}

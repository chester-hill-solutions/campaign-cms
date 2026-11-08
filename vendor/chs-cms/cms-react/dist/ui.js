import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus, X } from 'lucide-react';
import { useId, useState } from 'react';
import { useCmsText } from './context';
/** Labeled text input matching the host admin theme (`admin-field` tokens). */
export function AdminTextInput({ label, hint, id: idProp, className, ...props }) {
    const text = useCmsText();
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    return (_jsxs("div", { className: "admin-field", children: [_jsx("label", { htmlFor: inputId, className: "admin-field__label", children: text(label) }), _jsx("input", { ...props, id: inputId, className: `admin-field__input focus-ring ${className ?? ''}` }), hint ? _jsx("span", { className: "admin-field__hint", children: typeof hint === 'string' ? text(hint) : hint }) : null] }));
}
export function AdminTextArea({ label, hint, id: idProp, className, rows = 3, ...props }) {
    const text = useCmsText();
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    return (_jsxs("div", { className: "admin-field", children: [_jsx("label", { htmlFor: inputId, className: "admin-field__label", children: text(label) }), _jsx("textarea", { ...props, id: inputId, rows: rows, className: `admin-field__input focus-ring ${className ?? ''}` }), hint ? _jsx("span", { className: "admin-field__hint", children: typeof hint === 'string' ? text(hint) : hint }) : null] }));
}
/** Labeled select matching the host admin theme (`admin-field` tokens). */
export function AdminSelect({ label, hint, id: idProp, className, children, ...props }) {
    const text = useCmsText();
    const generatedId = useId();
    const selectId = idProp ?? generatedId;
    return (_jsxs("div", { className: "admin-field", children: [_jsx("label", { htmlFor: selectId, className: "admin-field__label", children: text(label) }), _jsx("select", { ...props, id: selectId, className: `admin-field__input focus-ring ${className ?? ''}`, children: children }), hint ? _jsx("span", { className: "admin-field__hint", children: typeof hint === 'string' ? text(hint) : hint }) : null] }));
}
export function AdminCheckbox({ label, ...props }) {
    const text = useCmsText();
    return (_jsxs("label", { className: "admin-checkbox", children: [_jsx("input", { type: "checkbox", ...props }), _jsx("span", { children: text(label) })] }));
}
/** Reusable tag/string-list editor for small, editor-managed vocabularies. */
export function AdminTagInput({ label, hint, name, value, onChange, addLabel = 'Add', emptyLabel = 'No values added', id: idProp, className, placeholder = 'Type a value and press Enter', maxLength = 120, onKeyDown, ...inputProps }) {
    const text = useCmsText();
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const [draft, setDraft] = useState('');
    const values = Array.isArray(value) ? value : [];
    function addValue() {
        const nextValue = draft.trim().replace(/,+$/, '').trim();
        if (!nextValue)
            return;
        if (!values.some((item) => item.toLocaleLowerCase() === nextValue.toLocaleLowerCase())) {
            onChange([...values, nextValue]);
        }
        setDraft('');
    }
    return (_jsxs("div", { className: "admin-field", children: [_jsx("label", { htmlFor: inputId, className: "admin-field__label", children: text(label) }), name ? _jsx("input", { type: "hidden", name: name, value: JSON.stringify(values) }) : null, _jsxs("ul", { className: "flex flex-wrap gap-2", "aria-label": text('{{label}} values', { label }), children: [values.map((item, index) => (_jsxs("li", { className: "inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface-elevated px-2 py-1 text-xs", children: [_jsx("span", { children: item }), _jsx("button", { type: "button", className: "focus-ring rounded p-0.5 text-ink-muted hover:text-ink", "aria-label": text('Remove {{value}}', { value: item }), onClick: () => onChange(values.filter((_, itemIndex) => itemIndex !== index)), children: _jsx(X, { size: 13, "aria-hidden": "true" }) })] }, `${item}-${index}`))), values.length === 0 ? _jsx("li", { className: "text-sm text-ink-muted", children: text(emptyLabel) }) : null] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { ...inputProps, id: inputId, type: "text", value: draft, maxLength: maxLength, placeholder: text(placeholder), className: `admin-field__input focus-ring ${className ?? ''}`, onChange: (event) => setDraft(event.currentTarget.value), onKeyDown: (event) => {
                            onKeyDown?.(event);
                            if (!event.defaultPrevented && (event.key === 'Enter' || event.key === ',')) {
                                event.preventDefault();
                                addValue();
                            }
                        } }), _jsxs("button", { type: "button", className: "focus-ring inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-50", onClick: addValue, disabled: !draft.trim(), children: [_jsx(Plus, { size: 14, "aria-hidden": "true" }), " ", text(addLabel)] })] }), hint ? _jsx("span", { className: "admin-field__hint", children: typeof hint === 'string' ? text(hint) : hint }) : null] }));
}

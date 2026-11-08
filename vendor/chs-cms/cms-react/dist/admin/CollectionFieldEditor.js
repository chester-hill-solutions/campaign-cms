import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AdminCheckbox, AdminTextArea, AdminTextInput } from '../ui';
const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'url', label: 'URL' },
    { value: 'date', label: 'Date' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'stringList', label: 'String List' },
    { value: 'image', label: 'Image' },
];
export function CollectionFieldEditor({ initial, onSave, onCancel, saving, }) {
    const [key, setKey] = useState(initial?.key ?? '');
    const [label, setLabel] = useState(initial?.label ?? '');
    const [type, setType] = useState(initial?.type ?? 'text');
    const [required, setRequired] = useState(initial?.required === 1);
    const [placeholder, setPlaceholder] = useState(initial?.config?.placeholder ?? '');
    const [helpText, setHelpText] = useState(initial?.config?.helpText ?? '');
    const [optionsStr, setOptionsStr] = useState(initial?.config?.options?.join(', ') ?? '');
    const [validationError, setValidationError] = useState(null);
    const showPlaceholder = type !== 'boolean';
    const showOptions = type === 'stringList';
    const handleSave = async () => {
        if (!key.trim() || !label.trim()) {
            setValidationError('Key and label are required');
            return;
        }
        setValidationError(null);
        const config = {};
        if (placeholder)
            config.placeholder = placeholder;
        if (helpText)
            config.helpText = helpText;
        if (type === 'stringList' && optionsStr.trim()) {
            config.options = optionsStr
                .split(',')
                .map((o) => o.trim())
                .filter(Boolean);
        }
        await onSave({
            key: key.trim(),
            label: label.trim(),
            type,
            required: required ? 1 : 0,
            config,
        });
    };
    return (_jsxs("div", { className: "grid gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(AdminTextInput, { label: "Key", value: key, onChange: (e) => setKey(e.target.value), placeholder: "e.g. projectDate", hint: "Machine name" }), _jsx(AdminTextInput, { label: "Label", value: label, onChange: (e) => setLabel(e.target.value), placeholder: "e.g. Project date" })] }), _jsxs("div", { className: "admin-field", children: [_jsx("label", { className: "admin-field__label", children: "Type" }), _jsx("select", { value: type, onChange: (e) => setType(e.target.value), className: "admin-field__input focus-ring", children: FIELD_TYPES.map((ft) => (_jsx("option", { value: ft.value, children: ft.label }, ft.value))) })] }), _jsx(AdminCheckbox, { label: "Required", checked: required, onChange: (e) => setRequired(e.target.checked) }), showOptions ? (_jsx(AdminTextInput, { label: "Options (comma-separated)", value: optionsStr, onChange: (e) => setOptionsStr(e.target.value), placeholder: "Option A, Option B, Option C", hint: "Each option appears as a selectable value" })) : null, showPlaceholder ? (_jsx(AdminTextInput, { label: "Placeholder", value: placeholder, onChange: (e) => setPlaceholder(e.target.value), placeholder: "Placeholder text\\u2026" })) : null, _jsx(AdminTextArea, { label: "Help text", value: helpText, onChange: (e) => setHelpText(e.target.value), placeholder: "Help text shown below the field" }), validationError ? (_jsx("p", { className: "text-xs font-semibold text-accent-red", role: "alert", children: validationError })) : null, _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark disabled:opacity-50", disabled: saving, onClick: handleSave, children: saving
                            ? 'Saving\u2026'
                            : initial
                                ? 'Update'
                                : 'Create' }), _jsx("button", { type: "button", className: "focus-ring rounded-full px-4 py-1.5 text-sm font-semibold text-ink-muted hover:bg-surface-page hover:text-ink", onClick: onCancel, children: "Cancel" })] })] }));
}

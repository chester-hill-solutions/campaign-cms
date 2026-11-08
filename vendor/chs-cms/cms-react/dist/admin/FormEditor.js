import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDown, ArrowUp, Plus, Trash2, TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';
import { FORM_FIELD_TYPES } from '@chester-hill-solutions/cms-core';
import { AdminCheckbox, AdminTextArea, AdminTextInput } from '../ui';
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/^(\d)/, '_$1');
}
const FIELD_TYPE_LABELS = {
    text: 'Text',
    email: 'Email',
    textarea: 'Textarea',
    select: 'Select',
    checkbox: 'Checkbox',
    radio: 'Radio',
    phone: 'Phone',
    hidden: 'Hidden',
};
export function FormEditor({ formId, initialTitle, initialDescription, initialFields, initialSettings, onSave, saving, error, }) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription ?? '');
    const [fields, setFields] = useState(initialFields);
    const [settings, setSettings] = useState(initialSettings);
    const [savingLocal, setSavingLocal] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [showFieldPicker, setShowFieldPicker] = useState(false);
    const handleFieldAdd = (type) => {
        const fieldCount = fields.length;
        const id = `f_${crypto.randomUUID().slice(0, 8)}`;
        const newField = {
            id,
            type,
            label: '',
            key: '',
            required: false,
            validation: {},
            sortOrder: fieldCount,
        };
        if (type === 'select' || type === 'radio' || type === 'checkbox') {
            newField.options = [];
        }
        setFields([...fields, newField]);
        setShowFieldPicker(false);
    };
    const handleFieldRemove = (fieldId) => {
        setFields(fields
            .filter((f) => f.id !== fieldId)
            .map((f, i) => ({ ...f, sortOrder: i })));
    };
    const moveField = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= fields.length)
            return;
        const updated = [...fields];
        const temp = updated[index];
        updated[index] = { ...updated[newIndex], sortOrder: index };
        updated[newIndex] = { ...temp, sortOrder: newIndex };
        setFields(updated);
    };
    const updateField = (fieldId, patch) => {
        setFields(fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)));
    };
    const handleLabelChange = (fieldId, label) => {
        const field = fields.find((f) => f.id === fieldId);
        const key = field?.key
            ? field.key
            : slugify(label).slice(0, 80) || `field_${fieldId.slice(0, 4)}`;
        updateField(fieldId, { label, key });
    };
    const handleOptionAdd = (fieldId) => {
        const field = fields.find((f) => f.id === fieldId);
        if (!field)
            return;
        const options = [...(field.options ?? []), ''];
        updateField(fieldId, { options });
    };
    const handleOptionChange = (fieldId, optionIndex, value) => {
        const field = fields.find((f) => f.id === fieldId);
        if (!field || !field.options)
            return;
        const options = [...field.options];
        options[optionIndex] = value;
        updateField(fieldId, { options });
    };
    const handleOptionRemove = (fieldId, optionIndex) => {
        const field = fields.find((f) => f.id === fieldId);
        if (!field || !field.options)
            return;
        const options = field.options.filter((_, i) => i !== optionIndex);
        updateField(fieldId, { options: options.length > 0 ? options : undefined });
    };
    const handleSave = async () => {
        if (!title.trim()) {
            setSaveError('Title is required');
            return;
        }
        if (fields.length === 0) {
            setSaveError('At least one field is required');
            return;
        }
        if (fields.some((f) => !f.label.trim())) {
            setSaveError('All fields must have a label');
            return;
        }
        setSavingLocal(true);
        setSaveError(null);
        const orderedFields = fields.map((f, i) => ({ ...f, sortOrder: i }));
        const result = await onSave({
            title: title.trim(),
            description: description.trim() || undefined,
            fields: orderedFields,
            settings,
        });
        if (!result.ok) {
            setSaveError(result.error);
        }
        setSavingLocal(false);
    };
    const hasOptions = (type) => type === 'select' || type === 'radio' || type === 'checkbox';
    const isSaving = saving || savingLocal;
    const displayError = error ?? saveError;
    return (_jsxs("div", { className: "grid gap-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx("h1", { className: "text-xl font-bold text-ink", children: formId ? `Edit: ${initialTitle}` : 'New form' }) }), _jsxs("section", { className: "grid gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsx("h2", { className: "text-sm font-bold text-ink", children: "Form details" }), _jsx(AdminTextInput, { label: "Title", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Contact Us" }), _jsx(AdminTextArea, { label: "Description", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Optional description shown above the form" })] }), _jsxs("section", { className: "grid gap-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-lg font-bold text-ink", children: ["Fields (", fields.length, ")"] }), !showFieldPicker ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark", onClick: () => setShowFieldPicker(true), children: [_jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }), "Add field"] })) : null] }), showFieldPicker ? (_jsxs("div", { className: "rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-bold text-ink", children: "Field type" }), _jsx("button", { type: "button", className: "focus-ring text-ink-muted hover:text-ink", "aria-label": "Close", onClick: () => setShowFieldPicker(false), children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: FORM_FIELD_TYPES.map((type) => (_jsx("button", { type: "button", className: "focus-ring rounded-full border border-border-subtle bg-surface-page px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface-elevated", onClick: () => handleFieldAdd(type), children: FIELD_TYPE_LABELS[type] }, type))) })] })) : null, fields.map((field, index) => (_jsxs("div", { className: "grid gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "rounded-full bg-accent-orange/10 px-2 py-0.5 text-xs font-semibold text-accent-orange", children: FIELD_TYPE_LABELS[field.type] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-surface-page hover:text-ink disabled:opacity-30", disabled: index === 0, onClick: () => moveField(index, -1), "aria-label": "Move up", children: _jsx(ArrowUp, { className: "h-4 w-4", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "focus-ring inline-flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-surface-page hover:text-ink disabled:opacity-30", disabled: index === fields.length - 1, onClick: () => moveField(index, 1), "aria-label": "Move down", children: _jsx(ArrowDown, { className: "h-4 w-4", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "focus-ring inline-flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-surface-page hover:text-accent-red", onClick: () => handleFieldRemove(field.id), "aria-label": "Remove field", children: _jsx(Trash2, { className: "h-4 w-4", "aria-hidden": "true" }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(AdminTextInput, { label: "Label", value: field.label, onChange: (e) => handleLabelChange(field.id, e.target.value), placeholder: "e.g. Your name" }), _jsx(AdminTextInput, { label: "Key", value: field.key, onChange: (e) => updateField(field.id, { key: e.target.value }), placeholder: "e.g. name", hint: "Machine name for submission keys" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [field.type !== 'hidden' ? (_jsx(AdminTextInput, { label: "Placeholder", value: field.placeholder ?? '', onChange: (e) => updateField(field.id, {
                                            placeholder: e.target.value || undefined,
                                        }), placeholder: "Placeholder text\\u2026" })) : null, _jsx(AdminCheckbox, { label: "Required", checked: field.required, onChange: (e) => updateField(field.id, { required: e.target.checked }) })] }), _jsx(AdminTextArea, { label: "Helper text", value: field.helperText ?? '', onChange: (e) => updateField(field.id, {
                                    helperText: e.target.value || undefined,
                                }), placeholder: "Shown below the field" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(AdminTextInput, { label: "Min length", type: "number", min: 0, max: 10000, value: field.validation?.minLength !== undefined
                                            ? String(field.validation.minLength)
                                            : '', onChange: (e) => {
                                            const v = e.target.value;
                                            updateField(field.id, {
                                                validation: {
                                                    ...field.validation,
                                                    minLength: v ? Number(v) : undefined,
                                                },
                                            });
                                        } }), _jsx(AdminTextInput, { label: "Max length", type: "number", min: 1, max: 10000, value: field.validation?.maxLength !== undefined
                                            ? String(field.validation.maxLength)
                                            : '', onChange: (e) => {
                                            const v = e.target.value;
                                            updateField(field.id, {
                                                validation: {
                                                    ...field.validation,
                                                    maxLength: v ? Number(v) : undefined,
                                                },
                                            });
                                        } })] }), _jsx(AdminTextInput, { label: "Validation pattern (regex)", value: field.validation?.pattern ?? '', onChange: (e) => updateField(field.id, {
                                    validation: {
                                        ...field.validation,
                                        pattern: e.target.value || undefined,
                                    },
                                }), hint: "e.g. ^[a-zA-Z]+$" }), hasOptions(field.type) ? (_jsxs("div", { className: "grid gap-2", children: [_jsx("span", { className: "text-xs font-semibold text-ink-muted", children: "Options" }), (field.options ?? []).map((option, oi) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { value: option, onChange: (e) => handleOptionChange(field.id, oi, e.target.value), placeholder: `Option ${oi + 1}`, className: "admin-field__input focus-ring flex-1 text-sm" }), _jsx("button", { type: "button", className: "focus-ring shrink-0 text-ink-muted hover:text-accent-red", onClick: () => handleOptionRemove(field.id, oi), "aria-label": "Remove option", children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] }, oi))), _jsx("button", { type: "button", className: "focus-ring self-start text-xs font-semibold text-accent-orange underline", onClick: () => handleOptionAdd(field.id), children: "+ Add option" })] })) : null] }, field.id))), fields.length === 0 ? (_jsx("p", { className: "rounded-lg border border-dashed border-border-subtle p-6 text-center text-sm text-ink-muted", children: "No fields yet. Click \u201CAdd field\u201D to get started." })) : null] }), _jsxs("section", { className: "grid gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsx("h2", { className: "text-sm font-bold text-ink", children: "Form settings" }), _jsx(AdminTextInput, { label: "Submit button text", value: settings.submitButtonText, onChange: (e) => setSettings({ ...settings, submitButtonText: e.target.value }), placeholder: "Submit" }), _jsx(AdminTextArea, { label: "Success message", value: settings.successMessage, onChange: (e) => setSettings({ ...settings, successMessage: e.target.value }), placeholder: "Thank you! Your submission has been received.", rows: 2 }), _jsx(AdminTextInput, { label: "Notification email", type: "email", value: settings.notificationEmail ?? '', onChange: (e) => setSettings({
                            ...settings,
                            notificationEmail: e.target.value || undefined,
                        }), hint: "Send email notification on each submission (not yet implemented)" }), _jsx(AdminTextInput, { label: "Redirect URL", value: settings.redirectUrl ?? '', onChange: (e) => setSettings({
                            ...settings,
                            redirectUrl: e.target.value || undefined,
                        }), hint: "Redirect after successful submission (optional)" })] }), displayError ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent-red/30 bg-accent-red/5 p-3 text-sm text-accent-red", role: "alert", children: [_jsx(TriangleAlert, { className: "h-4 w-4 shrink-0", "aria-hidden": "true" }), displayError] })) : null, _jsx("div", { className: "flex gap-2", children: _jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-6 py-2 text-sm font-bold text-primary-dark disabled:opacity-50", disabled: isSaving, onClick: handleSave, children: isSaving ? 'Saving\u2026' : 'Save form' }) })] }));
}

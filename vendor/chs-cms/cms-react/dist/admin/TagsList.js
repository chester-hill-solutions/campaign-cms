import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoaderCircle, Pencil, Plus, Trash2, TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';
import { AdminTextArea, AdminTextInput } from '../ui';
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
export function TagsList({ tags, onCreate, onUpdate, onDelete, loading, error, }) {
    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formId, setFormId] = useState('');
    const [formLabel, setFormLabel] = useState('');
    const [formSlug, setFormSlug] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [slugAuto, setSlugAuto] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const handleLabelChange = (value) => {
        setFormLabel(value);
        if (slugAuto) {
            setFormSlug(slugify(value));
        }
    };
    const handleSlugChange = (value) => {
        setFormSlug(value);
        setSlugAuto(false);
    };
    const openCreate = () => {
        setFormOpen(true);
        setEditId(null);
        setFormId('');
        setFormLabel('');
        setFormSlug('');
        setFormDescription('');
        setSlugAuto(true);
        setFormError(null);
    };
    const openEdit = (tag) => {
        setFormOpen(true);
        setEditId(tag.id);
        setFormId(tag.id);
        setFormLabel(tag.label);
        setFormSlug(tag.slug);
        setFormDescription(tag.description ?? '');
        setSlugAuto(false);
        setFormError(null);
    };
    const closeForm = () => {
        setFormOpen(false);
        setEditId(null);
    };
    const handleSave = async () => {
        if (!formId.trim() || !formLabel.trim()) {
            setFormError('ID and label are required');
            return;
        }
        setSubmitting(true);
        setFormError(null);
        if (editId) {
            const result = await onUpdate(editId, {
                label: formLabel.trim(),
                slug: formSlug.trim(),
                description: formDescription.trim() || undefined,
            });
            if (!result.ok) {
                setFormError(result.error);
            }
            else {
                closeForm();
            }
        }
        else {
            const result = await onCreate({
                id: formId.trim(),
                label: formLabel.trim(),
                slug: formSlug.trim(),
                description: formDescription.trim() || undefined,
            });
            if (!result.ok) {
                setFormError(result.error);
            }
            else {
                closeForm();
            }
        }
        setSubmitting(false);
    };
    const handleDelete = async (id) => {
        setDeleting(true);
        await onDelete(id);
        setDeleteConfirm(null);
        setDeleting(false);
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center p-12", children: _jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-ink-muted", "aria-hidden": "true" }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent-red/30 bg-accent-red/5 p-4 text-sm text-accent-red", role: "alert", children: [_jsx(TriangleAlert, { className: "h-4 w-4 shrink-0", "aria-hidden": "true" }), error] }));
    }
    return (_jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold text-ink", children: "Tags" }), !formOpen ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark", onClick: openCreate, children: [_jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }), "New tag"] })) : null] }), formOpen ? (_jsxs("div", { className: "grid gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-sm font-bold text-ink", children: editId ? 'Edit tag' : 'New tag' }), _jsx("button", { type: "button", className: "focus-ring text-ink-muted hover:text-ink", "aria-label": "Close", onClick: closeForm, children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] }), _jsx(AdminTextInput, { label: "ID", value: formId, onChange: (e) => setFormId(e.target.value), placeholder: "e.g. my-tag", hint: "Machine name", disabled: !!editId }), _jsx(AdminTextInput, { label: "Label", value: formLabel, onChange: (e) => handleLabelChange(e.target.value), placeholder: "e.g. My Tag" }), _jsx(AdminTextInput, { label: "Slug", value: formSlug, onChange: (e) => handleSlugChange(e.target.value), placeholder: "e.g. my-tag", hint: "URL-friendly identifier" }), _jsx(AdminTextArea, { label: "Description", value: formDescription, onChange: (e) => setFormDescription(e.target.value), placeholder: "Optional description" }), formError ? (_jsx("p", { className: "text-xs font-semibold text-accent-red", role: "alert", children: formError })) : null, _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark disabled:opacity-50", disabled: submitting, onClick: handleSave, children: submitting
                                    ? 'Saving\u2026'
                                    : editId
                                        ? 'Update'
                                        : 'Create' }), _jsx("button", { type: "button", className: "focus-ring rounded-full px-4 py-1.5 text-sm font-semibold text-ink-muted hover:bg-surface-page hover:text-ink", onClick: closeForm, children: "Cancel" })] })] })) : null, _jsx("div", { className: "overflow-hidden rounded-lg border border-border-subtle", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "border-b border-border-subtle bg-surface-elevated", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Label" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Slug" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Description" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted" })] }) }), _jsxs("tbody", { children: [tags.map((tag) => (_jsxs("tr", { className: "border-b border-border-subtle last:border-b-0", children: [_jsx("td", { className: "px-4 py-3 font-medium text-ink", children: tag.label }), _jsx("td", { className: "px-4 py-3 font-mono text-xs text-ink-muted", children: tag.slug }), _jsx("td", { className: "px-4 py-3 text-ink-muted", children: tag.description ?? '\u2014' }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-ink", "aria-label": `Edit ${tag.label}`, onClick: () => openEdit(tag), children: _jsx(Pencil, { className: "h-4 w-4", "aria-hidden": "true" }) }), deleteConfirm === tag.id ? (_jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1 rounded-full bg-accent-red px-3 py-1 text-xs font-bold text-white disabled:opacity-50", disabled: deleting, onClick: () => handleDelete(tag.id), children: deleting ? '\u2026' : 'Confirm' }), _jsx("button", { type: "button", className: "focus-ring text-xs font-semibold text-ink-muted hover:text-ink", onClick: () => setDeleteConfirm(null), children: "Cancel" })] })) : (_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-accent-red", "aria-label": `Delete ${tag.label}`, onClick: () => setDeleteConfirm(tag.id), children: _jsx(Trash2, { className: "h-4 w-4", "aria-hidden": "true" }) }))] }) })] }, tag.id))), tags.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-4 py-8 text-center text-sm text-ink-muted", children: "No tags yet." }) })) : null] })] }) })] }));
}

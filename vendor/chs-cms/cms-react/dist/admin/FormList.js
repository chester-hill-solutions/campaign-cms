import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoaderCircle, Pencil, Plus, Trash2, TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';
import { AdminTextArea, AdminTextInput } from '../ui';
export function FormList({ forms, onCreate, onDelete, loading, error, }) {
    const [showForm, setShowForm] = useState(false);
    const [newId, setNewId] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const resetForm = () => {
        setShowForm(false);
        setNewId('');
        setNewTitle('');
        setNewDescription('');
        setFormError(null);
    };
    const handleCreate = async () => {
        if (!newId.trim() || !newTitle.trim()) {
            setFormError('ID and title are required');
            return;
        }
        setSubmitting(true);
        setFormError(null);
        const result = await onCreate({
            id: newId.trim(),
            title: newTitle.trim(),
            description: newDescription.trim() || undefined,
        });
        if (result.ok) {
            resetForm();
        }
        else {
            setFormError(result.error);
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
    return (_jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold text-ink", children: "Forms" }), !showForm ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark", onClick: () => setShowForm(true), children: [_jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }), "New form"] })) : null] }), showForm ? (_jsxs("div", { className: "rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsx("h2", { className: "text-sm font-bold text-ink", children: "Create form" }), _jsx("button", { type: "button", className: "focus-ring text-ink-muted hover:text-ink", "aria-label": "Cancel", onClick: resetForm, children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] }), _jsxs("div", { className: "grid gap-3", children: [_jsx(AdminTextInput, { label: "ID", value: newId, onChange: (e) => setNewId(e.target.value), placeholder: "e.g. contact-us", hint: "Machine name, used to reference this form in blocks" }), _jsx(AdminTextInput, { label: "Title", value: newTitle, onChange: (e) => setNewTitle(e.target.value), placeholder: "e.g. Contact Us" }), _jsx(AdminTextArea, { label: "Description", value: newDescription, onChange: (e) => setNewDescription(e.target.value), placeholder: "Optional description" }), formError ? (_jsx("p", { className: "text-xs font-semibold text-accent-red", role: "alert", children: formError })) : null, _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark disabled:opacity-50", disabled: submitting, onClick: handleCreate, children: submitting ? 'Creating\u2026' : 'Create' }), _jsx("button", { type: "button", className: "focus-ring rounded-full px-4 py-1.5 text-sm font-semibold text-ink-muted hover:bg-surface-page hover:text-ink", onClick: resetForm, children: "Cancel" })] })] })] })) : null, _jsx("div", { className: "overflow-hidden rounded-lg border border-border-subtle", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "border-b border-border-subtle bg-surface-elevated", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Title" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "ID" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Fields" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted" })] }) }), _jsxs("tbody", { children: [forms.map((form) => {
                                    const fieldCount = (() => {
                                        try {
                                            return JSON.parse(form.fields_json).length;
                                        }
                                        catch {
                                            return 0;
                                        }
                                    })();
                                    return (_jsxs("tr", { className: "border-b border-border-subtle last:border-b-0", children: [_jsx("td", { className: "px-4 py-3 font-medium text-ink", children: form.title }), _jsx("td", { className: "px-4 py-3 font-mono text-xs text-ink-muted", children: form.id }), _jsx("td", { className: "px-4 py-3 text-ink-muted", children: fieldCount }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx("a", { href: `/admin/forms/${form.id}`, className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-ink", "aria-label": `Edit ${form.title}`, children: _jsx(Pencil, { className: "h-4 w-4", "aria-hidden": "true" }) }), _jsx("a", { href: `/admin/forms/${form.id}/responses`, className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-ink", "aria-label": `Responses for ${form.title}`, title: "View responses", children: _jsx("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }) }), deleteConfirm === form.id ? (_jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1 rounded-full bg-accent-red px-3 py-1 text-xs font-bold text-white disabled:opacity-50", disabled: deleting, onClick: () => handleDelete(form.id), children: deleting ? '\u2026' : 'Confirm' }), _jsx("button", { type: "button", className: "focus-ring text-xs font-semibold text-ink-muted hover:text-ink", onClick: () => setDeleteConfirm(null), children: "Cancel" })] })) : (_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-accent-red", "aria-label": `Delete ${form.title}`, onClick: () => setDeleteConfirm(form.id), children: _jsx(Trash2, { className: "h-4 w-4", "aria-hidden": "true" }) }))] }) })] }, form.id));
                                }), forms.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-4 py-8 text-center text-sm text-ink-muted", children: "No forms yet." }) })) : null] })] }) })] }));
}

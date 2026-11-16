import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoaderCircle, Pencil, Plus, Trash2, TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';
import { AdminTextArea, AdminTextInput } from '../ui';
import { CollectionFieldEditor } from './CollectionFieldEditor';
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
export function CollectionDetail({ collection, categories, fields, onUpdateCollection, onCreateCategory, onUpdateCategory, onDeleteCategory, onCreateField, onUpdateField, onDeleteField, loading, error, }) {
    const [editingCollection, setEditingCollection] = useState(false);
    const [editLabel, setEditLabel] = useState(collection.label);
    const [editDescription, setEditDescription] = useState(collection.description ?? '');
    const [savingCollection, setSavingCollection] = useState(false);
    const [collectionError, setCollectionError] = useState(null);
    const [activeTab, setActiveTab] = useState('categories');
    const [catFormOpen, setCatFormOpen] = useState(false);
    const [catEditId, setCatEditId] = useState(null);
    const [catId, setCatId] = useState('');
    const [catLabel, setCatLabel] = useState('');
    const [catSlug, setCatSlug] = useState('');
    const [catDescription, setCatDescription] = useState('');
    const [catSortOrder, setCatSortOrder] = useState(0);
    const [catSlugAuto, setCatSlugAuto] = useState(true);
    const [catSubmitting, setCatSubmitting] = useState(false);
    const [catFormError, setCatFormError] = useState(null);
    const [catDeleteConfirm, setCatDeleteConfirm] = useState(null);
    const [catDeleting, setCatDeleting] = useState(false);
    const [fieldFormOpen, setFieldFormOpen] = useState(false);
    const [fieldEditId, setFieldEditId] = useState(null);
    const [fieldSubmitting, setFieldSubmitting] = useState(false);
    const [fieldDeleteConfirm, setFieldDeleteConfirm] = useState(null);
    const [fieldDeleting, setFieldDeleting] = useState(false);
    const handleCatLabelChange = (value) => {
        setCatLabel(value);
        if (catSlugAuto && !catEditId) {
            setCatSlug(slugify(value));
        }
    };
    const handleCatSlugChange = (value) => {
        setCatSlug(value);
        if (!catEditId)
            setCatSlugAuto(false);
    };
    const openCatCreate = () => {
        setCatFormOpen(true);
        setCatEditId(null);
        setCatId('');
        setCatLabel('');
        setCatSlug('');
        setCatDescription('');
        setCatSortOrder(0);
        setCatSlugAuto(true);
        setCatFormError(null);
    };
    const openCatEdit = (cat) => {
        setCatFormOpen(true);
        setCatEditId(cat.id);
        setCatId(cat.id);
        setCatLabel(cat.label);
        setCatSlug(cat.slug);
        setCatDescription(cat.description ?? '');
        setCatSortOrder(cat.sortOrder);
        setCatSlugAuto(false);
        setCatFormError(null);
    };
    const closeCatForm = () => {
        setCatFormOpen(false);
        setCatEditId(null);
    };
    const handleCatSave = async () => {
        if (!catId.trim() || !catLabel.trim()) {
            setCatFormError('ID and label are required');
            return;
        }
        setCatSubmitting(true);
        setCatFormError(null);
        if (catEditId) {
            const result = await onUpdateCategory(catEditId, {
                label: catLabel.trim(),
                slug: catSlug.trim(),
                description: catDescription.trim() || undefined,
                sortOrder: catSortOrder,
            });
            if (!result.ok) {
                setCatFormError(result.error);
            }
            else {
                closeCatForm();
            }
        }
        else {
            const result = await onCreateCategory({
                id: catId.trim(),
                collectionId: collection.id,
                label: catLabel.trim(),
                slug: catSlug.trim(),
                description: catDescription.trim() || undefined,
                sortOrder: catSortOrder,
            });
            if (!result.ok) {
                setCatFormError(result.error);
            }
            else {
                closeCatForm();
            }
        }
        setCatSubmitting(false);
    };
    const handleFieldSave = async (data) => {
        setFieldSubmitting(true);
        if (fieldEditId) {
            const result = await onUpdateField(fieldEditId, data);
            if (result.ok) {
                setFieldFormOpen(false);
                setFieldEditId(null);
            }
        }
        else {
            const result = await onCreateField({
                id: data.key,
                collectionId: collection.id,
                ...data,
            });
            if (result.ok) {
                setFieldFormOpen(false);
            }
        }
        setFieldSubmitting(false);
    };
    const handleCatDelete = async (id) => {
        setCatDeleting(true);
        await onDeleteCategory(id);
        setCatDeleteConfirm(null);
        setCatDeleting(false);
    };
    const handleFieldDelete = async (id) => {
        setFieldDeleting(true);
        await onDeleteField(id);
        setFieldDeleteConfirm(null);
        setFieldDeleting(false);
    };
    const handleCollectionSave = async () => {
        setSavingCollection(true);
        setCollectionError(null);
        const result = await onUpdateCollection(collection.id, {
            label: editLabel.trim(),
            description: editDescription.trim() || undefined,
        });
        if (result.ok) {
            setEditingCollection(false);
        }
        else {
            setCollectionError(result.error);
        }
        setSavingCollection(false);
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center p-12", children: _jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-ink-muted", "aria-hidden": "true" }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent-red/30 bg-accent-red/5 p-4 text-sm text-accent-red", role: "alert", children: [_jsx(TriangleAlert, { className: "h-4 w-4 shrink-0", "aria-hidden": "true" }), error] }));
    }
    const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    const sortedFields = [...fields].sort((a, b) => a.sortOrder - b.sortOrder);
    return (_jsxs("div", { className: "grid gap-6", children: [_jsxs("section", { className: "grid gap-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold text-ink", children: collection.label }), !editingCollection ? (_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-ink", "aria-label": "Edit collection", onClick: () => setEditingCollection(true), children: _jsx(Pencil, { className: "h-4 w-4", "aria-hidden": "true" }) })) : null] }), editingCollection ? (_jsxs("div", { className: "grid gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsx(AdminTextInput, { label: "Label", value: editLabel, onChange: (e) => setEditLabel(e.target.value) }), _jsx(AdminTextArea, { label: "Description", value: editDescription, onChange: (e) => setEditDescription(e.target.value) }), collectionError ? (_jsx("p", { className: "text-xs font-semibold text-accent-red", role: "alert", children: collectionError })) : null, _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark disabled:opacity-50", disabled: savingCollection, onClick: handleCollectionSave, children: savingCollection ? 'Saving\u2026' : 'Save' }), _jsx("button", { type: "button", className: "focus-ring rounded-full px-4 py-1.5 text-sm font-semibold text-ink-muted hover:bg-surface-page hover:text-ink", onClick: () => {
                                            setEditingCollection(false);
                                            setEditLabel(collection.label);
                                            setEditDescription(collection.description ?? '');
                                            setCollectionError(null);
                                        }, children: "Cancel" })] })] })) : collection.description ? (_jsx("p", { className: "text-sm text-ink-muted", children: collection.description })) : null] }), _jsxs("div", { className: "flex gap-1 border-b border-border-subtle", children: [_jsxs("button", { type: "button", className: `focus-ring px-4 py-2 text-sm font-semibold ${activeTab === 'categories'
                            ? 'border-b-2 border-accent-orange text-ink'
                            : 'text-ink-muted hover:text-ink'}`, onClick: () => setActiveTab('categories'), children: ["Categories (", categories.length, ")"] }), _jsxs("button", { type: "button", className: `focus-ring px-4 py-2 text-sm font-semibold ${activeTab === 'fields'
                            ? 'border-b-2 border-accent-orange text-ink'
                            : 'text-ink-muted hover:text-ink'}`, onClick: () => setActiveTab('fields'), children: ["Fields (", fields.length, ")"] })] }), activeTab === 'categories' ? (_jsxs("div", { className: "grid gap-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-bold text-ink", children: "Categories" }), !catFormOpen ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark", onClick: openCatCreate, children: [_jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }), "Add category"] })) : null] }), catFormOpen ? (_jsxs("div", { className: "grid gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-bold text-ink", children: catEditId ? 'Edit category' : 'New category' }), _jsx("button", { type: "button", className: "focus-ring text-ink-muted hover:text-ink", "aria-label": "Close", onClick: closeCatForm, children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] }), _jsx(AdminTextInput, { label: "ID", value: catId, onChange: (e) => setCatId(e.target.value), placeholder: "e.g. my-category", hint: "Machine name", disabled: !!catEditId }), _jsx(AdminTextInput, { label: "Label", value: catLabel, onChange: (e) => handleCatLabelChange(e.target.value), placeholder: "e.g. My Category" }), _jsx(AdminTextInput, { label: "Slug", value: catSlug, onChange: (e) => handleCatSlugChange(e.target.value), placeholder: "e.g. my-category", hint: "URL-friendly identifier" }), _jsx(AdminTextArea, { label: "Description", value: catDescription, onChange: (e) => setCatDescription(e.target.value), placeholder: "Optional description" }), _jsx(AdminTextInput, { label: "Sort order", type: "number", value: String(catSortOrder), onChange: (e) => setCatSortOrder(Number(e.target.value)) }), catFormError ? (_jsx("p", { className: "text-xs font-semibold text-accent-red", role: "alert", children: catFormError })) : null, _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark disabled:opacity-50", disabled: catSubmitting, onClick: handleCatSave, children: catSubmitting
                                            ? 'Saving\u2026'
                                            : catEditId
                                                ? 'Update'
                                                : 'Create' }), _jsx("button", { type: "button", className: "focus-ring rounded-full px-4 py-1.5 text-sm font-semibold text-ink-muted hover:bg-surface-page hover:text-ink", onClick: closeCatForm, children: "Cancel" })] })] })) : null, _jsx("div", { className: "overflow-hidden rounded-lg border border-border-subtle", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "border-b border-border-subtle bg-surface-elevated", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Label" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Slug" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Order" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted" })] }) }), _jsxs("tbody", { children: [sortedCategories.map((cat) => (_jsxs("tr", { className: "border-b border-border-subtle last:border-b-0", children: [_jsx("td", { className: "px-4 py-3 font-medium text-ink", children: cat.label }), _jsx("td", { className: "px-4 py-3 font-mono text-xs text-ink-muted", children: cat.slug }), _jsx("td", { className: "px-4 py-3 text-ink-muted", children: cat.sortOrder }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-ink", "aria-label": `Edit ${cat.label}`, onClick: () => openCatEdit(cat), children: _jsx(Pencil, { className: "h-4 w-4", "aria-hidden": "true" }) }), catDeleteConfirm === cat.id ? (_jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1 rounded-full bg-accent-red px-3 py-1 text-xs font-bold text-white disabled:opacity-50", disabled: catDeleting, onClick: () => handleCatDelete(cat.id), children: catDeleting ? '\u2026' : 'Confirm' }), _jsx("button", { type: "button", className: "focus-ring text-xs font-semibold text-ink-muted hover:text-ink", onClick: () => setCatDeleteConfirm(null), children: "Cancel" })] })) : (_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-accent-red", "aria-label": `Delete ${cat.label}`, onClick: () => setCatDeleteConfirm(cat.id), children: _jsx(Trash2, { className: "h-4 w-4", "aria-hidden": "true" }) }))] }) })] }, cat.id))), sortedCategories.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-4 py-8 text-center text-sm text-ink-muted", children: "No categories yet." }) })) : null] })] }) })] })) : null, activeTab === 'fields' ? (_jsxs("div", { className: "grid gap-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-bold text-ink", children: "Fields" }), !fieldFormOpen ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark", onClick: () => {
                                    setFieldFormOpen(true);
                                    setFieldEditId(null);
                                }, children: [_jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }), "Add field"] })) : null] }), fieldFormOpen ? (_jsx(CollectionFieldEditor, { initial: fieldEditId
                            ? fields.find((f) => f.id === fieldEditId)
                            : undefined, onSave: handleFieldSave, onCancel: () => {
                            setFieldFormOpen(false);
                            setFieldEditId(null);
                        }, saving: fieldSubmitting })) : null, _jsx("div", { className: "overflow-hidden rounded-lg border border-border-subtle", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "border-b border-border-subtle bg-surface-elevated", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Label" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Key" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Type" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Required" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted" })] }) }), _jsxs("tbody", { children: [sortedFields.map((field) => (_jsxs("tr", { className: "border-b border-border-subtle last:border-b-0", children: [_jsx("td", { className: "px-4 py-3 font-medium text-ink", children: field.label }), _jsx("td", { className: "px-4 py-3 font-mono text-xs text-ink-muted", children: field.key }), _jsx("td", { className: "px-4 py-3 text-ink-muted", children: field.type }), _jsx("td", { className: "px-4 py-3 text-ink-muted", children: field.required ? 'Yes' : 'No' }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-ink", "aria-label": `Edit ${field.label}`, onClick: () => {
                                                                    setFieldEditId(field.id);
                                                                    setFieldFormOpen(true);
                                                                }, children: _jsx(Pencil, { className: "h-4 w-4", "aria-hidden": "true" }) }), fieldDeleteConfirm === field.id ? (_jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1 rounded-full bg-accent-red px-3 py-1 text-xs font-bold text-white disabled:opacity-50", disabled: fieldDeleting, onClick: () => handleFieldDelete(field.id), children: fieldDeleting ? '\u2026' : 'Confirm' }), _jsx("button", { type: "button", className: "focus-ring text-xs font-semibold text-ink-muted hover:text-ink", onClick: () => setFieldDeleteConfirm(null), children: "Cancel" })] })) : (_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-accent-red", "aria-label": `Delete ${field.label}`, onClick: () => setFieldDeleteConfirm(field.id), children: _jsx(Trash2, { className: "h-4 w-4", "aria-hidden": "true" }) }))] }) })] }, field.id))), sortedFields.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-sm text-ink-muted", children: "No fields yet." }) })) : null] })] }) })] })) : null] }));
}

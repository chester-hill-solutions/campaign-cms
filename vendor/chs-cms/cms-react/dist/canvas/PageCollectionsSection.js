import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AdminCheckbox, AdminSelect, AdminTextInput } from '../ui';
import { MediaField, PanelSection } from './fields';
function parseStringList(raw) {
    return raw
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
}
function MetadataField({ field, value, disabled, onChange, }) {
    if (field.type === 'boolean') {
        return (_jsx(AdminCheckbox, { label: field.label, checked: value === true, disabled: disabled, onChange: (e) => onChange(e.target.checked) }));
    }
    if (field.type === 'image') {
        return (_jsx(MediaField, { label: field.label, value: typeof value === 'string' ? value : '', onSelect: (path) => onChange(path || undefined), onClear: () => onChange(undefined) }));
    }
    if (field.type === 'stringList') {
        const display = Array.isArray(value) ? value.join(', ') : '';
        return (_jsx(AdminTextInput, { label: `${field.label} (comma-separated)`, hint: field.config?.helpText, value: display, disabled: disabled, onChange: (e) => onChange(parseStringList(e.target.value)) }));
    }
    // Native date inputs hide legacy year/range strings, so retain a text field for those values.
    const completeOrEmptyDate = typeof value !== 'string' || !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
    const inputType = field.type === 'date' && completeOrEmptyDate ? 'date' : 'text';
    return (_jsx(AdminTextInput, { label: field.label, type: inputType, hint: field.config?.helpText, value: typeof value === 'string' ? value : '', disabled: disabled, onChange: (e) => onChange(e.target.value || undefined) }));
}
/**
 * Assign the page to collections and edit its per-collection metadata
 * (e.g. portfolio project date, external URL, tech stack). Fully controlled:
 * hosts load state from their store and persist through the callbacks,
 * which map 1:1 onto cms-store operations.
 */
export function PageCollectionsSection({ collections, assignments, categoriesByCollectionId, fieldsByCollectionId, metadataByCollectionId, pending = false, onAssign, onAssignmentChange, onUnassign, onSetMetadataValue, }) {
    if (collections.length === 0)
        return null;
    return (_jsx(PanelSection, { title: "Collections", children: _jsx("div", { className: "grid gap-3", children: collections.map((collection) => {
                const assignment = assignments[collection.id];
                const categories = categoriesByCollectionId[collection.id] ?? [];
                const fields = fieldsByCollectionId[collection.id] ?? [];
                const metadata = metadataByCollectionId[collection.id] ?? {};
                if (!assignment) {
                    return (_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: "text-sm text-ink", children: collection.label }), _jsx("button", { type: "button", className: "focus-ring shrink-0 rounded-full border border-line-strong px-3 py-1 text-xs font-semibold text-ink hover:bg-surface-elevated", disabled: pending, onClick: () => onAssign(collection.id), children: "Add to collection" })] }, collection.id));
                }
                return (_jsxs("div", { className: "grid gap-2 rounded-lg border border-border-subtle p-2.5", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: "text-sm font-semibold text-ink", children: collection.label }), _jsx("button", { type: "button", className: "focus-ring shrink-0 text-xs font-semibold text-accent-red underline", disabled: pending, onClick: () => onUnassign(collection.id), children: "Remove" })] }), _jsxs(AdminSelect, { label: "Category", value: assignment.categoryId ?? '', disabled: pending, onChange: (e) => onAssignmentChange(collection.id, {
                                ...assignment,
                                categoryId: e.target.value || undefined,
                            }), children: [_jsx("option", { value: "", children: "No category" }), categories.map((category) => (_jsx("option", { value: category.id, children: category.label }, category.id)))] }), _jsx(AdminCheckbox, { label: "Featured", checked: assignment.featured, disabled: pending, onChange: (e) => onAssignmentChange(collection.id, {
                                ...assignment,
                                featured: e.target.checked,
                            }) }), _jsx(AdminTextInput, { label: "Sort date", type: assignment.sortDate && !/^\d{4}-\d{2}-\d{2}$/.test(assignment.sortDate) ? 'text' : 'date', value: assignment.sortDate ?? '', disabled: pending, onChange: (e) => onAssignmentChange(collection.id, {
                                ...assignment,
                                sortDate: e.target.value || undefined,
                            }) }), fields.map((field) => (_jsx(MetadataField, { field: field, value: metadata[field.key], disabled: pending, onChange: (value) => onSetMetadataValue(collection.id, field.key, value) }, field.id)))] }, collection.id));
            }) }) }));
}

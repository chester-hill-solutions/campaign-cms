import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Plus, X } from 'lucide-react';
import { useId, useState } from 'react';
import { AddItemButton, EditableText, useBlockEdit } from './editable';
const CELL_CONTROL_CLASS = 'focus-ring inline-flex h-5 w-5 items-center justify-center rounded border border-border-subtle bg-surface-card text-ink-muted hover:text-accent-red disabled:opacity-30';
function EditableTable({ block, edit }) {
    const setHeaders = (headers, rows) => edit.updateBlock({ ...block, headers, rows });
    const removeColumn = (col) => {
        if (block.headers.length <= 1)
            return;
        setHeaders(block.headers.filter((_, i) => i !== col), block.rows.map((row) => row.filter((_, i) => i !== col)));
    };
    const addColumn = () => {
        if (block.headers.length >= 10)
            return;
        setHeaders([...block.headers, 'Column'], block.rows.map((row) => [...row, '']));
    };
    return (_jsxs("div", { className: "overflow-x-auto", children: [_jsxs("table", { className: "w-full border-collapse text-left text-sm", children: [_jsx("thead", { children: _jsxs("tr", { children: [block.headers.map((header, col) => (_jsx("th", { scope: "col", className: "border-b border-border-subtle px-3 py-2 font-semibold text-ink", children: _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(EditableText, { value: header, placeholder: "Header", update: (v) => {
                                                    const headers = [...block.headers];
                                                    headers[col] = v;
                                                    return { ...block, headers };
                                                } }), _jsx("button", { type: "button", className: CELL_CONTROL_CLASS, "aria-label": `Remove column ${col + 1}`, title: "Remove column", disabled: block.headers.length <= 1, onClick: () => removeColumn(col), children: _jsx(X, { className: "h-3 w-3", "aria-hidden": "true" }) })] }) }, col))), _jsx("th", { className: "w-8 border-b border-border-subtle px-1 py-2", children: _jsx("button", { type: "button", className: CELL_CONTROL_CLASS, "aria-label": "Add column", title: "Add column", disabled: block.headers.length >= 10, onClick: addColumn, children: _jsx(Plus, { className: "h-3 w-3", "aria-hidden": "true" }) }) })] }) }), _jsx("tbody", { children: block.rows.map((row, rowIndex) => (_jsxs("tr", { children: [block.headers.map((_, cellIndex) => {
                                    const value = row[cellIndex] ?? '';
                                    const cellEditor = (_jsx(EditableText, { value: value, placeholder: "\u2014", update: (v) => {
                                            const rows = block.rows.map((r) => [...r]);
                                            const target = rows[rowIndex];
                                            while (target.length < block.headers.length)
                                                target.push('');
                                            target[cellIndex] = v;
                                            return { ...block, rows };
                                        } }));
                                    return cellIndex === 0 ? (_jsx("th", { scope: "row", className: "border-b border-border-subtle px-3 py-2 text-left font-medium text-ink", children: cellEditor }, cellIndex)) : (_jsx("td", { className: "border-b border-border-subtle px-3 py-2 text-ink-muted", children: cellEditor }, cellIndex));
                                }), _jsx("td", { className: "w-8 border-b border-border-subtle px-1 py-2", children: _jsx("button", { type: "button", className: CELL_CONTROL_CLASS, "aria-label": `Remove row ${rowIndex + 1}`, title: "Remove row", onClick: () => edit.updateBlock({
                                            ...block,
                                            rows: block.rows.filter((_, i) => i !== rowIndex),
                                        }), children: _jsx(X, { className: "h-3 w-3", "aria-hidden": "true" }) }) })] }, rowIndex))) })] }), block.rows.length < 50 ? (_jsx(AddItemButton, { label: "Add row", className: "mt-2", onAdd: () => edit.updateBlock({
                    ...block,
                    rows: [...block.rows, block.headers.map(() => '')],
                }) })) : null] }));
}
export function TableBlockView({ block }) {
    const baseId = useId();
    const edit = useBlockEdit();
    const [mobileOpen, setMobileOpen] = useState(false);
    const collapse = block.mobileCollapse ?? true;
    const table = (_jsxs("table", { className: "w-full border-collapse text-left text-sm", children: [_jsx("thead", { children: _jsx("tr", { children: block.headers.map((header, index) => (_jsx("th", { scope: "col", className: "border-b border-border-subtle px-3 py-2 font-semibold text-ink", children: header }, `${header}-${index}`))) }) }), _jsx("tbody", { children: block.rows.map((row, rowIndex) => (_jsx("tr", { children: row.map((cell, cellIndex) => cellIndex === 0 ? (_jsx("th", { scope: "row", className: "border-b border-border-subtle px-3 py-2 text-left font-medium text-ink", children: cell }, cellIndex)) : (_jsx("td", { className: "border-b border-border-subtle px-3 py-2 text-ink-muted", children: cell }, cellIndex))) }, rowIndex))) })] }));
    return (_jsxs("section", { "aria-labelledby": block.heading ? `${baseId}-heading` : undefined, children: [block.heading || edit ? (_jsx("h2", { id: `${baseId}-heading`, className: "m-0 mb-4 text-2xl font-semibold text-ink", children: _jsx(EditableText, { value: block.heading ?? '', placeholder: "Heading (optional)", update: (v) => ({ ...block, heading: v || undefined }) }) })) : null, edit ? (_jsx(EditableTable, { block: block, edit: edit })) : collapse ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "@md:hidden", children: [_jsx("button", { type: "button", className: "focus-ring w-full rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 text-left text-sm font-semibold text-ink", "aria-expanded": mobileOpen, onClick: () => setMobileOpen((v) => !v), children: block.mobileSummary ?? 'View full table' }), mobileOpen ? _jsx("div", { className: "mt-3 overflow-x-auto", children: table }) : null] }), _jsx("div", { className: "hidden overflow-x-auto @md:block", children: table })] })) : (_jsx("div", { className: "overflow-x-auto", children: table })), block.footnote || edit ? (_jsx("p", { className: "mt-3 text-xs leading-relaxed text-ink-muted", children: _jsx(EditableText, { value: block.footnote ?? '', multiline: true, placeholder: "Footnote (optional)", update: (v) => ({ ...block, footnote: v || undefined }) }) })) : null] }));
}

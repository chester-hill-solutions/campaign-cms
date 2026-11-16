import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Download, LoaderCircle, Trash2, TriangleAlert, } from 'lucide-react';
import { useState } from 'react';
export function FormResponses({ formId, formTitle, fields, responses, onDeleteResponse, onExportCsv, loading, error, }) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const handleDelete = async (id) => {
        setDeleting(true);
        await onDeleteResponse(id);
        setDeleteConfirm(null);
        setDeleting(false);
    };
    const handleExport = async () => {
        setExporting(true);
        try {
            // Escaped, because this file is opened in a spreadsheet and a response value is
            // visitor-supplied text.
            const csv = await onExportCsv({ escapeFormulas: true });
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${formId}-responses.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
        finally {
            setExporting(false);
        }
    };
    const visibleResponses = responses.filter((r) => !r.spam);
    const spamResponses = responses.filter((r) => r.spam);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center p-12", children: _jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-ink-muted", "aria-hidden": "true" }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent-red/30 bg-accent-red/5 p-4 text-sm text-accent-red", role: "alert", children: [_jsx(TriangleAlert, { className: "h-4 w-4 shrink-0", "aria-hidden": "true" }), error] }));
    }
    return (_jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-ink", children: formTitle }), _jsxs("p", { className: "text-sm text-ink-muted", children: [visibleResponses.length, " response", visibleResponses.length !== 1 ? 's' : '', spamResponses.length > 0
                                        ? ` (${spamResponses.length} spam)`
                                        : ''] })] }), visibleResponses.length > 0 ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark disabled:opacity-50", disabled: exporting, onClick: handleExport, children: [_jsx(Download, { className: "h-4 w-4", "aria-hidden": "true" }), exporting ? 'Exporting\u2026' : 'Export CSV'] })) : null] }), _jsx("div", { className: "overflow-x-auto rounded-lg border border-border-subtle", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "border-b border-border-subtle bg-surface-elevated", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Submitted" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "IP" }), fields.map((f) => (_jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: f.label }, f.id))), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Spam" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted" })] }) }), _jsxs("tbody", { children: [responses.map((response) => {
                                    const data = (() => {
                                        try {
                                            return JSON.parse(response.data_json);
                                        }
                                        catch {
                                            return {};
                                        }
                                    })();
                                    return (_jsxs("tr", { className: `border-b border-border-subtle last:border-b-0 ${response.spam ? 'opacity-50' : ''}`, children: [_jsx("td", { className: "whitespace-nowrap px-4 py-3 text-ink", children: new Date(response.submitted_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                }) }), _jsx("td", { className: "px-4 py-3 font-mono text-xs text-ink-muted", children: response.ip ?? '\u2014' }), fields.map((f) => (_jsx("td", { className: "px-4 py-3 text-ink", children: formatValue(data[f.key]) }, f.id))), _jsx("td", { className: "px-4 py-3", children: response.spam ? (_jsx("span", { className: "rounded-full bg-accent-red/10 px-2 py-0.5 text-xs font-semibold text-accent-red", children: "Spam" })) : (_jsx("span", { className: "rounded-full bg-surface-page px-2 py-0.5 text-xs text-ink-muted", children: "Clean" })) }), _jsx("td", { className: "px-4 py-3 text-right", children: deleteConfirm === response.id ? (_jsxs("div", { className: "inline-flex items-center gap-1", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1 rounded-full bg-accent-red px-3 py-1 text-xs font-bold text-white disabled:opacity-50", disabled: deleting, onClick: () => handleDelete(response.id), children: deleting ? '\u2026' : 'Confirm' }), _jsx("button", { type: "button", className: "focus-ring text-xs font-semibold text-ink-muted hover:text-ink", onClick: () => setDeleteConfirm(null), children: "Cancel" })] })) : (_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-accent-red", "aria-label": "Delete response", onClick: () => setDeleteConfirm(response.id), children: _jsx(Trash2, { className: "h-4 w-4", "aria-hidden": "true" }) })) })] }, response.id));
                                }), responses.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: fields.length + 5, className: "px-4 py-8 text-center text-sm text-ink-muted", children: "No responses yet." }) })) : null] })] }) }), spamResponses.length > 0 ? (_jsxs("details", { className: "rounded-lg border border-border-subtle", children: [_jsxs("summary", { className: "cursor-pointer px-4 py-2 text-sm font-semibold text-ink-muted hover:text-ink", children: ["Spam (", spamResponses.length, ")"] }), _jsx("div", { className: "border-t border-border-subtle p-4", children: _jsx("p", { className: "text-sm text-ink-muted", children: "Spam submissions are hidden from the main list and excluded from CSV exports." }) })] })) : null] }));
}
function formatValue(value) {
    if (value === undefined || value === null)
        return '\u2014';
    if (Array.isArray(value))
        return value.join(', ');
    return String(value);
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Pencil, Trash2, X, TriangleAlert } from 'lucide-react';
import { AdminCheckbox, AdminTextInput, AdminTextArea } from '../ui';
function providerLabel(provider) {
    switch (provider) {
        case 'cloudflare':
            return 'Cloudflare Web Analytics';
        case 'ga4':
            return 'Google Analytics 4';
        case 'gtm':
            return 'Google Tag Manager';
        case 'custom':
            return 'Custom script';
        default:
            return provider;
    }
}
function emptyScript() {
    return {
        id: '',
        label: '',
        src: '',
        inlineScript: '',
        loadMode: 'async',
        position: 'head',
    };
}
export function AnalyticsPanel({ config, onChange, privileged, auditNote, onAuditNoteChange, }) {
    const [scriptFormOpen, setScriptFormOpen] = useState(false);
    const [editingScript, setEditingScript] = useState(null);
    const [scriptForm, setScriptForm] = useState(emptyScript());
    const [scriptFormError, setScriptFormError] = useState(null);
    const updateCloudflare = (enabled) => onChange({ ...config, cloudflare: { ...config.cloudflare, enabled } });
    const updateCloudflareSiteTag = (siteTag) => onChange({ ...config, cloudflare: { ...config.cloudflare, siteTag } });
    const updateGa4 = (enabled) => onChange({ ...config, ga4: { ...config.ga4, enabled } });
    const updateGa4TrackingId = (trackingId) => onChange({ ...config, ga4: { ...config.ga4, trackingId } });
    const updateGtm = (enabled) => onChange({ ...config, gtm: { ...config.gtm, enabled } });
    const updateGtmContainerId = (containerId) => onChange({ ...config, gtm: { ...config.gtm, containerId } });
    const updateEvent = (key, value) => onChange({ ...config, events: { ...config.events, [key]: value } });
    const openScriptCreate = () => {
        setScriptFormOpen(true);
        setEditingScript(null);
        setScriptForm(emptyScript());
        setScriptFormError(null);
    };
    const openScriptEdit = (script) => {
        setScriptFormOpen(true);
        setEditingScript(script);
        setScriptForm({ ...script });
        setScriptFormError(null);
    };
    const closeScriptForm = () => {
        setScriptFormOpen(false);
        setEditingScript(null);
        setScriptForm(emptyScript());
        setScriptFormError(null);
    };
    const handleScriptSave = () => {
        const id = scriptForm.id.trim();
        const label = scriptForm.label.trim();
        if (!id || !label) {
            setScriptFormError('ID and label are required');
            return;
        }
        if (!scriptForm.src && !scriptForm.inlineScript) {
            setScriptFormError('Provide a script src or an inline script');
            return;
        }
        const duplicate = config.customScripts.find((s) => s.id === id && s !== editingScript);
        if (duplicate) {
            setScriptFormError('A script with this ID already exists');
            return;
        }
        const nextScript = {
            ...scriptForm,
            id,
            label,
            src: scriptForm.src?.trim() || undefined,
            inlineScript: scriptForm.inlineScript?.trim() || undefined,
        };
        const nextScripts = editingScript
            ? config.customScripts.map((s) => (s.id === editingScript.id ? nextScript : s))
            : [...config.customScripts, nextScript];
        onChange({ ...config, customScripts: nextScripts });
        closeScriptForm();
    };
    const handleScriptDelete = (id) => {
        onChange({
            ...config,
            customScripts: config.customScripts.filter((s) => s.id !== id),
        });
        if (editingScript?.id === id) {
            closeScriptForm();
        }
    };
    const hasCustomScripts = config.customScripts.length > 0;
    return (_jsxs("div", { className: "grid gap-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx("h1", { className: "text-xl font-bold text-ink", children: "Analytics" }) }), _jsxs("section", { className: "grid gap-4 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsx("h2", { className: "text-sm font-bold uppercase tracking-wide text-ink-muted", children: "Providers" }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "grid gap-3", children: [_jsx(AdminCheckbox, { label: providerLabel('cloudflare'), checked: config.cloudflare.enabled, onChange: (e) => updateCloudflare(e.target.checked) }), config.cloudflare.enabled ? (_jsx(AdminTextInput, { label: "Cloudflare site tag", value: config.cloudflare.siteTag ?? '', onChange: (e) => updateCloudflareSiteTag(e.target.value), placeholder: "e.g. site-token-from-cloudflare" })) : null] }), _jsxs("div", { className: "grid gap-3", children: [_jsx(AdminCheckbox, { label: providerLabel('ga4'), checked: config.ga4.enabled, onChange: (e) => updateGa4(e.target.checked) }), config.ga4.enabled ? (_jsx(AdminTextInput, { label: "GA4 tracking ID", value: config.ga4.trackingId ?? '', onChange: (e) => updateGa4TrackingId(e.target.value), placeholder: "e.g. G-XXXXXXXXXX" })) : null] }), _jsxs("div", { className: "grid gap-3", children: [_jsx(AdminCheckbox, { label: providerLabel('gtm'), checked: config.gtm.enabled, onChange: (e) => updateGtm(e.target.checked) }), config.gtm.enabled ? (_jsx(AdminTextInput, { label: "GTM container ID", value: config.gtm.containerId ?? '', onChange: (e) => updateGtmContainerId(e.target.value), placeholder: "e.g. GTM-XXXXXX" })) : null] })] })] }), _jsxs("section", { className: "grid gap-4 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsx("h2", { className: "text-sm font-bold uppercase tracking-wide text-ink-muted", children: "Event tracking" }), _jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [_jsx(AdminCheckbox, { label: "Page views", checked: config.events.pageView, onChange: (e) => updateEvent('pageView', e.target.checked) }), _jsx(AdminCheckbox, { label: "Form submissions", checked: config.events.formSubmit, onChange: (e) => updateEvent('formSubmit', e.target.checked) }), _jsx(AdminCheckbox, { label: "Link clicks", checked: config.events.linkClick, onChange: (e) => updateEvent('linkClick', e.target.checked) }), _jsx(AdminCheckbox, { label: "Scroll depth", checked: config.events.scrollDepth, onChange: (e) => updateEvent('scrollDepth', e.target.checked) })] })] }), _jsxs("section", { className: "grid gap-4 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-sm font-bold uppercase tracking-wide text-ink-muted", children: "Custom scripts" }), privileged && !scriptFormOpen ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-3 py-1 text-xs font-bold text-primary-dark", onClick: openScriptCreate, children: [_jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }), "Add script"] })) : null] }), hasCustomScripts && privileged ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent-yellow/30 bg-accent-yellow/5 p-3 text-sm text-accent-yellow", role: "alert", children: [_jsx(TriangleAlert, { className: "h-4 w-4 shrink-0", "aria-hidden": "true" }), "Custom scripts are privileged and will be audited."] })) : null, hasCustomScripts && !privileged ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent-yellow/30 bg-accent-yellow/5 p-3 text-sm text-accent-yellow", role: "alert", children: [_jsx(TriangleAlert, { className: "h-4 w-4 shrink-0", "aria-hidden": "true" }), "Custom scripts are shown read-only. Ask a privileged admin to edit them."] })) : null, scriptFormOpen ? (_jsxs("div", { className: "grid gap-3 rounded-lg border border-border-subtle bg-surface-page p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-bold text-ink", children: editingScript ? 'Edit custom script' : 'New custom script' }), _jsx("button", { type: "button", className: "focus-ring text-ink-muted hover:text-ink", "aria-label": "Close", onClick: closeScriptForm, children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] }), _jsx(AdminTextInput, { label: "ID", value: scriptForm.id, onChange: (e) => setScriptForm({ ...scriptForm, id: e.target.value }), placeholder: "e.g. my-script", hint: "Machine name", disabled: !!editingScript }), _jsx(AdminTextInput, { label: "Label", value: scriptForm.label, onChange: (e) => setScriptForm({ ...scriptForm, label: e.target.value }), placeholder: "e.g. My marketing pixel" }), _jsx(AdminTextInput, { label: "Script URL", value: scriptForm.src ?? '', onChange: (e) => setScriptForm({ ...scriptForm, src: e.target.value }), placeholder: "https://example.com/script.js", hint: "Leave blank to use inline script instead" }), _jsx(AdminTextArea, { label: "Inline script", value: scriptForm.inlineScript ?? '', onChange: (e) => setScriptForm({ ...scriptForm, inlineScript: e.target.value }), placeholder: "// javascript code", rows: 4, hint: "Use only when no external URL is provided" }), _jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [_jsxs("label", { className: "admin-field", children: [_jsx("span", { className: "admin-field__label", children: "Load mode" }), _jsxs("select", { className: "admin-field__input focus-ring", value: scriptForm.loadMode, onChange: (e) => setScriptForm({
                                                    ...scriptForm,
                                                    loadMode: e.target.value,
                                                }), children: [_jsx("option", { value: "async", children: "async" }), _jsx("option", { value: "defer", children: "defer" }), _jsx("option", { value: "blocking", children: "blocking" })] })] }), _jsxs("label", { className: "admin-field", children: [_jsx("span", { className: "admin-field__label", children: "Position" }), _jsxs("select", { className: "admin-field__input focus-ring", value: scriptForm.position, onChange: (e) => setScriptForm({
                                                    ...scriptForm,
                                                    position: e.target.value,
                                                }), children: [_jsx("option", { value: "head", children: "head" }), _jsx("option", { value: "body_end", children: "body end" })] })] })] }), scriptFormError ? (_jsx("p", { className: "text-xs font-semibold text-accent-red", role: "alert", children: scriptFormError })) : null, _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark", onClick: handleScriptSave, children: editingScript ? 'Update' : 'Create' }), _jsx("button", { type: "button", className: "focus-ring rounded-full px-4 py-1.5 text-sm font-semibold text-ink-muted hover:bg-surface-page hover:text-ink", onClick: closeScriptForm, children: "Cancel" })] })] })) : null, config.customScripts.length > 0 ? (_jsx("div", { className: "overflow-hidden rounded-lg border border-border-subtle", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "border-b border-border-subtle bg-surface-page", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Label" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "ID" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Position" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted", children: "Load" }), _jsx("th", { className: "px-4 py-3 font-semibold text-ink-muted" })] }) }), _jsx("tbody", { children: config.customScripts.map((script) => (_jsxs("tr", { className: "border-b border-border-subtle last:border-b-0", children: [_jsx("td", { className: "px-4 py-3 font-medium text-ink", children: script.label }), _jsx("td", { className: "px-4 py-3 font-mono text-xs text-ink-muted", children: script.id }), _jsx("td", { className: "px-4 py-3 text-ink-muted", children: script.position }), _jsx("td", { className: "px-4 py-3 text-ink-muted", children: script.loadMode }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs("div", { className: "inline-flex items-center gap-1", children: [privileged ? (_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-page hover:text-ink", "aria-label": `Edit ${script.label}`, onClick: () => openScriptEdit(script), children: _jsx(Pencil, { className: "h-4 w-4", "aria-hidden": "true" }) })) : null, privileged ? (_jsx("button", { type: "button", className: "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-page hover:text-accent-red", "aria-label": `Delete ${script.label}`, onClick: () => handleScriptDelete(script.id), children: _jsx(Trash2, { className: "h-4 w-4", "aria-hidden": "true" }) })) : null] }) })] }, script.id))) })] }) })) : (_jsx("p", { className: "text-sm text-ink-muted", children: "No custom scripts configured." }))] }), onAuditNoteChange ? (_jsxs("section", { className: "grid gap-4 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsx("h2", { className: "text-sm font-bold uppercase tracking-wide text-ink-muted", children: "Audit note" }), _jsx(AdminTextArea, { label: "Change note", value: auditNote ?? '', onChange: (e) => onAuditNoteChange(e.target.value), placeholder: "Why are these analytics settings changing?", rows: 2 })] })) : null] }));
}

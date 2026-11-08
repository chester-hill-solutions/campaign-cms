import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Globe, LoaderCircle, TriangleAlert, } from 'lucide-react';
export function DomainCutoverPanel({ siteName, currentDomain, workersDomain, status, checks, onInitiateCutover, loading, }) {
    const [confirming, setConfirming] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const allPassed = checks.every((check) => check.passed);
    const canInitiate = status !== 'cutover_complete' && allPassed && !loading && !submitting;
    const handleInitiate = async () => {
        if (!confirming) {
            setConfirming(true);
            setError(null);
            return;
        }
        setSubmitting(true);
        setError(null);
        const result = await onInitiateCutover();
        if (!result.ok) {
            setError(result.error);
        }
        setSubmitting(false);
        setConfirming(false);
    };
    const handleCancel = () => {
        setConfirming(false);
    };
    return (_jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold text-ink", children: "Domain cutover" }), _jsx("span", { className: "rounded-full bg-surface-elevated px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted", children: status })] }), _jsxs("div", { className: "grid gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-ink", children: [_jsx(Globe, { className: "h-4 w-4 text-ink-muted", "aria-hidden": "true" }), _jsx("span", { className: "font-semibold", children: "Site:" }), _jsx("span", { children: siteName })] }), _jsxs("div", { className: "text-sm text-ink", children: [_jsx("span", { className: "font-semibold", children: "Current domain:" }), ' ', _jsx("span", { className: currentDomain ? 'text-ink' : 'text-ink-muted', children: currentDomain ?? 'Not set' })] }), _jsxs("div", { className: "text-sm text-ink", children: [_jsx("span", { className: "font-semibold", children: "Workers domain:" }), ' ', _jsx("span", { children: workersDomain })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx("h2", { className: "text-sm font-bold text-ink", children: "Cutover checks" }), checks.map((check) => (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [check.passed ? (_jsx(CheckCircle2, { className: "h-4 w-4 text-accent-green", "aria-hidden": "true" })) : (_jsx(AlertCircle, { className: "h-4 w-4 text-accent-red", "aria-hidden": "true" })), _jsx("span", { className: check.passed ? 'text-ink' : 'text-ink-muted', children: check.label })] }, check.label))), checks.length === 0 ? (_jsx("p", { className: "text-sm text-ink-muted", children: "No checks configured." })) : null] }), loading || submitting ? (_jsxs("div", { className: "flex items-center gap-2 text-sm text-ink-muted", children: [_jsx(LoaderCircle, { className: "h-4 w-4 animate-spin", "aria-hidden": "true" }), "Running cutover..."] })) : status === 'cutover_complete' ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent-green/30 bg-accent-green/5 p-3 text-sm text-accent-green", children: [_jsx(CheckCircle2, { className: "h-4 w-4", "aria-hidden": "true" }), "Cutover complete"] })) : (_jsxs(_Fragment, { children: [!allPassed ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent-red/30 bg-accent-red/5 p-3 text-sm text-accent-red", children: [_jsx(TriangleAlert, { className: "h-4 w-4", "aria-hidden": "true" }), "All checks must pass before cutover."] })) : null, _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", className: "focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark disabled:opacity-50", disabled: !canInitiate, onClick: handleInitiate, children: confirming ? 'Confirm cutover' : 'Initiate cutover' }), confirming ? (_jsx("button", { type: "button", className: "focus-ring rounded-full px-4 py-1.5 text-sm font-semibold text-ink-muted hover:bg-surface-elevated hover:text-ink", onClick: handleCancel, children: "Cancel" })) : null] })] })), error ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent-red/30 bg-accent-red/5 p-4 text-sm text-accent-red", role: "alert", children: [_jsx(TriangleAlert, { className: "h-4 w-4 shrink-0", "aria-hidden": "true" }), error] })) : null] }));
}

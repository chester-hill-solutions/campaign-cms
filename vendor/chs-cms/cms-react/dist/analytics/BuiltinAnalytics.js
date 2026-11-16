import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
/** Per-mount navigation state; no browser globals are read until a navigation is recorded. */
export function createBuiltinAnalyticsNavigation() {
    let lastPath = null;
    return (path, endpoint = '/api/cms/analytics') => {
        const pathname = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
        if (lastPath === pathname)
            return;
        const previousPath = lastPath;
        lastPath = pathname;
        if (!pathname.startsWith('/') || pathname.startsWith('//') || /[\\\x00-\x1f\x7f]/.test(pathname) || /^\/(admin|api|media|_serverFn|assets)(\/|$)/.test(pathname))
            return;
        if (navigator.doNotTrack === '1')
            return;
        let referrer = previousPath ? window.location.origin : '';
        if (!previousPath && document.referrer) {
            try {
                referrer = new URL(document.referrer).origin;
            }
            catch { /* omit malformed referrers */ }
        }
        const payload = JSON.stringify({ path: pathname, referrer });
        let sent = false;
        try {
            sent = navigator.sendBeacon?.(endpoint, new Blob([payload], { type: 'application/json' })) ?? false;
        }
        catch { /* use fetch when beacon is unavailable */ }
        if (!sent)
            void fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => undefined);
    };
}
/** One beacon per pathname, including client navigation; query/hash changes are excluded. */
export function BuiltinAnalyticsTracker({ path, endpoint = '/api/cms/analytics' }) {
    const track = useRef(null);
    if (!track.current)
        track.current = createBuiltinAnalyticsNavigation();
    useEffect(() => { track.current?.(path, endpoint); }, [path, endpoint]);
    return null;
}
export function BuiltinAnalyticsPanel({ data }) {
    const peak = Math.max(1, ...data.daily.map((row) => row.views));
    return _jsxs("section", { className: "grid gap-5 rounded-xl border border-border-subtle bg-surface-card p-5", "aria-labelledby": "cms-analytics-title", children: [_jsxs("div", { children: [_jsx("h2", { id: "cms-analytics-title", className: "text-lg font-bold text-ink", children: "Built-in analytics" }), _jsxs("p", { className: "text-sm text-ink-muted", children: ["Last ", data.days, " days \u00B7 Page views, without cookies or visitor profiles."] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-ink-muted", children: "Page views" }), _jsx("p", { className: "text-3xl font-bold tabular-nums text-ink", children: data.totalPageViews.toLocaleString() })] }), data.totalPageViews === 0 ? _jsx("p", { className: "text-sm text-ink-muted", children: "Ready to collect traffic. Your first public page view will appear here." }) : null, _jsx("ol", { className: "flex h-24 items-end gap-1", "aria-label": "Daily page views", children: data.daily.map((row) => _jsxs("li", { className: "flex flex-1 flex-col justify-end", title: `${row.day}: ${row.views} page views`, children: [_jsxs("span", { className: "sr-only", children: [row.day, ": ", row.views, " page views"] }), _jsx("span", { "aria-hidden": "true", className: "block rounded-t bg-accent-orange", style: { height: `${Math.max(2, row.views / peak * 96)}px`, opacity: row.views ? 1 : .25 } })] }, row.day)) }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-ink", children: "Popular pages" }), _jsxs("ul", { className: "mt-2 grid gap-2", children: [data.pages.map((row) => _jsxs("li", { className: "flex justify-between gap-3 text-sm", children: [_jsx("a", { className: "truncate text-secondary-dark hover:underline", href: row.path, children: row.path }), _jsx("span", { className: "tabular-nums", children: row.views.toLocaleString() })] }, row.path)), !data.pages.length && _jsx("li", { className: "text-sm text-ink-muted", children: "No page views yet." })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-ink", children: "Referrers" }), _jsxs("ul", { className: "mt-2 grid gap-2", children: [data.referrers.map((row) => _jsxs("li", { className: "flex justify-between gap-3 text-sm", children: [_jsx("span", { className: "truncate", children: row.host }), _jsx("span", { className: "tabular-nums", children: row.views.toLocaleString() })] }, row.host)), !data.referrers.length && _jsx("li", { className: "text-sm text-ink-muted", children: "No referrers yet." })] })] })] }), _jsx("p", { className: "text-xs text-ink-muted", children: "Counts begin when enabled. These are page views, not unique visitors. Query strings, IP addresses, and full referrer URLs are not stored. Do Not Track is respected." })] });
}

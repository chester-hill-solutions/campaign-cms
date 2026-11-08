import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Activity, FileText, Image, LayoutDashboard, LineChart, Settings, Tags } from 'lucide-react';
import { AdminTextInput } from '../ui';
const navLinkClass = 'focus-ring flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors';
export function AdminLayout({ children, activeSection, collectionCount, tagCount, overviewHref = '/admin', pagesHref = '/admin/pages', collectionsHref = '/admin/collections', tagsHref = '/admin/tags', mediaHref = '/admin/media', analyticsHref = '/admin/analytics', settingsHref, }) {
    const counts = {
        collections: collectionCount,
        tags: tagCount,
    };
    const navItems = [
        { id: 'overview', label: 'Overview', icon: Activity, href: overviewHref },
        { id: 'pages', label: 'Pages', icon: FileText, href: pagesHref },
        { id: 'collections', label: 'Collections', icon: LayoutDashboard, href: collectionsHref },
        { id: 'tags', label: 'Tags', icon: Tags, href: tagsHref },
        { id: 'media', label: 'Media', icon: Image, href: mediaHref },
        { id: 'analytics', label: 'Analytics', icon: LineChart, href: analyticsHref },
        ...(settingsHref ? [{ id: 'settings', label: 'Site settings', icon: Settings, href: settingsHref }] : []),
    ];
    return (_jsxs("div", { className: "flex min-h-screen", children: [_jsxs("aside", { className: "flex w-60 flex-col border-r border-border-subtle bg-surface-page", children: [_jsx("div", { className: "border-b border-border-subtle p-4", children: _jsx(AdminTextInput, { label: "Filter", placeholder: "Filter nav...", className: "text-xs" }) }), _jsx("nav", { className: "flex flex-col gap-1 p-4 pt-2", children: navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (_jsxs("a", { href: item.href, className: `${navLinkClass} ${isActive
                                    ? 'bg-accent-orange text-primary-dark'
                                    : 'text-ink-muted hover:bg-surface-elevated hover:text-ink'}`, children: [_jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }), _jsx("span", { className: "flex-1", children: item.label }), counts[item.id] !== undefined ? (_jsx("span", { className: "rounded-full bg-surface-elevated px-2 py-0.5 text-xs tabular-nums", children: counts[item.id] })) : null] }, item.id));
                        }) })] }), _jsx("main", { className: "min-w-0 flex-1 bg-surface-page", children: children })] }));
}

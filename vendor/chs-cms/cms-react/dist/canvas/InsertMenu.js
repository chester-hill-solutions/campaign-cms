import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlignVerticalSpaceAround, AppWindow, CalendarDays, CalendarRange, Code2, Columns3, Contact, FileText, GalleryVertical, HandCoins, Heading, ImageIcon, Link2, List, ListCollapse, Megaphone, Milestone, Minus, PanelTop, Quote, Search, Sigma, Table2, TextQuote, } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { APP_BLOCK_TYPES, BLOCK_TYPE_LABELS, CONTENT_BLOCK_TYPES, LAYOUT_BLOCK_TYPES, } from '@chester-hill-solutions/cms-core';
const BLOCK_TYPE_ICONS = {
    hero: PanelTop,
    richText: FileText,
    cardGrid: GalleryVertical,
    table: Table2,
    accordion: ListCollapse,
    ctaStrip: Megaphone,
    quote: Quote,
    image: ImageIcon,
    columns: Columns3,
    list: List,
    divider: Minus,
    sectionHeader: Heading,
    twoUp: AppWindow,
    statGrid: Sigma,
    timeline: Milestone,
    callout: TextQuote,
    embed: Code2,
    customHtml: Code2,
    spacer: AlignVerticalSpaceAround,
    contactForm: Contact,
    eventsList: CalendarDays,
    eventsTeaser: CalendarRange,
    bioLinks: Link2,
    donateEmbed: HandCoins,
};
const BLOCK_TYPE_HINTS = {
    hero: 'Big intro with portrait and buttons',
    richText: 'Headings, paragraphs, lists',
    cardGrid: 'Cards in a responsive grid',
    table: 'Structured rows and columns',
    accordion: 'Expandable sections',
    ctaStrip: 'Highlighted call to action',
    sectionHeader: 'Kicker, heading, and dek',
    twoUp: 'Text beside an image',
    statGrid: 'Key numbers at a glance',
    timeline: 'Phased milestones',
    callout: 'Toned note or warning',
    customHtml: 'Raw HTML (trusted editors)',
    contactForm: 'The live contact form',
    eventsList: 'All upcoming and past events',
    eventsTeaser: 'Next few events',
    bioLinks: 'Social link buttons',
    donateEmbed: 'Donation form embed',
};
const GROUPS = [
    { label: 'Content', types: CONTENT_BLOCK_TYPES },
    { label: 'Layout', types: LAYOUT_BLOCK_TYPES },
    { label: 'App', types: APP_BLOCK_TYPES },
];
/** Searchable, keyboard-navigable block palette popover. */
export function InsertMenu({ onPick, onClose }) {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef(null);
    const filteredGroups = useMemo(() => {
        const q = query.trim().toLowerCase();
        return GROUPS.map((group) => ({
            ...group,
            types: group.types.filter((type) => {
                if (!q)
                    return true;
                return (BLOCK_TYPE_LABELS[type].toLowerCase().includes(q) ||
                    (BLOCK_TYPE_HINTS[type]?.toLowerCase().includes(q) ?? false) ||
                    type.toLowerCase().includes(q));
            }),
        })).filter((group) => group.types.length > 0);
    }, [query]);
    const flatTypes = useMemo(() => filteredGroups.flatMap((group) => group.types), [filteredGroups]);
    const active = flatTypes[Math.min(activeIndex, flatTypes.length - 1)];
    useEffect(() => {
        setActiveIndex(0);
    }, [query]);
    useEffect(() => {
        const el = listRef.current?.querySelector('[data-active="true"]');
        el?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", "aria-hidden": "true", onClick: onClose }), _jsxs("div", { className: "pb-insert-menu absolute left-1/2 top-full z-50 mt-1 w-80 -translate-x-1/2 overflow-hidden rounded-xl border border-border-subtle bg-surface-card shadow-xl", role: "dialog", "aria-label": "Insert block", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-border-subtle px-3 py-2", children: [_jsx(Search, { className: "h-4 w-4 shrink-0 text-ink-muted", "aria-hidden": "true" }), _jsx("input", { 
                                // eslint-disable-next-line jsx-a11y/no-autofocus -- command-palette pattern: the menu only exists to receive this query
                                autoFocus: true, value: query, placeholder: "Search blocks\u2026", "aria-label": "Search blocks", className: "w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted", onChange: (e) => setQuery(e.target.value), onKeyDown: (e) => {
                                    if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setActiveIndex((i) => Math.min(i + 1, flatTypes.length - 1));
                                    }
                                    else if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setActiveIndex((i) => Math.max(i - 1, 0));
                                    }
                                    else if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (active)
                                            onPick(active);
                                    }
                                    else if (e.key === 'Escape') {
                                        e.preventDefault();
                                        onClose();
                                    }
                                } })] }), _jsx("div", { ref: listRef, className: "max-h-72 overflow-y-auto p-1.5", children: flatTypes.length === 0 ? (_jsx("p", { className: "m-0 px-2 py-3 text-sm text-ink-muted", children: "No blocks match." })) : (filteredGroups.map((group) => (_jsxs("div", { children: [_jsx("p", { className: "m-0 px-2 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-muted", children: group.label }), group.types.map((type) => {
                                    const Icon = BLOCK_TYPE_ICONS[type];
                                    const isActive = type === active;
                                    return (_jsxs("button", { type: "button", "data-active": isActive, className: `focus-ring flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left ${isActive ? 'bg-surface-elevated' : 'hover:bg-surface-elevated'}`, onMouseEnter: () => setActiveIndex(flatTypes.indexOf(type)), onClick: () => onPick(type), children: [_jsx("span", { className: "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-surface-page text-ink-muted", children: _jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }) }), _jsxs("span", { className: "min-w-0", children: [_jsx("span", { className: "block text-sm font-semibold text-ink", children: BLOCK_TYPE_LABELS[type] }), BLOCK_TYPE_HINTS[type] ? (_jsx("span", { className: "block truncate text-xs text-ink-muted", children: BLOCK_TYPE_HINTS[type] })) : null] })] }, type));
                                })] }, group.label)))) })] })] }));
}

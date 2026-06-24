import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { sanitizeCustomHtml } from '@chester-hill-solutions/cms-core';
import { createBlockId } from '@chester-hill-solutions/cms-core';
import { AddItemButton, EditableMarkdown, EditableText, ItemControls, moveItem, useBlockEdit, } from './editable';
import { cardGridColumnClass } from './layoutClasses';
const CALLOUT_TONE_CLASSES = {
    neutral: 'border-border-subtle bg-surface-elevated',
    info: 'border-accent-green bg-[color-mix(in_oklab,var(--accent-green)_10%,var(--surface-card)_90%)]',
    warning: 'border-accent-orange bg-[color-mix(in_oklab,var(--accent-orange)_12%,var(--surface-card)_88%)]',
    success: 'border-accent-green bg-[color-mix(in_oklab,var(--accent-green)_14%,var(--surface-card)_86%)]',
};
const EMBED_ASPECT_CLASSES = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    auto: 'min-h-[240px]',
};
export function StatGridBlockView({ block }) {
    const edit = useBlockEdit();
    return (_jsxs("section", { "aria-labelledby": block.heading ? `stat-grid-${block.id}` : undefined, children: [block.heading || edit ? (_jsx("h2", { id: `stat-grid-${block.id}`, className: "m-0 mb-2 text-2xl font-semibold text-ink", children: _jsx(EditableText, { value: block.heading ?? '', placeholder: "Heading (optional)", update: (v) => ({ ...block, heading: v || undefined }) }) })) : null, block.subheading || edit ? (_jsx("p", { className: "m-0 mb-6 text-base text-ink-muted", children: _jsx(EditableText, { value: block.subheading ?? '', placeholder: "Subheading (optional)", update: (v) => ({ ...block, subheading: v || undefined }) }) })) : null, _jsx("div", { className: `grid gap-4 ${cardGridColumnClass(block.columns)}`, children: block.stats.map((stat, index) => (_jsxs("article", { className: "group/item relative rounded-xl border border-border-subtle bg-surface-elevated p-4 @sm:p-5", children: [edit ? (_jsx(ItemControls, { label: "stat", index: index, count: block.stats.length, onMove: (to) => edit.updateBlock({ ...block, stats: moveItem(block.stats, index, to) }), onRemove: () => edit.updateBlock({
                                ...block,
                                stats: block.stats.filter((s) => s.id !== stat.id),
                            }) })) : null, _jsx("p", { className: "m-0 text-2xl font-bold text-ink @sm:text-3xl", children: _jsx(EditableText, { value: stat.value, placeholder: "Value", update: (v) => {
                                    const stats = [...block.stats];
                                    stats[index] = { ...stat, value: v };
                                    return { ...block, stats };
                                } }) }), _jsx("p", { className: "m-0 mt-1 text-sm font-semibold text-ink", children: _jsx(EditableText, { value: stat.label, placeholder: "Label", update: (v) => {
                                    const stats = [...block.stats];
                                    stats[index] = { ...stat, label: v };
                                    return { ...block, stats };
                                } }) }), stat.note || edit ? (_jsx("p", { className: "m-0 mt-2 text-sm leading-relaxed text-ink-muted", children: _jsx(EditableText, { value: stat.note ?? '', placeholder: "Note (optional)", update: (v) => {
                                    const stats = [...block.stats];
                                    stats[index] = { ...stat, note: v || undefined };
                                    return { ...block, stats };
                                } }) })) : null, stat.source || edit ? (_jsxs("p", { className: "m-0 mt-1 text-xs text-ink-muted", children: ["Source:", ' ', _jsx(EditableText, { value: stat.source ?? '', placeholder: "(optional)", update: (v) => {
                                        const stats = [...block.stats];
                                        stats[index] = { ...stat, source: v || undefined };
                                        return { ...block, stats };
                                    } })] })) : null] }, stat.id))) }), edit && block.stats.length < 12 ? (_jsx(AddItemButton, { label: "Add stat", className: "mt-3", onAdd: () => edit.updateBlock({
                    ...block,
                    stats: [
                        ...block.stats,
                        { id: createBlockId('stat'), value: '0', label: 'New stat' },
                    ],
                }) })) : null] }));
}
export function TimelineBlockView({ block }) {
    const edit = useBlockEdit();
    return (_jsxs("section", { "aria-labelledby": block.heading ? `timeline-${block.id}` : undefined, children: [block.heading || edit ? (_jsx("h2", { id: `timeline-${block.id}`, className: "m-0 mb-6 text-2xl font-semibold text-ink", children: _jsx(EditableText, { value: block.heading ?? '', placeholder: "Heading (optional)", update: (v) => ({ ...block, heading: v || undefined }) }) })) : null, _jsx("ol", { className: "m-0 grid gap-6 border-l-2 border-accent-orange pl-6", children: block.items.map((item, index) => (_jsxs("li", { className: "group/item relative", children: [_jsx("span", { className: "absolute -left-[calc(1.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-orange", "aria-hidden": "true" }), edit ? (_jsx(ItemControls, { label: "milestone", index: index, count: block.items.length, onMove: (to) => edit.updateBlock({ ...block, items: moveItem(block.items, index, to) }), onRemove: () => edit.updateBlock({
                                ...block,
                                items: block.items.filter((i) => i.id !== item.id),
                            }) })) : null, item.phase || edit ? (_jsx("p", { className: "m-0 text-xs font-semibold uppercase tracking-wide text-accent-orange", children: _jsx(EditableText, { value: item.phase ?? '', placeholder: "Phase (optional)", update: (v) => {
                                    const items = [...block.items];
                                    items[index] = { ...item, phase: v || undefined };
                                    return { ...block, items };
                                } }) })) : null, _jsx("h3", { className: "m-0 mt-1 text-lg font-semibold text-ink", children: _jsx(EditableText, { value: item.title, placeholder: "Milestone title", update: (v) => {
                                    const items = [...block.items];
                                    items[index] = { ...item, title: v };
                                    return { ...block, items };
                                } }) }), item.dateLabel || edit ? (_jsx("p", { className: "m-0 mt-1 text-sm text-ink-muted", children: _jsx(EditableText, { value: item.dateLabel ?? '', placeholder: "Date (optional)", update: (v) => {
                                    const items = [...block.items];
                                    items[index] = { ...item, dateLabel: v || undefined };
                                    return { ...block, items };
                                } }) })) : null, item.bodyMarkdown || edit ? (_jsx("div", { className: "prose prose-sm mt-2 max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed", children: _jsx(EditableMarkdown, { value: item.bodyMarkdown ?? '', update: (md) => {
                                    const items = [...block.items];
                                    items[index] = { ...item, bodyMarkdown: md || undefined };
                                    return { ...block, items };
                                } }) })) : null] }, item.id))) }), edit && block.items.length < 20 ? (_jsx(AddItemButton, { label: "Add milestone", className: "ml-6 mt-3", onAdd: () => edit.updateBlock({
                    ...block,
                    items: [...block.items, { id: createBlockId('tl'), title: 'New milestone' }],
                }) })) : null] }));
}
export function CalloutBlockView({ block }) {
    const edit = useBlockEdit();
    const tone = block.tone ?? 'neutral';
    return (_jsxs("aside", { className: `rounded-xl border p-4 @sm:p-6 ${CALLOUT_TONE_CLASSES[tone]}`, role: "note", children: [block.heading || edit ? (_jsx("h3", { className: "m-0 mb-2 text-lg font-semibold text-ink", children: _jsx(EditableText, { value: block.heading ?? '', placeholder: "Heading (optional)", update: (v) => ({ ...block, heading: v || undefined }) }) })) : null, _jsx("div", { className: "prose prose-sm max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed", children: _jsx(EditableMarkdown, { value: block.markdown, update: (markdown) => ({ ...block, markdown }) }) })] }));
}
export function EmbedBlockView({ block }) {
    const edit = useBlockEdit();
    const aspectRatio = block.aspectRatio ?? '16:9';
    return (_jsxs("figure", { className: "m-0", children: [_jsxs("div", { className: `relative w-full overflow-hidden rounded-xl ${EMBED_ASPECT_CLASSES[aspectRatio]}`, children: [_jsx("iframe", { src: block.src, title: block.title, loading: "lazy", className: "absolute inset-0 h-full w-full border-0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }), edit ? (
                    // Keeps canvas clicks selecting the block instead of the iframe.
                    _jsx("div", { className: "absolute inset-0 z-10", "aria-hidden": "true" })) : null] }), block.caption || edit ? (_jsx("figcaption", { className: "mt-2 text-sm text-ink-muted", children: _jsx(EditableText, { value: block.caption ?? '', placeholder: "Caption (optional)", update: (v) => ({ ...block, caption: v || undefined }) }) })) : null] }));
}
export function CustomHtmlBlockView({ block }) {
    const edit = useBlockEdit();
    const sanitized = sanitizeCustomHtml(block.html);
    const inner = (_jsx("div", { className: "cms-custom-html prose prose-sm max-w-none @sm:prose-base", dangerouslySetInnerHTML: { __html: sanitized } }));
    if (!edit)
        return inner;
    return (_jsxs("div", { className: "relative", children: [_jsx("p", { className: "m-0 mb-2 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-muted", children: "Custom HTML \u2014 edit in block settings" }), inner, _jsx("div", { className: "absolute inset-0 z-10", "aria-hidden": "true" })] }));
}
export function QuoteBlockView({ block }) {
    const edit = useBlockEdit();
    return (_jsxs("blockquote", { className: "border-l-4 border-accent-orange pl-4", children: [_jsxs("p", { className: "m-0 text-lg italic leading-relaxed text-ink", children: ["\u201C", _jsx(EditableText, { value: block.text, multiline: true, placeholder: "Quote", update: (v) => ({ ...block, text: v }) }), "\u201D"] }), block.attribution || edit ? (_jsxs("footer", { className: "mt-2 text-sm text-ink-muted", children: ["\u2014", ' ', _jsx(EditableText, { value: block.attribution ?? '', placeholder: "Attribution (optional)", update: (v) => ({ ...block, attribution: v || undefined }) })] })) : null] }));
}

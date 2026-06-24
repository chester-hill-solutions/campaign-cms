import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useState } from 'react';
import { createBlockId } from '@chester-hill-solutions/cms-core';
import { AddItemButton, EditableText, ItemControls, moveItem, useBlockEdit, } from './editable';
import { cardGridColumnClass } from './layoutClasses';
import { PlainTextBody } from './PlainTextBody';
export function CardGridBlockView({ block }) {
    const baseId = useId();
    const edit = useBlockEdit();
    const [expandedId, setExpandedId] = useState(null);
    return (_jsxs("section", { "aria-labelledby": block.heading ? `${baseId}-heading` : undefined, children: [block.heading || edit ? (_jsx("h2", { id: `${baseId}-heading`, className: "m-0 mb-2 text-2xl font-semibold text-ink", children: _jsx(EditableText, { value: block.heading ?? '', placeholder: "Heading (optional)", update: (v) => ({ ...block, heading: v || undefined }) }) })) : null, block.subheading || edit ? (_jsx("p", { className: "m-0 mb-6 text-base text-ink-muted", children: _jsx(EditableText, { value: block.subheading ?? '', placeholder: "Subheading (optional)", update: (v) => ({ ...block, subheading: v || undefined }) }) })) : null, _jsx("div", { className: `grid gap-4 ${cardGridColumnClass(block.columns)}`, children: block.cards.map((card, index) => {
                    const hasExpand = Boolean(card.expandBody);
                    const isExpanded = expandedId === card.id;
                    const updateCard = (patch) => {
                        const cards = [...block.cards];
                        cards[index] = { ...card, ...patch };
                        return { ...block, cards };
                    };
                    return (_jsxs("article", { className: "group/item relative grid gap-2 rounded-xl border border-border-subtle bg-surface-elevated p-4 @sm:p-5", children: [edit ? (_jsx(ItemControls, { label: "card", index: index, count: block.cards.length, onMove: (to) => edit.updateBlock({ ...block, cards: moveItem(block.cards, index, to) }), onRemove: () => edit.updateBlock({
                                    ...block,
                                    cards: block.cards.filter((c) => c.id !== card.id),
                                }) })) : null, card.iconSrc ? (_jsx("img", { src: card.iconSrc, alt: "", className: "h-12 w-12", "aria-hidden": "true" })) : null, card.imageSrc ? (_jsx("img", { src: card.imageSrc, alt: "", className: "mb-2 w-full rounded-lg", loading: "lazy" })) : null, _jsx("h3", { className: "m-0 text-lg font-semibold text-ink", children: _jsx(EditableText, { value: card.title, placeholder: "Card title", update: (v) => updateCard({ title: v }) }) }), card.body || edit ? (edit ? (_jsx("p", { className: "m-0 whitespace-pre-line text-sm leading-relaxed text-ink-muted", children: _jsx(EditableText, { value: card.body ?? '', multiline: true, placeholder: "Card body (optional)", update: (v) => updateCard({ body: v || undefined }) }) })) : (_jsx(PlainTextBody, { text: card.body ?? '', className: "m-0 text-sm leading-relaxed text-ink-muted" }))) : null, edit ? (_jsxs("div", { className: "grid gap-1 border-t border-dashed border-border-subtle pt-2", children: [_jsx("span", { className: "text-[0.65rem] font-semibold uppercase tracking-wide text-ink-muted", children: "Shown after \u201CLearn more\u201D" }), _jsx("p", { className: "m-0 whitespace-pre-line text-sm leading-relaxed text-ink-muted", children: _jsx(EditableText, { value: card.expandBody ?? '', multiline: true, placeholder: "Expanded content (optional)", update: (v) => updateCard({ expandBody: v || undefined }) }) })] })) : hasExpand ? (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "focus-ring self-start text-sm font-semibold text-accent-orange underline", "aria-expanded": isExpanded, onClick: () => setExpandedId(isExpanded ? null : card.id), children: isExpanded ? 'Show less' : 'Learn more' }), isExpanded && card.expandBody ? (_jsx(PlainTextBody, { text: card.expandBody, className: "m-0 text-sm leading-relaxed text-ink-muted" })) : null] })) : null] }, card.id));
                }) }), edit && block.cards.length < 20 ? (_jsx(AddItemButton, { label: "Add card", className: "mt-3", onAdd: () => edit.updateBlock({
                    ...block,
                    cards: [
                        ...block.cards,
                        { id: createBlockId('card'), title: 'New card', body: 'Card body' },
                    ],
                }) })) : null] }));
}

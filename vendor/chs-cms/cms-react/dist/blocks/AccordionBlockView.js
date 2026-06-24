import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState } from 'react';
import { createBlockId } from '@chester-hill-solutions/cms-core';
import { AddItemButton, EditableMarkdown, EditableText, ItemControls, moveItem, useBlockEdit, } from './editable';
import { RichTextBlockView } from './RichTextBlockView';
export function AccordionBlockView({ block }) {
    const baseId = useId();
    const edit = useBlockEdit();
    const [openIds, setOpenIds] = useState(() => new Set());
    return (_jsxs("section", { "aria-labelledby": block.heading ? `${baseId}-heading` : undefined, children: [block.heading || edit ? (_jsx("h2", { id: `${baseId}-heading`, className: "m-0 mb-4 text-2xl font-semibold text-ink", children: _jsx(EditableText, { value: block.heading ?? '', placeholder: "Heading (optional)", update: (v) => ({ ...block, heading: v || undefined }) }) })) : null, _jsx("div", { className: "grid gap-3", children: block.sections.map((section, index) => {
                    // All sections stay open while editing so content is reachable.
                    const isOpen = edit ? true : openIds.has(section.id);
                    const panelId = `${baseId}-${section.id}`;
                    if (edit) {
                        return (_jsxs("div", { className: "group/item relative overflow-visible rounded-xl border border-border-subtle bg-surface-elevated", children: [_jsx(ItemControls, { label: "section", index: index, count: block.sections.length, onMove: (to) => edit.updateBlock({
                                        ...block,
                                        sections: moveItem(block.sections, index, to),
                                    }), onRemove: () => edit.updateBlock({
                                        ...block,
                                        sections: block.sections.filter((s) => s.id !== section.id),
                                    }) }), _jsx("h3", { className: "m-0 px-4 py-3 text-base font-semibold text-ink @sm:px-5 @sm:py-4", children: _jsx(EditableText, { value: section.title, placeholder: "Section title", update: (v) => {
                                            const sections = [...block.sections];
                                            sections[index] = { ...section, title: v };
                                            return { ...block, sections };
                                        } }) }), _jsxs("div", { className: "border-t border-border-subtle px-4 py-3 @sm:px-5 @sm:py-4", children: [section.imageSrc ? (_jsx("img", { src: section.imageSrc, alt: "", className: "mb-4 w-full rounded-lg", loading: "lazy" })) : null, _jsx("div", { className: "prose prose-sm max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed", children: _jsx(EditableMarkdown, { value: section.markdown, update: (markdown) => {
                                                    const sections = [...block.sections];
                                                    sections[index] = { ...section, markdown };
                                                    return { ...block, sections };
                                                } }) })] })] }, section.id));
                    }
                    return (_jsxs("div", { className: "overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated", children: [_jsx("h3", { className: "m-0", children: _jsxs("button", { type: "button", className: "focus-ring flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-base font-semibold text-ink @sm:px-5 @sm:py-4", "aria-expanded": isOpen, "aria-controls": panelId, onClick: () => {
                                        setOpenIds((prev) => {
                                            const next = new Set(prev);
                                            if (next.has(section.id))
                                                next.delete(section.id);
                                            else
                                                next.add(section.id);
                                            return next;
                                        });
                                    }, children: [section.title, _jsx("span", { "aria-hidden": "true", className: "text-accent-orange", children: isOpen ? '−' : '+' })] }) }), isOpen ? (_jsxs("div", { id: panelId, className: "border-t border-border-subtle px-4 py-3 @sm:px-5 @sm:py-4", children: [section.imageSrc ? (_jsx("img", { src: section.imageSrc, alt: "", className: "mb-4 w-full rounded-lg", loading: "lazy" })) : null, _jsx(RichTextBlockView, { block: {
                                            id: `${section.id}-body`,
                                            type: 'richText',
                                            layout: block.layout,
                                            markdown: section.markdown,
                                        } })] })) : null] }, section.id));
                }) }), edit && block.sections.length < 20 ? (_jsx(AddItemButton, { label: "Add section", className: "mt-3", onAdd: () => edit.updateBlock({
                    ...block,
                    sections: [
                        ...block.sections,
                        {
                            id: createBlockId('sec'),
                            title: 'New section',
                            markdown: 'Section content.',
                        },
                    ],
                }) })) : null] }));
}

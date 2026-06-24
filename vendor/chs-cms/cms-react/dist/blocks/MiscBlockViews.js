import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AddItemButton, EditableText, ItemControls, moveItem, useBlockEdit, } from './editable';
export function ImageBlockView({ block }) {
    const edit = useBlockEdit();
    return (_jsxs("figure", { className: "m-0", children: [block.src ? (_jsx("img", { src: block.src, alt: block.alt, className: "h-auto w-full rounded-xl", loading: "lazy" })) : edit ? (_jsx("div", { className: "grid min-h-40 place-items-center rounded-xl border border-dashed border-line-strong text-xs font-semibold text-ink-muted", children: "No image \u2014 add one in block settings" })) : null, block.caption || edit ? (_jsx("figcaption", { className: "mt-2 text-sm text-ink-muted", children: _jsx(EditableText, { value: block.caption ?? '', placeholder: "Caption (optional)", update: (v) => ({ ...block, caption: v || undefined }) }) })) : null] }));
}
function focusListItem(blockId, index) {
    requestAnimationFrame(() => {
        const el = document.querySelector(`[data-editable-id="${blockId}-item-${index}"]`);
        el?.focus();
    });
}
export function ListBlockView({ block }) {
    const edit = useBlockEdit();
    const Tag = block.ordered ? 'ol' : 'ul';
    const listClass = block.ordered ? 'list-decimal' : 'list-disc';
    return (_jsxs("section", { children: [block.heading || edit ? (_jsx("h2", { className: "m-0 mb-4 text-2xl font-semibold text-ink", children: _jsx(EditableText, { value: block.heading ?? '', placeholder: "Heading (optional)", update: (v) => ({ ...block, heading: v || undefined }) }) })) : null, _jsx(Tag, { className: `m-0 space-y-2 pl-5 text-ink-muted ${listClass}`, children: block.items.map((item, index) => (_jsx("li", { className: `leading-relaxed ${edit ? 'group/item relative' : ''}`, children: edit ? (_jsxs(_Fragment, { children: [_jsx(EditableText, { value: item, placeholder: "List item", editableId: `${block.id}-item-${index}`, update: (v) => {
                                    const items = [...block.items];
                                    items[index] = v;
                                    return { ...block, items };
                                }, onEnterKey: () => {
                                    if (block.items.length >= 50)
                                        return;
                                    const items = [...block.items];
                                    items.splice(index + 1, 0, 'New item');
                                    edit.updateBlock({ ...block, items });
                                    focusListItem(block.id, index + 1);
                                }, onBackspaceEmpty: () => {
                                    if (block.items.length <= 1)
                                        return;
                                    edit.updateBlock({
                                        ...block,
                                        items: block.items.filter((_, i) => i !== index),
                                    });
                                    focusListItem(block.id, Math.max(0, index - 1));
                                } }), _jsx(ItemControls, { label: "item", index: index, count: block.items.length, onMove: (to) => edit.updateBlock({ ...block, items: moveItem(block.items, index, to) }), onRemove: () => edit.updateBlock({
                                    ...block,
                                    items: block.items.filter((_, i) => i !== index),
                                }) })] })) : (item) }, index))) }), edit && block.items.length < 50 ? (_jsx(AddItemButton, { label: "Add item", className: "mt-3", onAdd: () => edit.updateBlock({ ...block, items: [...block.items, 'New item'] }) })) : null] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, GripVertical, PanelLeft, Plus, Trash2, TriangleAlert, } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { BLOCK_TYPE_LABELS, insertBlockAt, removeBlockFromPage, reorderBlocksInPage, updateBlockInPage, } from '@chester-hill-solutions/cms-core';
import { useCmsUi } from '../context';
import { getBlockChildren, getBlockParts, } from './blockChildren';
import { BlockSettingsBody } from './BlockSettingsBody';
import { BLOCK_TYPE_ICONS } from './blockTypeIcons';
import { InsertMenu } from './InsertMenu';
const CHILD_ROW_CLASS = (childSelected) => `focus-ring w-full truncate rounded-md px-2 py-1 text-left text-xs ${childSelected
    ? 'bg-[color-mix(in_oklab,var(--accent-orange)_16%,var(--surface-card))] font-semibold text-ink'
    : 'text-ink-muted hover:bg-surface-elevated hover:text-ink'}`;
function SortableBlockRow({ block, selected, itemIndexSelected, partKeySelected, expanded, onToggleExpand, onSelectBlock, onSelectItem, onSelectPart, onDelete, errors, }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
    const children = getBlockChildren(block);
    const parts = getBlockParts(block);
    const hasChildren = children.length > 0 || parts.length > 0;
    const Icon = BLOCK_TYPE_ICONS[block.type];
    const hasErrors = Boolean(errors && errors.length > 0);
    return (_jsxs("li", { ref: setNodeRef, style: {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.45 : 1,
        }, className: "list-none", children: [_jsxs("div", { className: `group/row flex items-center gap-0.5 rounded-lg px-1 py-1 ${selected && itemIndexSelected === undefined && partKeySelected === undefined
                    ? 'bg-[color-mix(in_oklab,var(--accent-orange)_16%,var(--surface-card))]'
                    : 'hover:bg-surface-elevated'}`, children: [_jsx("button", { type: "button", className: "focus-ring inline-flex h-7 w-5 shrink-0 cursor-grab items-center justify-center rounded text-ink-muted active:cursor-grabbing", "aria-label": `Drag ${BLOCK_TYPE_LABELS[block.type]}`, ...attributes, ...listeners, children: _jsx(GripVertical, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) }), hasChildren ? (_jsx("button", { type: "button", className: "focus-ring inline-flex h-7 w-5 shrink-0 items-center justify-center rounded text-ink-muted hover:text-ink", "aria-label": expanded ? 'Collapse items' : 'Expand items', "aria-expanded": expanded, onClick: onToggleExpand, children: expanded ? (_jsx(ChevronDown, { className: "h-3.5 w-3.5", "aria-hidden": "true" })) : (_jsx(ChevronRight, { className: "h-3.5 w-3.5", "aria-hidden": "true" })) })) : (_jsx("span", { className: "inline-flex h-7 w-5 shrink-0", "aria-hidden": "true" })), _jsxs("button", { type: "button", className: "focus-ring flex min-w-0 flex-1 items-center gap-1.5 rounded px-1 py-1 text-left", onClick: onSelectBlock, children: [_jsx(Icon, { className: "h-3.5 w-3.5 shrink-0 text-ink-muted", "aria-hidden": "true" }), _jsx("span", { className: "truncate text-xs font-semibold text-ink", children: BLOCK_TYPE_LABELS[block.type] }), hasErrors ? (_jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0 text-accent-red", "aria-label": `${errors?.length ?? 0} validation errors` })) : null] }), _jsx("button", { type: "button", className: "focus-ring inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-ink-muted opacity-0 hover:bg-surface-page hover:text-accent-red group-hover/row:opacity-100 focus-visible:opacity-100", "aria-label": `Delete ${BLOCK_TYPE_LABELS[block.type]}`, onClick: onDelete, children: _jsx(Trash2, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) })] }), hasChildren && expanded ? (_jsxs("ul", { className: "m-0 ml-8 grid list-none gap-0.5 border-l border-border-subtle py-0.5 pl-2", children: [parts.map((part) => {
                        const partSelected = selected && partKeySelected === part.key;
                        return (_jsx("li", { className: "list-none", children: _jsx("button", { type: "button", className: CHILD_ROW_CLASS(Boolean(partSelected)), onClick: () => onSelectPart(part.key), children: part.label }) }, `${block.id}-part-${part.key}`));
                    }), children.map((child) => {
                        const childSelected = selected && itemIndexSelected === child.index;
                        return (_jsx("li", { className: "list-none", children: _jsx("button", { type: "button", className: CHILD_ROW_CLASS(Boolean(childSelected)), onClick: () => onSelectItem(child.index), children: child.label }) }, `${block.id}-${child.index}`));
                    })] })) : null] }));
}
/**
 * Always-visible left rail: page block outline on top, settings for the
 * current selection below.
 */
export function BlockListSidebar({ content, selection, onSelect, onChange, errorsByBlock, showSettings = true, onCollapse, className = '', }) {
    const { blockDefaults } = useCmsUi();
    const dndContextId = useId();
    const [insertOpen, setInsertOpen] = useState(false);
    const [expandedIds, setExpandedIds] = useState(() => new Set());
    const selectedBlock = content.blocks.find((b) => b.id === selection?.blockId) ?? null;
    useEffect(() => {
        if (selection?.blockId &&
            (selection.itemIndex !== undefined || selection.partKey !== undefined)) {
            setExpandedIds((prev) => {
                if (prev.has(selection.blockId))
                    return prev;
                const next = new Set(prev);
                next.add(selection.blockId);
                return next;
            });
        }
    }, [selection]);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const sortableIds = useMemo(() => content.blocks.map((b) => b.id), [content.blocks]);
    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id)
            return;
        const fromIndex = content.blocks.findIndex((b) => b.id === active.id);
        const toIndex = content.blocks.findIndex((b) => b.id === over.id);
        if (fromIndex < 0 || toIndex < 0)
            return;
        onChange(reorderBlocksInPage(content, fromIndex, toIndex));
    }
    function handleInsert(type) {
        const { content: next, block } = insertBlockAt(content, type, content.blocks.length, blockDefaults);
        onChange(next);
        setInsertOpen(false);
        onSelect({ blockId: block.id });
    }
    function toggleExpanded(blockId) {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(blockId))
                next.delete(blockId);
            else
                next.add(blockId);
            return next;
        });
    }
    return (_jsxs("aside", { className: `pb-block-sidebar relative flex h-full min-h-0 w-80 shrink-0 flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-card ${className}`, "aria-label": "Page blocks", children: [_jsxs("header", { className: "flex shrink-0 items-center justify-between border-b border-border-subtle px-3 py-2.5", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [onCollapse ? (_jsx("button", { type: "button", className: "focus-ring inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-surface-elevated hover:text-ink", "aria-label": "Hide block list", onClick: onCollapse, children: _jsx(PanelLeft, { className: "h-4 w-4", "aria-hidden": "true" }) })) : null, _jsx("h2", { className: "m-0 text-sm font-semibold text-ink", children: "Blocks" })] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", className: "focus-ring inline-flex h-7 items-center gap-1 rounded-md border border-border-subtle px-2 text-xs font-semibold text-ink hover:border-accent-orange", onClick: () => setInsertOpen((open) => !open), children: [_jsx(Plus, { className: "h-3.5 w-3.5", "aria-hidden": "true" }), "Add"] }), insertOpen ? (_jsx(InsertMenu, { align: "end", onPick: handleInsert, onClose: () => setInsertOpen(false) })) : null] })] }), _jsx("div", { className: "min-h-0 flex-[0.9] overflow-y-auto px-2 py-2", children: content.blocks.length === 0 ? (_jsx("p", { className: "m-0 px-2 py-6 text-center text-xs text-ink-muted", children: "No blocks yet. Add one to start building the page." })) : (_jsx(DndContext, { id: dndContextId, sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: sortableIds, strategy: verticalListSortingStrategy, children: _jsx("ul", { className: "m-0 grid list-none gap-0.5 p-0", children: content.blocks.map((block) => (_jsx(SortableBlockRow, { block: block, selected: selection?.blockId === block.id, itemIndexSelected: selection?.blockId === block.id ? selection.itemIndex : undefined, partKeySelected: selection?.blockId === block.id ? selection.partKey : undefined, expanded: expandedIds.has(block.id), onToggleExpand: () => toggleExpanded(block.id), onSelectBlock: () => onSelect({ blockId: block.id }), onSelectItem: (index) => onSelect({ blockId: block.id, itemIndex: index }), onSelectPart: (key) => onSelect({ blockId: block.id, partKey: key }), onDelete: () => {
                                    onChange(removeBlockFromPage(content, block.id));
                                    if (selection?.blockId === block.id)
                                        onSelect(null);
                                }, errors: errorsByBlock.get(block.id) }, block.id))) }) }) })) }), showSettings ? (_jsxs("div", { className: "flex min-h-0 flex-[1.1] flex-col border-t border-border-subtle", children: [_jsxs("header", { className: "flex shrink-0 items-center justify-between px-3 py-2", children: [_jsx("h3", { className: "m-0 text-xs font-semibold uppercase tracking-wide text-ink-muted", children: selectedBlock
                                    ? `${BLOCK_TYPE_LABELS[selectedBlock.type]} settings`
                                    : 'Settings' }), selection?.itemIndex !== undefined || selection?.partKey !== undefined ? (_jsx("button", { type: "button", className: "focus-ring text-[0.65rem] font-semibold text-accent-orange hover:underline", onClick: () => selection?.blockId
                                    ? onSelect({ blockId: selection.blockId })
                                    : undefined, children: "Whole block" })) : null] }), _jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-3 pb-3", children: selectedBlock ? (_jsx(BlockSettingsBody, { block: selectedBlock, errors: errorsByBlock.get(selectedBlock.id), onChange: (block) => onChange(updateBlockInPage(content, block)), focusItemIndex: selection?.itemIndex, focusPartKey: selection?.partKey })) : (_jsx("p", { className: "m-0 px-1 py-4 text-xs text-ink-muted", children: "Select a block on the canvas or in the list to edit images, links, layout, and other settings. Text is edited inline on the page." })) })] })) : null] }));
}

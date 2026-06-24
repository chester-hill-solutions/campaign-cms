import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Fragment, useMemo, useRef, useState } from 'react';
import { APP_BLOCK_TYPES, BLOCK_TYPE_LABELS, duplicateBlockInPage, insertBlockAt, moveBlockInPage, reorderBlocksInPage, updateBlockInPage, } from '@chester-hill-solutions/cms-core';
import { renderBlockView } from '../blocks/BlockRenderer';
import { BlockEditProvider } from '../blocks/editable';
import { useCmsUi } from '../context';
import { BlockChrome } from './BlockChrome';
import { InsertMenu } from './InsertMenu';
const APP_BLOCK_TYPE_SET = new Set(APP_BLOCK_TYPES);
function AppBlockPlaceholder({ block }) {
    const heading = 'heading' in block && typeof block.heading === 'string' ? block.heading : null;
    return (_jsxs("div", { className: "grid gap-1 rounded-xl border border-dashed border-line-strong bg-surface-elevated/50 px-5 py-6 text-center", children: [_jsx("p", { className: "m-0 text-sm font-semibold text-ink", children: BLOCK_TYPE_LABELS[block.type] }), heading ? _jsxs("p", { className: "m-0 text-sm text-ink-muted", children: ["\u201C", heading, "\u201D"] }) : null, _jsx("p", { className: "m-0 text-xs text-ink-muted", children: "Live content renders on the public site. Configure it in block settings." })] }));
}
function InsertPoint({ open, onOpen, onClose, onPick, }) {
    return (_jsxs("div", { className: "pb-insert-point group/insert relative -my-2 flex h-5 items-center justify-center", children: [_jsx("span", { className: `absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-accent-orange transition-opacity ${open ? 'opacity-60' : 'opacity-0 group-hover/insert:opacity-60'}`, "aria-hidden": "true" }), _jsx("button", { type: "button", "aria-label": "Insert block here", className: `focus-ring relative z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border border-accent-orange bg-surface-card text-accent-orange shadow-sm transition-opacity hover:bg-accent-orange hover:text-primary-dark focus-visible:opacity-100 ${open ? 'opacity-100' : 'opacity-0 group-hover/insert:opacity-100'}`, onClick: (e) => {
                    e.stopPropagation();
                    onOpen();
                }, children: _jsx(Plus, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) }), open ? _jsx(InsertMenu, { onPick: onPick, onClose: onClose }) : null] }));
}
/**
 * The inline-editable page canvas. Renders real block views wrapped in
 * selection chrome, with insert points between blocks and drag reordering.
 */
export function EditorCanvas({ content, onChange, selectedId, onSelect, onOpenSettings, onDelete, errorsByBlock, }) {
    const [insertAt, setInsertAt] = useState(null);
    const { blockDefaults } = useCmsUi();
    const stateRef = useRef({ content, onChange });
    stateRef.current = { content, onChange };
    // Stable identity so block views don't remount as content changes.
    const editApi = useMemo(() => ({
        updateBlock: (block) => {
            const { content: current, onChange: emit } = stateRef.current;
            emit(updateBlockInPage(current, block));
        },
    }), []);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id)
            return;
        const fromIndex = content.blocks.findIndex((b) => b.id === active.id);
        const toIndex = content.blocks.findIndex((b) => b.id === over.id);
        if (fromIndex < 0 || toIndex < 0)
            return;
        onChange(reorderBlocksInPage(content, fromIndex, toIndex));
    };
    const handleInsert = (type, index) => {
        const { content: next, block } = insertBlockAt(content, type, index, blockDefaults);
        onChange(next);
        setInsertAt(null);
        onSelect(block.id);
    };
    if (content.blocks.length === 0) {
        return (_jsx(BlockEditProvider, { value: editApi, children: _jsxs("div", { className: "relative grid place-items-center py-16", children: [_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-line-strong px-6 py-4 text-sm font-semibold text-ink-muted hover:border-accent-orange hover:text-ink", onClick: () => setInsertAt(0), children: [_jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }), "Add your first block"] }), insertAt !== null ? (_jsx(InsertMenu, { onPick: (type) => handleInsert(type, 0), onClose: () => setInsertAt(null) })) : null] }) }));
    }
    return (_jsx(BlockEditProvider, { value: editApi, children: _jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: content.blocks.map((b) => b.id), strategy: verticalListSortingStrategy, children: _jsxs("div", { className: "@container grid w-full min-w-0 gap-2 pb-10 pt-4", children: [_jsx(InsertPoint, { open: insertAt === 0, onOpen: () => setInsertAt(0), onClose: () => setInsertAt(null), onPick: (type) => handleInsert(type, 0) }), content.blocks.map((block, index) => (_jsxs(Fragment, { children: [_jsx(BlockChrome, { block: block, index: index, count: content.blocks.length, selected: block.id === selectedId, errors: errorsByBlock.get(block.id), onSelect: () => onSelect(block.id), onOpenSettings: onOpenSettings, onMove: (direction) => onChange(moveBlockInPage(content, block.id, direction)), onDuplicate: () => onChange(duplicateBlockInPage(content, block.id)), onDelete: () => onDelete(block.id), children: APP_BLOCK_TYPE_SET.has(block.type) ? (_jsx(AppBlockPlaceholder, { block: block })) : (renderBlockView(block)) }), _jsx(InsertPoint, { open: insertAt === index + 1, onOpen: () => setInsertAt(index + 1), onClose: () => setInsertAt(null), onPick: (type) => handleInsert(type, index + 1) })] }, block.id)))] }) }) }) }));
}

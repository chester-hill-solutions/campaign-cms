import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { BLOCK_TYPE_LABELS } from '@chester-hill-solutions/cms-core';
import { BlockTypeSettings } from './blockTypeSettings';
import { PanelSection, SegmentedControl } from './fields';
import { useCmsText } from '../context';
function LayoutSettings({ layout, onChange, }) {
    return (_jsxs(PanelSection, { title: "Layout", children: [_jsx(SegmentedControl, { label: "Width", hint: "How wide this block sits in the page frame: contained stays in the content column, wide stretches further, full reaches the edges.", options: [
                    { value: 'contained', label: 'Contained' },
                    { value: 'wide', label: 'Wide' },
                    { value: 'full', label: 'Full' },
                ], value: layout.width, onChange: (width) => onChange({ ...layout, width }) }), _jsx(SegmentedControl, { label: "Background", hint: "Surface behind the block content. Card adds a bordered panel; accent and gradient use brand colors.", options: [
                    { value: 'none', label: 'None' },
                    { value: 'card', label: 'Card' },
                    { value: 'accent', label: 'Accent' },
                    { value: 'brand-gradient', label: 'Gradient' },
                ], value: layout.background, onChange: (background) => onChange({ ...layout, background }) }), _jsx(SegmentedControl, { label: "Vertical spacing", hint: "Padding above and below the block. Use tight for dense stacks and loose to separate major sections.", options: [
                    { value: 'tight', label: 'Tight' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'loose', label: 'Loose' },
                ], value: layout.spacing, onChange: (spacing) => onChange({ ...layout, spacing }) }), _jsx(SegmentedControl, { label: "Alignment", hint: "Horizontal alignment for text and inline content inside this block.", options: [
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                ], value: layout.align, onChange: (align) => onChange({ ...layout, align }) })] }));
}
/** Shared settings fields for a selected block (type-specific + layout). */
export function BlockSettingsBody({ block, errors, onChange, focusItemIndex, focusPartKey, }) {
    const text = useCmsText();
    const rootRef = useRef(null);
    useEffect(() => {
        const root = rootRef.current;
        if (!root)
            return;
        if (focusItemIndex !== undefined) {
            const el = root.querySelector(`[data-settings-item="${focusItemIndex}"]`);
            if (el) {
                if (el instanceof HTMLDetailsElement)
                    el.open = true;
                el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
            return;
        }
        if (focusPartKey) {
            const el = root.querySelector(`[data-settings-part="${focusPartKey}"]`);
            el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [block.id, focusItemIndex, focusPartKey]);
    return (_jsxs("div", { ref: rootRef, className: "grid content-start gap-3", "aria-label": text('{{block}} settings', { block: text(BLOCK_TYPE_LABELS[block.type]) }), children: [errors && errors.length > 0 ? (_jsx("div", { className: "rounded-lg border border-accent-red bg-[color-mix(in_oklab,var(--accent-red)_8%,var(--surface-card))] p-2", role: "alert", children: _jsx("ul", { className: "m-0 grid list-disc gap-0.5 pl-4 text-xs text-accent-red", children: errors.map((message) => (_jsx("li", { children: text(message) }, message))) }) })) : null, _jsx(BlockTypeSettings, { block: block, onChange: onChange }), _jsx(LayoutSettings, { layout: block.layout, onChange: (layout) => onChange({ ...block, layout }) })] }));
}

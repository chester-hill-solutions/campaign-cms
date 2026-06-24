import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
import { BLOCK_TYPE_LABELS } from '@chester-hill-solutions/cms-core';
import { BlockTypeSettings } from './blockTypeSettings';
import { PanelSection, SegmentedControl } from './fields';
function LayoutSettings({ layout, onChange, }) {
    return (_jsxs(PanelSection, { title: "Layout", children: [_jsx(SegmentedControl, { label: "Width", options: [
                    { value: 'contained', label: 'Contained' },
                    { value: 'wide', label: 'Wide' },
                    { value: 'full', label: 'Full' },
                ], value: layout.width, onChange: (width) => onChange({ ...layout, width }) }), _jsx(SegmentedControl, { label: "Background", options: [
                    { value: 'none', label: 'None' },
                    { value: 'card', label: 'Card' },
                    { value: 'accent', label: 'Accent' },
                    { value: 'brand-gradient', label: 'Gradient' },
                ], value: layout.background, onChange: (background) => onChange({ ...layout, background }) }), _jsx(SegmentedControl, { label: "Vertical spacing", options: [
                    { value: 'tight', label: 'Tight' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'loose', label: 'Loose' },
                ], value: layout.spacing, onChange: (spacing) => onChange({ ...layout, spacing }) }), _jsx(SegmentedControl, { label: "Alignment", options: [
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                ], value: layout.align, onChange: (align) => onChange({ ...layout, align }) })] }));
}
/** Floating settings inspector for the selected block. */
export function BlockSettingsPanel({ block, errors, onChange, onClose }) {
    return (_jsxs("aside", { className: "pb-settings-panel fixed bottom-4 right-4 top-24 z-40 flex w-80 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-card shadow-xl", "aria-label": `${BLOCK_TYPE_LABELS[block.type]} settings`, children: [_jsxs("header", { className: "flex items-center justify-between border-b border-border-subtle px-4 py-2.5", children: [_jsxs("h2", { className: "m-0 text-sm font-semibold text-ink", children: [BLOCK_TYPE_LABELS[block.type], " settings"] }), _jsx("button", { type: "button", className: "focus-ring inline-flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:text-ink", "aria-label": "Close settings", onClick: onClose, children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] }), _jsxs("div", { className: "grid flex-1 content-start gap-3 overflow-y-auto px-4 py-3", children: [errors && errors.length > 0 ? (_jsx("div", { className: "rounded-lg border border-accent-red bg-[color-mix(in_oklab,var(--accent-red)_8%,var(--surface-card))] p-2", role: "alert", children: _jsx("ul", { className: "m-0 grid list-disc gap-0.5 pl-4 text-xs text-accent-red", children: errors.map((message) => (_jsx("li", { children: message }, message))) }) })) : null, _jsx(BlockTypeSettings, { block: block, onChange: onChange }), _jsx(LayoutSettings, { layout: block.layout, onChange: (layout) => onChange({ ...block, layout }) })] })] }));
}

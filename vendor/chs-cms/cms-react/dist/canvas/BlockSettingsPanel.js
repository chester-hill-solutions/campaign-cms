import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { X } from 'lucide-react';
import { BLOCK_TYPE_LABELS } from '@chester-hill-solutions/cms-core';
import { BlockItemSettings, itemSettingsLabel } from './blockItemSettings';
import { BlockTypeSettings } from './blockTypeSettings';
import { SegmentedControl } from './fields';
import { isItemSelection } from './selection';
import { useCmsTranslate } from '../context';
function LayoutSettings({ layout, onChange, t, }) {
    return (_jsxs("div", { className: "grid gap-3", children: [_jsx(SegmentedControl, { label: t('cms.layout.width', 'Width'), options: [
                    { value: 'contained', label: t('cms.layout.width.contained', 'Contained') },
                    { value: 'wide', label: t('cms.layout.width.wide', 'Wide') },
                    { value: 'full', label: t('cms.layout.width.full', 'Full') },
                ], value: layout.width, onChange: (width) => onChange({ ...layout, width }) }), _jsx(SegmentedControl, { label: t('cms.layout.background', 'Background'), options: [
                    { value: 'none', label: t('cms.layout.background.none', 'None') },
                    { value: 'card', label: t('cms.layout.background.card', 'Card') },
                    { value: 'accent', label: t('cms.layout.background.accent', 'Accent') },
                    { value: 'brand-gradient', label: t('cms.layout.background.gradient', 'Gradient') },
                ], value: layout.background, onChange: (background) => onChange({ ...layout, background }) }), layout.background === 'accent' || layout.background === 'brand-gradient' ? (_jsx(SegmentedControl, { label: t('cms.layout.accentColor', 'Accent color'), options: [
                    { value: 'primary', label: t('cms.layout.accent.primary', 'Primary') },
                    { value: 'alt', label: t('cms.layout.accent.alt', 'Alt') },
                    { value: 'tertiary', label: t('cms.layout.accent.tertiary', 'Tertiary') },
                ], value: layout.accent ?? 'primary', onChange: (accent) => onChange({ ...layout, accent }) })) : null, _jsx(SegmentedControl, { label: t('cms.layout.verticalSpacing', 'Vertical spacing'), options: [
                    { value: 'tight', label: t('cms.layout.spacing.tight', 'Tight') },
                    { value: 'normal', label: t('cms.layout.spacing.normal', 'Normal') },
                    { value: 'loose', label: t('cms.layout.spacing.loose', 'Loose') },
                ], value: layout.spacing, onChange: (spacing) => onChange({ ...layout, spacing }) }), _jsx(SegmentedControl, { label: t('cms.layout.alignment', 'Alignment'), options: [
                    { value: 'left', label: t('cms.layout.align.left', 'Left') },
                    { value: 'center', label: t('cms.layout.align.center', 'Center') },
                ], value: layout.align, onChange: (align) => onChange({ ...layout, align }) })] }));
}
/** Settings inspector for the selected block or nested item. */
export function BlockSettingsPanel({ block, selection = null, errors, onChange, onClose, variant = 'docked', forms, }) {
    const t = useCmsTranslate();
    const itemMode = block != null && isItemSelection(selection) && selection.blockId === block.id;
    const title = !block
        ? t('cms.block.settings', 'Settings')
        : itemMode
            ? `${t(`cms.block.${block.type}`, BLOCK_TYPE_LABELS[block.type])} · ${t(`cms.blockItem.${selection.itemKind}`, itemSettingsLabel(block, selection))}`
            : t('cms.block.settingsTitle', `${t(`cms.block.${block.type}`, BLOCK_TYPE_LABELS[block.type])} settings`, { label: t(`cms.block.${block.type}`, BLOCK_TYPE_LABELS[block.type]) });
    const shellClass = variant === 'floating'
        ? 'pb-settings-panel fixed bottom-4 right-4 top-24 z-40 flex w-80 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-card shadow-xl'
        : 'pb-settings-panel flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface-card shadow-sm';
    return (_jsxs("aside", { className: shellClass, "aria-label": title, children: [_jsxs("header", { className: "flex items-center justify-between border-b border-border-subtle px-4 py-2.5", children: [_jsx("h2", { className: "m-0 truncate text-sm font-semibold text-ink", children: title }), block ? (_jsx("button", { type: "button", className: "focus-ring inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-ink-muted hover:text-ink", "aria-label": t('cms.block.clearSelection', 'Clear selection'), onClick: onClose, children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })) : (_jsx("span", { className: "inline-block h-7 w-7", "aria-hidden": "true" }))] }), _jsx("div", { className: "grid flex-1 content-start gap-3 overflow-y-auto px-4 py-3", children: !block ? (_jsx("p", { className: "m-0 text-xs text-ink-muted", children: t('cms.block.selectHelp', 'Select a block or item in the structure tree or on the page.') })) : (_jsxs(_Fragment, { children: [errors && errors.length > 0 && !itemMode ? (_jsx("div", { className: "rounded-lg border border-accent-red bg-[color-mix(in_oklab,var(--accent-red)_8%,var(--surface-card))] p-2", role: "alert", children: _jsx("ul", { className: "m-0 grid list-disc gap-0.5 pl-4 text-xs text-accent-red", children: errors.map((message) => (_jsx("li", { children: message }, message))) }) })) : null, itemMode && selection ? (_jsx(BlockItemSettings, { block: block, selection: selection, onChange: onChange })) : (_jsxs(_Fragment, { children: [_jsx(BlockTypeSettings, { block: block, onChange: onChange, forms: forms }), _jsxs("details", { className: "rounded-lg border border-border-subtle bg-surface-elevated/40", children: [_jsxs("summary", { className: "cursor-pointer px-3 py-2 text-xs font-semibold text-ink", children: [t('cms.layout.title', 'Layout'), _jsxs("span", { className: "ml-1 font-normal text-ink-muted", children: ["\u2014 ", t('cms.layout.summary', 'width, background, spacing')] })] }), _jsx("div", { className: "border-t border-border-subtle px-3 py-2", children: _jsx(LayoutSettings, { layout: block.layout, onChange: (layout) => onChange({ ...block, layout }), t: t }) })] })] }))] })) })] }));
}

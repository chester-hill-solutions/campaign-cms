import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ImageIcon, X } from 'lucide-react';
import { useState } from 'react';
import { AdminCheckbox, AdminTextInput } from '../ui';
import { MediaPicker } from '../MediaPicker';
/** Titled group of fields inside the settings panel. */
export function PanelSection({ title, children, }) {
    return (_jsxs("section", { className: "grid gap-2.5 border-t border-border-subtle pt-3", children: [_jsx("h3", { className: "m-0 text-xs font-semibold uppercase tracking-wide text-ink-muted", children: title }), children] }));
}
/** Compact segmented control for small enum fields. */
export function SegmentedControl({ label, options, value, onChange, }) {
    return (_jsxs("div", { className: "grid gap-1", children: [_jsx("span", { className: "text-xs font-semibold text-ink-muted", children: label }), _jsx("div", { role: "radiogroup", "aria-label": label, className: "flex flex-wrap gap-0.5 rounded-lg border border-border-subtle bg-surface-page p-0.5", children: options.map((option) => (_jsx("button", { type: "button", role: "radio", "aria-checked": option.value === value, className: `focus-ring flex-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ${option.value === value
                        ? 'bg-accent-orange text-primary-dark'
                        : 'text-ink-muted hover:text-ink'}`, onClick: () => onChange(option.value), children: option.label }, String(option.value)))) })] }));
}
/** CTA editor: clearing the label removes the CTA entirely. */
export function CtaFields({ label, cta, onChange, }) {
    return (_jsxs("fieldset", { className: "m-0 grid gap-2 rounded-lg border border-border-subtle bg-surface-elevated p-2.5", children: [_jsx("legend", { className: "px-1 text-xs font-semibold text-ink-muted", children: label }), _jsx(AdminTextInput, { label: "Label", value: cta?.label ?? '', placeholder: "Leave empty to hide", onChange: (e) => {
                    const labelValue = e.target.value;
                    if (!labelValue) {
                        onChange(undefined);
                        return;
                    }
                    onChange({ label: labelValue, href: cta?.href ?? '/', external: cta?.external });
                } }), _jsx(AdminTextInput, { label: "Link", value: cta?.href ?? '', onChange: (e) => {
                    const href = e.target.value;
                    if (!href) {
                        onChange(undefined);
                        return;
                    }
                    onChange({ label: cta?.label ?? 'Link', href, external: cta?.external });
                } }), _jsx(AdminCheckbox, { label: "Opens in new tab", checked: cta?.external ?? false, onChange: (e) => {
                    if (!cta)
                        return;
                    onChange({ ...cta, external: e.target.checked });
                } })] }));
}
/** Image field with thumbnail, media library picker, and manual path entry. */
export function MediaField({ label, value, onSelect, onClear, }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    return (_jsxs("div", { className: "grid gap-1.5", children: [_jsx("span", { className: "text-xs font-semibold text-ink-muted", children: label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", className: "focus-ring relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-page", "aria-label": value ? `Change ${label}` : `Choose ${label}`, onClick: () => setPickerOpen(true), children: value ? (_jsx("img", { src: value, alt: "", className: "h-full w-full object-cover" })) : (_jsx(ImageIcon, { className: "absolute inset-0 m-auto h-5 w-5 text-ink-muted", "aria-hidden": "true" })) }), _jsxs("div", { className: "grid min-w-0 flex-1 gap-1", children: [_jsx("input", { value: value, placeholder: "/media/\u2026 or /path.webp", "aria-label": `${label} path`, className: "admin-field__input focus-ring w-full text-xs", onChange: (e) => onSelect(e.target.value) }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", className: "focus-ring text-xs font-semibold text-accent-orange underline", onClick: () => setPickerOpen(true), children: "Media library" }), value ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-0.5 text-xs font-semibold text-accent-red underline", onClick: onClear, children: [_jsx(X, { className: "h-3 w-3", "aria-hidden": "true" }), "Clear"] })) : null] })] })] }), _jsx(MediaPicker, { open: pickerOpen, onClose: () => setPickerOpen(false), onSelect: (path, alt) => onSelect(path, alt) })] }));
}

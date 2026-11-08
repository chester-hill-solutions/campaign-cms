import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ImageIcon, X } from 'lucide-react';
import { useState } from 'react';
import { AdminCheckbox, AdminTextInput } from '../ui';
import { MediaPicker } from '../MediaPicker';
import { useCmsText } from '../context';
/** Titled group of fields inside the settings panel. */
export function PanelSection({ title, children, }) {
    const text = useCmsText();
    return (_jsxs("section", { className: "grid gap-2.5 border-t border-border-subtle pt-3", children: [_jsx("h3", { className: "m-0 text-xs font-semibold uppercase tracking-wide text-ink-muted", children: text(title) }), children] }));
}
/** Compact segmented control for small enum fields. */
export function SegmentedControl({ label, hint, options, value, onChange, }) {
    const text = useCmsText();
    return (_jsxs("div", { className: "grid gap-1", children: [_jsx("span", { className: "text-xs font-semibold text-ink-muted", children: text(label) }), hint ? _jsx("span", { className: "text-xs leading-relaxed text-ink-muted", children: text(hint) }) : null, _jsx("div", { role: "radiogroup", "aria-label": text(label), className: "flex flex-wrap gap-0.5 rounded-lg border border-border-subtle bg-surface-page p-0.5", children: options.map((option) => (_jsx("button", { type: "button", role: "radio", "aria-checked": option.value === value, className: `focus-ring flex-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ${option.value === value
                        ? 'bg-accent-orange text-primary-dark'
                        : 'text-ink-muted hover:text-ink'}`, onClick: () => onChange(option.value), children: text(option.label) }, String(option.value)))) })] }));
}
/** Keep partial CTA edits intact; removing a button is an explicit action. */
export function CtaFields({ label, cta, onChange, }) {
    const text = useCmsText();
    return (_jsxs("fieldset", { className: "m-0 grid gap-2 rounded-lg border border-border-subtle bg-surface-elevated p-2.5", children: [_jsx("legend", { className: "px-1 text-xs font-semibold text-ink-muted", children: text(label) }), _jsx(AdminTextInput, { label: "Label", value: cta?.label ?? '', placeholder: text('Button text'), onChange: (e) => {
                    onChange({ label: e.target.value, href: cta?.href ?? '', external: cta?.external });
                } }), _jsx(AdminTextInput, { label: "Link", hint: "URL or path the button opens, e.g. /donate or https://example.com.", value: cta?.href ?? '', placeholder: "/path or https://\u2026", onChange: (e) => {
                    onChange({ label: cta?.label ?? '', href: e.target.value, external: cta?.external });
                } }), cta ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-border-subtle px-3 text-xs font-semibold text-accent-red", "aria-label": `${text('Remove button')} — ${text(label)}`, onClick: () => onChange(undefined), children: [_jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }), text('Remove button')] })) : null, _jsx(AdminCheckbox, { label: "Opens in new tab", checked: cta?.external ?? false, onChange: (e) => {
                    if (!cta)
                        return;
                    onChange({ ...cta, external: e.target.checked });
                } })] }));
}
/** Image field with thumbnail, media library picker, and manual path entry. */
export function MediaField({ label, value, onSelect, onClear, }) {
    const text = useCmsText();
    const [pickerOpen, setPickerOpen] = useState(false);
    return (_jsxs("div", { className: "grid gap-1.5", children: [_jsx("span", { className: "text-xs font-semibold text-ink-muted", children: text(label) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", className: "focus-ring relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-page", "aria-label": text(value ? `Change ${label}` : `Choose ${label}`), onClick: () => setPickerOpen(true), children: value ? (_jsx("img", { src: value, alt: "", className: "h-full w-full object-cover" })) : (_jsx(ImageIcon, { className: "absolute inset-0 m-auto h-5 w-5 text-ink-muted", "aria-hidden": "true" })) }), _jsxs("div", { className: "grid min-w-0 flex-1 gap-1", children: [_jsx("input", { value: value, placeholder: text('/media/… or /path.webp'), "aria-label": text(`${label} path`), className: "admin-field__input focus-ring w-full text-xs", onChange: (e) => onSelect(e.target.value) }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", className: "focus-ring text-xs font-semibold text-accent-orange underline", onClick: () => setPickerOpen(true), children: text('Media library') }), value ? (_jsxs("button", { type: "button", className: "focus-ring inline-flex items-center gap-0.5 text-xs font-semibold text-accent-red underline", onClick: onClear, children: [_jsx(X, { className: "h-3 w-3", "aria-hidden": "true" }), text('Clear')] })) : null] })] })] }), _jsx(MediaPicker, { open: pickerOpen, onClose: () => setPickerOpen(false), onSelect: (path, alt) => onSelect(path, alt) })] }));
}

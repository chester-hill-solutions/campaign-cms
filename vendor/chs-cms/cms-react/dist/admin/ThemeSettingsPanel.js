import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { defaultSiteTheme } from '@chester-hill-solutions/cms-core';
import { AdminCheckbox, AdminTextInput } from '../ui';
const LIGHT_FIELDS = [
    { key: 'ink', label: 'Ink' },
    { key: 'surfacePage', label: 'Page surface' },
    { key: 'surfaceCard', label: 'Card surface' },
    { key: 'surfaceElevated', label: 'Elevated surface' },
    { key: 'surfaceCardStrong', label: 'Strong card surface' },
    { key: 'accent', label: 'Accent (primary)' },
    { key: 'accentAlt', label: 'Accent alt' },
    { key: 'accentTertiary', label: 'Accent tertiary' },
];
function ColorField({ label, value, onChange, }) {
    const hexForPicker = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000';
    return (_jsxs("div", { className: "grid gap-1", children: [_jsx("span", { className: "text-xs font-medium text-ink", children: label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "color", "aria-label": `${label} picker`, className: "h-9 w-10 cursor-pointer rounded border border-border-subtle bg-surface-card p-0.5", value: hexForPicker, onChange: (e) => onChange(e.target.value) }), _jsx("input", { type: "text", "aria-label": label, className: "admin-field__input focus-ring min-w-0 flex-1 font-mono text-xs", value: value, onChange: (e) => onChange(e.target.value) })] })] }));
}
function ColorSetEditor({ title, colors, onChange, }) {
    return (_jsxs("section", { className: "grid gap-3 rounded-xl border border-border-subtle bg-surface-elevated/40 p-4", children: [_jsx("h2", { className: "m-0 text-sm font-semibold text-ink", children: title }), _jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: LIGHT_FIELDS.map(({ key, label }) => (_jsx(ColorField, { label: label, value: colors[key] ?? '', onChange: (value) => onChange({ ...colors, [key]: value }) }, key))) }), _jsx("div", { className: "flex flex-wrap gap-2 rounded-lg border border-border-subtle bg-surface-card p-3", "aria-label": `${title} swatches`, children: LIGHT_FIELDS.map(({ key, label }) => (_jsx("span", { title: label, className: "inline-block h-6 w-6 rounded-full border border-border-subtle", style: { background: colors[key] ?? 'transparent' } }, key))) })] }));
}
export function ThemeSettingsPanel({ theme, onChange, onSave, saving, error, statusMessage, }) {
    const darkEnabled = theme.dark != null;
    const updateLight = (light) => onChange({ ...theme, light });
    const updateDark = (dark) => onChange({ ...theme, dark });
    const toggleDark = (enabled) => {
        if (enabled) {
            onChange({
                ...theme,
                dark: theme.dark ?? {
                    ink: '#fafaf7',
                    surfacePage: '#1f2421',
                    surfaceCard: '#2c2c26',
                    surfaceElevated: '#333330',
                    surfaceCardStrong: '#3a3a34',
                    accent: theme.light.accent,
                    accentAlt: theme.light.accentAlt,
                    accentTertiary: theme.light.accentTertiary,
                },
            });
        }
        else {
            onChange({
                version: theme.version,
                light: theme.light,
                fonts: theme.fonts,
            });
        }
    };
    return (_jsxs("div", { className: "cms-theme-settings grid max-w-3xl gap-4", children: [_jsxs("header", { className: "grid gap-1", children: [_jsx("h1", { className: "m-0 text-2xl font-semibold text-ink", children: "Site theme" }), _jsx("p", { className: "m-0 text-sm text-ink-muted", children: "Colors and fonts applied site-wide via CSS custom properties." }), statusMessage ? _jsx("p", { className: "m-0 text-sm text-ink-muted", children: statusMessage }) : null, error ? (_jsx("p", { className: "m-0 text-sm text-accent-red", role: "alert", children: error })) : null] }), _jsx(ColorSetEditor, { title: "Light mode", colors: theme.light, onChange: updateLight }), _jsxs("section", { className: "grid gap-3 rounded-xl border border-border-subtle bg-surface-elevated/40 p-4", children: [_jsx(AdminCheckbox, { label: "Enable dark mode tokens", checked: darkEnabled, onChange: (e) => toggleDark(e.target.checked) }), darkEnabled && theme.dark ? (_jsx(ColorSetEditor, { title: "Dark mode", colors: theme.dark, onChange: updateDark })) : null] }), _jsxs("section", { className: "grid gap-3 rounded-xl border border-border-subtle bg-surface-elevated/40 p-4", children: [_jsx("h2", { className: "m-0 text-sm font-semibold text-ink", children: "Fonts" }), _jsx(AdminTextInput, { label: "Body font stack", value: theme.fonts.body, onChange: (e) => onChange({ ...theme, fonts: { ...theme.fonts, body: e.target.value } }) }), _jsx(AdminTextInput, { label: "Heading font stack (optional)", value: theme.fonts.heading ?? '', onChange: (e) => {
                            const heading = e.target.value.trim();
                            onChange({
                                ...theme,
                                fonts: heading
                                    ? { ...theme.fonts, heading }
                                    : { body: theme.fonts.body },
                            });
                        } })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("button", { type: "button", className: "rounded-lg bg-accent-orange px-3 py-1.5 text-sm font-medium text-primary-light focus-ring disabled:opacity-60", onClick: () => void onSave(), disabled: saving, children: saving ? 'Saving…' : 'Save theme' }), _jsx("button", { type: "button", className: "rounded-lg border border-border-subtle bg-surface-card px-3 py-1.5 text-sm text-ink focus-ring", onClick: () => onChange(defaultSiteTheme), disabled: saving, children: "Reset to defaults" })] })] }));
}

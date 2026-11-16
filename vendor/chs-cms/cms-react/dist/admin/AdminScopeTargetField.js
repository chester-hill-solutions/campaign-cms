import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useState } from 'react';
import { useCmsText } from '../context';
/** Select a scope and, when that scope requires one, its target record. */
export function AdminScopeTargetField({ label, scopeLabel, scopes, scope, target, onScopeChange, onTargetChange, scopeName = 'scope', targetName = 'target', hint, searchable = false, searchLabel = 'Search targets', searchPlaceholder = 'Search available targets', }) {
    const text = useCmsText();
    const id = useId();
    const scopeId = `${id}-scope`;
    const targetId = `${id}-target`;
    const searchId = `${id}-search`;
    const [query, setQuery] = useState('');
    const selectedScope = scopes.find((option) => option.value === scope) ?? scopes[0];
    const targets = selectedScope?.targets ?? [];
    const targetIsValid = targets.some((option) => option.value === target);
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const visibleTargets = targets.filter((option) => `${option.label} ${option.value}`.toLocaleLowerCase().includes(normalizedQuery));
    return (_jsxs("section", { className: "grid gap-3", "aria-label": text(label), children: [hint ? _jsx("p", { className: "m-0 text-xs leading-relaxed text-ink-muted", children: text(hint) }) : null, _jsxs("label", { className: "admin-field", htmlFor: scopeId, children: [_jsx("span", { className: "admin-field__label", children: text(scopeLabel) }), _jsx("select", { id: scopeId, name: scopeName, value: selectedScope?.value ?? '', className: "admin-field__input focus-ring", onChange: (event) => {
                            onScopeChange(event.currentTarget.value);
                            onTargetChange('');
                            setQuery('');
                        }, children: scopes.map((option) => _jsx("option", { value: option.value, children: text(option.label) }, option.value)) })] }), targets.length ? (_jsxs(_Fragment, { children: [searchable ? (_jsxs("label", { className: "admin-field", htmlFor: searchId, children: [_jsx("span", { className: "admin-field__label", children: text(searchLabel) }), _jsx("input", { id: searchId, type: "search", value: query, placeholder: text(searchPlaceholder), className: "admin-field__input focus-ring", onChange: (event) => setQuery(event.currentTarget.value) })] })) : null, _jsxs("label", { className: "admin-field", htmlFor: targetId, children: [_jsx("span", { className: "admin-field__label", children: text(selectedScope?.targetLabel ?? label) }), _jsxs("select", { id: targetId, name: targetName, required: true, value: targetIsValid ? target : '', className: "admin-field__input focus-ring", onChange: (event) => onTargetChange(event.currentTarget.value), children: [_jsx("option", { value: "", children: text(selectedScope?.chooseTargetLabel ?? 'Choose a target') }), targetIsValid && !visibleTargets.some((option) => option.value === target) ? (_jsx("option", { value: target, children: targets.find((option) => option.value === target)?.label })) : null, visibleTargets.map((option) => _jsx("option", { value: option.value, children: option.label }, option.value))] })] })] })) : (_jsx("input", { type: "hidden", name: targetName, value: "" })), !targets.length && selectedScope?.emptyTargetsLabel ? (_jsx("p", { className: "m-0 text-xs text-ink-muted", children: text(selectedScope.emptyTargetsLabel) })) : null] }));
}

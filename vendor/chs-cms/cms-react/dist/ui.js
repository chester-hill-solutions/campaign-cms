import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
/** Labeled text input matching the host admin theme (`admin-field` tokens). */
export function AdminTextInput({ label, hint, id: idProp, className, ...props }) {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    return (_jsxs("div", { className: "admin-field", children: [_jsx("label", { htmlFor: inputId, className: "admin-field__label", children: label }), _jsx("input", { ...props, id: inputId, className: `admin-field__input focus-ring ${className ?? ''}` }), hint ? _jsx("span", { className: "admin-field__hint", children: hint }) : null] }));
}
export function AdminTextArea({ label, hint, id: idProp, className, rows = 3, ...props }) {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    return (_jsxs("div", { className: "admin-field", children: [_jsx("label", { htmlFor: inputId, className: "admin-field__label", children: label }), _jsx("textarea", { ...props, id: inputId, rows: rows, className: `admin-field__input focus-ring ${className ?? ''}` }), hint ? _jsx("span", { className: "admin-field__hint", children: hint }) : null] }));
}
export function AdminCheckbox({ label, ...props }) {
    return (_jsxs("label", { className: "admin-checkbox", children: [_jsx("input", { type: "checkbox", ...props }), _jsx("span", { children: label })] }));
}

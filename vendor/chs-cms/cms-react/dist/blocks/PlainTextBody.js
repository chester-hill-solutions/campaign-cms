import { jsx as _jsx } from "react/jsx-runtime";
/** Plain CMS copy from textarea fields — preserves single line breaks. */
export function PlainTextBody({ text, className }) {
    return (_jsx("p", { className: className ?? 'm-0 whitespace-pre-line leading-relaxed', children: text }));
}

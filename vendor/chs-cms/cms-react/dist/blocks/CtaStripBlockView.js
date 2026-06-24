import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BlockCtaRow } from './BlockCtaLink';
import { EditableText, useBlockEdit } from './editable';
import { PlainTextBody } from './PlainTextBody';
export function CtaStripBlockView({ block }) {
    const edit = useBlockEdit();
    const ctas = [block.primaryCta, block.secondaryCta].filter((cta) => Boolean(cta));
    return (_jsxs("section", { className: "rounded-2xl border border-border-subtle bg-surface-elevated p-6 @sm:p-8", children: [_jsx("h2", { className: "m-0 text-2xl font-semibold text-ink", children: _jsx(EditableText, { value: block.headline, placeholder: "Headline", update: (v) => ({ ...block, headline: v }) }) }), block.body || edit ? (edit ? (_jsx("p", { className: "mt-3 whitespace-pre-line text-base text-ink-muted", children: _jsx(EditableText, { value: block.body ?? '', multiline: true, placeholder: "Supporting text (optional)", update: (v) => ({ ...block, body: v || undefined }) }) })) : (_jsx(PlainTextBody, { text: block.body ?? '', className: "mt-3 text-base text-ink-muted" }))) : null, _jsx("div", { className: "mt-5", children: edit && ctas.length === 0 ? (_jsx("p", { className: "m-0 text-xs font-semibold text-ink-muted", children: "Add buttons in block settings" })) : (_jsx(BlockCtaRow, { ctas: ctas })) })] }));
}

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BlockCtaRow } from './BlockCtaLink';
import { EditableMarkdown, EditableText, useBlockEdit } from './editable';
import { PlainTextBody } from './PlainTextBody';
export function SectionHeaderBlockView({ block }) {
    const edit = useBlockEdit();
    const HeadingTag = block.level === 'h3' ? 'h3' : 'h2';
    const headingClass = block.level === 'h3'
        ? 'm-0 text-xl font-semibold text-ink @sm:text-2xl'
        : 'm-0 text-2xl font-semibold text-ink @sm:text-3xl';
    return (_jsxs("section", { id: block.anchorId, "aria-labelledby": `section-header-${block.id}`, children: [block.kicker || edit ? (_jsx("p", { className: "island-kicker m-0", children: _jsx(EditableText, { value: block.kicker ?? '', placeholder: "Kicker", update: (v) => ({ ...block, kicker: v || undefined }) }) })) : null, _jsx(HeadingTag, { id: `section-header-${block.id}`, className: headingClass, children: _jsx(EditableText, { value: block.heading, placeholder: "Section heading", update: (v) => ({ ...block, heading: v }) }) }), block.dek || edit ? (_jsx("p", { className: "m-0 mt-2 text-base leading-relaxed text-ink-muted @sm:text-lg", children: _jsx(EditableText, { value: block.dek ?? '', placeholder: "Dek (optional)", update: (v) => ({ ...block, dek: v || undefined }) }) })) : null, block.body || edit ? (edit ? (_jsx("p", { className: "m-0 mt-3 text-base leading-relaxed text-ink-muted", children: _jsx(EditableText, { value: block.body ?? '', multiline: true, placeholder: "Body (optional)", update: (v) => ({ ...block, body: v || undefined }) }) })) : (_jsx(PlainTextBody, { text: block.body ?? '', className: "m-0 mt-3 text-base leading-relaxed text-ink-muted" }))) : null] }));
}
export function TwoUpBlockView({ block }) {
    const edit = useBlockEdit();
    const imagePosition = block.imagePosition ?? 'right';
    const hasImage = Boolean(block.imageSrc);
    const ctas = [block.primaryCta, block.secondaryCta].filter((cta) => Boolean(cta));
    const textContent = (_jsxs("div", { className: "min-w-0", children: [block.kicker || edit ? (_jsx("p", { className: "island-kicker m-0", children: _jsx(EditableText, { value: block.kicker ?? '', placeholder: "Kicker", update: (v) => ({ ...block, kicker: v || undefined }) }) })) : null, block.heading || edit ? (_jsx("h2", { className: "m-0 mt-2 text-2xl font-semibold text-ink @sm:text-3xl", children: _jsx(EditableText, { value: block.heading ?? '', placeholder: "Heading", update: (v) => ({ ...block, heading: v || undefined }) }) })) : null, block.bodyMarkdown || edit ? (_jsx("div", { className: "prose prose-sm mt-4 max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed", children: _jsx(EditableMarkdown, { value: block.bodyMarkdown ?? '', update: (bodyMarkdown) => ({
                        ...block,
                        bodyMarkdown: bodyMarkdown || undefined,
                    }) }) })) : null, ctas.length > 0 ? (_jsx("div", { className: "mt-5", children: _jsx(BlockCtaRow, { ctas: ctas }) })) : null] }));
    const imageContent = hasImage ? (_jsxs("figure", { className: "m-0", children: [_jsx("img", { src: block.imageSrc, alt: block.imageAlt ?? '', className: "h-auto w-full rounded-xl", loading: "lazy" }), block.imageCaption || edit ? (_jsx("figcaption", { className: "mt-2 text-sm text-ink-muted", children: _jsx(EditableText, { value: block.imageCaption ?? '', placeholder: "Caption (optional)", update: (v) => ({ ...block, imageCaption: v || undefined }) }) })) : null] })) : edit ? (_jsx("div", { className: "grid min-h-40 place-items-center rounded-xl border border-dashed border-line-strong text-xs font-semibold text-ink-muted", children: "No image \u2014 add one in block settings" })) : null;
    return (_jsx("section", { className: "grid gap-8 @sm:grid-cols-2 @sm:items-start", children: imagePosition === 'left' ? (_jsxs(_Fragment, { children: [imageContent, textContent] })) : (_jsxs(_Fragment, { children: [textContent, imageContent] })) }));
}
export function SpacerBlockView({ block }) {
    const sizeClass = block.size === 'small' ? 'h-4' : block.size === 'large' ? 'h-16' : 'h-8';
    return _jsx("div", { className: sizeClass, "aria-hidden": "true" });
}
export function ColumnsBlockView({ block }) {
    const gridClass = block.columnCount === 3
        ? 'grid-cols-1 @md:grid-cols-3'
        : 'grid-cols-1 @md:grid-cols-2';
    return (_jsx("div", { className: `grid gap-6 ${gridClass}`, children: block.columns.map((col, index) => (_jsx("div", { className: "prose prose-sm max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed", children: _jsx(EditableMarkdown, { value: col.markdown, update: (markdown) => {
                    const columns = [...block.columns];
                    columns[index] = { markdown };
                    return { ...block, columns };
                } }) }, index))) }));
}
export function DividerBlockView(_props) {
    return _jsx("hr", { className: "border-0 border-t border-border-subtle" });
}

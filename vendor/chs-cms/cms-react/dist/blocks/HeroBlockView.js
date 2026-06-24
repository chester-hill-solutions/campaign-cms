import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCmsUi } from '../context';
import { BlockCtaRow } from './BlockCtaLink';
import { EditableText, useBlockEdit } from './editable';
import { PlainTextBody } from './PlainTextBody';
function heroLayoutClasses(block) {
    const imagePosition = block.imagePosition ?? 'right';
    const mobileImagePosition = block.mobileImagePosition ?? 'bottom';
    const grid = [
        'hero-block__grid',
        imagePosition === 'left' ? 'hero-block__grid--image-left' : 'hero-block__grid--image-right',
    ].join(' ');
    const mobileOrder = mobileImagePosition === 'top'
        ? { text: 'hero-block__text--mobile-after', figure: 'hero-block__figure--mobile-first' }
        : { text: 'hero-block__text--mobile-first', figure: 'hero-block__figure--mobile-after' };
    return {
        grid,
        text: ['hero-block__text relative z-10 min-w-0', mobileOrder.text].join(' '),
        figure: ['hero-block__figure relative z-10 m-0 min-w-0', mobileOrder.figure].join(' '),
    };
}
export function HeroBlockView({ block }) {
    const edit = useBlockEdit();
    const { heroFallbackPortrait } = useCmsUi();
    const portraitSrc = block.portraitSrc ?? heroFallbackPortrait?.src;
    const portraitAlt = block.portraitAlt ?? heroFallbackPortrait?.alt ?? '';
    const ctas = [block.primaryCta, block.secondaryCta, block.tertiaryCta].filter((cta) => Boolean(cta));
    const layout = heroLayoutClasses(block);
    const textContent = (_jsxs("div", { className: layout.text, children: [block.kicker || edit ? (_jsx("p", { className: "island-kicker m-0", children: _jsx(EditableText, { value: block.kicker ?? '', placeholder: "Kicker", update: (v) => ({ ...block, kicker: v || undefined }) }) })) : null, _jsx("h1", { id: `hero-heading-${block.id}`, className: "display-title m-0 mt-3 text-3xl text-ink @sm:text-4xl", children: _jsx(EditableText, { value: block.heading, placeholder: "Heading", update: (v) => ({ ...block, heading: v }) }) }), block.subhead || edit ? (_jsx("p", { className: "m-0 mt-3 text-base leading-relaxed text-ink-muted @sm:text-lg", children: _jsx(EditableText, { value: block.subhead ?? '', placeholder: "Subhead (optional)", update: (v) => ({ ...block, subhead: v || undefined }) }) })) : null, block.body || edit ? (_jsx("div", { className: "prose prose-sm mb-6 mt-4 max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed prose-p:whitespace-pre-line", children: edit ? (_jsx("p", { className: "m-0", children: _jsx(EditableText, { value: block.body ?? '', multiline: true, placeholder: "Body (optional)", update: (v) => ({ ...block, body: v || undefined }) }) })) : (_jsx(PlainTextBody, { text: block.body ?? '', className: "m-0" })) })) : null, _jsx(BlockCtaRow, { ctas: ctas })] }));
    const imageContent = (_jsx("figure", { className: layout.figure, children: _jsxs("div", { className: "hero-block__portrait", style: block.backgroundSrc
                ? {
                    backgroundImage: `url(${block.backgroundSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }
                : undefined, children: [block.backgroundSrc ? (_jsx("div", { className: "pointer-events-none absolute inset-0 rounded-2xl bg-[color-mix(in_oklab,var(--surface-page)_88%,transparent)]", "aria-hidden": "true" })) : (_jsxs("div", { className: "frank-hero-stack frank-hero-stack--portrait", "aria-hidden": "true", children: [_jsx("div", { className: "frank-hero-stack__solid frank-hero-stack__solid--peach" }), _jsx("div", { className: "frank-hero-stack__solid frank-hero-stack__solid--red" }), _jsx("div", { className: "frank-hero-stack__solid frank-hero-stack__solid--orange" })] })), _jsx("div", { className: "hero-block__portrait-frame relative z-10 overflow-hidden rounded-2xl border-2 border-[color-mix(in_oklab,var(--line-strong)_55%,var(--accent-green)_45%)] bg-secondary-dark shadow-[3px_3px_0_color-mix(in_oklab,var(--accent-green)_32%,var(--secondary-dark)_68%)]", children: portraitSrc ? (_jsx("img", { src: portraitSrc, alt: portraitAlt, width: heroFallbackPortrait?.width, height: heroFallbackPortrait?.height, srcSet: block.portraitSrc ? undefined : heroFallbackPortrait?.srcSet, sizes: heroFallbackPortrait?.sizes, className: "aspect-[4/5] h-auto w-full object-cover object-[center_12%]", decoding: "async", fetchPriority: "high" })) : null })] }) }));
    return (_jsx("section", { className: "rise-in", "aria-labelledby": `hero-heading-${block.id}`, children: _jsxs("div", { className: layout.grid, children: [textContent, imageContent] }) }));
}
export { heroLayoutClasses };

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AdminCheckbox, AdminTextArea, AdminTextInput } from '../ui';
import { CtaFields, MediaField, PanelSection, SegmentedControl } from './fields';
function NoSettings() {
    return (_jsx("p", { className: "m-0 text-xs text-ink-muted", children: "All content for this block is edited directly on the canvas." }));
}
/**
 * Non-text settings for the selected block. Text content is edited inline on
 * the canvas; this panel covers images, links, enums, and app-block fields.
 */
export function BlockTypeSettings({ block, onChange }) {
    switch (block.type) {
        case 'hero':
            return (_jsxs(_Fragment, { children: [_jsxs(PanelSection, { title: "Images", children: [_jsx(MediaField, { label: "Portrait", value: block.portraitSrc ?? '', onSelect: (path, alt) => onChange({
                                    ...block,
                                    portraitSrc: path || undefined,
                                    portraitAlt: alt ?? block.portraitAlt,
                                }), onClear: () => onChange({ ...block, portraitSrc: undefined, portraitAlt: undefined }) }), _jsx(AdminTextInput, { label: "Portrait alt text", value: block.portraitAlt ?? '', onChange: (e) => onChange({ ...block, portraitAlt: e.target.value || undefined }) }), _jsx(MediaField, { label: "Background image", value: block.backgroundSrc ?? '', onSelect: (path) => onChange({ ...block, backgroundSrc: path || undefined }), onClear: () => onChange({ ...block, backgroundSrc: undefined }) }), _jsx(SegmentedControl, { label: "Image position (desktop)", options: [
                                    { value: 'left', label: 'Left' },
                                    { value: 'right', label: 'Right' },
                                ], value: block.imagePosition ?? 'right', onChange: (imagePosition) => onChange({ ...block, imagePosition }) }), _jsx(SegmentedControl, { label: "Image position (mobile)", options: [
                                    { value: 'top', label: 'Top' },
                                    { value: 'bottom', label: 'Bottom' },
                                ], value: block.mobileImagePosition ?? 'bottom', onChange: (mobileImagePosition) => onChange({ ...block, mobileImagePosition }) })] }), _jsxs(PanelSection, { title: "Buttons", children: [_jsx(CtaFields, { label: "Primary", cta: block.primaryCta, onChange: (primaryCta) => onChange({ ...block, primaryCta }) }), _jsx(CtaFields, { label: "Secondary", cta: block.secondaryCta, onChange: (secondaryCta) => onChange({ ...block, secondaryCta }) }), _jsx(CtaFields, { label: "Tertiary", cta: block.tertiaryCta, onChange: (tertiaryCta) => onChange({ ...block, tertiaryCta }) })] })] }));
        case 'richText':
            return (_jsx(PanelSection, { title: "Advanced", children: _jsx(AdminTextInput, { label: "Anchor ID", hint: "Lets links jump to this section, e.g. #costs", value: block.anchorId ?? '', onChange: (e) => onChange({ ...block, anchorId: e.target.value || undefined }) }) }));
        case 'cardGrid':
            return (_jsxs(_Fragment, { children: [_jsx(PanelSection, { title: "Grid", children: _jsx(SegmentedControl, { label: "Columns", options: [
                                { value: 1, label: '1' },
                                { value: 2, label: '2' },
                                { value: 3, label: '3' },
                                { value: 4, label: '4' },
                            ], value: block.columns, onChange: (columns) => onChange({ ...block, columns }) }) }), _jsx(PanelSection, { title: "Card images", children: block.cards.map((card, index) => (_jsxs("details", { className: "rounded-lg border border-border-subtle bg-surface-elevated p-2", children: [_jsx("summary", { className: "cursor-pointer text-xs font-semibold text-ink", children: card.title || `Card ${index + 1}` }), _jsxs("div", { className: "mt-2 grid gap-2", children: [_jsx(MediaField, { label: "Icon", value: card.iconSrc ?? '', onSelect: (path) => {
                                                const cards = [...block.cards];
                                                cards[index] = { ...card, iconSrc: path || undefined };
                                                onChange({ ...block, cards });
                                            }, onClear: () => {
                                                const cards = [...block.cards];
                                                cards[index] = { ...card, iconSrc: undefined };
                                                onChange({ ...block, cards });
                                            } }), _jsx(MediaField, { label: "Image", value: card.imageSrc ?? '', onSelect: (path) => {
                                                const cards = [...block.cards];
                                                cards[index] = { ...card, imageSrc: path || undefined };
                                                onChange({ ...block, cards });
                                            }, onClear: () => {
                                                const cards = [...block.cards];
                                                cards[index] = { ...card, imageSrc: undefined };
                                                onChange({ ...block, cards });
                                            } })] })] }, card.id))) })] }));
        case 'table':
            return (_jsxs(PanelSection, { title: "Mobile behavior", children: [_jsx(AdminCheckbox, { label: "Collapse on mobile", checked: block.mobileCollapse ?? true, onChange: (e) => onChange({ ...block, mobileCollapse: e.target.checked }) }), _jsx(AdminTextInput, { label: "Mobile summary", hint: "Button label shown instead of the full table", value: block.mobileSummary ?? '', onChange: (e) => onChange({ ...block, mobileSummary: e.target.value || undefined }) })] }));
        case 'accordion':
            return (_jsx(PanelSection, { title: "Section images", children: block.sections.map((section, index) => (_jsxs("details", { className: "rounded-lg border border-border-subtle bg-surface-elevated p-2", children: [_jsx("summary", { className: "cursor-pointer text-xs font-semibold text-ink", children: section.title || `Section ${index + 1}` }), _jsx("div", { className: "mt-2", children: _jsx(MediaField, { label: "Image", value: section.imageSrc ?? '', onSelect: (path) => {
                                    const sections = [...block.sections];
                                    sections[index] = { ...section, imageSrc: path || undefined };
                                    onChange({ ...block, sections });
                                }, onClear: () => {
                                    const sections = [...block.sections];
                                    sections[index] = { ...section, imageSrc: undefined };
                                    onChange({ ...block, sections });
                                } }) })] }, section.id))) }));
        case 'ctaStrip':
            return (_jsxs(PanelSection, { title: "Buttons", children: [_jsx(CtaFields, { label: "Primary", cta: block.primaryCta, onChange: (primaryCta) => onChange({ ...block, primaryCta }) }), _jsx(CtaFields, { label: "Secondary", cta: block.secondaryCta, onChange: (secondaryCta) => onChange({ ...block, secondaryCta }) })] }));
        case 'quote':
        case 'timeline':
        case 'divider':
            return _jsx(NoSettings, {});
        case 'image':
            return (_jsxs(PanelSection, { title: "Image", children: [_jsx(MediaField, { label: "Image", value: block.src, onSelect: (path, alt) => onChange({ ...block, src: path, alt: alt ?? block.alt }), onClear: () => onChange({ ...block, src: '', alt: '' }) }), _jsx(AdminTextInput, { label: "Alt text", hint: "Describe the image for screen readers", value: block.alt, onChange: (e) => onChange({ ...block, alt: e.target.value }) })] }));
        case 'columns': {
            return (_jsx(PanelSection, { title: "Columns", children: _jsx(SegmentedControl, { label: "Column count", options: [
                        { value: 2, label: '2' },
                        { value: 3, label: '3' },
                    ], value: block.columnCount, onChange: (columnCount) => {
                        const columns = [...block.columns];
                        while (columns.length < columnCount) {
                            columns.push({ markdown: `Column ${columns.length + 1}` });
                        }
                        while (columns.length > columnCount) {
                            columns.pop();
                        }
                        onChange({ ...block, columnCount, columns });
                    } }) }));
        }
        case 'list':
            return (_jsx(PanelSection, { title: "List style", children: _jsx(SegmentedControl, { label: "Numbering", options: [
                        { value: 'bulleted', label: 'Bullets' },
                        { value: 'ordered', label: 'Numbered' },
                    ], value: block.ordered ? 'ordered' : 'bulleted', onChange: (v) => onChange({ ...block, ordered: v === 'ordered' }) }) }));
        case 'sectionHeader':
            return (_jsxs(PanelSection, { title: "Heading", children: [_jsx(SegmentedControl, { label: "Heading level", options: [
                            { value: 'h2', label: 'H2' },
                            { value: 'h3', label: 'H3' },
                        ], value: block.level ?? 'h2', onChange: (level) => onChange({ ...block, level }) }), _jsx(AdminTextInput, { label: "Anchor ID", hint: "Lets links jump to this section, e.g. #costs", value: block.anchorId ?? '', onChange: (e) => onChange({ ...block, anchorId: e.target.value || undefined }) })] }));
        case 'twoUp':
            return (_jsxs(_Fragment, { children: [_jsxs(PanelSection, { title: "Image", children: [_jsx(MediaField, { label: "Image", value: block.imageSrc ?? '', onSelect: (path, alt) => onChange({
                                    ...block,
                                    imageSrc: path || undefined,
                                    imageAlt: alt ?? block.imageAlt,
                                }), onClear: () => onChange({
                                    ...block,
                                    imageSrc: undefined,
                                    imageAlt: undefined,
                                    imageCaption: undefined,
                                }) }), _jsx(AdminTextInput, { label: "Alt text", value: block.imageAlt ?? '', onChange: (e) => onChange({ ...block, imageAlt: e.target.value || undefined }) }), _jsx(SegmentedControl, { label: "Image position", options: [
                                    { value: 'left', label: 'Left' },
                                    { value: 'right', label: 'Right' },
                                ], value: block.imagePosition ?? 'right', onChange: (imagePosition) => onChange({ ...block, imagePosition }) })] }), _jsxs(PanelSection, { title: "Buttons", children: [_jsx(CtaFields, { label: "Primary", cta: block.primaryCta, onChange: (primaryCta) => onChange({ ...block, primaryCta }) }), _jsx(CtaFields, { label: "Secondary", cta: block.secondaryCta, onChange: (secondaryCta) => onChange({ ...block, secondaryCta }) })] })] }));
        case 'statGrid':
            return (_jsx(PanelSection, { title: "Grid", children: _jsx(SegmentedControl, { label: "Columns", options: [
                        { value: 2, label: '2' },
                        { value: 3, label: '3' },
                        { value: 4, label: '4' },
                    ], value: block.columns, onChange: (columns) => onChange({ ...block, columns }) }) }));
        case 'callout':
            return (_jsx(PanelSection, { title: "Style", children: _jsx(SegmentedControl, { label: "Tone", options: [
                        { value: 'neutral', label: 'Neutral' },
                        { value: 'info', label: 'Info' },
                        { value: 'warning', label: 'Warning' },
                        { value: 'success', label: 'Success' },
                    ], value: block.tone ?? 'neutral', onChange: (tone) => onChange({ ...block, tone }) }) }));
        case 'embed':
            return (_jsxs(PanelSection, { title: "Embed", children: [_jsx(AdminTextInput, { label: "Embed URL", hint: "e.g. https://www.youtube.com/embed/\u2026", value: block.src, onChange: (e) => onChange({ ...block, src: e.target.value }) }), _jsx(AdminTextInput, { label: "Accessible title", value: block.title, onChange: (e) => onChange({ ...block, title: e.target.value }) }), _jsx(AdminTextInput, { label: "Provider", value: block.provider ?? '', onChange: (e) => onChange({ ...block, provider: e.target.value || undefined }) }), _jsx(SegmentedControl, { label: "Aspect ratio", options: [
                            { value: '16:9', label: '16:9' },
                            { value: '4:3', label: '4:3' },
                            { value: '1:1', label: '1:1' },
                            { value: 'auto', label: 'Auto' },
                        ], value: block.aspectRatio ?? '16:9', onChange: (aspectRatio) => onChange({ ...block, aspectRatio }) })] }));
        case 'customHtml':
            return (_jsxs(PanelSection, { title: "Custom HTML", children: [_jsx("p", { className: "m-0 rounded-lg border border-accent-orange bg-[color-mix(in_oklab,var(--accent-orange)_10%,transparent)] p-2 text-xs text-ink", children: "Advanced block for trusted editors. Scripts and inline event handlers are stripped on render." }), _jsx(AdminTextInput, { label: "Label", value: block.label ?? '', onChange: (e) => onChange({ ...block, label: e.target.value || undefined }) }), _jsx(AdminTextArea, { label: "HTML", value: block.html, rows: 12, className: "font-mono text-xs", onChange: (e) => onChange({ ...block, html: e.target.value }) }), _jsx(AdminTextArea, { label: "Notes (admin only)", value: block.notes ?? '', rows: 2, onChange: (e) => onChange({ ...block, notes: e.target.value || undefined }) })] }));
        case 'spacer':
            return (_jsx(PanelSection, { title: "Spacing", children: _jsx(SegmentedControl, { label: "Size", options: [
                        { value: 'small', label: 'Small' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'large', label: 'Large' },
                    ], value: block.size ?? 'medium', onChange: (size) => onChange({ ...block, size }) }) }));
        case 'contactForm':
            return (_jsxs(PanelSection, { title: "Contact form", children: [_jsx(AdminTextInput, { label: "Kicker", value: block.kicker ?? '', onChange: (e) => onChange({ ...block, kicker: e.target.value || undefined }) }), _jsx(AdminTextInput, { label: "Heading", value: block.heading, onChange: (e) => onChange({ ...block, heading: e.target.value }) }), _jsx(AdminTextArea, { label: "Subtext", value: block.subtext ?? '', rows: 2, onChange: (e) => onChange({ ...block, subtext: e.target.value || undefined }) })] }));
        case 'eventsList':
            return (_jsx(PanelSection, { title: "Events list", children: _jsx(AdminTextInput, { label: "Heading", value: block.heading ?? '', onChange: (e) => onChange({ ...block, heading: e.target.value || undefined }) }) }));
        case 'eventsTeaser':
            return (_jsxs(PanelSection, { title: "Events teaser", children: [_jsx(AdminTextInput, { label: "Heading", value: block.heading ?? '', onChange: (e) => onChange({ ...block, heading: e.target.value || undefined }) }), _jsx(AdminTextInput, { label: "Max events shown", type: "number", min: 1, max: 10, value: String(block.maxItems ?? 2), onChange: (e) => onChange({
                            ...block,
                            maxItems: Math.max(1, Math.min(10, Number(e.target.value) || 2)),
                        }) }), _jsx(AdminCheckbox, { label: "Show \u201CView all events\u201D link", checked: block.showViewAllLink !== false, onChange: (e) => onChange({ ...block, showViewAllLink: e.target.checked }) })] }));
        case 'bioLinks':
            return (_jsx("p", { className: "m-0 text-xs text-ink-muted", children: "Shows the links managed under Admin \u2192 Bio links." }));
        case 'donateEmbed':
            return (_jsx(PanelSection, { title: "Donate embed", children: _jsx(AdminTextInput, { label: "Heading", value: block.heading ?? '', onChange: (e) => onChange({ ...block, heading: e.target.value || undefined }) }) }));
        default: {
            const _exhaustive = block;
            return _exhaustive;
        }
    }
}

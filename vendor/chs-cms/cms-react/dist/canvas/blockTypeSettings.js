import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AdminCheckbox, AdminSelect, AdminTextArea, AdminTextInput } from '../ui';
import { CtaFields, MediaField, PanelSection, SegmentedControl } from './fields';
const FALLBACK_CONTAINER = {
    gap: 'normal',
    arrangement: 'grid',
    alignItems: 'stretch',
};
function NoSettings() {
    return (_jsx("p", { className: "m-0 text-xs text-ink-muted", children: "All content for this block is edited directly on the canvas." }));
}
function ContainerLayoutFields({ container, onChange, showArrangement = false, }) {
    const gap = container?.gap ?? FALLBACK_CONTAINER.gap;
    const alignItems = container?.alignItems ?? FALLBACK_CONTAINER.alignItems;
    const arrangement = showArrangement && container && 'arrangement' in container && container.arrangement
        ? container.arrangement
        : FALLBACK_CONTAINER.arrangement;
    return (_jsxs(PanelSection, { title: "Container", children: [_jsx(SegmentedControl, { label: "Gap", hint: "Space between items in this block. Tight packs them; loose gives each item more breathing room.", options: [
                    { value: 'tight', label: 'Tight' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'loose', label: 'Loose' },
                ], value: gap, onChange: (nextGap) => {
                    if (showArrangement) {
                        onChange({
                            gap: nextGap,
                            arrangement,
                            alignItems,
                        });
                    }
                    else {
                        onChange({ gap: nextGap, alignItems });
                    }
                } }), showArrangement ? (_jsx(SegmentedControl, { label: "Arrangement", hint: "Grid places items in columns. List stacks every item in a single column.", options: [
                    { value: 'grid', label: 'Grid' },
                    { value: 'list', label: 'List' },
                ], value: arrangement, onChange: (nextArrangement) => onChange({
                    gap,
                    arrangement: nextArrangement,
                    alignItems,
                }) })) : null, _jsx(SegmentedControl, { label: "Align items", hint: "How each item aligns inside its cell: start at the top, center vertically, or stretch to fill height.", options: [
                    { value: 'start', label: 'Start' },
                    { value: 'center', label: 'Center' },
                    { value: 'stretch', label: 'Stretch' },
                ], value: alignItems, onChange: (nextAlign) => {
                    if (showArrangement) {
                        onChange({
                            gap,
                            arrangement,
                            alignItems: nextAlign,
                        });
                    }
                    else {
                        onChange({ gap, alignItems: nextAlign });
                    }
                } })] }));
}
/**
 * Non-text settings for the selected block. Text content is edited inline on
 * the canvas; this panel covers images, links, enums, and app-block fields.
 */
export function BlockTypeSettings({ block, onChange, forms }) {
    switch (block.type) {
        case 'hero':
            return (_jsxs(_Fragment, { children: [_jsx(PanelSection, { title: "Heading", children: _jsx(AdminTextInput, { label: "Emphasized phrase", hint: "Optional closing phrase in the heading accent colour.", value: block.headingAccent ?? '', onChange: (e) => onChange({ ...block, headingAccent: e.target.value || undefined }) }) }), _jsxs(PanelSection, { title: "Images", children: [_jsx(MediaField, { label: "Portrait", value: block.portraitSrc ?? '', onSelect: (path, alt) => onChange({
                                    ...block,
                                    portraitSrc: path || undefined,
                                    portraitAlt: alt ?? block.portraitAlt,
                                }), onClear: () => onChange({ ...block, portraitSrc: undefined, portraitAlt: undefined }) }), _jsx(AdminTextInput, { label: "Portrait alt text", hint: "Short description of the portrait for screen readers, e.g. \u201CJane Doe smiling outdoors\u201D.", value: block.portraitAlt ?? '', onChange: (e) => onChange({ ...block, portraitAlt: e.target.value || undefined }) }), _jsx(MediaField, { label: "Background image", value: block.backgroundSrc ?? '', onSelect: (path) => onChange({ ...block, backgroundSrc: path || undefined }), onClear: () => onChange({ ...block, backgroundSrc: undefined }) }), _jsx(SegmentedControl, { label: "Image position (desktop)", hint: "Which side the portrait sits on for wide screens.", options: [
                                    { value: 'left', label: 'Left' },
                                    { value: 'right', label: 'Right' },
                                ], value: block.imagePosition ?? 'right', onChange: (imagePosition) => onChange({ ...block, imagePosition }) }), _jsx(SegmentedControl, { label: "Image position (mobile)", hint: "Whether the portrait appears above or below the headline on small screens.", options: [
                                    { value: 'top', label: 'Top' },
                                    { value: 'bottom', label: 'Bottom' },
                                ], value: block.mobileImagePosition ?? 'bottom', onChange: (mobileImagePosition) => onChange({ ...block, mobileImagePosition }) })] }), _jsxs(PanelSection, { title: "Buttons", children: [_jsx("div", { "data-settings-part": "primaryCta", children: _jsx(CtaFields, { label: "Primary", cta: block.primaryCta, onChange: (primaryCta) => onChange({ ...block, primaryCta }) }) }), _jsx("div", { "data-settings-part": "secondaryCta", children: _jsx(CtaFields, { label: "Secondary", cta: block.secondaryCta, onChange: (secondaryCta) => onChange({ ...block, secondaryCta }) }) }), _jsx("div", { "data-settings-part": "tertiaryCta", children: _jsx(CtaFields, { label: "Tertiary", cta: block.tertiaryCta, onChange: (tertiaryCta) => onChange({ ...block, tertiaryCta }) }) })] })] }));
        case 'richText':
            return (_jsx(PanelSection, { title: "Advanced", children: _jsx(AdminTextInput, { label: "Anchor ID", hint: "Optional fragment id so in-page links can jump here, e.g. set \u201Ccosts\u201D then link to #costs.", value: block.anchorId ?? '', onChange: (e) => onChange({ ...block, anchorId: e.target.value || undefined }) }) }));
        case 'cardGrid': {
            const arrangement = block.container?.arrangement ?? FALLBACK_CONTAINER.arrangement;
            return (_jsxs(_Fragment, { children: [_jsx(ContainerLayoutFields, { showArrangement: true, container: block.container, onChange: (container) => onChange({ ...block, container: container }) }), arrangement === 'grid' ? (_jsx(PanelSection, { title: "Grid", children: _jsx(SegmentedControl, { label: "Columns", hint: "How many cards sit side by side on desktop. Cards wrap on smaller screens.", options: [
                                { value: 1, label: '1' },
                                { value: 2, label: '2' },
                                { value: 3, label: '3' },
                                { value: 4, label: '4' },
                            ], value: block.columns, onChange: (columns) => onChange({ ...block, columns }) }) })) : null, _jsx(PanelSection, { title: "Card images", children: block.cards.map((card, index) => (_jsxs("details", { "data-settings-item": index, className: "rounded-lg border border-border-subtle bg-surface-elevated p-2", children: [_jsx("summary", { className: "cursor-pointer text-xs font-semibold text-ink", children: card.title || `Card ${index + 1}` }), _jsxs("div", { className: "mt-2 grid gap-2", children: [_jsx(MediaField, { label: "Icon", value: card.iconSrc ?? '', onSelect: (path) => {
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
        }
        case 'table':
            return (_jsxs(PanelSection, { title: "Mobile behavior", children: [_jsx(AdminCheckbox, { label: "Collapse on mobile", checked: block.mobileCollapse ?? true, onChange: (e) => onChange({ ...block, mobileCollapse: e.target.checked }) }), _jsx(AdminTextInput, { label: "Mobile summary", hint: "On small screens, visitors tap this button label to expand the full table (e.g. \u201CView comparison\u201D).", value: block.mobileSummary ?? '', onChange: (e) => onChange({ ...block, mobileSummary: e.target.value || undefined }) })] }));
        case 'accordion':
            return (_jsx(PanelSection, { title: "Section images", children: block.sections.map((section, index) => (_jsxs("details", { "data-settings-item": index, className: "rounded-lg border border-border-subtle bg-surface-elevated p-2", children: [_jsx("summary", { className: "cursor-pointer text-xs font-semibold text-ink", children: section.title || `Section ${index + 1}` }), _jsx("div", { className: "mt-2", children: _jsx(MediaField, { label: "Image", value: section.imageSrc ?? '', onSelect: (path) => {
                                    const sections = [...block.sections];
                                    sections[index] = { ...section, imageSrc: path || undefined };
                                    onChange({ ...block, sections });
                                }, onClear: () => {
                                    const sections = [...block.sections];
                                    sections[index] = { ...section, imageSrc: undefined };
                                    onChange({ ...block, sections });
                                } }) })] }, section.id))) }));
        case 'ctaStrip':
            return (_jsxs(PanelSection, { title: "Buttons", children: [_jsx("div", { "data-settings-part": "primaryCta", children: _jsx(CtaFields, { label: "Primary", cta: block.primaryCta, onChange: (primaryCta) => onChange({ ...block, primaryCta }) }) }), _jsx("div", { "data-settings-part": "secondaryCta", children: _jsx(CtaFields, { label: "Secondary", cta: block.secondaryCta, onChange: (secondaryCta) => onChange({ ...block, secondaryCta }) }) })] }));
        case 'quote':
        case 'timeline':
        case 'divider':
            return _jsx(NoSettings, {});
        case 'image':
            return (_jsxs(PanelSection, { title: "Image", children: [_jsx(MediaField, { label: "Image", value: block.src, onSelect: (path, alt) => onChange({ ...block, src: path, alt: alt ?? block.alt }), onClear: () => onChange({ ...block, src: '', alt: '' }) }), _jsx(AdminTextInput, { label: "Alt text", hint: "Describe what the image shows for screen readers and when the image fails to load.", value: block.alt, onChange: (e) => onChange({ ...block, alt: e.target.value }) })] }));
        case 'columns': {
            return (_jsxs(_Fragment, { children: [_jsx(ContainerLayoutFields, { container: block.container, onChange: (container) => onChange({ ...block, container: container }) }), _jsx(PanelSection, { title: "Columns", children: _jsx(SegmentedControl, { label: "Column count", hint: "Number of side-by-side text columns on desktop. Content for each column is edited on the canvas.", options: [
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
                            } }) })] }));
        }
        case 'list':
            return (_jsxs(_Fragment, { children: [_jsx(ContainerLayoutFields, { container: block.container, onChange: (container) => onChange({ ...block, container: container }) }), _jsx(PanelSection, { title: "List style", children: _jsx(SegmentedControl, { label: "Numbering", hint: "Bullets for unordered points; numbered for sequenced steps.", options: [
                                { value: 'bulleted', label: 'Bullets' },
                                { value: 'ordered', label: 'Numbered' },
                            ], value: block.ordered ? 'ordered' : 'bulleted', onChange: (v) => onChange({ ...block, ordered: v === 'ordered' }) }) })] }));
        case 'sectionHeader':
            return (_jsxs(PanelSection, { title: "Heading", children: [_jsx(SegmentedControl, { label: "Heading level", hint: "H2 for major page sections; H3 for subsections under an H2.", options: [
                            { value: 'h2', label: 'H2' },
                            { value: 'h3', label: 'H3' },
                        ], value: block.level ?? 'h2', onChange: (level) => onChange({ ...block, level }) }), _jsx(AdminTextInput, { label: "Anchor ID", hint: "Optional fragment id so in-page links can jump here, e.g. set \u201Ccosts\u201D then link to #costs.", value: block.anchorId ?? '', onChange: (e) => onChange({ ...block, anchorId: e.target.value || undefined }) })] }));
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
                                }) }), _jsx(AdminTextInput, { label: "Alt text", hint: "Describe what the image shows for screen readers and when the image fails to load.", value: block.imageAlt ?? '', onChange: (e) => onChange({ ...block, imageAlt: e.target.value || undefined }) }), _jsx(SegmentedControl, { label: "Image position", hint: "Whether the image sits to the left or right of the text on desktop.", options: [
                                    { value: 'left', label: 'Left' },
                                    { value: 'right', label: 'Right' },
                                ], value: block.imagePosition ?? 'right', onChange: (imagePosition) => onChange({ ...block, imagePosition }) })] }), _jsxs(PanelSection, { title: "Buttons", children: [_jsx("div", { "data-settings-part": "primaryCta", children: _jsx(CtaFields, { label: "Primary", cta: block.primaryCta, onChange: (primaryCta) => onChange({ ...block, primaryCta }) }) }), _jsx("div", { "data-settings-part": "secondaryCta", children: _jsx(CtaFields, { label: "Secondary", cta: block.secondaryCta, onChange: (secondaryCta) => onChange({ ...block, secondaryCta }) }) })] })] }));
        case 'statGrid': {
            const arrangement = block.container?.arrangement ?? FALLBACK_CONTAINER.arrangement;
            return (_jsxs(_Fragment, { children: [_jsx(ContainerLayoutFields, { showArrangement: true, container: block.container, onChange: (container) => onChange({ ...block, container: container }) }), arrangement === 'grid' ? (_jsx(PanelSection, { title: "Grid", children: _jsx(SegmentedControl, { label: "Columns", hint: "How many stats sit side by side on desktop.", options: [
                                { value: 2, label: '2' },
                                { value: 3, label: '3' },
                                { value: 4, label: '4' },
                            ], value: block.columns, onChange: (columns) => onChange({ ...block, columns }) }) })) : null] }));
        }
        case 'callout':
            return (_jsx(PanelSection, { title: "Style", children: _jsx(SegmentedControl, { label: "Tone", hint: "Visual treatment for the note: info for guidance, warning for caution, success for confirmation.", options: [
                        { value: 'neutral', label: 'Neutral' },
                        { value: 'info', label: 'Info' },
                        { value: 'warning', label: 'Warning' },
                        { value: 'success', label: 'Success' },
                    ], value: block.tone ?? 'neutral', onChange: (tone) => onChange({ ...block, tone }) }) }));
        case 'collectionGrid': {
            const arrangement = block.container?.arrangement ?? FALLBACK_CONTAINER.arrangement;
            return (_jsxs(_Fragment, { children: [_jsx(ContainerLayoutFields, { showArrangement: true, container: block.container, onChange: (container) => onChange({ ...block, container: container }) }), _jsxs(PanelSection, { title: "Collection", children: [_jsx(AdminTextInput, { label: "Collection ID", hint: "Machine id of the collection whose published entries appear here (from Admin \u2192 Collections).", value: block.collectionId, onChange: (e) => onChange({ ...block, collectionId: e.target.value }) }), _jsx(AdminTextInput, { label: "Heading", hint: "Optional title shown above the grid of entries.", value: block.heading ?? '', onChange: (e) => onChange({ ...block, heading: e.target.value || undefined }) }), _jsx(AdminTextArea, { label: "Subheading", hint: "Optional supporting line under the heading.", value: block.subheading ?? '', rows: 2, onChange: (e) => onChange({ ...block, subheading: e.target.value || undefined }) }), arrangement === 'grid' ? (_jsx(SegmentedControl, { label: "Columns", hint: "How many entry cards sit side by side on desktop.", options: [
                                    { value: 1, label: '1' },
                                    { value: 2, label: '2' },
                                    { value: 3, label: '3' },
                                    { value: 4, label: '4' },
                                ], value: block.columns, onChange: (columns) => onChange({ ...block, columns }) })) : null, _jsx(SegmentedControl, { label: "Card style", options: [
                                    { value: 'summary', label: 'Summary' },
                                    { value: 'overlay', label: 'Overlay' },
                                ], value: block.cardStyle, onChange: (cardStyle) => onChange({ ...block, cardStyle }) })] }), _jsxs(PanelSection, { title: "Filtering", children: [_jsx(AdminTextInput, { label: "Category ID", hint: "Optional category machine id. Leave blank to include every category in the collection.", value: block.categoryId ?? '', onChange: (e) => onChange({ ...block, categoryId: e.target.value || undefined }) }), _jsx(AdminCheckbox, { label: "Show featured only", checked: block.showFeaturedOnly, onChange: (e) => onChange({ ...block, showFeaturedOnly: e.target.checked }) }), _jsx(AdminTextInput, { label: "Max items", hint: "Cap how many entries render (1\u201350). Leave blank to use the collection default.", type: "number", min: 1, max: 50, value: block.maxItems !== undefined ? String(block.maxItems) : '', onChange: (e) => {
                                    const v = e.target.value;
                                    onChange({
                                        ...block,
                                        maxItems: v ? Math.max(1, Math.min(50, Number(v))) : undefined,
                                    });
                                } })] })] }));
        }
        case 'embed':
            return (_jsxs(PanelSection, { title: "Embed", children: [_jsx(AdminTextInput, { label: "Embed URL", hint: "Paste an embeddable URL such as a YouTube embed link (https://www.youtube.com/embed/\u2026).", value: block.src, onChange: (e) => onChange({ ...block, src: e.target.value }) }), _jsx(AdminTextInput, { label: "Accessible title", hint: "Short title announced by screen readers for the iframe, e.g. \u201CCampaign launch video\u201D.", value: block.title, onChange: (e) => onChange({ ...block, title: e.target.value }) }), _jsx(AdminTextInput, { label: "Provider", hint: "Optional label for the source (YouTube, Vimeo, etc.) shown in admin tooling.", value: block.provider ?? '', onChange: (e) => onChange({ ...block, provider: e.target.value || undefined }) }), _jsx(SegmentedControl, { label: "Aspect ratio", hint: "Frame shape for the embed. Use 16:9 for most videos; Auto sizes to the content.", options: [
                            { value: '16:9', label: '16:9' },
                            { value: '4:3', label: '4:3' },
                            { value: '1:1', label: '1:1' },
                            { value: 'auto', label: 'Auto' },
                        ], value: block.aspectRatio ?? '16:9', onChange: (aspectRatio) => onChange({ ...block, aspectRatio }) })] }));
        case 'customHtml':
            return (_jsxs(PanelSection, { title: "Custom HTML", children: [_jsx("p", { className: "m-0 rounded-lg border border-accent-orange bg-[color-mix(in_oklab,var(--accent-orange)_10%,transparent)] p-2 text-xs text-ink", children: "Advanced block for trusted editors. Scripts and inline event handlers are stripped on render." }), _jsx(AdminTextInput, { label: "Label", hint: "Admin-only name shown in the block outline so you can recognize this embed.", value: block.label ?? '', onChange: (e) => onChange({ ...block, label: e.target.value || undefined }) }), _jsx(AdminTextArea, { label: "HTML", hint: "Markup inserted into the page. Keep it simple and avoid scripts; they are stripped.", value: block.html, rows: 12, className: "font-mono text-xs", onChange: (e) => onChange({ ...block, html: e.target.value }) }), _jsx(AdminTextArea, { label: "Notes (admin only)", hint: "Internal reminder about where this HTML came from or how to update it. Visitors never see this.", value: block.notes ?? '', rows: 2, onChange: (e) => onChange({ ...block, notes: e.target.value || undefined }) })] }));
        case 'spacer':
            return (_jsx(PanelSection, { title: "Spacing", children: _jsx(SegmentedControl, { label: "Size", hint: "Empty vertical space between neighboring blocks.", options: [
                        { value: 'small', label: 'Small' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'large', label: 'Large' },
                    ], value: block.size ?? 'medium', onChange: (size) => onChange({ ...block, size }) }) }));
        case 'contactForm':
            return (_jsxs(PanelSection, { title: "Contact form", children: [_jsx(AdminTextInput, { label: "Kicker", value: block.kicker ?? '', onChange: (e) => onChange({ ...block, kicker: e.target.value || undefined }) }), _jsx(AdminTextInput, { label: "Heading", value: block.heading, onChange: (e) => onChange({ ...block, heading: e.target.value }) }), _jsx(AdminTextArea, { label: "Subtext", value: block.subtext ?? '', rows: 2, onChange: (e) => onChange({ ...block, subtext: e.target.value || undefined }) }), forms && forms.length > 0 ? (_jsxs(AdminSelect, { label: "Form", hint: "Saved form-builder definition", value: block.formId ?? '', onChange: (e) => onChange({ ...block, formId: e.target.value || undefined }), children: [_jsx("option", { value: "", children: "Default contact form" }), forms.map((form) => (_jsx("option", { value: form.id, children: form.title }, form.id)))] })) : (_jsx(AdminTextInput, { label: "Form ID (optional)", hint: "Reference a form builder form definition", value: block.formId ?? '', onChange: (e) => onChange({ ...block, formId: e.target.value || undefined }) }))] }));
        case 'eventsList':
            return (_jsx(PanelSection, { title: "Events list", children: _jsx(AdminTextInput, { label: "Heading", hint: "Optional title above the full list of upcoming and past events.", value: block.heading ?? '', onChange: (e) => onChange({ ...block, heading: e.target.value || undefined }) }) }));
        case 'eventsTeaser':
            return (_jsxs(PanelSection, { title: "Events teaser", children: [_jsx(AdminTextInput, { label: "Heading", hint: "Optional title above the short list of upcoming events.", value: block.heading ?? '', onChange: (e) => onChange({ ...block, heading: e.target.value || undefined }) }), _jsx(AdminTextInput, { label: "Max events shown", hint: "How many upcoming events to preview (1\u201310).", type: "number", min: 1, max: 10, value: String(block.maxItems ?? 2), onChange: (e) => onChange({
                            ...block,
                            maxItems: Math.max(1, Math.min(10, Number(e.target.value) || 2)),
                        }) }), _jsx(AdminCheckbox, { label: "Show \u201CView all events\u201D link", checked: block.showViewAllLink !== false, onChange: (e) => onChange({ ...block, showViewAllLink: e.target.checked }) })] }));
        case 'bioLinks':
            return (_jsx("p", { className: "m-0 text-xs text-ink-muted", children: "Renders the social and profile links managed under Admin \u2192 Bio links. Edit those links there; this block only places them on the page." }));
        case 'donateEmbed':
            return (_jsx(PanelSection, { title: "Donate embed", children: _jsx(AdminTextInput, { label: "Heading", hint: "Optional title shown above the donation form embed.", value: block.heading ?? '', onChange: (e) => onChange({ ...block, heading: e.target.value || undefined }) }) }));
        default: {
            const _exhaustive = block;
            return _exhaustive;
        }
    }
}

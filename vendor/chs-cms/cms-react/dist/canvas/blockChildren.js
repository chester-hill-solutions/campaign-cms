function truncateLabel(value, max = 40) {
    const trimmed = value.trim().replace(/\s+/g, ' ');
    if (!trimmed)
        return '';
    return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}
function fallbackLabel(index) {
    return `Item ${index + 1}`;
}
/**
 * Derive outline children for composite blocks. Non-composite types return [].
 * Labels prefer the item's primary text field and fall back to "Item N".
 */
export function getBlockChildren(block) {
    switch (block.type) {
        case 'cardGrid':
            return block.cards.map((card, index) => ({
                index,
                label: truncateLabel(card.title) || fallbackLabel(index),
                styleKey: card.id,
            }));
        case 'accordion':
            return block.sections.map((section, index) => ({
                index,
                label: truncateLabel(section.title) || fallbackLabel(index),
                styleKey: section.id,
            }));
        case 'columns':
            return block.columns.map((_column, index) => ({
                index,
                label: `Column ${index + 1}`,
                styleKey: `column-${index}`,
            }));
        case 'list':
            return block.items.map((item, index) => ({
                index,
                label: truncateLabel(item) || fallbackLabel(index),
                styleKey: `item-${index}`,
            }));
        case 'statGrid':
            return block.stats.map((stat, index) => ({
                index,
                label: truncateLabel(stat.label) || truncateLabel(stat.value) || fallbackLabel(index),
                styleKey: stat.id,
            }));
        case 'timeline':
            return block.items.map((item, index) => ({
                index,
                label: truncateLabel(item.title) || fallbackLabel(index),
                styleKey: item.id,
            }));
        case 'table':
            return block.rows.map((row, index) => {
                const summary = truncateLabel(row.filter(Boolean).join(' · '));
                return {
                    index,
                    label: summary || `Row ${index + 1}`,
                    styleKey: `row-${index}`,
                };
            });
        case 'hero':
        case 'richText':
        case 'ctaStrip':
        case 'quote':
        case 'image':
        case 'divider':
        case 'sectionHeader':
        case 'twoUp':
        case 'callout':
        case 'embed':
        case 'customHtml':
        case 'spacer':
        case 'contactForm':
        case 'eventsList':
        case 'eventsTeaser':
        case 'bioLinks':
        case 'donateEmbed':
        case 'collectionGrid':
            return [];
        default: {
            const _exhaustive = block;
            return _exhaustive;
        }
    }
}
/**
 * Named selectable parts for blocks composed of fixed fields rather than
 * item arrays. Optional parts appear only once they have content.
 */
export function getBlockParts(block) {
    switch (block.type) {
        case 'hero': {
            const parts = [];
            if (block.kicker)
                parts.push({ key: 'kicker', label: 'Kicker', kind: 'text' });
            parts.push({ key: 'heading', label: 'Heading', kind: 'text' });
            if (block.subhead)
                parts.push({ key: 'subhead', label: 'Subhead', kind: 'text' });
            if (block.body)
                parts.push({ key: 'body', label: 'Body', kind: 'text' });
            if (block.primaryCta) {
                parts.push({ key: 'primaryCta', label: 'Primary button', kind: 'cta' });
            }
            if (block.secondaryCta) {
                parts.push({ key: 'secondaryCta', label: 'Secondary button', kind: 'cta' });
            }
            if (block.tertiaryCta) {
                parts.push({ key: 'tertiaryCta', label: 'Tertiary button', kind: 'cta' });
            }
            return parts;
        }
        case 'ctaStrip': {
            const parts = [{ key: 'headline', label: 'Headline', kind: 'text' }];
            if (block.body)
                parts.push({ key: 'body', label: 'Body', kind: 'text' });
            if (block.primaryCta) {
                parts.push({ key: 'primaryCta', label: 'Primary button', kind: 'cta' });
            }
            if (block.secondaryCta) {
                parts.push({ key: 'secondaryCta', label: 'Secondary button', kind: 'cta' });
            }
            return parts;
        }
        case 'collectionGrid': {
            const parts = [];
            if (block.heading)
                parts.push({ key: 'heading', label: 'Heading', kind: 'text' });
            if (block.subheading) {
                parts.push({ key: 'subheading', label: 'Subheading', kind: 'text' });
            }
            parts.push({ key: 'cards', label: 'Cards', kind: 'text' });
            return parts;
        }
        case 'cardGrid': {
            const parts = [];
            if (block.heading)
                parts.push({ key: 'heading', label: 'Heading', kind: 'text' });
            if (block.subheading) {
                parts.push({ key: 'subheading', label: 'Subheading', kind: 'text' });
            }
            return parts;
        }
        case 'richText':
        case 'table':
        case 'accordion':
        case 'quote':
        case 'image':
        case 'columns':
        case 'list':
        case 'divider':
        case 'sectionHeader':
        case 'twoUp':
        case 'statGrid':
        case 'timeline':
        case 'callout':
        case 'embed':
        case 'customHtml':
        case 'spacer':
        case 'contactForm':
        case 'eventsList':
        case 'eventsTeaser':
        case 'bioLinks':
        case 'donateEmbed':
            return [];
        default: {
            const _exhaustive = block;
            return _exhaustive;
        }
    }
}

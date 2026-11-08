function truncate(label, max = 40) {
    const trimmed = label.trim();
    if (!trimmed)
        return '';
    if (trimmed.length <= max)
        return trimmed;
    return `${trimmed.slice(0, max - 1)}…`;
}
/** Pure helper: items nested under a block for the structure navigator. */
export function getBlockTreeChildren(block) {
    switch (block.type) {
        case 'cardGrid':
            return block.cards.map((card, itemIndex) => ({
                key: card.id,
                label: truncate(card.title) || `Card ${itemIndex + 1}`,
                itemKind: 'card',
                itemId: card.id,
                itemIndex,
            }));
        case 'accordion':
            return block.sections.map((section, itemIndex) => ({
                key: section.id,
                label: truncate(section.title) || `Section ${itemIndex + 1}`,
                itemKind: 'accordionSection',
                itemId: section.id,
                itemIndex,
            }));
        case 'statGrid':
            return block.stats.map((stat, itemIndex) => {
                const combined = [stat.value, stat.label].filter(Boolean).join(' — ');
                return {
                    key: stat.id,
                    label: truncate(combined) || `Stat ${itemIndex + 1}`,
                    itemKind: 'stat',
                    itemId: stat.id,
                    itemIndex,
                };
            });
        case 'timeline':
            return block.items.map((item, itemIndex) => ({
                key: item.id,
                label: truncate(item.title) || `Item ${itemIndex + 1}`,
                itemKind: 'timelineItem',
                itemId: item.id,
                itemIndex,
            }));
        case 'columns':
            return block.columns.map((_, itemIndex) => ({
                key: `${block.id}-col-${itemIndex}`,
                label: `Column ${itemIndex + 1}`,
                itemKind: 'column',
                itemIndex,
            }));
        case 'list':
            return block.items.map((text, itemIndex) => ({
                key: `${block.id}-li-${itemIndex}`,
                label: truncate(text) || `Item ${itemIndex + 1}`,
                itemKind: 'listItem',
                itemIndex,
            }));
        default:
            return [];
    }
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getBlockTreeChildren } from '@chester-hill-solutions/cms-core';
import { AdminTextArea, AdminTextInput } from '../ui';
import { MediaField, PanelSection } from './fields';
import { isItemSelection } from './selection';
export function itemSettingsLabel(block, selection) {
    if (!isItemSelection(selection))
        return '';
    const child = getBlockTreeChildren(block).find((c) => {
        if (c.itemKind !== selection.itemKind)
            return false;
        if (selection.itemId)
            return c.itemId === selection.itemId;
        return c.itemIndex === selection.itemIndex;
    });
    return child?.label ?? 'Item';
}
/** Settings form for a selected nested item under a multi-item block. */
export function BlockItemSettings({ block, selection, onChange }) {
    if (!isItemSelection(selection) || selection.blockId !== block.id) {
        return (_jsx("p", { className: "m-0 text-xs text-ink-muted", children: "Select an item in the structure tree." }));
    }
    const index = selection.itemIndex;
    switch (selection.itemKind) {
        case 'card': {
            if (block.type !== 'cardGrid')
                return null;
            const card = block.cards[index];
            if (!card)
                return null;
            return (_jsxs(PanelSection, { title: "Card", children: [_jsx(AdminTextInput, { label: "Title", value: card.title, onChange: (e) => {
                            const cards = [...block.cards];
                            cards[index] = { ...card, title: e.target.value };
                            onChange({ ...block, cards });
                        } }), _jsx(AdminTextArea, { label: "Body", value: card.body ?? '', rows: 3, onChange: (e) => {
                            const cards = [...block.cards];
                            cards[index] = { ...card, body: e.target.value || undefined };
                            onChange({ ...block, cards });
                        } }), _jsx(AdminTextArea, { label: "Expand body", value: card.expandBody ?? '', rows: 3, onChange: (e) => {
                            const cards = [...block.cards];
                            cards[index] = { ...card, expandBody: e.target.value || undefined };
                            onChange({ ...block, cards });
                        } }), _jsx(MediaField, { label: "Icon", value: card.iconSrc ?? '', onSelect: (path) => {
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
                        } })] }));
        }
        case 'accordionSection': {
            if (block.type !== 'accordion')
                return null;
            const section = block.sections[index];
            if (!section)
                return null;
            return (_jsxs(PanelSection, { title: "Section", children: [_jsx(AdminTextInput, { label: "Title", value: section.title, onChange: (e) => {
                            const sections = [...block.sections];
                            sections[index] = { ...section, title: e.target.value };
                            onChange({ ...block, sections });
                        } }), _jsx(AdminTextArea, { label: "Content (markdown)", value: section.markdown, rows: 8, onChange: (e) => {
                            const sections = [...block.sections];
                            sections[index] = { ...section, markdown: e.target.value };
                            onChange({ ...block, sections });
                        } }), _jsx(MediaField, { label: "Image", value: section.imageSrc ?? '', onSelect: (path) => {
                            const sections = [...block.sections];
                            sections[index] = { ...section, imageSrc: path || undefined };
                            onChange({ ...block, sections });
                        }, onClear: () => {
                            const sections = [...block.sections];
                            sections[index] = { ...section, imageSrc: undefined };
                            onChange({ ...block, sections });
                        } })] }));
        }
        case 'stat': {
            if (block.type !== 'statGrid')
                return null;
            const stat = block.stats[index];
            if (!stat)
                return null;
            return (_jsxs(PanelSection, { title: "Stat", children: [_jsx(AdminTextInput, { label: "Value", value: stat.value, onChange: (e) => {
                            const stats = [...block.stats];
                            stats[index] = { ...stat, value: e.target.value };
                            onChange({ ...block, stats });
                        } }), _jsx(AdminTextInput, { label: "Label", value: stat.label, onChange: (e) => {
                            const stats = [...block.stats];
                            stats[index] = { ...stat, label: e.target.value };
                            onChange({ ...block, stats });
                        } }), _jsx(AdminTextInput, { label: "Note", value: stat.note ?? '', onChange: (e) => {
                            const stats = [...block.stats];
                            stats[index] = { ...stat, note: e.target.value || undefined };
                            onChange({ ...block, stats });
                        } }), _jsx(AdminTextInput, { label: "Source", value: stat.source ?? '', onChange: (e) => {
                            const stats = [...block.stats];
                            stats[index] = { ...stat, source: e.target.value || undefined };
                            onChange({ ...block, stats });
                        } })] }));
        }
        case 'timelineItem': {
            if (block.type !== 'timeline')
                return null;
            const item = block.items[index];
            if (!item)
                return null;
            return (_jsxs(PanelSection, { title: "Timeline item", children: [_jsx(AdminTextInput, { label: "Phase", value: item.phase ?? '', onChange: (e) => {
                            const items = [...block.items];
                            items[index] = { ...item, phase: e.target.value || undefined };
                            onChange({ ...block, items });
                        } }), _jsx(AdminTextInput, { label: "Title", value: item.title, onChange: (e) => {
                            const items = [...block.items];
                            items[index] = { ...item, title: e.target.value };
                            onChange({ ...block, items });
                        } }), _jsx(AdminTextArea, { label: "Body (markdown)", value: item.bodyMarkdown ?? '', rows: 5, onChange: (e) => {
                            const items = [...block.items];
                            items[index] = { ...item, bodyMarkdown: e.target.value || undefined };
                            onChange({ ...block, items });
                        } }), _jsx(AdminTextInput, { label: "Date label", value: item.dateLabel ?? '', onChange: (e) => {
                            const items = [...block.items];
                            items[index] = { ...item, dateLabel: e.target.value || undefined };
                            onChange({ ...block, items });
                        } })] }));
        }
        case 'column': {
            if (block.type !== 'columns')
                return null;
            const col = block.columns[index];
            if (!col)
                return null;
            return (_jsx(PanelSection, { title: `Column ${index + 1}`, children: _jsx(AdminTextArea, { label: "Content (markdown)", value: col.markdown, rows: 10, onChange: (e) => {
                        const columns = [...block.columns];
                        columns[index] = { markdown: e.target.value };
                        onChange({ ...block, columns });
                    } }) }));
        }
        case 'listItem': {
            if (block.type !== 'list')
                return null;
            const text = block.items[index];
            if (text === undefined)
                return null;
            return (_jsx(PanelSection, { title: `Item ${index + 1}`, children: _jsx(AdminTextArea, { label: "Text", value: text, rows: 3, onChange: (e) => {
                        const items = [...block.items];
                        items[index] = e.target.value;
                        onChange({ ...block, items });
                    } }) }));
        }
        default:
            return null;
    }
}

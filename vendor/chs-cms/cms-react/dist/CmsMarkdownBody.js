import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function renderCmsInline(text) {
    const nodes = [];
    const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }
        const token = match[0];
        if (token.startsWith('**')) {
            nodes.push(_jsx("strong", { children: token.slice(2, -2) }, `${match.index}-strong`));
        }
        else if (token.startsWith('*')) {
            nodes.push(_jsx("em", { children: token.slice(1, -1) }, `${match.index}-em`));
        }
        else {
            const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
            if (linkMatch) {
                const [, label, href] = linkMatch;
                const external = href.startsWith('http');
                nodes.push(_jsx("a", { href: href, className: "text-accent-orange underline-offset-2 hover:underline", ...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {}), children: label }, `${match.index}-link`));
            }
            else {
                nodes.push(token);
            }
        }
        lastIndex = match.index + token.length;
    }
    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }
    return nodes.length > 0 ? nodes : [text];
}
function isTableRow(line) {
    return line.trim().startsWith('|') && line.trim().endsWith('|');
}
function isTableDivider(line) {
    return /^\|\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|$/.test(line.trim());
}
function parseTableRow(line) {
    return line
        .trim()
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim());
}
function parseMarkdownBlocks(markdown) {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const blocks = [];
    let index = 0;
    while (index < lines.length) {
        const line = lines[index]?.trim() ?? '';
        if (!line || line === '---') {
            index += 1;
            continue;
        }
        if (line.startsWith('# ') && !line.startsWith('## ')) {
            index += 1;
            while (index < lines.length && lines[index]?.trim() && !lines[index]?.startsWith('## ')) {
                index += 1;
            }
            continue;
        }
        if (line.startsWith('## ')) {
            blocks.push({ type: 'heading', level: 2, text: line.slice(3).trim() });
            index += 1;
            continue;
        }
        if (line.startsWith('### ')) {
            blocks.push({ type: 'heading', level: 3, text: line.slice(4).trim() });
            index += 1;
            continue;
        }
        if (isTableRow(line)) {
            const headers = parseTableRow(line);
            index += 1;
            if (lines[index] && isTableDivider(lines[index])) {
                index += 1;
            }
            const rows = [];
            while (index < lines.length && isTableRow(lines[index] ?? '')) {
                rows.push(parseTableRow(lines[index] ?? ''));
                index += 1;
            }
            blocks.push({ type: 'table', headers, rows });
            continue;
        }
        if (line.startsWith('- ')) {
            const items = [];
            while (index < lines.length && (lines[index]?.trim().startsWith('- ') ?? false)) {
                items.push((lines[index] ?? '').trim().slice(2));
                index += 1;
            }
            blocks.push({ type: 'list', ordered: false, items });
            continue;
        }
        const orderedMatch = /^(\d+)\.\s+(.+)$/.exec(line);
        if (orderedMatch) {
            const items = [];
            while (index < lines.length) {
                const current = lines[index]?.trim() ?? '';
                const itemMatch = /^(\d+)\.\s+(.+)$/.exec(current);
                if (!itemMatch)
                    break;
                items.push(itemMatch[2]);
                index += 1;
            }
            blocks.push({ type: 'list', ordered: true, items });
            continue;
        }
        const paragraphLines = [line];
        index += 1;
        while (index < lines.length &&
            (lines[index]?.trim() ?? '') &&
            lines[index]?.trim() !== '---' &&
            !lines[index]?.startsWith('#') &&
            !(lines[index]?.trim().startsWith('- ') ?? false) &&
            !isTableRow(lines[index] ?? '') &&
            !/^(\d+)\.\s+/.test(lines[index]?.trim() ?? '')) {
            paragraphLines.push(lines[index]?.trim() ?? '');
            index += 1;
        }
        blocks.push({ type: 'paragraph', text: paragraphLines.join('\n') });
    }
    return blocks;
}
export function CmsMarkdownBody({ markdown }) {
    const blocks = parseMarkdownBlocks(markdown);
    return (_jsx(_Fragment, { children: blocks.map((block, blockIndex) => {
            switch (block.type) {
                case 'heading':
                    if (block.level === 2) {
                        return (_jsx("h2", { className: "display-title mt-8 text-2xl text-ink first:mt-0", children: block.text }, blockIndex));
                    }
                    return (_jsx("h3", { className: "mt-6 text-lg font-semibold text-ink", children: block.text }, blockIndex));
                case 'paragraph':
                    if (block.text.startsWith('*') && block.text.endsWith('*')) {
                        return (_jsx("p", { className: "text-sm italic", children: block.text.slice(1, -1) }, blockIndex));
                    }
                    if (block.text.startsWith('> ')) {
                        return (_jsx("blockquote", { className: "border-l-4 border-accent-orange pl-4 text-ink-muted", children: renderCmsInline(block.text.slice(2)) }, blockIndex));
                    }
                    return (_jsx("p", { className: "whitespace-pre-line", children: renderCmsInline(block.text) }, blockIndex));
                case 'list':
                    if (block.ordered) {
                        return (_jsx("ol", { className: "list-decimal space-y-2 pl-6", children: block.items.map((item) => (_jsx("li", { children: renderCmsInline(item) }, item.slice(0, 24)))) }, blockIndex));
                    }
                    return (_jsx("ul", { className: "list-disc space-y-2 pl-6", children: block.items.map((item) => (_jsx("li", { children: renderCmsInline(item) }, item.slice(0, 24)))) }, blockIndex));
                case 'table':
                    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[32rem] border-collapse text-sm", children: [_jsx("thead", { children: _jsx("tr", { children: block.headers.map((header) => (_jsx("th", { className: "border-b border-line-strong px-3 py-2 text-left font-semibold text-ink", children: header }, header))) }) }), _jsx("tbody", { children: block.rows.map((row) => (_jsx("tr", { className: "border-b border-border-subtle", children: row.map((cell, cellIndex) => (_jsx("td", { className: "px-3 py-2 align-top", children: renderCmsInline(cell) }, `${row.join('|')}-${cellIndex}`))) }, row.join('|')))) })] }) }, blockIndex));
                default: {
                    const _exhaustive = block;
                    return _exhaustive;
                }
            }
        }) }));
}

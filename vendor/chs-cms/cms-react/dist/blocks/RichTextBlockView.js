import { jsx as _jsx } from "react/jsx-runtime";
import { EditableMarkdown } from './editable';
export function RichTextBlockView({ block }) {
    return (_jsx("section", { id: block.anchorId, className: "prose prose-sm max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed prose-li:leading-relaxed prose-strong:text-ink", children: _jsx(EditableMarkdown, { value: block.markdown, update: (markdown) => ({ ...block, markdown }) }) }));
}

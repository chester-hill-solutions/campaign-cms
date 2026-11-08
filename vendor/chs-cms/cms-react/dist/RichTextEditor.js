import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
import { CmsMarkdownBody } from './CmsMarkdownBody';
const Editor = lazy(() => import('./canvas/InlineRichTextEditor'));
/** The same markdown editor as the page builder, usable outside its block context. */
export function RichTextEditor(props) {
    return _jsx(Suspense, { fallback: _jsx(CmsMarkdownBody, { markdown: props.value }), children: _jsx(Editor, { ...props }) });
}

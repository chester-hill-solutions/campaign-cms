import type { ReactNode } from 'react';
/** Shared with table-of-contents consumers so their links match rendered headings. */
export declare function cmsHeadingId(text: string): string;
export declare function renderCmsInline(text: string): ReactNode[];
export declare function CmsMarkdownBody({ markdown }: {
    markdown: string;
}): import("react").JSX.Element;

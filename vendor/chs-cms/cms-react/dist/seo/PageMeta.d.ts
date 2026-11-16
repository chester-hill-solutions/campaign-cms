import type { ReactElement } from 'react';
import { type PageSeo } from '@chester-hill-solutions/cms-core';
export type PageMetaProps = {
    seo: PageSeo;
    jsonLd?: Record<string, unknown>;
};
export declare function PageMeta({ seo, jsonLd }: PageMetaProps): ReactElement;

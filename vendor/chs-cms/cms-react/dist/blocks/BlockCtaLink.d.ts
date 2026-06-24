import type { BlockCta } from '@chester-hill-solutions/cms-core';
export declare function BlockCtaLink({ cta, variant }: {
    cta: BlockCta;
    variant?: 'primary' | 'secondary';
}): import("react").JSX.Element;
export declare function BlockCtaRow({ ctas }: {
    ctas: BlockCta[];
}): import("react").JSX.Element | null;

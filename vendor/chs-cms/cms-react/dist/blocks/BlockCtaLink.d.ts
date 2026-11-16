import type { BlockCta } from '@chester-hill-solutions/cms-core';
export type BlockCtaAction = {
    cta: BlockCta;
    variant: 'primary' | 'secondary';
};
export declare function BlockCtaLink({ cta, variant }: {
    cta: BlockCta;
    variant?: 'primary' | 'secondary';
}): import("react").JSX.Element;
export declare function BlockCtaRow({ ctas }: {
    ctas: BlockCtaAction[];
}): import("react").JSX.Element | null;

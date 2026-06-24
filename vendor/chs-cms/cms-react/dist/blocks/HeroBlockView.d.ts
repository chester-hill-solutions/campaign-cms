import type { HeroBlock } from '@chester-hill-solutions/cms-core';
declare function heroLayoutClasses(block: HeroBlock): {
    grid: string;
    text: string;
    figure: string;
};
export declare function HeroBlockView({ block }: {
    block: HeroBlock;
}): import("react").JSX.Element;
export { heroLayoutClasses };

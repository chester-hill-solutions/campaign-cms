import type { BlockLayout, ContainerLayout, StackContainerLayout } from '@chester-hill-solutions/cms-core';
export declare function blockLayoutClasses(layout: BlockLayout): string;
export declare function cardGridColumnClass(columns: 1 | 2 | 3 | 4): string;
export type ContainerLayoutClassesInput = {
    gap?: ContainerLayout['gap'];
    arrangement?: ContainerLayout['arrangement'];
    alignItems?: ContainerLayout['alignItems'];
    columns?: 1 | 2 | 3 | 4;
    /** Gap scale for CSS grid containers. Defaults to `grid`. */
    gapScale?: 'grid' | 'columns';
};
/**
 * Classes for multi-item CSS grids (cardGrid, statGrid, collectionGrid, columns).
 * When `arrangement` is `list`, column count is forced to a single stack.
 */
export declare function containerLayoutClasses(input?: ContainerLayoutClassesInput): string;
export type StackContainerClassesInput = {
    gap?: StackContainerLayout['gap'];
    alignItems?: StackContainerLayout['alignItems'];
};
/** Vertical list spacing (`space-y-*`) plus optional text alignment for list blocks. */
export declare function listContainerClasses(input?: StackContainerClassesInput): string;
/** Resolve container from a block field that may be missing on older saved docs. */
export declare function resolveContainerLayout(container: Partial<ContainerLayout> | undefined): ContainerLayout;
export declare function resolveStackContainerLayout(container: Partial<StackContainerLayout> | undefined): StackContainerLayout;

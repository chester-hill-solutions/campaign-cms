// w-full keeps the block pinned to its grid track; without it, auto margins
// switch the item to fit-content sizing and wide children (code, tables)
// stretch the track past the viewport.
const WIDTH_CLASSES = {
    contained: 'mx-auto w-full max-w-3xl',
    wide: 'mx-auto w-full max-w-5xl',
    full: 'w-full max-w-none',
};
/** Static strings so Tailwind v4 source scan picks them up. */
const ACCENT_BG = {
    primary: 'rounded-2xl bg-[color-mix(in_oklab,var(--accent-orange)_12%,var(--surface-card)_88%)] p-6 @sm:p-8',
    alt: 'rounded-2xl bg-[color-mix(in_oklab,var(--accent-red)_12%,var(--surface-card)_88%)] p-6 @sm:p-8',
    tertiary: 'rounded-2xl bg-[color-mix(in_oklab,var(--accent-green)_12%,var(--surface-card)_88%)] p-6 @sm:p-8',
};
const GRADIENT_BG = {
    primary: 'rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent-orange)_18%,transparent),color-mix(in_oklab,var(--accent-red)_12%,transparent))] p-6 @sm:p-8',
    alt: 'rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent-red)_18%,transparent),color-mix(in_oklab,var(--accent-orange)_12%,transparent))] p-6 @sm:p-8',
    tertiary: 'rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent-green)_18%,transparent),color-mix(in_oklab,var(--accent-orange)_12%,transparent))] p-6 @sm:p-8',
};
function backgroundClasses(layout) {
    const accent = layout.accent ?? 'primary';
    switch (layout.background) {
        case 'none':
            return '';
        case 'card':
            return 'rounded-2xl border border-border-subtle bg-surface-elevated p-6 @sm:p-8';
        case 'accent':
            return ACCENT_BG[accent];
        case 'brand-gradient':
            return GRADIENT_BG[accent];
        default: {
            const _exhaustive = layout.background;
            return _exhaustive;
        }
    }
}
const SPACING_CLASSES = {
    tight: 'py-4',
    normal: 'py-8',
    loose: 'py-12',
};
const ALIGN_CLASSES = {
    left: 'text-left',
    center: 'text-center mx-auto',
};
/** Mirrors `DEFAULT_CONTAINER_LAYOUT` from cms-core (avoid runtime import of constants). */
const FALLBACK_CONTAINER = {
    gap: 'normal',
    arrangement: 'grid',
    alignItems: 'stretch',
};
/** Mirrors `DEFAULT_STACK_CONTAINER_LAYOUT` from cms-core. */
const FALLBACK_STACK_CONTAINER = {
    gap: 'normal',
    alignItems: 'stretch',
};
const GRID_GAP_CLASSES = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-8',
};
/** Columns historically used a slightly larger default gap than card grids. */
const COLUMNS_GAP_CLASSES = {
    tight: 'gap-3',
    normal: 'gap-6',
    loose: 'gap-10',
};
const LIST_GAP_CLASSES = {
    tight: 'space-y-1',
    normal: 'space-y-2',
    loose: 'space-y-4',
};
const ALIGN_ITEMS_CLASSES = {
    start: 'items-start',
    center: 'items-center',
    stretch: 'items-stretch',
};
export function blockLayoutClasses(layout) {
    return [
        // Grid children default to min-width:auto, which lets wide content (code
        // blocks, tables) blow out the track instead of scrolling internally.
        'min-w-0',
        WIDTH_CLASSES[layout.width],
        backgroundClasses(layout),
        SPACING_CLASSES[layout.spacing],
        ALIGN_CLASSES[layout.align],
    ]
        .filter(Boolean)
        .join(' ');
}
export function cardGridColumnClass(columns) {
    switch (columns) {
        case 1:
            return 'grid-cols-1';
        case 2:
            return 'grid-cols-1 @sm:grid-cols-2';
        case 3:
            return 'grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3';
        case 4:
            return 'grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4';
        default: {
            const _exhaustive = columns;
            return _exhaustive;
        }
    }
}
/**
 * Classes for multi-item CSS grids (cardGrid, statGrid, collectionGrid, columns).
 * When `arrangement` is `list`, column count is forced to a single stack.
 */
export function containerLayoutClasses(input = {}) {
    const gap = input.gap ?? FALLBACK_CONTAINER.gap;
    const arrangement = input.arrangement ?? FALLBACK_CONTAINER.arrangement;
    const alignItems = input.alignItems ?? FALLBACK_CONTAINER.alignItems;
    const gapScale = input.gapScale ?? 'grid';
    const columns = arrangement === 'list' ? 1 : (input.columns ?? 1);
    const gapClass = gapScale === 'columns' ? COLUMNS_GAP_CLASSES[gap] : GRID_GAP_CLASSES[gap];
    return ['grid', gapClass, ALIGN_ITEMS_CLASSES[alignItems], cardGridColumnClass(columns)]
        .filter(Boolean)
        .join(' ');
}
/** Vertical list spacing (`space-y-*`) plus optional text alignment for list blocks. */
export function listContainerClasses(input = {}) {
    const gap = input.gap ?? FALLBACK_STACK_CONTAINER.gap;
    const alignItems = input.alignItems ?? FALLBACK_STACK_CONTAINER.alignItems;
    const alignClass = alignItems === 'center' ? 'text-center' : alignItems === 'start' ? 'text-left' : '';
    return [LIST_GAP_CLASSES[gap], alignClass].filter(Boolean).join(' ');
}
/** Resolve container from a block field that may be missing on older saved docs. */
export function resolveContainerLayout(container) {
    return {
        gap: container?.gap ?? FALLBACK_CONTAINER.gap,
        arrangement: container?.arrangement ?? FALLBACK_CONTAINER.arrangement,
        alignItems: container?.alignItems ?? FALLBACK_CONTAINER.alignItems,
    };
}
export function resolveStackContainerLayout(container) {
    return {
        gap: container?.gap ?? FALLBACK_STACK_CONTAINER.gap,
        alignItems: container?.alignItems ?? FALLBACK_STACK_CONTAINER.alignItems,
    };
}

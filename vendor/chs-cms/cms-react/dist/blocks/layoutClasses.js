const WIDTH_CLASSES = {
    contained: 'mx-auto max-w-3xl',
    wide: 'mx-auto max-w-5xl',
    full: 'w-full max-w-none',
};
const BACKGROUND_CLASSES = {
    none: '',
    card: 'rounded-2xl border border-border-subtle bg-surface-elevated p-6 @sm:p-8',
    accent: 'rounded-2xl bg-[color-mix(in_oklab,var(--accent-orange)_12%,var(--surface-card)_88%)] p-6 @sm:p-8',
    'brand-gradient': 'rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent-orange)_18%,transparent),color-mix(in_oklab,var(--accent-red)_12%,transparent))] p-6 @sm:p-8',
};
const SPACING_CLASSES = {
    tight: 'py-4',
    normal: 'py-8',
    loose: 'py-12',
};
const ALIGN_CLASSES = {
    left: 'text-left',
    center: 'text-center mx-auto',
};
export function blockLayoutClasses(layout) {
    return [
        WIDTH_CLASSES[layout.width],
        BACKGROUND_CLASSES[layout.background],
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

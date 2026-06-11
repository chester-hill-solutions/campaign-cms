import type { BlockLayout } from '@campaign/cms-core'

const WIDTH_CLASSES: Record<BlockLayout['width'], string> = {
  contained: 'mx-auto max-w-3xl',
  wide: 'mx-auto max-w-5xl',
  full: 'w-full max-w-none',
}

const BACKGROUND_CLASSES: Record<BlockLayout['background'], string> = {
  none: '',
  card: 'rounded-2xl border border-border-subtle bg-surface-elevated p-6 @sm:p-8',
  accent: 'rounded-2xl bg-[color-mix(in_oklab,var(--accent-orange)_12%,var(--surface-card)_88%)] p-6 @sm:p-8',
  'brand-gradient':
    'rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent-orange)_18%,transparent),color-mix(in_oklab,var(--accent-red)_12%,transparent))] p-6 @sm:p-8',
}

const SPACING_CLASSES: Record<BlockLayout['spacing'], string> = {
  tight: 'py-4',
  normal: 'py-8',
  loose: 'py-12',
}

const ALIGN_CLASSES: Record<BlockLayout['align'], string> = {
  left: 'text-left',
  center: 'text-center mx-auto',
}

export function blockLayoutClasses(layout: BlockLayout): string {
  return [
    WIDTH_CLASSES[layout.width],
    BACKGROUND_CLASSES[layout.background],
    SPACING_CLASSES[layout.spacing],
    ALIGN_CLASSES[layout.align],
  ]
    .filter(Boolean)
    .join(' ')
}

export function cardGridColumnClass(columns: 1 | 2 | 3 | 4): string {
  switch (columns) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-1 @sm:grid-cols-2'
    case 3:
      return 'grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3'
    case 4:
      return 'grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4'
    default: {
      const _exhaustive: never = columns
      return _exhaustive
    }
  }
}

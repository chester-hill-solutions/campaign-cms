import { X } from 'lucide-react'

import type { BlockLayout, PageBlock } from '@campaign/cms-core'
import { BLOCK_TYPE_LABELS } from '@campaign/cms-core'
import { BlockTypeSettings } from './blockTypeSettings'
import { PanelSection, SegmentedControl } from './fields'

function LayoutSettings({
  layout,
  onChange,
}: {
  layout: BlockLayout
  onChange: (layout: BlockLayout) => void
}) {
  return (
    <PanelSection title="Layout">
      <SegmentedControl
        label="Width"
        options={[
          { value: 'contained', label: 'Contained' },
          { value: 'wide', label: 'Wide' },
          { value: 'full', label: 'Full' },
        ]}
        value={layout.width}
        onChange={(width) => onChange({ ...layout, width })}
      />
      <SegmentedControl
        label="Background"
        options={[
          { value: 'none', label: 'None' },
          { value: 'card', label: 'Card' },
          { value: 'accent', label: 'Accent' },
          { value: 'brand-gradient', label: 'Gradient' },
        ]}
        value={layout.background}
        onChange={(background) => onChange({ ...layout, background })}
      />
      <SegmentedControl
        label="Vertical spacing"
        options={[
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ]}
        value={layout.spacing}
        onChange={(spacing) => onChange({ ...layout, spacing })}
      />
      <SegmentedControl
        label="Alignment"
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
        ]}
        value={layout.align}
        onChange={(align) => onChange({ ...layout, align })}
      />
    </PanelSection>
  )
}

type Props = {
  block: PageBlock
  errors?: string[]
  onChange: (block: PageBlock) => void
  onClose: () => void
}

/** Floating settings inspector for the selected block. */
export function BlockSettingsPanel({ block, errors, onChange, onClose }: Props) {
  return (
    <aside
      className="pb-settings-panel fixed bottom-4 right-4 top-24 z-40 flex w-80 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-card shadow-xl"
      aria-label={`${BLOCK_TYPE_LABELS[block.type]} settings`}
    >
      <header className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
        <h2 className="m-0 text-sm font-semibold text-ink">
          {BLOCK_TYPE_LABELS[block.type]} settings
        </h2>
        <button
          type="button"
          className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:text-ink"
          aria-label="Close settings"
          onClick={onClose}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>
      <div className="grid flex-1 content-start gap-3 overflow-y-auto px-4 py-3">
        {errors && errors.length > 0 ? (
          <div className="rounded-lg border border-accent-red bg-[color-mix(in_oklab,var(--accent-red)_8%,var(--surface-card))] p-2" role="alert">
            <ul className="m-0 grid list-disc gap-0.5 pl-4 text-xs text-accent-red">
              {errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <BlockTypeSettings block={block} onChange={onChange} />
        <LayoutSettings
          layout={block.layout}
          onChange={(layout) => onChange({ ...block, layout })}
        />
      </div>
    </aside>
  )
}

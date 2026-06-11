import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Settings2,
  Trash2,
  TriangleAlert,
} from 'lucide-react'

import type { PageBlock } from '@campaign/cms-core'
import { BLOCK_TYPE_LABELS } from '@campaign/cms-core'
import { blockLayoutClasses } from '../blocks/layoutClasses'

type Props = {
  block: PageBlock
  index: number
  count: number
  selected: boolean
  errors?: string[]
  onSelect: () => void
  onOpenSettings: () => void
  onMove: (direction: -1 | 1) => void
  onDuplicate: () => void
  onDelete: () => void
  children: React.ReactNode
}

const TOOLBAR_BUTTON_CLASS =
  'focus-ring inline-flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-surface-elevated hover:text-ink disabled:opacity-30'

/**
 * Canvas wrapper for one block: hover/selection outline, label chip, and a
 * floating toolbar with move / duplicate / settings / delete plus drag handle.
 */
export function BlockChrome({
  block,
  index,
  count,
  selected,
  errors,
  onSelect,
  onOpenSettings,
  onMove,
  onDuplicate,
  onDelete,
  children,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  const label = BLOCK_TYPE_LABELS[block.type]
  const hasErrors = Boolean(errors && errors.length > 0)

  return (
    // Mouse-only selection affordance; keyboard users reach every action via
    // the toolbar buttons and inline editors, which are all focusable.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 30 : undefined,
      }}
      className={`pb-block group/block relative rounded-lg ${selected ? 'pb-block--selected' : ''} ${hasErrors ? 'pb-block--error' : ''}`}
      data-block-id={block.id}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onClickCapture={(e) => {
        // Keep canvas clicks from navigating away via CTA / inline links.
        const anchor = (e.target as HTMLElement).closest('a')
        if (anchor) e.preventDefault()
      }}
    >
      <span
        className={`pointer-events-none absolute -top-2.5 left-2 z-20 rounded bg-surface-card px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-muted shadow-sm ${
          selected ? '' : 'hidden group-hover/block:inline-block'
        }`}
      >
        {label}
      </span>

      {hasErrors ? (
        <span
          className="absolute -top-2.5 left-24 z-20 inline-flex items-center gap-1 rounded bg-accent-red px-1.5 py-0.5 text-[0.65rem] font-semibold text-white shadow-sm"
          title={errors?.join('\n')}
        >
          <TriangleAlert className="h-3 w-3" aria-hidden="true" />
          {errors?.[0]}
        </span>
      ) : null}

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- stops bubbling to block select only */}
      <div
        className={`pb-block-toolbar absolute -top-3.5 right-2 z-30 items-center gap-0.5 rounded-lg border border-border-subtle bg-surface-card p-0.5 shadow-lg ${
          selected ? 'flex' : 'hidden group-hover/block:flex'
        }`}
        role="toolbar"
        aria-label={`${label} block actions`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={`${TOOLBAR_BUTTON_CLASS} cursor-grab active:cursor-grabbing`}
          aria-label={`Drag ${label}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={TOOLBAR_BUTTON_CLASS}
          aria-label="Move up"
          title="Move up"
          disabled={index === 0}
          onClick={() => onMove(-1)}
        >
          <ChevronUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={TOOLBAR_BUTTON_CLASS}
          aria-label="Move down"
          title="Move down"
          disabled={index >= count - 1}
          onClick={() => onMove(1)}
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="mx-0.5 h-5 w-px bg-border-subtle" aria-hidden="true" />
        <button
          type="button"
          className={TOOLBAR_BUTTON_CLASS}
          aria-label="Duplicate block"
          title="Duplicate"
          onClick={onDuplicate}
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={TOOLBAR_BUTTON_CLASS}
          aria-label="Block settings"
          title="Settings"
          onClick={() => {
            onSelect()
            onOpenSettings()
          }}
        >
          <Settings2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${TOOLBAR_BUTTON_CLASS} hover:text-accent-red`}
          aria-label="Delete block"
          title="Delete"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className={blockLayoutClasses(block.layout)}>{children}</div>
    </div>
  )
}

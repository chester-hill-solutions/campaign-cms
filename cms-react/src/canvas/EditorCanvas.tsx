import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Fragment, useMemo, useRef, useState } from 'react'

import type { PageBlock } from '@campaign/cms-core'
import {
  APP_BLOCK_TYPES,
  BLOCK_TYPE_LABELS,
  duplicateBlockInPage,
  insertBlockAt,
  moveBlockInPage,
  reorderBlocksInPage,
  updateBlockInPage,
  type PageMeta,
} from '@campaign/cms-core'
import { renderBlockView } from '../blocks/BlockRenderer'
import { BlockEditProvider, type BlockEditApi } from '../blocks/editable'
import { useCmsUi } from '../context'
import { BlockChrome } from './BlockChrome'
import { InsertMenu } from './InsertMenu'

const APP_BLOCK_TYPE_SET = new Set<PageBlock['type']>(APP_BLOCK_TYPES)

function AppBlockPlaceholder({ block }: { block: PageBlock }) {
  const heading =
    'heading' in block && typeof block.heading === 'string' ? block.heading : null
  return (
    <div className="grid gap-1 rounded-xl border border-dashed border-line-strong bg-surface-elevated/50 px-5 py-6 text-center">
      <p className="m-0 text-sm font-semibold text-ink">
        {BLOCK_TYPE_LABELS[block.type]}
      </p>
      {heading ? <p className="m-0 text-sm text-ink-muted">“{heading}”</p> : null}
      <p className="m-0 text-xs text-ink-muted">
        Live content renders on the public site. Configure it in block settings.
      </p>
    </div>
  )
}

function InsertPoint({
  open,
  onOpen,
  onClose,
  onPick,
}: {
  open: boolean
  onOpen: () => void
  onClose: () => void
  onPick: (type: PageBlock['type']) => void
}) {
  return (
    <div className="pb-insert-point group/insert relative -my-2 flex h-5 items-center justify-center">
      <span
        className={`absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-accent-orange transition-opacity ${
          open ? 'opacity-60' : 'opacity-0 group-hover/insert:opacity-60'
        }`}
        aria-hidden="true"
      />
      <button
        type="button"
        aria-label="Insert block here"
        className={`focus-ring relative z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border border-accent-orange bg-surface-card text-accent-orange shadow-sm transition-opacity hover:bg-accent-orange hover:text-primary-dark focus-visible:opacity-100 ${
          open ? 'opacity-100' : 'opacity-0 group-hover/insert:opacity-100'
        }`}
        onClick={(e) => {
          e.stopPropagation()
          onOpen()
        }}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open ? <InsertMenu onPick={onPick} onClose={onClose} /> : null}
    </div>
  )
}

type Props = {
  content: PageMeta
  onChange: (next: PageMeta) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  onOpenSettings: () => void
  onDelete: (blockId: string) => void
  errorsByBlock: ReadonlyMap<string, string[]>
}

/**
 * The inline-editable page canvas. Renders real block views wrapped in
 * selection chrome, with insert points between blocks and drag reordering.
 */
export function EditorCanvas({
  content,
  onChange,
  selectedId,
  onSelect,
  onOpenSettings,
  onDelete,
  errorsByBlock,
}: Props) {
  const [insertAt, setInsertAt] = useState<number | null>(null)
  const { blockDefaults } = useCmsUi()

  const stateRef = useRef({ content, onChange })
  stateRef.current = { content, onChange }

  // Stable identity so block views don't remount as content changes.
  const editApi = useMemo<BlockEditApi>(
    () => ({
      updateBlock: (block) => {
        const { content: current, onChange: emit } = stateRef.current
        emit(updateBlockInPage(current, block))
      },
    }),
    [],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = content.blocks.findIndex((b) => b.id === active.id)
    const toIndex = content.blocks.findIndex((b) => b.id === over.id)
    if (fromIndex < 0 || toIndex < 0) return
    onChange(reorderBlocksInPage(content, fromIndex, toIndex))
  }

  const handleInsert = (type: PageBlock['type'], index: number) => {
    const { content: next, block } = insertBlockAt(content, type, index, blockDefaults)
    onChange(next)
    setInsertAt(null)
    onSelect(block.id)
  }

  if (content.blocks.length === 0) {
    return (
      <BlockEditProvider value={editApi}>
        <div className="relative grid place-items-center py-16">
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-line-strong px-6 py-4 text-sm font-semibold text-ink-muted hover:border-accent-orange hover:text-ink"
            onClick={() => setInsertAt(0)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add your first block
          </button>
          {insertAt !== null ? (
            <InsertMenu
              onPick={(type) => handleInsert(type, 0)}
              onClose={() => setInsertAt(null)}
            />
          ) : null}
        </div>
      </BlockEditProvider>
    )
  }

  return (
    <BlockEditProvider value={editApi}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={content.blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="@container grid w-full min-w-0 gap-2 pb-10 pt-4">
            <InsertPoint
              open={insertAt === 0}
              onOpen={() => setInsertAt(0)}
              onClose={() => setInsertAt(null)}
              onPick={(type) => handleInsert(type, 0)}
            />
            {content.blocks.map((block, index) => (
              <Fragment key={block.id}>
                <BlockChrome
                  block={block}
                  index={index}
                  count={content.blocks.length}
                  selected={block.id === selectedId}
                  errors={errorsByBlock.get(block.id)}
                  onSelect={() => onSelect(block.id)}
                  onOpenSettings={onOpenSettings}
                  onMove={(direction) =>
                    onChange(moveBlockInPage(content, block.id, direction))
                  }
                  onDuplicate={() => onChange(duplicateBlockInPage(content, block.id))}
                  onDelete={() => onDelete(block.id)}
                >
                  {APP_BLOCK_TYPE_SET.has(block.type) ? (
                    <AppBlockPlaceholder block={block} />
                  ) : (
                    renderBlockView(block)
                  )}
                </BlockChrome>
                <InsertPoint
                  open={insertAt === index + 1}
                  onOpen={() => setInsertAt(index + 1)}
                  onClose={() => setInsertAt(null)}
                  onPick={(type) => handleInsert(type, index + 1)}
                />
              </Fragment>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </BlockEditProvider>
  )
}

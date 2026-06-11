import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import {
  Suspense,
  createContext,
  lazy,
  useContext,
  useEffect,
  useRef,
} from 'react'

import { CmsMarkdownBody } from '../CmsMarkdownBody'
import type { PageBlock } from '@campaign/cms-core'

/**
 * Edit context for the admin page builder canvas. On the public site this
 * context is absent and every editable primitive renders plain content,
 * keeping the public DOM identical to the pre-builder output.
 */
export type BlockEditApi = {
  updateBlock: (block: PageBlock) => void
}

const BlockEditContext = createContext<BlockEditApi | null>(null)

export const BlockEditProvider = BlockEditContext.Provider

export function useBlockEdit(): BlockEditApi | null {
  return useContext(BlockEditContext)
}

type EditableTextProps = {
  value: string
  /** Produce the next block from the edited value. Only called in edit mode. */
  update: (value: string) => PageBlock
  placeholder?: string
  multiline?: boolean
  className?: string
  /** Stable id used to restore focus after structural edits (list items). */
  editableId?: string
  onEnterKey?: () => void
  onBackspaceEmpty?: () => void
}

function readEditableText(el: HTMLElement, multiline: boolean): string {
  if (!multiline) return el.textContent ?? ''
  let out = ''
  el.childNodes.forEach((node) => {
    if (node.nodeName === 'BR') out += '\n'
    else out += node.textContent ?? ''
  })
  return out
}

function EditableTextInner({
  value,
  onChange,
  placeholder,
  multiline = false,
  className,
  editableId,
  onEnterKey,
  onBackspaceEmpty,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
  editableId?: string
  onEnterKey?: () => void
  onBackspaceEmpty?: () => void
}) {
  const ref = useRef<HTMLSpanElement>(null)

  // Sync external value changes (undo/redo, revision restore) while not focused.
  useEffect(() => {
    const el = ref.current
    if (!el || document.activeElement === el) return
    if (readEditableText(el, multiline) !== value) {
      el.textContent = value
    }
  })

  return (
    <span
      ref={ref}
      role="textbox"
      aria-multiline={multiline}
      aria-label={placeholder ?? 'Text'}
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-placeholder={placeholder}
      data-editable-id={editableId}
      className={`pb-editable ${className ?? ''}`}
      onInput={(e) => onChange(readEditableText(e.currentTarget, multiline))}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          if (multiline) {
            document.execCommand('insertLineBreak')
            onChange(readEditableText(e.currentTarget, multiline))
          } else if (onEnterKey) {
            onEnterKey()
          } else {
            e.currentTarget.blur()
          }
          return
        }
        if (e.key === 'Escape') {
          e.currentTarget.blur()
          return
        }
        if (
          e.key === 'Backspace' &&
          onBackspaceEmpty &&
          readEditableText(e.currentTarget, multiline) === ''
        ) {
          e.preventDefault()
          onBackspaceEmpty()
        }
      }}
      onPaste={(e) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        const insert = multiline ? text : text.replace(/\s*\n\s*/g, ' ')
        document.execCommand('insertText', false, insert)
        onChange(readEditableText(e.currentTarget, multiline))
      }}
    />
  )
}

/**
 * Inline-editable text. Renders the plain value on the public site; a
 * contentEditable region (inheriting the surrounding typography) in the
 * builder canvas.
 */
export function EditableText({ value, update, ...rest }: EditableTextProps) {
  const edit = useBlockEdit()
  if (!edit) return <>{value}</>
  return (
    <EditableTextInner
      value={value}
      onChange={(next) => edit.updateBlock(update(next))}
      {...rest}
    />
  )
}

const InlineRichTextEditor = lazy(
  () => import('../canvas/InlineRichTextEditor'),
)

type EditableMarkdownProps = {
  value: string
  /** Produce the next block from the edited markdown. Only called in edit mode. */
  update: (markdown: string) => PageBlock
}

/**
 * Markdown body. Public site renders via CmsMarkdownBody; the builder canvas
 * lazy-loads a TipTap editor that round-trips to the same markdown subset.
 */
export function EditableMarkdown({ value, update }: EditableMarkdownProps) {
  const edit = useBlockEdit()
  if (!edit) return <CmsMarkdownBody markdown={value} />
  return (
    <Suspense fallback={<CmsMarkdownBody markdown={value} />}>
      <InlineRichTextEditor
        value={value}
        onChange={(markdown) => edit.updateBlock(update(markdown))}
      />
    </Suspense>
  )
}

/**
 * Hover controls for items inside a block (cards, sections, stats…).
 * Place inside a `relative` container with the `group/item` class.
 */
export function ItemControls({
  label,
  index,
  count,
  min = 1,
  onMove,
  onRemove,
}: {
  label: string
  index: number
  count: number
  min?: number
  onMove: (toIndex: number) => void
  onRemove: () => void
}) {
  const buttonClass =
    'focus-ring inline-flex h-6 w-6 items-center justify-center rounded border border-border-subtle bg-surface-card text-ink-muted hover:text-ink disabled:opacity-30'
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stops bubbling to block select only
    <span
      className="pb-item-controls absolute -top-2.5 right-2 z-20 hidden gap-1 rounded-md bg-surface-card/95 p-0.5 shadow-sm group-focus-within/item:inline-flex group-hover/item:inline-flex"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={buttonClass}
        aria-label={`Move ${label} up`}
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
      >
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label={`Move ${label} down`}
        disabled={index >= count - 1}
        onClick={() => onMove(index + 1)}
      >
        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${buttonClass} hover:text-accent-red`}
        aria-label={`Remove ${label}`}
        disabled={count <= min}
        onClick={onRemove}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </span>
  )
}

/** Dashed "add item" button shown at the end of editable item collections. */
export function AddItemButton({
  label,
  onAdd,
  className,
}: {
  label: string
  onAdd: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      className={`focus-ring inline-flex items-center gap-1.5 self-start rounded-lg border border-dashed border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-muted hover:border-accent-orange hover:text-ink ${className ?? ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onAdd()
      }}
    >
      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  )
}

/** Reorder an array immutably. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  if (moved === undefined) return items
  next.splice(to, 0, moved)
  return next
}

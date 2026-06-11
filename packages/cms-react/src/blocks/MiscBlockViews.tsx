import type { ImageBlock, ListBlock } from '@campaign/cms-core'
import {
  AddItemButton,
  EditableText,
  ItemControls,
  moveItem,
  useBlockEdit,
} from './editable'

export function ImageBlockView({ block }: { block: ImageBlock }) {
  const edit = useBlockEdit()

  return (
    <figure className="m-0">
      {block.src ? (
        <img
          src={block.src}
          alt={block.alt}
          className="h-auto w-full rounded-xl"
          loading="lazy"
        />
      ) : edit ? (
        <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-line-strong text-xs font-semibold text-ink-muted">
          No image — add one in block settings
        </div>
      ) : null}
      {block.caption || edit ? (
        <figcaption className="mt-2 text-sm text-ink-muted">
          <EditableText
            value={block.caption ?? ''}
            placeholder="Caption (optional)"
            update={(v) => ({ ...block, caption: v || undefined })}
          />
        </figcaption>
      ) : null}
    </figure>
  )
}

function focusListItem(blockId: string, index: number) {
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>(
      `[data-editable-id="${blockId}-item-${index}"]`,
    )
    el?.focus()
  })
}

export function ListBlockView({ block }: { block: ListBlock }) {
  const edit = useBlockEdit()
  const Tag = block.ordered ? 'ol' : 'ul'
  const listClass = block.ordered ? 'list-decimal' : 'list-disc'

  return (
    <section>
      {block.heading || edit ? (
        <h2 className="m-0 mb-4 text-2xl font-semibold text-ink">
          <EditableText
            value={block.heading ?? ''}
            placeholder="Heading (optional)"
            update={(v) => ({ ...block, heading: v || undefined })}
          />
        </h2>
      ) : null}
      <Tag className={`m-0 space-y-2 pl-5 text-ink-muted ${listClass}`}>
        {block.items.map((item, index) => (
          <li
            key={index}
            className={`leading-relaxed ${edit ? 'group/item relative' : ''}`}
          >
            {edit ? (
              <>
                <EditableText
                  value={item}
                  placeholder="List item"
                  editableId={`${block.id}-item-${index}`}
                  update={(v) => {
                    const items = [...block.items]
                    items[index] = v
                    return { ...block, items }
                  }}
                  onEnterKey={() => {
                    if (block.items.length >= 50) return
                    const items = [...block.items]
                    items.splice(index + 1, 0, 'New item')
                    edit.updateBlock({ ...block, items })
                    focusListItem(block.id, index + 1)
                  }}
                  onBackspaceEmpty={() => {
                    if (block.items.length <= 1) return
                    edit.updateBlock({
                      ...block,
                      items: block.items.filter((_, i) => i !== index),
                    })
                    focusListItem(block.id, Math.max(0, index - 1))
                  }}
                />
                <ItemControls
                  label="item"
                  index={index}
                  count={block.items.length}
                  onMove={(to) =>
                    edit.updateBlock({ ...block, items: moveItem(block.items, index, to) })
                  }
                  onRemove={() =>
                    edit.updateBlock({
                      ...block,
                      items: block.items.filter((_, i) => i !== index),
                    })
                  }
                />
              </>
            ) : (
              item
            )}
          </li>
        ))}
      </Tag>
      {edit && block.items.length < 50 ? (
        <AddItemButton
          label="Add item"
          className="mt-3"
          onAdd={() =>
            edit.updateBlock({ ...block, items: [...block.items, 'New item'] })
          }
        />
      ) : null}
    </section>
  )
}

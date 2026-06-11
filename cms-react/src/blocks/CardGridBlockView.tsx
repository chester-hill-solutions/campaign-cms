import { useId, useState } from 'react'

import type { CardGridBlock } from '@campaign/cms-core'
import { createBlockId } from '@campaign/cms-core'
import {
  AddItemButton,
  EditableText,
  ItemControls,
  moveItem,
  useBlockEdit,
} from './editable'
import { cardGridColumnClass } from './layoutClasses'
import { PlainTextBody } from './PlainTextBody'

export function CardGridBlockView({ block }: { block: CardGridBlock }) {
  const baseId = useId()
  const edit = useBlockEdit()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section aria-labelledby={block.heading ? `${baseId}-heading` : undefined}>
      {block.heading || edit ? (
        <h2 id={`${baseId}-heading`} className="m-0 mb-2 text-2xl font-semibold text-ink">
          <EditableText
            value={block.heading ?? ''}
            placeholder="Heading (optional)"
            update={(v) => ({ ...block, heading: v || undefined })}
          />
        </h2>
      ) : null}
      {block.subheading || edit ? (
        <p className="m-0 mb-6 text-base text-ink-muted">
          <EditableText
            value={block.subheading ?? ''}
            placeholder="Subheading (optional)"
            update={(v) => ({ ...block, subheading: v || undefined })}
          />
        </p>
      ) : null}
      <div className={`grid gap-4 ${cardGridColumnClass(block.columns)}`}>
        {block.cards.map((card, index) => {
          const hasExpand = Boolean(card.expandBody)
          const isExpanded = expandedId === card.id
          const updateCard = (patch: Partial<typeof card>) => {
            const cards = [...block.cards]
            cards[index] = { ...card, ...patch }
            return { ...block, cards }
          }
          return (
            <article
              key={card.id}
              className="group/item relative grid gap-2 rounded-xl border border-border-subtle bg-surface-elevated p-4 @sm:p-5"
            >
              {edit ? (
                <ItemControls
                  label="card"
                  index={index}
                  count={block.cards.length}
                  onMove={(to) =>
                    edit.updateBlock({ ...block, cards: moveItem(block.cards, index, to) })
                  }
                  onRemove={() =>
                    edit.updateBlock({
                      ...block,
                      cards: block.cards.filter((c) => c.id !== card.id),
                    })
                  }
                />
              ) : null}
              {card.iconSrc ? (
                <img src={card.iconSrc} alt="" className="h-12 w-12" aria-hidden="true" />
              ) : null}
              {card.imageSrc ? (
                <img src={card.imageSrc} alt="" className="mb-2 w-full rounded-lg" loading="lazy" />
              ) : null}
              <h3 className="m-0 text-lg font-semibold text-ink">
                <EditableText
                  value={card.title}
                  placeholder="Card title"
                  update={(v) => updateCard({ title: v })}
                />
              </h3>
              {card.body || edit ? (
                edit ? (
                  <p className="m-0 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                    <EditableText
                      value={card.body ?? ''}
                      multiline
                      placeholder="Card body (optional)"
                      update={(v) => updateCard({ body: v || undefined })}
                    />
                  </p>
                ) : (
                  <PlainTextBody
                    text={card.body ?? ''}
                    className="m-0 text-sm leading-relaxed text-ink-muted"
                  />
                )
              ) : null}
              {edit ? (
                <div className="grid gap-1 border-t border-dashed border-border-subtle pt-2">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink-muted">
                    Shown after “Learn more”
                  </span>
                  <p className="m-0 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                    <EditableText
                      value={card.expandBody ?? ''}
                      multiline
                      placeholder="Expanded content (optional)"
                      update={(v) => updateCard({ expandBody: v || undefined })}
                    />
                  </p>
                </div>
              ) : hasExpand ? (
                <>
                  <button
                    type="button"
                    className="focus-ring self-start text-sm font-semibold text-accent-orange underline"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedId(isExpanded ? null : card.id)}
                  >
                    {isExpanded ? 'Show less' : 'Learn more'}
                  </button>
                  {isExpanded && card.expandBody ? (
                    <PlainTextBody
                      text={card.expandBody}
                      className="m-0 text-sm leading-relaxed text-ink-muted"
                    />
                  ) : null}
                </>
              ) : null}
            </article>
          )
        })}
      </div>
      {edit && block.cards.length < 20 ? (
        <AddItemButton
          label="Add card"
          className="mt-3"
          onAdd={() =>
            edit.updateBlock({
              ...block,
              cards: [
                ...block.cards,
                { id: createBlockId('card'), title: 'New card', body: 'Card body' },
              ],
            })
          }
        />
      ) : null}
    </section>
  )
}

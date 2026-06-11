import { useId, useState } from 'react'

import type { AccordionBlock } from '@campaign/cms-core'
import { createBlockId } from '@campaign/cms-core'
import {
  AddItemButton,
  EditableMarkdown,
  EditableText,
  ItemControls,
  moveItem,
  useBlockEdit,
} from './editable'
import { RichTextBlockView } from './RichTextBlockView'

export function AccordionBlockView({ block }: { block: AccordionBlock }) {
  const baseId = useId()
  const edit = useBlockEdit()
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set())

  return (
    <section aria-labelledby={block.heading ? `${baseId}-heading` : undefined}>
      {block.heading || edit ? (
        <h2 id={`${baseId}-heading`} className="m-0 mb-4 text-2xl font-semibold text-ink">
          <EditableText
            value={block.heading ?? ''}
            placeholder="Heading (optional)"
            update={(v) => ({ ...block, heading: v || undefined })}
          />
        </h2>
      ) : null}
      <div className="grid gap-3">
        {block.sections.map((section, index) => {
          // All sections stay open while editing so content is reachable.
          const isOpen = edit ? true : openIds.has(section.id)
          const panelId = `${baseId}-${section.id}`

          if (edit) {
            return (
              <div
                key={section.id}
                className="group/item relative overflow-visible rounded-xl border border-border-subtle bg-surface-elevated"
              >
                <ItemControls
                  label="section"
                  index={index}
                  count={block.sections.length}
                  onMove={(to) =>
                    edit.updateBlock({
                      ...block,
                      sections: moveItem(block.sections, index, to),
                    })
                  }
                  onRemove={() =>
                    edit.updateBlock({
                      ...block,
                      sections: block.sections.filter((s) => s.id !== section.id),
                    })
                  }
                />
                <h3 className="m-0 px-4 py-3 text-base font-semibold text-ink @sm:px-5 @sm:py-4">
                  <EditableText
                    value={section.title}
                    placeholder="Section title"
                    update={(v) => {
                      const sections = [...block.sections]
                      sections[index] = { ...section, title: v }
                      return { ...block, sections }
                    }}
                  />
                </h3>
                <div className="border-t border-border-subtle px-4 py-3 @sm:px-5 @sm:py-4">
                  {section.imageSrc ? (
                    <img
                      src={section.imageSrc}
                      alt=""
                      className="mb-4 w-full rounded-lg"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="prose prose-sm max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed">
                    <EditableMarkdown
                      value={section.markdown}
                      update={(markdown) => {
                        const sections = [...block.sections]
                        sections[index] = { ...section, markdown }
                        return { ...block, sections }
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          }

          return (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated"
            >
              <h3 className="m-0">
                <button
                  type="button"
                  className="focus-ring flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-base font-semibold text-ink @sm:px-5 @sm:py-4"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => {
                    setOpenIds((prev) => {
                      const next = new Set(prev)
                      if (next.has(section.id)) next.delete(section.id)
                      else next.add(section.id)
                      return next
                    })
                  }}
                >
                  {section.title}
                  <span aria-hidden="true" className="text-accent-orange">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
              </h3>
              {isOpen ? (
                <div id={panelId} className="border-t border-border-subtle px-4 py-3 @sm:px-5 @sm:py-4">
                  {section.imageSrc ? (
                    <img
                      src={section.imageSrc}
                      alt=""
                      className="mb-4 w-full rounded-lg"
                      loading="lazy"
                    />
                  ) : null}
                  <RichTextBlockView
                    block={{
                      id: `${section.id}-body`,
                      type: 'richText',
                      layout: block.layout,
                      markdown: section.markdown,
                    }}
                  />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
      {edit && block.sections.length < 20 ? (
        <AddItemButton
          label="Add section"
          className="mt-3"
          onAdd={() =>
            edit.updateBlock({
              ...block,
              sections: [
                ...block.sections,
                {
                  id: createBlockId('sec'),
                  title: 'New section',
                  markdown: 'Section content.',
                },
              ],
            })
          }
        />
      ) : null}
    </section>
  )
}

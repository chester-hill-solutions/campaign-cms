import { sanitizeCustomHtml } from '@campaign/cms-core'
import type {
  CalloutBlock,
  CustomHtmlBlock,
  EmbedBlock,
  QuoteBlock,
  StatGridBlock,
  TimelineBlock,
} from '@campaign/cms-core'
import { createBlockId } from '@campaign/cms-core'
import {
  AddItemButton,
  EditableMarkdown,
  EditableText,
  ItemControls,
  moveItem,
  useBlockEdit,
} from './editable'
import { cardGridColumnClass } from './layoutClasses'

const CALLOUT_TONE_CLASSES: Record<CalloutBlock['tone'], string> = {
  neutral: 'border-border-subtle bg-surface-elevated',
  info: 'border-accent-green bg-[color-mix(in_oklab,var(--accent-green)_10%,var(--surface-card)_90%)]',
  warning:
    'border-accent-orange bg-[color-mix(in_oklab,var(--accent-orange)_12%,var(--surface-card)_88%)]',
  success:
    'border-accent-green bg-[color-mix(in_oklab,var(--accent-green)_14%,var(--surface-card)_86%)]',
}

const EMBED_ASPECT_CLASSES: Record<EmbedBlock['aspectRatio'], string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  auto: 'min-h-[240px]',
}

export function StatGridBlockView({ block }: { block: StatGridBlock }) {
  const edit = useBlockEdit()

  return (
    <section aria-labelledby={block.heading ? `stat-grid-${block.id}` : undefined}>
      {block.heading || edit ? (
        <h2 id={`stat-grid-${block.id}`} className="m-0 mb-2 text-2xl font-semibold text-ink">
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
        {block.stats.map((stat, index) => (
          <article
            key={stat.id}
            className="group/item relative rounded-xl border border-border-subtle bg-surface-elevated p-4 @sm:p-5"
          >
            {edit ? (
              <ItemControls
                label="stat"
                index={index}
                count={block.stats.length}
                onMove={(to) =>
                  edit.updateBlock({ ...block, stats: moveItem(block.stats, index, to) })
                }
                onRemove={() =>
                  edit.updateBlock({
                    ...block,
                    stats: block.stats.filter((s) => s.id !== stat.id),
                  })
                }
              />
            ) : null}
            <p className="m-0 text-2xl font-bold text-ink @sm:text-3xl">
              <EditableText
                value={stat.value}
                placeholder="Value"
                update={(v) => {
                  const stats = [...block.stats]
                  stats[index] = { ...stat, value: v }
                  return { ...block, stats }
                }}
              />
            </p>
            <p className="m-0 mt-1 text-sm font-semibold text-ink">
              <EditableText
                value={stat.label}
                placeholder="Label"
                update={(v) => {
                  const stats = [...block.stats]
                  stats[index] = { ...stat, label: v }
                  return { ...block, stats }
                }}
              />
            </p>
            {stat.note || edit ? (
              <p className="m-0 mt-2 text-sm leading-relaxed text-ink-muted">
                <EditableText
                  value={stat.note ?? ''}
                  placeholder="Note (optional)"
                  update={(v) => {
                    const stats = [...block.stats]
                    stats[index] = { ...stat, note: v || undefined }
                    return { ...block, stats }
                  }}
                />
              </p>
            ) : null}
            {stat.source || edit ? (
              <p className="m-0 mt-1 text-xs text-ink-muted">
                Source:{' '}
                <EditableText
                  value={stat.source ?? ''}
                  placeholder="(optional)"
                  update={(v) => {
                    const stats = [...block.stats]
                    stats[index] = { ...stat, source: v || undefined }
                    return { ...block, stats }
                  }}
                />
              </p>
            ) : null}
          </article>
        ))}
      </div>
      {edit && block.stats.length < 12 ? (
        <AddItemButton
          label="Add stat"
          className="mt-3"
          onAdd={() =>
            edit.updateBlock({
              ...block,
              stats: [
                ...block.stats,
                { id: createBlockId('stat'), value: '0', label: 'New stat' },
              ],
            })
          }
        />
      ) : null}
    </section>
  )
}

export function TimelineBlockView({ block }: { block: TimelineBlock }) {
  const edit = useBlockEdit()

  return (
    <section aria-labelledby={block.heading ? `timeline-${block.id}` : undefined}>
      {block.heading || edit ? (
        <h2 id={`timeline-${block.id}`} className="m-0 mb-6 text-2xl font-semibold text-ink">
          <EditableText
            value={block.heading ?? ''}
            placeholder="Heading (optional)"
            update={(v) => ({ ...block, heading: v || undefined })}
          />
        </h2>
      ) : null}
      <ol className="m-0 grid gap-6 border-l-2 border-accent-orange pl-6">
        {block.items.map((item, index) => (
          <li key={item.id} className="group/item relative">
            <span
              className="absolute -left-[calc(1.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-orange"
              aria-hidden="true"
            />
            {edit ? (
              <ItemControls
                label="milestone"
                index={index}
                count={block.items.length}
                onMove={(to) =>
                  edit.updateBlock({ ...block, items: moveItem(block.items, index, to) })
                }
                onRemove={() =>
                  edit.updateBlock({
                    ...block,
                    items: block.items.filter((i) => i.id !== item.id),
                  })
                }
              />
            ) : null}
            {item.phase || edit ? (
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-accent-orange">
                <EditableText
                  value={item.phase ?? ''}
                  placeholder="Phase (optional)"
                  update={(v) => {
                    const items = [...block.items]
                    items[index] = { ...item, phase: v || undefined }
                    return { ...block, items }
                  }}
                />
              </p>
            ) : null}
            <h3 className="m-0 mt-1 text-lg font-semibold text-ink">
              <EditableText
                value={item.title}
                placeholder="Milestone title"
                update={(v) => {
                  const items = [...block.items]
                  items[index] = { ...item, title: v }
                  return { ...block, items }
                }}
              />
            </h3>
            {item.dateLabel || edit ? (
              <p className="m-0 mt-1 text-sm text-ink-muted">
                <EditableText
                  value={item.dateLabel ?? ''}
                  placeholder="Date (optional)"
                  update={(v) => {
                    const items = [...block.items]
                    items[index] = { ...item, dateLabel: v || undefined }
                    return { ...block, items }
                  }}
                />
              </p>
            ) : null}
            {item.bodyMarkdown || edit ? (
              <div className="prose prose-sm mt-2 max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed">
                <EditableMarkdown
                  value={item.bodyMarkdown ?? ''}
                  update={(md) => {
                    const items = [...block.items]
                    items[index] = { ...item, bodyMarkdown: md || undefined }
                    return { ...block, items }
                  }}
                />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      {edit && block.items.length < 20 ? (
        <AddItemButton
          label="Add milestone"
          className="ml-6 mt-3"
          onAdd={() =>
            edit.updateBlock({
              ...block,
              items: [...block.items, { id: createBlockId('tl'), title: 'New milestone' }],
            })
          }
        />
      ) : null}
    </section>
  )
}

export function CalloutBlockView({ block }: { block: CalloutBlock }) {
  const edit = useBlockEdit()
  const tone = block.tone ?? 'neutral'
  return (
    <aside
      className={`rounded-xl border p-4 @sm:p-6 ${CALLOUT_TONE_CLASSES[tone]}`}
      role="note"
    >
      {block.heading || edit ? (
        <h3 className="m-0 mb-2 text-lg font-semibold text-ink">
          <EditableText
            value={block.heading ?? ''}
            placeholder="Heading (optional)"
            update={(v) => ({ ...block, heading: v || undefined })}
          />
        </h3>
      ) : null}
      <div className="prose prose-sm max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed">
        <EditableMarkdown
          value={block.markdown}
          update={(markdown) => ({ ...block, markdown })}
        />
      </div>
    </aside>
  )
}

export function EmbedBlockView({ block }: { block: EmbedBlock }) {
  const edit = useBlockEdit()
  const aspectRatio = block.aspectRatio ?? '16:9'
  return (
    <figure className="m-0">
      <div className={`relative w-full overflow-hidden rounded-xl ${EMBED_ASPECT_CLASSES[aspectRatio]}`}>
        <iframe
          src={block.src}
          title={block.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {edit ? (
          // Keeps canvas clicks selecting the block instead of the iframe.
          <div className="absolute inset-0 z-10" aria-hidden="true" />
        ) : null}
      </div>
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

export function CustomHtmlBlockView({ block }: { block: CustomHtmlBlock }) {
  const edit = useBlockEdit()
  const sanitized = sanitizeCustomHtml(block.html)
  const inner = (
    <div
      className="cms-custom-html prose prose-sm max-w-none @sm:prose-base"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
  if (!edit) return inner
  return (
    <div className="relative">
      <p className="m-0 mb-2 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-muted">
        Custom HTML — edit in block settings
      </p>
      {inner}
      <div className="absolute inset-0 z-10" aria-hidden="true" />
    </div>
  )
}

export function QuoteBlockView({ block }: { block: QuoteBlock }) {
  const edit = useBlockEdit()
  return (
    <blockquote className="border-l-4 border-accent-orange pl-4">
      <p className="m-0 text-lg italic leading-relaxed text-ink">
        &ldquo;
        <EditableText
          value={block.text}
          multiline
          placeholder="Quote"
          update={(v) => ({ ...block, text: v })}
        />
        &rdquo;
      </p>
      {block.attribution || edit ? (
        <footer className="mt-2 text-sm text-ink-muted">
          —{' '}
          <EditableText
            value={block.attribution ?? ''}
            placeholder="Attribution (optional)"
            update={(v) => ({ ...block, attribution: v || undefined })}
          />
        </footer>
      ) : null}
    </blockquote>
  )
}

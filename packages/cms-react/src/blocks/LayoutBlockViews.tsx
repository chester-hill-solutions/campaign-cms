import type {
  ColumnsBlock,
  DividerBlock,
  SectionHeaderBlock,
  SpacerBlock,
  TwoUpBlock,
} from '@campaign/cms-core'
import { BlockCtaRow } from './BlockCtaLink'
import { EditableMarkdown, EditableText, useBlockEdit } from './editable'
import { PlainTextBody } from './PlainTextBody'

export function SectionHeaderBlockView({ block }: { block: SectionHeaderBlock }) {
  const edit = useBlockEdit()
  const HeadingTag = block.level === 'h3' ? 'h3' : 'h2'
  const headingClass =
    block.level === 'h3'
      ? 'm-0 text-xl font-semibold text-ink @sm:text-2xl'
      : 'm-0 text-2xl font-semibold text-ink @sm:text-3xl'

  return (
    <section id={block.anchorId} aria-labelledby={`section-header-${block.id}`}>
      {block.kicker || edit ? (
        <p className="island-kicker m-0">
          <EditableText
            value={block.kicker ?? ''}
            placeholder="Kicker"
            update={(v) => ({ ...block, kicker: v || undefined })}
          />
        </p>
      ) : null}
      <HeadingTag id={`section-header-${block.id}`} className={headingClass}>
        <EditableText
          value={block.heading}
          placeholder="Section heading"
          update={(v) => ({ ...block, heading: v })}
        />
      </HeadingTag>
      {block.dek || edit ? (
        <p className="m-0 mt-2 text-base leading-relaxed text-ink-muted @sm:text-lg">
          <EditableText
            value={block.dek ?? ''}
            placeholder="Dek (optional)"
            update={(v) => ({ ...block, dek: v || undefined })}
          />
        </p>
      ) : null}
      {block.body || edit ? (
        edit ? (
          <p className="m-0 mt-3 text-base leading-relaxed text-ink-muted">
            <EditableText
              value={block.body ?? ''}
              multiline
              placeholder="Body (optional)"
              update={(v) => ({ ...block, body: v || undefined })}
            />
          </p>
        ) : (
          <PlainTextBody
            text={block.body ?? ''}
            className="m-0 mt-3 text-base leading-relaxed text-ink-muted"
          />
        )
      ) : null}
    </section>
  )
}

export function TwoUpBlockView({ block }: { block: TwoUpBlock }) {
  const edit = useBlockEdit()
  const imagePosition = block.imagePosition ?? 'right'
  const hasImage = Boolean(block.imageSrc)
  const ctas = [block.primaryCta, block.secondaryCta].filter(
    (cta): cta is NonNullable<typeof cta> => Boolean(cta),
  )

  const textContent = (
    <div className="min-w-0">
      {block.kicker || edit ? (
        <p className="island-kicker m-0">
          <EditableText
            value={block.kicker ?? ''}
            placeholder="Kicker"
            update={(v) => ({ ...block, kicker: v || undefined })}
          />
        </p>
      ) : null}
      {block.heading || edit ? (
        <h2 className="m-0 mt-2 text-2xl font-semibold text-ink @sm:text-3xl">
          <EditableText
            value={block.heading ?? ''}
            placeholder="Heading"
            update={(v) => ({ ...block, heading: v || undefined })}
          />
        </h2>
      ) : null}
      {block.bodyMarkdown || edit ? (
        <div className="prose prose-sm mt-4 max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed">
          <EditableMarkdown
            value={block.bodyMarkdown ?? ''}
            update={(bodyMarkdown) => ({
              ...block,
              bodyMarkdown: bodyMarkdown || undefined,
            })}
          />
        </div>
      ) : null}
      {ctas.length > 0 ? (
        <div className="mt-5">
          <BlockCtaRow ctas={ctas} />
        </div>
      ) : null}
    </div>
  )

  const imageContent = hasImage ? (
    <figure className="m-0">
      <img
        src={block.imageSrc}
        alt={block.imageAlt ?? ''}
        className="h-auto w-full rounded-xl"
        loading="lazy"
      />
      {block.imageCaption || edit ? (
        <figcaption className="mt-2 text-sm text-ink-muted">
          <EditableText
            value={block.imageCaption ?? ''}
            placeholder="Caption (optional)"
            update={(v) => ({ ...block, imageCaption: v || undefined })}
          />
        </figcaption>
      ) : null}
    </figure>
  ) : edit ? (
    <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-line-strong text-xs font-semibold text-ink-muted">
      No image — add one in block settings
    </div>
  ) : null

  return (
    <section className="grid gap-8 @sm:grid-cols-2 @sm:items-start">
      {imagePosition === 'left' ? (
        <>
          {imageContent}
          {textContent}
        </>
      ) : (
        <>
          {textContent}
          {imageContent}
        </>
      )}
    </section>
  )
}

export function SpacerBlockView({ block }: { block: SpacerBlock }) {
  const sizeClass =
    block.size === 'small' ? 'h-4' : block.size === 'large' ? 'h-16' : 'h-8'
  return <div className={sizeClass} aria-hidden="true" />
}

export function ColumnsBlockView({ block }: { block: ColumnsBlock }) {
  const gridClass =
    block.columnCount === 3
      ? 'grid-cols-1 @md:grid-cols-3'
      : 'grid-cols-1 @md:grid-cols-2'

  return (
    <div className={`grid gap-6 ${gridClass}`}>
      {block.columns.map((col, index) => (
        <div
          key={index}
          className="prose prose-sm max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed"
        >
          <EditableMarkdown
            value={col.markdown}
            update={(markdown) => {
              const columns = [...block.columns]
              columns[index] = { markdown }
              return { ...block, columns }
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function DividerBlockView(_props: { block: DividerBlock }) {
  return <hr className="border-0 border-t border-border-subtle" />
}

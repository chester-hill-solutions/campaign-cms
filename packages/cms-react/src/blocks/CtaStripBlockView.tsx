import type { CtaStripBlock } from '@campaign/cms-core'
import { BlockCtaRow } from './BlockCtaLink'
import { EditableText, useBlockEdit } from './editable'
import { PlainTextBody } from './PlainTextBody'

export function CtaStripBlockView({ block }: { block: CtaStripBlock }) {
  const edit = useBlockEdit()
  const ctas = [block.primaryCta, block.secondaryCta].filter(
    (cta): cta is NonNullable<typeof cta> => Boolean(cta),
  )

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface-elevated p-6 @sm:p-8">
      <h2 className="m-0 text-2xl font-semibold text-ink">
        <EditableText
          value={block.headline}
          placeholder="Headline"
          update={(v) => ({ ...block, headline: v })}
        />
      </h2>
      {block.body || edit ? (
        edit ? (
          <p className="mt-3 whitespace-pre-line text-base text-ink-muted">
            <EditableText
              value={block.body ?? ''}
              multiline
              placeholder="Supporting text (optional)"
              update={(v) => ({ ...block, body: v || undefined })}
            />
          </p>
        ) : (
          <PlainTextBody text={block.body ?? ''} className="mt-3 text-base text-ink-muted" />
        )
      ) : null}
      <div className="mt-5">
        {edit && ctas.length === 0 ? (
          <p className="m-0 text-xs font-semibold text-ink-muted">
            Add buttons in block settings
          </p>
        ) : (
          <BlockCtaRow ctas={ctas} />
        )}
      </div>
    </section>
  )
}

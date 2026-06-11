import type { HeroBlock } from '@campaign/cms-core'

import { useCmsUi } from '../context'
import { BlockCtaRow } from './BlockCtaLink'
import { EditableText, useBlockEdit } from './editable'
import { PlainTextBody } from './PlainTextBody'

function heroLayoutClasses(block: HeroBlock): {
  grid: string
  text: string
  figure: string
} {
  const imagePosition = block.imagePosition ?? 'right'
  const mobileImagePosition = block.mobileImagePosition ?? 'bottom'

  const grid = [
    'hero-block__grid',
    imagePosition === 'left' ? 'hero-block__grid--image-left' : 'hero-block__grid--image-right',
  ].join(' ')

  const mobileOrder =
    mobileImagePosition === 'top'
      ? { text: 'hero-block__text--mobile-after', figure: 'hero-block__figure--mobile-first' }
      : { text: 'hero-block__text--mobile-first', figure: 'hero-block__figure--mobile-after' }

  return {
    grid,
    text: ['hero-block__text relative z-10 min-w-0', mobileOrder.text].join(' '),
    figure: ['hero-block__figure relative z-10 m-0 min-w-0', mobileOrder.figure].join(' '),
  }
}

export function HeroBlockView({ block }: { block: HeroBlock }) {
  const edit = useBlockEdit()
  const { heroFallbackPortrait } = useCmsUi()
  const portraitSrc = block.portraitSrc ?? heroFallbackPortrait?.src
  const portraitAlt = block.portraitAlt ?? heroFallbackPortrait?.alt ?? ''
  const ctas = [block.primaryCta, block.secondaryCta, block.tertiaryCta].filter(
    (cta): cta is NonNullable<typeof cta> => Boolean(cta),
  )
  const layout = heroLayoutClasses(block)

  const textContent = (
    <div className={layout.text}>
      {block.kicker || edit ? (
        <p className="island-kicker m-0">
          <EditableText
            value={block.kicker ?? ''}
            placeholder="Kicker"
            update={(v) => ({ ...block, kicker: v || undefined })}
          />
        </p>
      ) : null}
      <h1
        id={`hero-heading-${block.id}`}
        className="display-title m-0 mt-3 text-3xl text-ink @sm:text-4xl"
      >
        <EditableText
          value={block.heading}
          placeholder="Heading"
          update={(v) => ({ ...block, heading: v })}
        />
      </h1>
      {block.subhead || edit ? (
        <p className="m-0 mt-3 text-base leading-relaxed text-ink-muted @sm:text-lg">
          <EditableText
            value={block.subhead ?? ''}
            placeholder="Subhead (optional)"
            update={(v) => ({ ...block, subhead: v || undefined })}
          />
        </p>
      ) : null}
      {block.body || edit ? (
        <div className="prose prose-sm mb-6 mt-4 max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed prose-p:whitespace-pre-line">
          {edit ? (
            <p className="m-0">
              <EditableText
                value={block.body ?? ''}
                multiline
                placeholder="Body (optional)"
                update={(v) => ({ ...block, body: v || undefined })}
              />
            </p>
          ) : (
            <PlainTextBody text={block.body ?? ''} className="m-0" />
          )}
        </div>
      ) : null}
      <BlockCtaRow ctas={ctas} />
    </div>
  )

  const imageContent = (
    <figure className={layout.figure}>
      <div
        className="hero-block__portrait"
        style={
          block.backgroundSrc
            ? {
                backgroundImage: `url(${block.backgroundSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {block.backgroundSrc ? (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[color-mix(in_oklab,var(--surface-page)_88%,transparent)]"
            aria-hidden="true"
          />
        ) : (
          <div className="frank-hero-stack frank-hero-stack--portrait" aria-hidden="true">
            <div className="frank-hero-stack__solid frank-hero-stack__solid--peach" />
            <div className="frank-hero-stack__solid frank-hero-stack__solid--red" />
            <div className="frank-hero-stack__solid frank-hero-stack__solid--orange" />
          </div>
        )}
        <div className="hero-block__portrait-frame relative z-10 overflow-hidden rounded-2xl border-2 border-[color-mix(in_oklab,var(--line-strong)_55%,var(--accent-green)_45%)] bg-secondary-dark shadow-[3px_3px_0_color-mix(in_oklab,var(--accent-green)_32%,var(--secondary-dark)_68%)]">
          {portraitSrc ? (
            <img
              src={portraitSrc}
              alt={portraitAlt}
              width={heroFallbackPortrait?.width}
              height={heroFallbackPortrait?.height}
              srcSet={block.portraitSrc ? undefined : heroFallbackPortrait?.srcSet}
              sizes={heroFallbackPortrait?.sizes}
              className="aspect-[4/5] h-auto w-full object-cover object-[center_12%]"
              decoding="async"
              fetchPriority="high"
            />
          ) : null}
        </div>
      </div>
    </figure>
  )

  return (
    <section className="rise-in" aria-labelledby={`hero-heading-${block.id}`}>
      <div className={layout.grid}>
        {textContent}
        {imageContent}
      </div>
    </section>
  )
}

export { heroLayoutClasses }

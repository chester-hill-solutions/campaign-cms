import type { BlockCta } from '@campaign/cms-core'

export function BlockCtaLink({ cta, variant = 'primary' }: { cta: BlockCta; variant?: 'primary' | 'secondary' }) {
  const isExternal = cta.external ?? /^https?:\/\//.test(cta.href)
  const className =
    variant === 'primary'
      ? 'focus-ring inline-flex min-h-11 items-center justify-center rounded-full border-2 border-accent-green bg-accent-orange px-5 py-3 text-center text-sm font-bold leading-snug text-primary-dark no-underline shadow-[4px_4px_0_color-mix(in_oklab,var(--accent-green)_42%,transparent)] transition hover:-translate-y-0.5 hover:brightness-[1.04] @sm:px-7 @sm:text-base'
      : 'focus-ring inline-flex min-h-11 items-center justify-center rounded-full border-2 border-line-strong bg-[color-mix(in_oklab,var(--surface-card-strong)_55%,transparent)] px-5 py-3 text-center text-sm font-semibold leading-snug text-ink no-underline transition hover:border-accent-green @sm:px-7 @sm:text-base'

  if (isExternal) {
    return (
      <a href={cta.href} className={className} target="_blank" rel="noopener noreferrer">
        {cta.label}
      </a>
    )
  }

  if (cta.href.startsWith('#')) {
    return (
      <a href={cta.href} className={className}>
        {cta.label}
      </a>
    )
  }

  return (
    <a href={cta.href} className={className}>
      {cta.label}
    </a>
  )
}

export function BlockCtaRow({ ctas }: { ctas: BlockCta[] }) {
  if (ctas.length === 0) return null
  return (
    <div className="flex max-w-lg flex-col gap-3 @sm:max-w-none @sm:flex-row @sm:flex-wrap">
      {ctas.map((cta, index) => (
        <BlockCtaLink key={`${cta.label}-${index}`} cta={cta} variant={index === 0 ? 'primary' : 'secondary'} />
      ))}
    </div>
  )
}

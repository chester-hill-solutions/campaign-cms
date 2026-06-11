type PlainTextBodyProps = {
  text: string
  className?: string
}

/** Plain CMS copy from textarea fields — preserves single line breaks. */
export function PlainTextBody({ text, className }: PlainTextBodyProps) {
  return (
    <p className={className ?? 'm-0 whitespace-pre-line leading-relaxed'}>{text}</p>
  )
}

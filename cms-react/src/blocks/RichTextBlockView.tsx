import type { RichTextBlock } from '@campaign/cms-core'
import { EditableMarkdown } from './editable'

export function RichTextBlockView({ block }: { block: RichTextBlock }) {
  return (
    <section id={block.anchorId} className="prose prose-sm max-w-none text-ink-muted @sm:prose-base prose-p:leading-relaxed prose-li:leading-relaxed prose-strong:text-ink">
      <EditableMarkdown
        value={block.markdown}
        update={(markdown) => ({ ...block, markdown })}
      />
    </section>
  )
}

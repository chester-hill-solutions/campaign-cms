import type { ReactNode } from 'react'

export function renderCmsInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      nodes.push(<em key={`${match.index}-em`}>{token.slice(1, -1)}</em>)
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
      if (linkMatch) {
        const [, label, href] = linkMatch
        const external = href.startsWith('http')
        nodes.push(
          <a
            key={`${match.index}-link`}
            href={href}
            className="text-accent-orange underline-offset-2 hover:underline"
            {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          >
            {label}
          </a>,
        )
      } else {
        nodes.push(token)
      }
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith('|') && line.trim().endsWith('|')
}

function isTableDivider(line: string): boolean {
  return /^\|\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|$/.test(line.trim())
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim())
}

type Block =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }

function parseMarkdownBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? ''

    if (!line || line === '---') {
      index += 1
      continue
    }

    if (line.startsWith('# ') && !line.startsWith('## ')) {
      index += 1
      while (index < lines.length && lines[index]?.trim() && !lines[index]?.startsWith('## ')) {
        index += 1
      }
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: line.slice(3).trim() })
      index += 1
      continue
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, text: line.slice(4).trim() })
      index += 1
      continue
    }

    if (isTableRow(line)) {
      const headers = parseTableRow(line)
      index += 1
      if (lines[index] && isTableDivider(lines[index])) {
        index += 1
      }
      const rows: string[][] = []
      while (index < lines.length && isTableRow(lines[index] ?? '')) {
        rows.push(parseTableRow(lines[index] ?? ''))
        index += 1
      }
      blocks.push({ type: 'table', headers, rows })
      continue
    }

    if (line.startsWith('- ')) {
      const items: string[] = []
      while (index < lines.length && (lines[index]?.trim().startsWith('- ') ?? false)) {
        items.push((lines[index] ?? '').trim().slice(2))
        index += 1
      }
      blocks.push({ type: 'list', ordered: false, items })
      continue
    }

    const orderedMatch = /^(\d+)\.\s+(.+)$/.exec(line)
    if (orderedMatch) {
      const items: string[] = []
      while (index < lines.length) {
        const current = lines[index]?.trim() ?? ''
        const itemMatch = /^(\d+)\.\s+(.+)$/.exec(current)
        if (!itemMatch) break
        items.push(itemMatch[2])
        index += 1
      }
      blocks.push({ type: 'list', ordered: true, items })
      continue
    }

    const paragraphLines: string[] = [line]
    index += 1
    while (
      index < lines.length &&
      (lines[index]?.trim() ?? '') &&
      lines[index]?.trim() !== '---' &&
      !lines[index]?.startsWith('#') &&
      !(lines[index]?.trim().startsWith('- ') ?? false) &&
      !isTableRow(lines[index] ?? '') &&
      !/^(\d+)\.\s+/.test(lines[index]?.trim() ?? '')
    ) {
      paragraphLines.push(lines[index]?.trim() ?? '')
      index += 1
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join('\n') })
  }

  return blocks
}

export function CmsMarkdownBody({ markdown }: { markdown: string }) {
  const blocks = parseMarkdownBlocks(markdown)

  return (
    <>
      {blocks.map((block, blockIndex) => {
        switch (block.type) {
          case 'heading':
            if (block.level === 2) {
              return (
                <h2 key={blockIndex} className="display-title mt-8 text-2xl text-ink first:mt-0">
                  {block.text}
                </h2>
              )
            }
            return (
              <h3 key={blockIndex} className="mt-6 text-lg font-semibold text-ink">
                {block.text}
              </h3>
            )
          case 'paragraph':
            if (block.text.startsWith('*') && block.text.endsWith('*')) {
              return (
                <p key={blockIndex} className="text-sm italic">
                  {block.text.slice(1, -1)}
                </p>
              )
            }
            if (block.text.startsWith('> ')) {
              return (
                <blockquote
                  key={blockIndex}
                  className="border-l-4 border-accent-orange pl-4 text-ink-muted"
                >
                  {renderCmsInline(block.text.slice(2))}
                </blockquote>
              )
            }
            return (
              <p key={blockIndex} className="whitespace-pre-line">
                {renderCmsInline(block.text)}
              </p>
            )
          case 'list':
            if (block.ordered) {
              return (
                <ol key={blockIndex} className="list-decimal space-y-2 pl-6">
                  {block.items.map((item) => (
                    <li key={item.slice(0, 24)}>{renderCmsInline(item)}</li>
                  ))}
                </ol>
              )
            }
            return (
              <ul key={blockIndex} className="list-disc space-y-2 pl-6">
                {block.items.map((item) => (
                  <li key={item.slice(0, 24)}>{renderCmsInline(item)}</li>
                ))}
              </ul>
            )
          case 'table':
            return (
              <div key={blockIndex} className="overflow-x-auto">
                <table className="w-full min-w-[32rem] border-collapse text-sm">
                  <thead>
                    <tr>
                      {block.headers.map((header) => (
                        <th
                          key={header}
                          className="border-b border-line-strong px-3 py-2 text-left font-semibold text-ink"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join('|')} className="border-b border-border-subtle">
                        {row.map((cell, cellIndex) => (
                          <td key={`${row.join('|')}-${cellIndex}`} className="px-3 py-2 align-top">
                            {renderCmsInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default: {
            const _exhaustive: never = block
            return _exhaustive
          }
        }
      })}
    </>
  )
}

import type { z } from 'zod'

import { pageDocPayloadSchema } from './blockSchemas'
import type { PageMeta } from './pageBlockOps'

export type PageDocValidation = {
  ok: boolean
  byBlock: ReadonlyMap<string, string[]>
  page: string[]
}

const FIELD_LABELS: Record<string, string> = {
  seoTitle: 'SEO title',
  seoDescription: 'SEO description',
  navLabel: 'Nav label',
  bodyMarkdown: 'Body',
  expandBody: 'Expanded content',
}

function friendlyMessage(issue: z.core.$ZodIssue): string {
  if (issue.code === 'too_small') return 'is required'
  if (issue.code === 'too_big') return `is too long (max ${String(issue.maximum)})`
  return issue.message
}

function fieldLabel(path: PropertyKey[]): string {
  const parts = path
    .filter((part) => typeof part === 'string')
    .map((part) => FIELD_LABELS[part] ?? part)
  return parts.join(' ')
}

/**
 * Client-side validation matching the server's save schema, with zod issues
 * mapped to block ids so errors can badge the offending canvas blocks.
 */
export function validatePageDoc(content: PageMeta): PageDocValidation {
  const parsed = pageDocPayloadSchema.safeParse({
    kind: 'pageDoc',
    version: 1,
    ...content,
  })
  if (parsed.success) return { ok: true, byBlock: new Map(), page: [] }

  const byBlock = new Map<string, string[]>()
  const page: string[] = []

  for (const issue of parsed.error.issues) {
    if (issue.path[0] === 'blocks' && typeof issue.path[1] === 'number') {
      const block = content.blocks[issue.path[1]]
      const label = fieldLabel(issue.path.slice(2)) || 'Block'
      const message = `${label} ${friendlyMessage(issue)}`
      if (block) {
        byBlock.set(block.id, [...(byBlock.get(block.id) ?? []), message])
        continue
      }
      page.push(message)
      continue
    }
    const label = fieldLabel(issue.path) || 'Page'
    page.push(`${label} ${friendlyMessage(issue)}`)
  }

  return { ok: false, byBlock, page }
}

import { createBlockId, DEFAULT_BLOCK_LAYOUT, type PageDocPayload } from './blockSchemas'
import { normalizeCmsSlug } from './slugs'

export const DYNAMIC_PAGE_ENTRY_PREFIX = 'page-' as const

/** True for known fixed pageDoc entry ids and dynamically created `page-*` ids. */
export function isPageDocEntryId(
  entryId: string,
  knownEntryIds: ReadonlySet<string>,
): boolean {
  if (knownEntryIds.has(entryId)) return true
  return (
    entryId.startsWith(DYNAMIC_PAGE_ENTRY_PREFIX) &&
    entryId.length > DYNAMIC_PAGE_ENTRY_PREFIX.length
  )
}

export function entryIdFromPageSlug(slug: string): string {
  const normalized = normalizeCmsSlug(slug)
  const base = normalized
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${DYNAMIC_PAGE_ENTRY_PREFIX}${base || createBlockId('page').slice(4)}`
}

export type NewPageSeoDefaults = {
  /** e.g. (title) => `${title} | Candidate Name` */
  seoTitle: (title: string) => string
  seoDescription: (title: string) => string
}

export function defaultNewPageDoc(
  input: { title: string; slug: string; navLabel?: string },
  seo: NewPageSeoDefaults,
): Omit<PageDocPayload, 'kind' | 'version'> {
  const slug = normalizeCmsSlug(input.slug)
  const title = input.title.trim()
  const navLabel = input.navLabel?.trim() || title

  return {
    slug,
    title,
    enabled: 0,
    showInNav: 0,
    navLabel,
    seoTitle: seo.seoTitle(title),
    seoDescription: seo.seoDescription(title),
    blocks: [
      {
        id: createBlockId(),
        type: 'richText',
        layout: DEFAULT_BLOCK_LAYOUT,
        markdown: `## ${title}\n\nStart editing this page in the block builder.`,
      },
    ],
  }
}

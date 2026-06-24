import {
  defaultNewPageDoc as coreDefaultNewPageDoc,
  entryIdFromPageSlug,
  type PageDocPayload,
} from '@chester-hill-solutions/cms-core'

export { entryIdFromPageSlug }

const SEO = {
  seoTitle: (title: string) => `${title} | Campaign CMS Example`,
  seoDescription: (title: string) => `${title} — a minimal Campaign CMS demo site.`,
}

export function defaultNewPageDoc(input: {
  title: string
  slug: string
}): Omit<PageDocPayload, 'kind' | 'version'> {
  return coreDefaultNewPageDoc(input, SEO)
}

export { validateNewPageSlug } from './cmsPagePath'

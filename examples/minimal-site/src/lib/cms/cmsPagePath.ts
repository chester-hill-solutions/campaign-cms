import {
  cmsPagePublicPath,
  isReservedCmsSlug as coreIsReservedCmsSlug,
  normalizeCmsSlug,
  validateNewPageSlug as coreValidateNewPageSlug,
} from '@campaign/cms-core'

export const CMS_RESERVED_PATH_PREFIXES = new Set(['admin', 'api', 'media'])

export { cmsPagePublicPath, normalizeCmsSlug }

export function isReservedCmsSlug(slug: string): boolean {
  return coreIsReservedCmsSlug(slug, CMS_RESERVED_PATH_PREFIXES)
}

export function validateNewPageSlug(slug: string): string | null {
  return coreValidateNewPageSlug(slug, CMS_RESERVED_PATH_PREFIXES)
}

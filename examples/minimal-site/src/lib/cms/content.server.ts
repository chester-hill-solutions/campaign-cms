import { env } from 'cloudflare:workers'

import { pageDocPayloadSchema } from '@campaign/cms-core'
import { createCmsStore } from '@campaign/cms-server'

import { defaultNewPageDoc, entryIdFromPageSlug, validateNewPageSlug } from './pageDocEntry'

function parsePayload(raw: unknown) {
  const parsed = pageDocPayloadSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

const store = createCmsStore(() => ({ db: env.DB, media: env.MEDIA }), {
  parsePayload,
  newPageDoc: defaultNewPageDoc,
  validateNewPageSlug,
  entryIdFromPageSlug,
})

export const {
  getPublishedPageDocBySlug,
  getPageDocEditorState,
  savePageDocDraft,
  publishEntry,
  streamMediaFromR2,
  listMediaAssets,
  uploadMediaAsset,
} = store

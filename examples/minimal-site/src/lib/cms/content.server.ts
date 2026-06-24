import { env } from 'cloudflare:workers'

import { pageDocPayloadSchema } from '@chester-hill-solutions/cms-core'
import { createCmsStore } from '@chester-hill-solutions/cms-server'

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

/** Full store instance — used by the agent tool layer (see agent.server.ts). */
export const cmsStore = store

export const {
  getPublishedPageDocBySlug,
  getPageDocEditorState,
  savePageDocDraft,
  publishEntry,
  streamMediaFromR2,
  listMediaAssets,
  uploadMediaAsset,
} = store

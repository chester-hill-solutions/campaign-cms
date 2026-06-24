import { createServerFn } from '@tanstack/react-start'

import type { PageDocPayload } from '@chester-hill-solutions/cms-core'

import {
  getPageDocEditorState,
  getPublishedPageDocBySlug,
  publishEntry,
  savePageDocDraft,
} from '../lib/cms/content.server'

export const loadPublicPageFn = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => getPublishedPageDocBySlug(slug))

export const loadEditorStateFn = createServerFn({ method: 'GET' })
  .inputValidator((entryId: string) => entryId)
  .handler(async ({ data: entryId }) => getPageDocEditorState(entryId))

export const saveDraftFn = createServerFn({ method: 'POST' })
  .inputValidator((input: { entryId: string; payload: PageDocPayload }) => input)
  .handler(async ({ data }) => {
    const { kind: _k, version: _v, ...content } = data.payload
    return savePageDocDraft(data.entryId, content)
  })

export const publishPageFn = createServerFn({ method: 'POST' })
  .inputValidator((entryId: string) => entryId)
  .handler(async ({ data: entryId }) => publishEntry(entryId))

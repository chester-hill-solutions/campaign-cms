import { createServerFn } from '@tanstack/react-start'

import {
  getPageDocEditorState,
  getPublishedPageDocBySlug,
  publishEntry,
  savePageDocDraft,
} from '../lib/cms/content.server'

export const loadPublicPageFn = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => getPublishedPageDocBySlug(slug))

export const loadEditorStateFn = createServerFn({ method: 'GET' })
  .validator((entryId: string) => entryId)
  .handler(async ({ data: entryId }) => getPageDocEditorState(entryId))

export const saveDraftFn = createServerFn({ method: 'POST' })
  .validator((input: { entryId: string; payload: unknown }) => input)
  .handler(async ({ data }) => savePageDocDraft(data.entryId, data.payload))

export const publishPageFn = createServerFn({ method: 'POST' })
  .validator((entryId: string) => entryId)
  .handler(async ({ data: entryId }) => publishEntry(entryId))

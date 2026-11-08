import { createServerFn } from '@tanstack/react-start'

import { cmsStore, getPageDocEditorState, getPublishedPageDocBySlug } from '../lib/cms/content.server'
import {
  publishEditorDraft,
  publishPageInputSchema,
  saveDraftInputSchema,
  saveEditorDraft,
  type PublishPageInput,
  type SaveDraftInput,
} from '../lib/cms/editorMutations.server'

export const loadPublicPageFn = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => getPublishedPageDocBySlug(slug))

export const loadEditorStateFn = createServerFn({ method: 'GET' })
  .inputValidator((entryId: string) => entryId)
  .handler(async ({ data: entryId }) => getPageDocEditorState(entryId))

export const saveDraftFn = createServerFn({ method: 'POST' })
  .inputValidator((input: SaveDraftInput) => saveDraftInputSchema.parse(input))
  .handler(async ({ data }) => saveEditorDraft(cmsStore, data))

export const publishPageFn = createServerFn({ method: 'POST' })
  .inputValidator((input: PublishPageInput) => publishPageInputSchema.parse(input))
  .handler(async ({ data }) => publishEditorDraft(cmsStore, data))

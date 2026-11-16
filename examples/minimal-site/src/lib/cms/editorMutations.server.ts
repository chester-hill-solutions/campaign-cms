import { pageDocPayloadSchema, type PageDocPayload } from '@chester-hill-solutions/cms-core'
import { CmsRevisionConflictError, type CmsStore } from '@chester-hill-solutions/cms-store'
import { z } from 'zod'

export const saveDraftInputSchema = z.object({
  entryId: z.string().min(1),
  payload: pageDocPayloadSchema,
  expectedDraftRevisionId: z.string().min(1).nullable(),
})
export const publishPageInputSchema = z.object({
  entryId: z.string().min(1),
  expectedDraftRevisionId: z.string().min(1),
})
export type SaveDraftInput = z.infer<typeof saveDraftInputSchema>
export type PublishPageInput = z.infer<typeof publishPageInputSchema>

type ConflictResult = { ok: false; conflict: boolean; error: string }
type EditorStore = Pick<CmsStore<PageDocPayload>, 'savePageDocDraft' | 'publishEntry'>

export async function saveEditorDraft(
  store: EditorStore,
  input: SaveDraftInput,
): Promise<{ ok: true; revisionId: string } | ConflictResult> {
  const { kind: _kind, version: _version, ...content } = input.payload
  try {
    const result = await store.savePageDocDraft(input.entryId, content, input.expectedDraftRevisionId)
    return result.ok ? result : { ok: false, conflict: false, error: 'Validation failed' }
  } catch (error) {
    if (error instanceof CmsRevisionConflictError) {
      return { ok: false, conflict: true, error: 'This draft changed elsewhere. Your local edits are preserved; reload the latest draft to continue.' }
    }
    throw error
  }
}

export async function publishEditorDraft(
  store: EditorStore,
  input: PublishPageInput,
): Promise<{ ok: true; published: boolean } | ConflictResult> {
  try {
    return { ok: true, ...await store.publishEntry(input.entryId, input.expectedDraftRevisionId) }
  } catch (error) {
    if (error instanceof CmsRevisionConflictError) {
      return { ok: false, conflict: true, error: 'This draft changed elsewhere. Nothing was published; reload the latest draft to continue.' }
    }
    throw error
  }
}

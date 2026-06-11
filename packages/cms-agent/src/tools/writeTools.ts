import { notFound, toolError } from '../errors'
import { applyDraftMutation } from '../pipeline'
import {
  createPageInput,
  publishPageInput,
  restoreRevisionInput,
  updatePageMetaInput,
  uploadMediaInput,
} from '../schemas'
import type { CmsAgentConfig, CmsAgentStore, ToolResult } from '../types'
import { makeTool, type CmsAgentTool } from './makeTool'

const MAX_MEDIA_BYTES = 5 * 1024 * 1024

function decodeBase64(base64: string): ToolResult<ArrayBuffer> {
  try {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return { ok: true, data: bytes.buffer }
  } catch {
    return toolError('VALIDATION', 'base64 field is not valid base64 data')
  }
}

export function createWriteTools(
  store: CmsAgentStore,
  config: CmsAgentConfig,
): CmsAgentTool[] {
  return [
    makeTool({
      name: 'create_page',
      description:
        'Create a new page with default content as an unpublished draft. Check the slug with check_slug first.',
      inputSchema: createPageInput,
      mutates: true,
      config,
      handler: async ({ title, slug }) => {
        const slugError = config.validateNewPageSlug(slug)
        if (slugError) {
          return toolError('VALIDATION', slugError, {
            fieldErrors: [{ field: 'slug', message: slugError }],
          })
        }
        if (await store.isPageDocSlugTaken(slug)) {
          return toolError('CONFLICT', `Slug "${slug}" is already in use`, {
            suggestion: 'Pick a different slug or call list_pages.',
          })
        }
        const created = await store.createPageDocEntry({ title, slug })
        if (!created.ok) {
          return toolError('VALIDATION', created.error)
        }
        return { ok: true, data: { entryId: created.entryId } }
      },
    }),

    makeTool({
      name: 'update_page_meta',
      description:
        'Update page metadata (title, SEO fields, nav settings) in the draft. Only the provided fields change.',
      inputSchema: updatePageMetaInput,
      mutates: true,
      config,
      handler: ({ entryId, expectedDraftRevisionId, ...patch }) =>
        applyDraftMutation(
          store,
          entryId,
          expectedDraftRevisionId,
          'agent:update_page_meta',
          (content) => {
            const next = {
              ...content,
              ...(patch.title !== undefined && { title: patch.title }),
              ...(patch.dek !== undefined && { dek: patch.dek }),
              ...(patch.seoTitle !== undefined && { seoTitle: patch.seoTitle }),
              ...(patch.seoDescription !== undefined && {
                seoDescription: patch.seoDescription,
              }),
              ...(patch.navLabel !== undefined && { navLabel: patch.navLabel }),
              ...(patch.navOrder !== undefined && { navOrder: patch.navOrder }),
              ...(patch.showInNav !== undefined && {
                showInNav: patch.showInNav ? (1 as const) : (0 as const),
              }),
              ...(patch.enabled !== undefined && {
                enabled: patch.enabled ? (1 as const) : (0 as const),
              }),
              ...(patch.noindex !== undefined && {
                noindex: patch.noindex ? (1 as const) : (0 as const),
              }),
              ...(patch.ogImagePath !== undefined && {
                ogImagePath: patch.ogImagePath,
              }),
            }
            return { ok: true, data: { content: next, info: undefined } }
          },
        ),
    }),

    makeTool({
      name: 'upload_media',
      description:
        'Upload an image (base64-encoded, max 5 MB, JPEG/PNG/WebP/GIF) to the media library. Returns the asset; use /media/{r2_key} in image block src fields.',
      inputSchema: uploadMediaInput,
      mutates: true,
      config,
      handler: async ({ filename, mime, base64, alt, width, height }) => {
        const decoded = decodeBase64(base64)
        if (!decoded.ok) return decoded
        if (decoded.data.byteLength > MAX_MEDIA_BYTES) {
          return toolError('VALIDATION', 'File too large (max 5 MB)')
        }
        const uploaded = await store.uploadMediaAsset({
          filename,
          mime,
          bytes: decoded.data,
          alt,
          width,
          height,
        })
        if (!uploaded.ok) {
          return toolError('VALIDATION', uploaded.error)
        }
        return { ok: true, data: { asset: uploaded.asset } }
      },
    }),

    makeTool({
      name: 'restore_revision',
      description:
        'Copy a historical revision into the current draft (rollback). Does not publish — call publish_page afterwards to go live.',
      inputSchema: restoreRevisionInput,
      mutates: true,
      config,
      handler: async ({ entryId, revisionId }) => {
        const entry = await store.getContentEntryRow(entryId)
        if (!entry) {
          return notFound(`Entry "${entryId}"`, 'Call list_pages for valid ids.')
        }
        const restored = await store.restoreRevisionAsDraft(entryId, revisionId)
        if (!restored.ok) {
          return restored.error.toLowerCase().includes('not found')
            ? notFound(
                `Revision "${revisionId}"`,
                'Call list_revisions for valid revision ids.',
              )
            : toolError('PRECONDITION', restored.error)
        }
        return { ok: true, data: { entryId, revisionId } }
      },
    }),

    makeTool({
      name: 'publish_page',
      description:
        'Publish the current draft to the live site. Requires human approval. Draft edits never go live without this call.',
      inputSchema: publishPageInput,
      mutates: true,
      needsApproval: true,
      config,
      handler: async ({ entryId }) => {
        const entry = await store.getContentEntryRow(entryId)
        if (!entry) {
          return notFound(`Entry "${entryId}"`, 'Call list_pages for valid ids.')
        }
        if (!entry.draft_revision_id) {
          return toolError('PRECONDITION', 'No draft to publish', {
            suggestion: 'Save draft changes first (add_block, update_block, …).',
          })
        }
        if (entry.draft_revision_id === entry.published_revision_id) {
          return { ok: true, data: { entryId, alreadyPublished: true } }
        }
        const result = await store.publishEntry(entryId)
        if (!result.published) {
          return toolError('PRECONDITION', 'Publish had no effect', {
            retryable: true,
          })
        }
        return { ok: true, data: { entryId, published: true } }
      },
    }),
  ]
}

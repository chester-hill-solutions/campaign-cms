import { z } from 'zod';
import { ALL_BLOCK_TYPES } from '@chester-hill-solutions/cms-core';
const entryId = z.string().min(1).max(200);
const blockId = z.string().min(1).max(64);
/**
 * Optimistic concurrency token. When provided, the write fails with CONFLICT
 * if the entry's current draft revision differs (someone edited in between).
 */
const expectedDraftRevisionId = z.string().min(1).max(80).optional();
// ------------------------------------------------------------------- reads --
export const listPagesInput = z.object({});
export const getPageInput = z.object({
    entryId,
    view: z.enum(['draft', 'published', 'both', 'summary']).default('both'),
});
export const getBlockTypesInput = z.object({});
export const listRevisionsInput = z.object({ entryId });
export const listMediaInput = z.object({
    limit: z.number().int().min(1).max(100).optional(),
});
export const checkSlugInput = z.object({
    slug: z.string().min(1).max(80),
    excludeEntryId: entryId.optional(),
});
// ------------------------------------------------------------------ writes --
export const createPageInput = z.object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(80),
});
export const updatePageMetaInput = z.object({
    entryId,
    expectedDraftRevisionId,
    title: z.string().min(1).max(200).optional(),
    dek: z.string().max(500).optional(),
    seoTitle: z.string().min(1).max(200).optional(),
    seoDescription: z.string().min(1).max(320).optional(),
    navLabel: z.string().min(1).max(80).optional(),
    navOrder: z.number().int().min(0).max(999).optional(),
    showInNav: z.boolean().optional(),
    enabled: z.boolean().optional(),
    noindex: z.boolean().optional(),
    ogImagePath: z.string().max(500).optional(),
});
export const addBlockInput = z.object({
    entryId,
    expectedDraftRevisionId,
    type: z.enum(ALL_BLOCK_TYPES),
    /** Insert position; defaults to the end of the page. */
    index: z.number().int().min(0).max(100).optional(),
});
export const updateBlockInput = z.object({
    entryId,
    expectedDraftRevisionId,
    blockId,
    /**
     * Partial block fields to merge. Field names must match the Zod block
     * schemas (see get_block_types). `id` and `type` cannot be changed.
     */
    patch: z.record(z.string().max(80), z.unknown()),
});
export const removeBlockInput = z.object({
    entryId,
    expectedDraftRevisionId,
    blockId,
});
export const reorderBlockInput = z
    .object({
    entryId,
    expectedDraftRevisionId,
    blockId: blockId.optional(),
    direction: z.enum(['up', 'down']).optional(),
    fromIndex: z.number().int().min(0).max(99).optional(),
    toIndex: z.number().int().min(0).max(99).optional(),
})
    .refine((v) => (v.blockId !== undefined && v.direction !== undefined) ||
    (v.fromIndex !== undefined && v.toIndex !== undefined), {
    message: 'Provide either { blockId, direction } or { fromIndex, toIndex }.',
});
export const duplicateBlockInput = z.object({
    entryId,
    expectedDraftRevisionId,
    blockId,
});
// 5 MB binary ≈ 6.7M base64 chars; allow padding headroom.
const MAX_BASE64_LENGTH = 7_100_000;
export const uploadMediaInput = z.object({
    filename: z.string().min(1).max(200),
    mime: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    /** Base64-encoded file contents (no data: URL prefix). Max 5 MB decoded. */
    base64: z.string().min(1).max(MAX_BASE64_LENGTH),
    alt: z.string().min(1).max(200),
    width: z.number().int().min(1).max(10000).optional(),
    height: z.number().int().min(1).max(10000).optional(),
});
export const restoreRevisionInput = z.object({
    entryId,
    revisionId: z.string().min(1).max(80),
});
export const publishPageInput = z.object({ entryId });
export const cmsAgentToolSchemas = {
    list_pages: listPagesInput,
    get_page: getPageInput,
    get_block_types: getBlockTypesInput,
    list_revisions: listRevisionsInput,
    list_media: listMediaInput,
    check_slug: checkSlugInput,
    create_page: createPageInput,
    update_page_meta: updatePageMetaInput,
    add_block: addBlockInput,
    update_block: updateBlockInput,
    remove_block: removeBlockInput,
    reorder_block: reorderBlockInput,
    duplicate_block: duplicateBlockInput,
    upload_media: uploadMediaInput,
    restore_revision: restoreRevisionInput,
    publish_page: publishPageInput,
};

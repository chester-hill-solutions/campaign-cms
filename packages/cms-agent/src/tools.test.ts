import { describe, expect, it, vi } from 'vitest'

import { ALL_BLOCK_TYPES, createDefaultBlock } from '@campaign/cms-core'

import { createCmsAgentTools } from './tools'
import { createCmsToolSpecs, formatToolError } from './tanstack'
import {
  makeConfig,
  makeEditorState,
  makeEntryRow,
  makePageMeta,
  makeStore,
} from './testFixtures'
import type { ToolError } from './types'

function expectError(result: { ok: boolean }, code: ToolError['code']): ToolError {
  expect(result.ok).toBe(false)
  const error = result as ToolError
  expect(error.code).toBe(code)
  return error
}

describe('read tools', () => {
  it('get_page returns NOT_FOUND for a missing entry', async () => {
    const store = makeStore({ getPageDocEditorState: vi.fn(async () => null) })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('get_page', { entryId: 'page-missing' })
    expectError(result, 'NOT_FOUND')
  })

  it('get_page view summary returns compact block list', async () => {
    const agent = createCmsAgentTools(makeStore(), makeConfig())
    const result = await agent.invoke('get_page', {
      entryId: 'page-about',
      view: 'summary',
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      const data = result.data as { blocks: { id: string; type: string }[] }
      expect(data.blocks).toHaveLength(1)
      expect(data.blocks[0].type).toBe('richText')
    }
  })

  it('get_block_types covers every type in ALL_BLOCK_TYPES', async () => {
    const agent = createCmsAgentTools(makeStore(), makeConfig())
    const result = await agent.invoke('get_block_types', {})
    expect(result.ok).toBe(true)
    if (result.ok) {
      const data = result.data as { types: { type: string }[] }
      expect(data.types.map((t) => t.type).sort()).toEqual(
        [...ALL_BLOCK_TYPES].sort(),
      )
    }
  })

  it('read tools call assertCanRead but never assertCanMutate', async () => {
    const config = makeConfig()
    const agent = createCmsAgentTools(makeStore(), config)
    await agent.invoke('list_pages', {})
    await agent.invoke('get_block_types', {})
    expect(config.assertCanRead).toHaveBeenCalledTimes(2)
    expect(config.assertCanMutate).not.toHaveBeenCalled()
  })

  it('list_revisions returns NOT_FOUND for a missing entry', async () => {
    const store = makeStore({ getContentEntryRow: vi.fn(async () => null) })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('list_revisions', { entryId: 'page-x' })
    expectError(result, 'NOT_FOUND')
  })

  it('check_slug reports unavailable when slug is taken', async () => {
    const store = makeStore({ isPageDocSlugTaken: vi.fn(async () => true) })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('check_slug', { slug: 'about' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toMatchObject({ available: false })
    }
  })
})

describe('block tools', () => {
  it('add_block saves the draft with the new block appended', async () => {
    const store = makeStore()
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('add_block', {
      entryId: 'page-about',
      type: 'hero',
    })
    expect(result.ok).toBe(true)
    expect(store.savePageDocDraft).toHaveBeenCalledTimes(1)
    const [, content, message] = vi.mocked(store.savePageDocDraft).mock.calls[0]
    expect(content.blocks).toHaveLength(2)
    expect(content.blocks[1].type).toBe('hero')
    expect(message).toBe('agent:add_block hero')
  })

  it('update_block returns NOT_FOUND for an unknown block id', async () => {
    const agent = createCmsAgentTools(makeStore(), makeConfig())
    const result = await agent.invoke('update_block', {
      entryId: 'page-about',
      blockId: 'blk_nope',
      patch: { markdown: 'Hello' },
    })
    expectError(result, 'NOT_FOUND')
  })

  it('update_block rejects a patch that changes the block type', async () => {
    const content = makePageMeta()
    const blockId = content.blocks[0].id
    const store = makeStore({
      getPageDocEditorState: vi.fn(async () => makeEditorState(content)),
    })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('update_block', {
      entryId: 'page-about',
      blockId,
      patch: { type: 'hero' },
    })
    expectError(result, 'VALIDATION')
  })

  it('update_block returns fieldErrors for invalid field values', async () => {
    const content = makePageMeta({ blocks: [createDefaultBlock('hero')] })
    const blockId = content.blocks[0].id
    const store = makeStore({
      getPageDocEditorState: vi.fn(async () => makeEditorState(content)),
    })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('update_block', {
      entryId: 'page-about',
      blockId,
      patch: { heading: '' },
    })
    const error = expectError(result, 'VALIDATION')
    expect(error.fieldErrors?.some((fe) => fe.blockId === blockId)).toBe(true)
    expect(error.suggestion).toContain('get_block_types')
  })

  it('remove_block refuses to remove the last block', async () => {
    const content = makePageMeta()
    const blockId = content.blocks[0].id
    const store = makeStore({
      getPageDocEditorState: vi.fn(async () => makeEditorState(content)),
    })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('remove_block', {
      entryId: 'page-about',
      blockId,
    })
    expectError(result, 'PRECONDITION')
  })

  it('reorder_block down on the last block returns PRECONDITION', async () => {
    const content = makePageMeta()
    const blockId = content.blocks[0].id
    const store = makeStore({
      getPageDocEditorState: vi.fn(async () => makeEditorState(content)),
    })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('reorder_block', {
      entryId: 'page-about',
      blockId,
      direction: 'down',
    })
    expectError(result, 'PRECONDITION')
  })

  it('duplicate_block inserts a copy with a fresh id', async () => {
    const content = makePageMeta()
    const blockId = content.blocks[0].id
    const store = makeStore({
      getPageDocEditorState: vi.fn(async () => makeEditorState(content)),
    })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('duplicate_block', {
      entryId: 'page-about',
      blockId,
    })
    expect(result.ok).toBe(true)
    const [, saved] = vi.mocked(store.savePageDocDraft).mock.calls[0]
    expect(saved.blocks).toHaveLength(2)
    expect(saved.blocks[1].id).not.toBe(blockId)
    expect(saved.blocks[1].type).toBe(saved.blocks[0].type)
  })

  it('write fails with CONFLICT on expectedDraftRevisionId mismatch', async () => {
    const agent = createCmsAgentTools(makeStore(), makeConfig())
    const result = await agent.invoke('add_block', {
      entryId: 'page-about',
      type: 'hero',
      expectedDraftRevisionId: 'rev_stale',
    })
    const error = expectError(result, 'CONFLICT')
    expect(error.suggestion).toContain('get_page')
  })
})

describe('write tools', () => {
  it('create_page returns CONFLICT for a duplicate slug', async () => {
    const store = makeStore({ isPageDocSlugTaken: vi.fn(async () => true) })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('create_page', {
      title: 'About',
      slug: 'about',
    })
    expectError(result, 'CONFLICT')
  })

  it('create_page returns VALIDATION for a reserved slug', async () => {
    const config = makeConfig({
      validateNewPageSlug: () => 'Slug is reserved.',
    })
    const agent = createCmsAgentTools(makeStore(), config)
    const result = await agent.invoke('create_page', {
      title: 'Admin',
      slug: 'admin',
    })
    expectError(result, 'VALIDATION')
  })

  it('update_page_meta converts booleans to 0/1 payload fields', async () => {
    const store = makeStore()
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('update_page_meta', {
      entryId: 'page-about',
      showInNav: false,
      enabled: true,
      seoTitle: 'New SEO title',
    })
    expect(result.ok).toBe(true)
    const [, content] = vi.mocked(store.savePageDocDraft).mock.calls[0]
    expect(content.showInNav).toBe(0)
    expect(content.enabled).toBe(1)
    expect(content.seoTitle).toBe('New SEO title')
  })

  it('publish_page returns PRECONDITION when there is no draft', async () => {
    const store = makeStore({
      getContentEntryRow: vi.fn(async () =>
        makeEntryRow({ draft_revision_id: null }),
      ),
    })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('publish_page', { entryId: 'page-about' })
    expectError(result, 'PRECONDITION')
    expect(store.publishEntry).not.toHaveBeenCalled()
  })

  it('publish_page is idempotent when draft is already live', async () => {
    const store = makeStore({
      getContentEntryRow: vi.fn(async () =>
        makeEntryRow({
          draft_revision_id: 'rev_1',
          published_revision_id: 'rev_1',
        }),
      ),
    })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('publish_page', { entryId: 'page-about' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toMatchObject({ alreadyPublished: true })
    }
    expect(store.publishEntry).not.toHaveBeenCalled()
  })

  it('upload_media returns VALIDATION for malformed base64', async () => {
    const agent = createCmsAgentTools(makeStore(), makeConfig())
    const result = await agent.invoke('upload_media', {
      filename: 'x.png',
      mime: 'image/png',
      base64: '!!!not-base64!!!',
      alt: 'x',
    })
    expectError(result, 'VALIDATION')
  })

  it('restore_revision maps a missing revision to NOT_FOUND', async () => {
    const store = makeStore({
      restoreRevisionAsDraft: vi.fn(async () => ({
        ok: false as const,
        error: 'Revision not found',
      })),
    })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('restore_revision', {
      entryId: 'page-about',
      revisionId: 'rev_nope',
    })
    expectError(result, 'NOT_FOUND')
  })
})

describe('tool envelope', () => {
  it('maps an assertCanMutate denial to FORBIDDEN', async () => {
    const config = makeConfig({
      assertCanMutate: vi.fn(() => {
        throw new Error('Agent disabled')
      }),
    })
    const agent = createCmsAgentTools(makeStore(), config)
    const result = await agent.invoke('add_block', {
      entryId: 'page-about',
      type: 'hero',
    })
    const error = expectError(result, 'FORBIDDEN')
    expect(error.error).toBe('Agent disabled')
  })

  it('maps a store throw to INTERNAL retryable', async () => {
    const store = makeStore({
      listPageDocEntriesWithStatus: vi.fn(async () => {
        throw new Error('D1_ERROR: connection lost')
      }),
    })
    const agent = createCmsAgentTools(store, makeConfig())
    const result = await agent.invoke('list_pages', {})
    const error = expectError(result, 'INTERNAL')
    expect(error.retryable).toBe(true)
    expect(error.error).not.toContain('D1_ERROR')
  })

  it('returns VALIDATION with field paths for invalid tool input', async () => {
    const agent = createCmsAgentTools(makeStore(), makeConfig())
    const result = await agent.invoke('add_block', {
      entryId: 'page-about',
      type: 'not-a-block-type',
    })
    const error = expectError(result, 'VALIDATION')
    expect(error.fieldErrors?.some((fe) => fe.field === 'type')).toBe(true)
  })

  it('returns NOT_FOUND for an unknown tool name', async () => {
    const agent = createCmsAgentTools(makeStore(), makeConfig())
    const result = await agent.invoke('delete_everything', {})
    expectError(result, 'NOT_FOUND')
  })

  it('invokes onToolComplete with the result for observability', async () => {
    const onToolComplete = vi.fn()
    const agent = createCmsAgentTools(makeStore(), makeConfig({ onToolComplete }))
    await agent.invoke('list_pages', {})
    expect(onToolComplete).toHaveBeenCalledTimes(1)
    const [ctx, result] = onToolComplete.mock.calls[0]
    expect(ctx.toolName).toBe('list_pages')
    expect(result.ok).toBe(true)
  })
})

describe('tanstack tool specs', () => {
  it('exposes every tool with publish_page requiring approval', () => {
    const agent = createCmsAgentTools(makeStore(), makeConfig())
    const specs = createCmsToolSpecs(agent)
    expect(specs).toHaveLength(16)
    const publish = specs.find((s) => s.name === 'publish_page')
    expect(publish?.needsApproval).toBe(true)
    expect(specs.filter((s) => s.needsApproval)).toHaveLength(1)
  })

  it('serializes failures as model-readable strings with recovery hints', async () => {
    const store = makeStore({ getPageDocEditorState: vi.fn(async () => null) })
    const agent = createCmsAgentTools(store, makeConfig())
    const specs = createCmsToolSpecs(agent)
    const getPage = specs.find((s) => s.name === 'get_page')
    const output = await getPage?.execute({ entryId: 'page-missing' })
    expect(output).toContain('[NOT_FOUND]')
    expect(output).toContain('list_pages')
  })

  it('formatToolError includes field errors and suggestions', () => {
    const formatted = formatToolError({
      ok: false,
      code: 'VALIDATION',
      error: 'Invalid fields',
      fieldErrors: [{ blockId: 'blk_1', field: 'heading', message: 'is required' }],
      suggestion: 'Call get_block_types.',
    })
    expect(formatted).toContain('[VALIDATION]')
    expect(formatted).toContain('blk_1.heading')
    expect(formatted).toContain('get_block_types')
  })
})

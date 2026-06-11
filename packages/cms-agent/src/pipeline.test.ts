import { describe, expect, it, vi } from 'vitest'

import type { PageDocPayload } from '@campaign/cms-core'

import { checkExpectedRevision, loadDraftForEdit } from './pipeline'
import {
  makeEditorState,
  makeEntryRow,
  makePageMeta,
  makeStore,
} from './testFixtures'

describe('loadDraftForEdit', () => {
  it('returns NOT_FOUND for a missing entry', async () => {
    const store = makeStore({ getPageDocEditorState: vi.fn(async () => null) })
    const result = await loadDraftForEdit(store, 'page-missing')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('NOT_FOUND')
  })

  it('uses the draft when present', async () => {
    const result = await loadDraftForEdit(makeStore(), 'page-about')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.content.title).toBe('About')
      expect(result.data.draftRevisionId).toBe('rev_1')
    }
  })

  it('falls back to published content when there is no draft', async () => {
    const state = makeEditorState()
    const published: PageDocPayload = {
      kind: 'pageDoc',
      version: 1,
      ...makePageMeta({ title: 'Live title' }),
    }
    state.draft = null
    state.published = published
    const store = makeStore({ getPageDocEditorState: vi.fn(async () => state) })

    const result = await loadDraftForEdit(store, 'page-about')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.content.title).toBe('Live title')
  })

  it('returns PRECONDITION when entry has neither draft nor published', async () => {
    const state = makeEditorState(
      makePageMeta(),
      makeEntryRow({ draft_revision_id: null }),
    )
    state.draft = null
    state.published = null
    const store = makeStore({ getPageDocEditorState: vi.fn(async () => state) })

    const result = await loadDraftForEdit(store, 'page-about')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('PRECONDITION')
  })
})

describe('checkExpectedRevision', () => {
  it('passes when no expectation is provided', () => {
    expect(checkExpectedRevision('rev_1', undefined).ok).toBe(true)
  })

  it('passes when the revision matches', () => {
    expect(checkExpectedRevision('rev_1', 'rev_1').ok).toBe(true)
  })

  it('returns CONFLICT when the draft moved', () => {
    const result = checkExpectedRevision('rev_2', 'rev_1')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.code).toBe('CONFLICT')
      expect(result.suggestion).toContain('get_page')
    }
  })
})

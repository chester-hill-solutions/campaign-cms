import { vi } from 'vitest'

import {
  createDefaultBlock,
  type ContentEntryRow,
  type EntryEditorState,
  type PageDocPayload,
} from '@campaign/cms-core'

import type { CmsAgentConfig, CmsAgentStore, PageMeta } from './types'

export function makePageMeta(overrides: Partial<PageMeta> = {}): PageMeta {
  return {
    slug: 'about',
    title: 'About',
    enabled: 1,
    showInNav: 1,
    navLabel: 'About',
    seoTitle: 'About',
    seoDescription: 'About the campaign.',
    blocks: [createDefaultBlock('richText')],
    ...overrides,
  }
}

export function makeEntryRow(
  overrides: Partial<ContentEntryRow> = {},
): ContentEntryRow {
  return {
    id: 'page-about',
    type: 'page_doc',
    slug: 'about',
    title: 'About',
    status: 'draft',
    published_revision_id: null,
    draft_revision_id: 'rev_1',
    ...overrides,
  }
}

export function makeEditorState(
  content: PageMeta = makePageMeta(),
  entry: ContentEntryRow = makeEntryRow(),
): EntryEditorState<PageDocPayload> {
  const payload: PageDocPayload = { kind: 'pageDoc', version: 1, ...content }
  return {
    entry,
    draft: payload,
    published: null,
    meta: {
      entryExists: true,
      hasDraft: true,
      hasPublished: false,
      hasUnpublishedChanges: true,
      publishedAt: null,
    },
  }
}

export function makeStore(overrides: Partial<CmsAgentStore> = {}): CmsAgentStore {
  return {
    listPageDocEntriesWithStatus: vi.fn(async () => []),
    getPageDocEditorState: vi.fn(async () => makeEditorState()),
    getContentEntryRow: vi.fn(async () => makeEntryRow()),
    listRevisionsForEntry: vi.fn(async () => []),
    listMediaAssets: vi.fn(async () => []),
    isPageDocSlugTaken: vi.fn(async () => false),
    createPageDocEntry: vi.fn(async () => ({
      ok: true as const,
      entryId: 'page-new',
    })),
    savePageDocDraft: vi.fn(async () => ({ ok: true as const })),
    publishEntry: vi.fn(async () => ({ published: true })),
    restoreRevisionAsDraft: vi.fn(async () => ({ ok: true as const })),
    uploadMediaAsset: vi.fn(async () => ({
      ok: true as const,
      asset: {
        id: 'media_1',
        r2_key: 'media_1.png',
        filename: 'x.png',
        mime: 'image/png',
        size_bytes: 1,
        width: null,
        height: null,
        alt: 'x',
        created_at: new Date().toISOString(),
      },
    })),
    ...overrides,
  }
}

export function makeConfig(
  overrides: Partial<CmsAgentConfig> = {},
): CmsAgentConfig {
  return {
    assertCanRead: vi.fn(),
    assertCanMutate: vi.fn(),
    actorId: 'test-agent',
    validateNewPageSlug: () => null,
    entryIdFromPageSlug: (slug) => `page-${slug}`,
    newPageDoc: ({ title, slug }) => makePageMeta({ title, slug }),
    ...overrides,
  }
}

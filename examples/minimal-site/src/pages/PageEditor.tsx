import { LoaderCircle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  removeBlockFromPage,
  updateBlockInPage,
  validatePageDoc,
  type EntryEditorMeta,
  type PageDocPayload,
  type PageMeta,
} from '@chester-hill-solutions/cms-core'
import {
  BlockSettingsPanel,
  CmsUiProvider,
  EditorCanvas,
  EditorTopBar,
  PageSettingsDrawer,
  useAutosave,
  useDocHistory,
  reconcileSelection,
  type BlockSelection,
  type Viewport,
} from '@chester-hill-solutions/cms-react'

import { exampleCmsUi } from '../lib/cms/cmsUi'
import { cmsPagePublicPath } from '../lib/cms/cmsPagePath'
import { loadEditorStateFn, publishPageFn, saveDraftFn } from '../server/cmsFns'

const DEMO_ENTRY_ID = 'page-about'

const EMPTY_META: EntryEditorMeta = {
  entryExists: false,
  hasDraft: false,
  hasPublished: false,
  hasUnpublishedChanges: false,
  publishedAt: null,
}

function toPageMeta(payload: PageDocPayload): PageMeta {
  const { kind: _k, version: _v, ...rest } = payload
  return rest
}

export function PageEditor() {
  const [meta, setMeta] = useState<EntryEditorMeta>(EMPTY_META)
  const [ready, setReady] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null)
  const draftRevision = useRef<string | null>(null)
  const [selection, setSelection] = useState<BlockSelection | null>(null)
  const [blockPanelOpen, setBlockPanelOpen] = useState(false)
  const [pageSettingsOpen, setPageSettingsOpen] = useState(false)
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [publishPending, setPublishPending] = useState(false)
  const [publishMessage, setPublishMessage] = useState<string | null>(null)

  const history = useDocHistory<PageMeta>({
    slug: 'about',
    title: 'About',
    enabled: 1,
    showInNav: 1,
    navLabel: 'About',
    seoTitle: 'About',
    seoDescription: '',
    blocks: [],
  })
  const { content, set: setContent, reset, undo, redo, canUndo, canRedo } = history

  const validation = useMemo(() => validatePageDoc(content), [content])
  const resolvedSelection = useMemo(() => reconcileSelection(content.blocks, selection), [content.blocks, selection])
  const selectedBlock = content.blocks.find((b) => b.id === resolvedSelection?.blockId) ?? null

  const saveDraft = useCallback(async (snapshot: PageMeta) => {
    const payload: PageDocPayload = { kind: 'pageDoc', version: 1, ...snapshot }
    const res = await saveDraftFn({ data: {
      entryId: DEMO_ENTRY_ID, payload, expectedDraftRevisionId: draftRevision.current,
    } })
    if (!res.ok) {
      if (res.conflict) setConflict(true)
      return { ok: false as const, error: res.error }
    }
    draftRevision.current = res.revisionId
    setMeta(current => ({ ...current, entryExists: true, hasDraft: true, hasUnpublishedChanges: true }))
    return { ok: true as const }
  }, [])

  const { status, error, dirty, flush, markSaved } = useAutosave({
    content,
    ready,
    valid: validation.ok,
    paused: conflict,
    save: saveDraft,
  })

  useEffect(() => {
    void loadEditorStateFn({ data: DEMO_ENTRY_ID }).then((state) => {
      if (!state) {
        setReady(true)
        return
      }
      draftRevision.current = state.entry.draft_revision_id
      setMeta(state.meta)
      setPublishedSlug(state.published?.slug ?? null)
      const payload = state.draft ?? state.published
      if (payload) {
        reset(toPageMeta(payload))
        markSaved(toPageMeta(payload))
      }
      setReady(true)
    })
  }, [markSaved, reset])

  function onChange(next: PageMeta) {
    setContent(next)
  }

  function onSelectBlock(next: BlockSelection | null) {
    setSelection(next)
    if (next) {
      setBlockPanelOpen(true)
      setPageSettingsOpen(false)
    }
  }

  async function handlePublish() {
    setPublishPending(true)
    setPublishMessage(null)
    try {
      if (conflict || !await flush()) return
      const expectedDraftRevisionId = draftRevision.current
      if (!expectedDraftRevisionId) {
        setPublishMessage('Save a draft before publishing')
        return
      }
      const res = await publishPageFn({ data: { entryId: DEMO_ENTRY_ID, expectedDraftRevisionId } })
      if (!res.ok) {
        if (res.conflict) setConflict(true)
        setPublishMessage(res.error)
        return
      }
      setPublishMessage(res.published ? 'Published' : 'Already live')
      const state = await loadEditorStateFn({ data: DEMO_ENTRY_ID })
      // This refresh is metadata only; a different draft must not advance our save guard.
      if (state) {
        setMeta(state.meta)
        setPublishedSlug(state.published?.slug ?? null)
      }
      window.setTimeout(() => setPublishMessage(null), 3000)
    } catch {
      setPublishMessage('Publish failed — your local edits are preserved')
    } finally {
      setPublishPending(false)
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface-page text-ink-muted">
        <LoaderCircle className="h-7 w-7 animate-spin" aria-hidden="true" />
        <p className="text-sm font-medium">Loading page editor…</p>
      </div>
    )
  }

  return (
    <CmsUiProvider config={exampleCmsUi}>
      <div className="pb-editor min-h-screen bg-[color-mix(in_oklab,var(--surface-elevated)_55%,var(--surface-page))]">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-3 sm:px-6">
          <EditorTopBar
            title={content.title}
            meta={meta}
            publicPath={publishedSlug === null ? null : cmsPagePublicPath(publishedSlug)}
            pagesListHref={null}
            saveStatus={status}
            saveError={error}
            dirty={dirty}
            pageErrorCount={validation.page.length}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            viewport={viewport}
            onViewportChange={setViewport}
            onOpenPageSettings={() => {
              setPageSettingsOpen(true)
              setBlockPanelOpen(false)
            }}
            publishPending={publishPending}
            publishDisabled={conflict}
            onPublish={() => void handlePublish()}
            publishMessage={publishMessage}
          />

          {conflict ? (
            <p role="alert" className="mb-4 text-sm text-ink-muted">
              This draft changed elsewhere. Your edits are still here.{' '}
              <button type="button" className="underline" onClick={() => window.location.reload()}>
                Reload latest draft and discard local changes
              </button>
            </p>
          ) : null}

          <div
            className={`mx-auto transition-[max-width] duration-200 ${
              viewport === 'mobile' ? 'max-w-[24rem]' : 'max-w-3xl'
            }`}
          >
            <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface-page shadow-[0_24px_48px_-12px_color-mix(in_oklab,var(--ink)_12%,transparent)]">
              <EditorCanvas
                content={content}
                onChange={onChange}
                selection={resolvedSelection}
                onSelect={onSelectBlock}
                onOpenSettings={() => setBlockPanelOpen(true)}
                onDelete={(id) => onChange(removeBlockFromPage(content, id))}
                errorsByBlock={validation.byBlock}
              />
            </div>
          </div>
        </div>

        {blockPanelOpen && selectedBlock ? (
          <BlockSettingsPanel
            block={selectedBlock}
            selection={resolvedSelection}
            errors={validation.byBlock.get(selectedBlock.id)}
            onChange={(block) => onChange(updateBlockInPage(content, block))}
            onClose={() => setBlockPanelOpen(false)}
          />
        ) : null}

        <PageSettingsDrawer
          open={pageSettingsOpen}
          onClose={() => setPageSettingsOpen(false)}
          content={content}
          onChange={onChange}
          pageErrors={validation.page}
          revisions={[]}
          restorePending={false}
          onRestoreRevision={() => undefined}
          onApplyTemplate={() => undefined}
        />
      </div>
    </CmsUiProvider>
  )
}

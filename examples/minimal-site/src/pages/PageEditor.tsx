import { LoaderCircle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

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
  const [selectedId, setSelectedId] = useState<string | null>(null)
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
  const selectedBlock = content.blocks.find((b) => b.id === selectedId) ?? null

  const saveDraft = useCallback(async (snapshot: PageMeta) => {
    const payload: PageDocPayload = { kind: 'pageDoc', version: 1, ...snapshot }
    const res = await saveDraftFn({ data: { entryId: DEMO_ENTRY_ID, payload } })
    if (!res.ok) return { ok: false as const, error: 'Validation failed' }
    return { ok: true as const }
  }, [])

  const { status, error, dirty, flush, markSaved } = useAutosave({
    content,
    ready,
    valid: validation.ok,
    save: saveDraft,
  })

  useEffect(() => {
    void loadEditorStateFn({ data: DEMO_ENTRY_ID }).then((state) => {
      if (!state) {
        setReady(true)
        return
      }
      setMeta(state.meta)
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

  function onSelectBlock(id: string | null) {
    setSelectedId(id)
    if (id) {
      setBlockPanelOpen(true)
      setPageSettingsOpen(false)
    }
  }

  async function handlePublish() {
    setPublishPending(true)
    setPublishMessage(null)
    const saved = await flush()
    if (!saved) {
      setPublishPending(false)
      return
    }
    const res = await publishPageFn({ data: DEMO_ENTRY_ID })
    setPublishMessage(res.published ? 'Published' : 'Already live')
    const state = await loadEditorStateFn({ data: DEMO_ENTRY_ID })
    if (state) setMeta(state.meta)
    setPublishPending(false)
    window.setTimeout(() => setPublishMessage(null), 3000)
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
            publicPath={content.slug ? cmsPagePublicPath(content.slug) : null}
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
            onPublish={() => void handlePublish()}
            publishMessage={publishMessage}
          />

          <div
            className={`mx-auto transition-[max-width] duration-200 ${
              viewport === 'mobile' ? 'max-w-[24rem]' : 'max-w-3xl'
            }`}
          >
            <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface-page shadow-[0_24px_48px_-12px_color-mix(in_oklab,var(--ink)_12%,transparent)]">
              <EditorCanvas
                content={content}
                onChange={onChange}
                selectedId={selectedId}
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

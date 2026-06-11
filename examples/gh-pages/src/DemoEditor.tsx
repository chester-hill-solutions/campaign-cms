import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  removeBlockFromPage,
  updateBlockInPage,
  validatePageDoc,
  type EntryEditorMeta,
  type PageDocPayload,
  type PageMeta,
} from '@campaign/cms-core'
import {
  BlockSettingsPanel,
  CmsUiProvider,
  EditorCanvas,
  EditorTopBar,
  PageSettingsDrawer,
  useAutosave,
  useDocHistory,
  type Viewport,
} from '@campaign/cms-react'

import seedPage from '../../minimal-site/scripts/seed-about.json'
import { demoCmsUi } from './lib/cmsUi'
import { demoPreviewHref } from './lib/demoPaths'
import { loadDraft, loadPublished, saveDraft, savePublished, toPageMeta } from './lib/localDraft'

const REPO_URL = 'https://github.com/chester-hill-solutions/campaign-cms'
const seedMeta = toPageMeta(seedPage as PageDocPayload)

function initialMeta(): EntryEditorMeta {
  const published = loadPublished()
  const draft = loadDraft()
  return {
    entryExists: true,
    hasDraft: Boolean(draft),
    hasPublished: Boolean(published),
    hasUnpublishedChanges: Boolean(draft && published && JSON.stringify(draft) !== JSON.stringify(published)),
    publishedAt: published ? new Date().toISOString() : null,
  }
}

export function DemoEditor() {
  const [meta, setMeta] = useState<EntryEditorMeta>(initialMeta)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [blockPanelOpen, setBlockPanelOpen] = useState(false)
  const [pageSettingsOpen, setPageSettingsOpen] = useState(false)
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [publishPending, setPublishPending] = useState(false)
  const [publishMessage, setPublishMessage] = useState<string | null>(null)

  const [ready, setReady] = useState(false)

  const history = useDocHistory<PageMeta>(seedMeta)
  const { content, set: setContent, reset, undo, redo, canUndo, canRedo } = history

  const validation = useMemo(() => validatePageDoc(content), [content])
  const selectedBlock = content.blocks.find((b) => b.id === selectedId) ?? null

  const persistDraft = useCallback(async (snapshot: PageMeta) => {
    saveDraft(snapshot)
    return { ok: true as const }
  }, [])

  const { status, error, dirty, flush, markSaved } = useAutosave({
    content,
    ready,
    valid: validation.ok,
    save: persistDraft,
  })

  useEffect(() => {
    const draft = loadDraft()
    const snapshot = draft ?? seedMeta
    reset(snapshot)
    markSaved(snapshot)
    setReady(true)
  }, [markSaved, reset])

  function onChange(next: PageMeta) {
    setContent(next)
    if (meta.hasPublished) {
      const published = loadPublished()
      setMeta((current) => ({
        ...current,
        hasDraft: true,
        hasUnpublishedChanges: published ? JSON.stringify(next) !== JSON.stringify(published) : true,
      }))
    }
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
    savePublished(content)
    setMeta({
      entryExists: true,
      hasDraft: true,
      hasPublished: true,
      hasUnpublishedChanges: false,
      publishedAt: new Date().toISOString(),
    })
    setPublishMessage('Published to this browser')
    setPublishPending(false)
    window.setTimeout(() => setPublishMessage(null), 3000)
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page text-sm text-ink-muted">
        Loading editor…
      </div>
    )
  }

  return (
    <CmsUiProvider config={demoCmsUi}>
      <div className="pb-editor min-h-screen bg-[color-mix(in_oklab,var(--surface-elevated)_55%,var(--surface-page))]">
        <div className="rounded-b border border-amber-500/40 bg-amber-950/50 px-4 py-2 text-center text-sm text-amber-100">
          Browser demo — edits autosave to{' '}
          <code className="rounded bg-black/20 px-1 py-0.5 text-xs">localStorage</code> only.{' '}
          <a href={REPO_URL} className="font-semibold text-amber-50 underline">
            Clone the repo
          </a>{' '}
          for D1, media library, and real publish.
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-3 sm:px-6">
          <EditorTopBar
            title={content.title}
            meta={meta}
            publicPath={meta.hasPublished ? demoPreviewHref() : null}
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

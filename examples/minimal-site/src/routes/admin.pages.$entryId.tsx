import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  removeBlockFromPage,
  updateBlockInPage,
  validatePageDoc,
  type PageDocPayload,
  type PageMeta,
  type EntryEditorMeta,
} from '@campaign/cms-core'
import {
  BlockSettingsPanel,
  CmsUiProvider,
  EditorCanvas,
  EditorTopBar,
  useAutosave,
  useDocHistory,
  type Viewport,
} from '@campaign/cms-react'

import { exampleCmsUi } from '../lib/cms/cmsUi'
import { cmsPagePublicPath } from '../lib/cms/cmsPagePath'
import { loadEditorStateFn, publishPageFn, saveDraftFn } from '../server/cmsFns'

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

export const Route = createFileRoute('/admin/pages/$entryId')({
  loader: ({ params }) => ({ entryId: params.entryId }),
  component: AdminPageEditor,
})

function AdminPageEditor() {
  const { entryId } = Route.useLoaderData()
  const [meta, setMeta] = useState<EntryEditorMeta>(EMPTY_META)
  const [ready, setReady] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
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
    seoDescription: 'About this campaign',
    blocks: [],
  })
  const { content, set: setContent, reset, undo, redo, canUndo, canRedo } = history

  const validation = useMemo(() => validatePageDoc(content), [content])
  const selectedBlock = content.blocks.find((b) => b.id === selectedId) ?? null

  const saveDraft = useCallback(
    async (snapshot: PageMeta) => {
      const payload: PageDocPayload = { kind: 'pageDoc', version: 1, ...snapshot }
      const res = await saveDraftFn({ data: { entryId, payload } })
      if (!res.ok) return { ok: false as const, error: 'Validation failed' }
      return { ok: true as const }
    },
    [entryId],
  )

  const { status, error, dirty, flush, markSaved } = useAutosave({
    content,
    ready,
    valid: validation.ok,
    save: saveDraft,
  })

  useEffect(() => {
    void loadEditorStateFn({ data: entryId }).then((state) => {
      if (!state) return
      setMeta(state.meta)
      const payload = state.draft ?? state.published
      if (payload) {
        reset(toPageMeta(payload))
        markSaved(toPageMeta(payload))
      }
      setReady(true)
    })
  }, [entryId, markSaved, reset])

  function onChange(next: PageMeta) {
    setContent(next)
  }

  async function handlePublish() {
    setPublishPending(true)
    setPublishMessage(null)
    const saved = await flush()
    if (!saved) {
      setPublishPending(false)
      return
    }
    const res = await publishPageFn({ data: entryId })
    setPublishMessage(res.published ? 'Published!' : 'Nothing to publish')
    const state = await loadEditorStateFn({ data: entryId })
    if (state) setMeta(state.meta)
    setPublishPending(false)
  }

  return (
    <CmsUiProvider config={exampleCmsUi}>
      <div className="pb-editor min-h-screen bg-zinc-950 px-4 sm:px-6">
        <div className="rounded-b border border-amber-500/40 bg-amber-950/50 px-4 py-2 text-center text-sm text-amber-100">
          Demo editor — no authentication. Do not deploy this pattern to production.
        </div>
        <EditorTopBar
          title={content.title}
          meta={meta}
          publicPath={content.slug ? cmsPagePublicPath(content.slug) : null}
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
          onOpenPageSettings={() => setPanelOpen(true)}
          publishPending={publishPending}
          onPublish={() => void handlePublish()}
          publishMessage={publishMessage}
        />
        <EditorCanvas
          content={content}
          onChange={onChange}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onOpenSettings={() => setPanelOpen(true)}
          onDelete={(id) => onChange(removeBlockFromPage(content, id))}
          errorsByBlock={validation.byBlock}
        />
        {panelOpen && selectedBlock ? (
          <BlockSettingsPanel
            block={selectedBlock}
            errors={validation.byBlock.get(selectedBlock.id)}
            onChange={(block) => onChange(updateBlockInPage(content, block.id, block))}
            onClose={() => setPanelOpen(false)}
          />
        ) : null}
      </div>
    </CmsUiProvider>
  )
}

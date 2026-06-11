import {
  ArrowLeft,
  Check,
  CloudUpload,
  ExternalLink,
  LoaderCircle,
  Monitor,
  Redo2,
  Settings,
  Smartphone,
  TriangleAlert,
  Undo2,
} from 'lucide-react'

import type { EntryEditorMeta } from '@campaign/cms-core'
import type { AutosaveStatus } from './useAutosave'

export type Viewport = 'desktop' | 'mobile'

const ICON_BUTTON_CLASS =
  'focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-elevated hover:text-ink disabled:opacity-30'

function SaveIndicator({
  status,
  error,
  dirty,
  pageErrorCount,
}: {
  status: AutosaveStatus
  error: string | null
  dirty: boolean
  pageErrorCount: number
}) {
  if (pageErrorCount > 0 || status === 'error') {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-semibold text-accent-red"
        role="alert"
      >
        <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
        {pageErrorCount > 0 ? 'Fix errors to save' : (error ?? 'Save failed')}
      </span>
    )
  }
  if (status === 'saving') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted" role="status">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        Saving…
      </span>
    )
  }
  if (dirty) {
    return (
      <span className="text-xs font-semibold text-ink-muted" role="status">
        Unsaved changes
      </span>
    )
  }
  if (status === 'saved') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted" role="status">
        <Check className="h-3.5 w-3.5 text-accent-green" aria-hidden="true" />
        Saved
      </span>
    )
  }
  return null
}

type Props = {
  title: string
  meta: EntryEditorMeta
  publicPath: string | null
  pagesListHref?: string | null
  saveStatus: AutosaveStatus
  saveError: string | null
  dirty: boolean
  pageErrorCount: number
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  viewport: Viewport
  onViewportChange: (viewport: Viewport) => void
  onOpenPageSettings: () => void
  publishPending: boolean
  onPublish: () => void
  publishMessage: string | null
}

/** Sticky editor header: title, save state, undo/redo, viewport, publish. */
export function EditorTopBar({
  title,
  meta,
  publicPath,
  pagesListHref = '/admin/pages',
  saveStatus,
  saveError,
  dirty,
  pageErrorCount,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  viewport,
  onViewportChange,
  onOpenPageSettings,
  publishPending,
  onPublish,
  publishMessage,
}: Props) {
  let statusLabel = 'New page'
  if (meta.entryExists) {
    if (meta.hasUnpublishedChanges) statusLabel = 'Draft changes'
    else if (meta.hasPublished) statusLabel = 'Published'
    else if (meta.hasDraft) statusLabel = 'Draft'
  }

  return (
    <div className="pb-topbar sticky top-0 z-40 -mx-4 mb-2 border-b border-border-subtle bg-surface-page/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {pagesListHref ? (
          <>
            <a
              href={pagesListHref}
              className="focus-ring inline-flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Pages
            </a>
            <span className="h-5 w-px bg-border-subtle" aria-hidden="true" />
          </>
        ) : null}
        <button
          type="button"
          className="focus-ring max-w-56 truncate text-left text-sm font-bold text-ink hover:text-accent-orange"
          title="Edit page settings"
          onClick={onOpenPageSettings}
        >
          {title || 'Untitled page'}
        </button>
        <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-muted">
          {statusLabel}
        </span>
        <SaveIndicator
          status={saveStatus}
          error={saveError}
          dirty={dirty}
          pageErrorCount={pageErrorCount}
        />
        {publishMessage ? (
          <span className="text-xs font-semibold text-accent-green" role="status">
            {publishMessage}
          </span>
        ) : null}

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className={ICON_BUTTON_CLASS}
            aria-label="Undo"
            title="Undo (Cmd+Z)"
            disabled={!canUndo}
            onClick={onUndo}
          >
            <Undo2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={ICON_BUTTON_CLASS}
            aria-label="Redo"
            title="Redo (Cmd+Shift+Z)"
            disabled={!canRedo}
            onClick={onRedo}
          >
            <Redo2 className="h-4 w-4" aria-hidden="true" />
          </button>

          <span className="mx-1 h-5 w-px bg-border-subtle" aria-hidden="true" />

          <div
            className="flex rounded-lg border border-border-subtle p-0.5"
            role="radiogroup"
            aria-label="Preview width"
          >
            <button
              type="button"
              role="radio"
              aria-checked={viewport === 'desktop'}
              aria-label="Desktop width"
              title="Desktop width"
              className={`focus-ring inline-flex h-7 w-8 items-center justify-center rounded-md ${
                viewport === 'desktop'
                  ? 'bg-accent-orange text-primary-dark'
                  : 'text-ink-muted hover:text-ink'
              }`}
              onClick={() => onViewportChange('desktop')}
            >
              <Monitor className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={viewport === 'mobile'}
              aria-label="Mobile width"
              title="Mobile width"
              className={`focus-ring inline-flex h-7 w-8 items-center justify-center rounded-md ${
                viewport === 'mobile'
                  ? 'bg-accent-orange text-primary-dark'
                  : 'text-ink-muted hover:text-ink'
              }`}
              onClick={() => onViewportChange('mobile')}
            >
              <Smartphone className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <span className="mx-1 h-5 w-px bg-border-subtle" aria-hidden="true" />

          {publicPath ? (
            <a
              href={publicPath}
              target="_blank"
              rel="noreferrer"
              className={ICON_BUTTON_CLASS}
              aria-label="View live page"
              title="View live page (published version)"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
          <button
            type="button"
            className={ICON_BUTTON_CLASS}
            aria-label="Page settings"
            title="Page settings"
            onClick={onOpenPageSettings}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="focus-ring ml-1 inline-flex items-center gap-1.5 rounded-full border-2 border-accent-green bg-accent-orange px-4 py-1.5 text-sm font-bold text-primary-dark disabled:opacity-50"
            disabled={publishPending || pageErrorCount > 0}
            onClick={onPublish}
          >
            <CloudUpload className="h-4 w-4" aria-hidden="true" />
            {publishPending ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}

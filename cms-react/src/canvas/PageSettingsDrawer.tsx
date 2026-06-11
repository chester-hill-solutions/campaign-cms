import { X } from 'lucide-react'

import { cmsPagePublicPath } from '@campaign/cms-core'
import { AdminCheckbox, AdminTextArea, AdminTextInput } from '../ui'
import { MediaField, PanelSection } from './fields'
import type { PageMeta } from '@campaign/cms-core'

export type RevisionRow = {
  id: string
  version: number
  created_at: string
  message: string | null
}

type Props = {
  open: boolean
  onClose: () => void
  content: PageMeta
  onChange: (next: PageMeta) => void
  pageErrors: string[]
  revisions: RevisionRow[]
  restorePending: boolean
  onRestoreRevision: (revisionId: string) => void
  onApplyTemplate: () => void
}

/** Slide-over drawer for page meta, SEO, navigation, and revision history. */
export function PageSettingsDrawer({
  open,
  onClose,
  content,
  onChange,
  pageErrors,
  revisions,
  restorePending,
  onRestoreRevision,
  onApplyTemplate,
}: Props) {
  if (!open) return null

  const publicPath = content.slug ? cmsPagePublicPath(content.slug) : '/'

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-[26rem] max-w-full flex-col overflow-hidden border-l border-border-subtle bg-surface-card shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Page settings"
      >
        <header className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
          <h2 className="m-0 text-base font-semibold text-ink">Page settings</h2>
          <button
            type="button"
            className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded text-ink-muted hover:text-ink"
            aria-label="Close page settings"
            onClick={onClose}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="grid flex-1 content-start gap-4 overflow-y-auto px-5 py-4">
          {pageErrors.length > 0 ? (
            <div
              className="rounded-lg border border-accent-red bg-[color-mix(in_oklab,var(--accent-red)_8%,var(--surface-card))] p-2.5"
              role="alert"
            >
              <ul className="m-0 grid list-disc gap-0.5 pl-4 text-xs text-accent-red">
                {pageErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="grid gap-3">
            <AdminTextInput
              label="Title"
              value={content.title}
              onChange={(e) => onChange({ ...content, title: e.target.value })}
            />
            <AdminTextInput
              label="Slug"
              hint={
                <>
                  Public URL:{' '}
                  <a
                    href={publicPath}
                    className="font-semibold text-accent-orange underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {publicPath}
                  </a>
                </>
              }
              value={content.slug}
              onChange={(e) => onChange({ ...content, slug: e.target.value })}
            />
            <AdminTextArea
              label="Dek (subtitle)"
              value={content.dek ?? ''}
              rows={2}
              onChange={(e) =>
                onChange({ ...content, dek: e.target.value || undefined })
              }
            />
            <AdminCheckbox
              label="Enabled (visible to the public)"
              checked={content.enabled === 1}
              onChange={(e) => onChange({ ...content, enabled: e.target.checked ? 1 : 0 })}
            />
          </div>

          <PanelSection title="Navigation">
            <AdminCheckbox
              label="Show in site navigation"
              checked={content.showInNav === 1}
              onChange={(e) =>
                onChange({ ...content, showInNav: e.target.checked ? 1 : 0 })
              }
            />
            <AdminTextInput
              label="Nav label"
              value={content.navLabel}
              onChange={(e) => onChange({ ...content, navLabel: e.target.value })}
            />
            <AdminTextInput
              label="Nav order"
              type="number"
              min={0}
              max={999}
              value={String(content.navOrder ?? 0)}
              onChange={(e) =>
                onChange({ ...content, navOrder: Number(e.target.value) || 0 })
              }
            />
          </PanelSection>

          <PanelSection title="SEO">
            <AdminTextInput
              label="SEO title"
              value={content.seoTitle}
              onChange={(e) => onChange({ ...content, seoTitle: e.target.value })}
            />
            <AdminTextArea
              label="SEO description"
              value={content.seoDescription}
              rows={2}
              onChange={(e) => onChange({ ...content, seoDescription: e.target.value })}
            />
            <MediaField
              label="Social share image"
              value={content.ogImagePath ?? ''}
              onSelect={(path) =>
                onChange({ ...content, ogImagePath: path || undefined })
              }
              onClear={() => onChange({ ...content, ogImagePath: undefined })}
            />
            <AdminCheckbox
              label="Hide from search engines (noindex)"
              checked={content.noindex === 1}
              onChange={(e) =>
                onChange({ ...content, noindex: e.target.checked ? 1 : 0 })
              }
            />
          </PanelSection>

          <PanelSection title="Templates">
            <button
              type="button"
              className="focus-ring justify-self-start rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-elevated"
              onClick={onApplyTemplate}
            >
              Apply policy plank template
            </button>
            <p className="m-0 text-xs text-ink-muted">
              Replaces all blocks with the standard policy plank layout. Undo with
              Cmd+Z if needed.
            </p>
          </PanelSection>

          {revisions.length > 0 ? (
            <PanelSection title="Revision history">
              <ul className="m-0 grid list-none gap-1.5 p-0 text-sm">
                {revisions.map((rev) => (
                  <li key={rev.id} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-ink-muted">
                      v{rev.version} · {rev.created_at}
                    </span>
                    <button
                      type="button"
                      className="focus-ring shrink-0 text-xs font-semibold text-accent-orange underline"
                      disabled={restorePending}
                      onClick={() => onRestoreRevision(rev.id)}
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            </PanelSection>
          ) : null}
        </div>
      </aside>
    </>
  )
}

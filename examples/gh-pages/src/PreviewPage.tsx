import { BlockRenderer, CmsUiProvider } from '@campaign/cms-react'

import seedPage from '../../minimal-site/scripts/seed-about.json'
import type { PageDocPayload } from '@campaign/cms-core'

import { demoCmsUi } from './lib/cmsUi'
import { loadPublished, toPageMeta } from './lib/localDraft'

const REPO_URL = 'https://github.com/chester-hill-solutions/campaign-cms'
const seedMeta = toPageMeta(seedPage as PageDocPayload)

export function PreviewPage() {
  const page = loadPublished() ?? seedMeta
  const editorHref = (() => {
    const url = new URL(window.location.href)
    url.searchParams.delete('view')
    return url.toString()
  })()

  return (
    <div className="min-h-screen bg-surface-page text-ink antialiased">
      <header className="border-b border-border-subtle bg-surface-card">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="grid gap-0.5">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Published preview
            </p>
            <h1 className="m-0 text-base font-semibold text-ink">{page.title}</h1>
          </div>
          <a
            href={editorHref}
            className="focus-ring rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink no-underline hover:border-accent-green"
          >
            Back to editor
          </a>
        </div>
        <p className="mx-auto max-w-3xl px-4 pb-3 text-sm text-ink-muted sm:px-6">
          Shows the last version you published in this browser.{' '}
          <a href={REPO_URL} className="font-semibold text-accent-orange underline">
            campaign-cms
          </a>
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {page.dek ? <p className="m-0 mb-8 text-lg text-ink-muted">{page.dek}</p> : null}
        <CmsUiProvider config={demoCmsUi}>
          <BlockRenderer blocks={page.blocks} />
        </CmsUiProvider>
      </main>
    </div>
  )
}

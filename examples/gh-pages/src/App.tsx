import { BlockRenderer, CmsUiProvider } from '@campaign/cms-react'
import type { PageDocPayload } from '@campaign/cms-core'

import seedPage from '../../minimal-site/scripts/seed-about.json'
import { demoCmsUi } from './lib/cmsUi'

const page = seedPage as PageDocPayload

const REPO_URL = 'https://github.com/chester-hill-solutions/campaign-cms'

export function App() {
  return (
    <div className="min-h-screen bg-surface-page text-ink antialiased">
      <header className="border-b border-border-subtle bg-surface-card">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="grid gap-0.5">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Campaign CMS
            </p>
            <h1 className="m-0 text-base font-semibold text-ink">Live block preview</h1>
          </div>
          <a
            href={REPO_URL}
            className="focus-ring rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink no-underline hover:border-accent-green"
          >
            View on GitHub
          </a>
        </div>
        <p className="mx-auto max-w-3xl px-4 pb-3 text-sm text-ink-muted sm:px-6">
          Static published output from the{' '}
          <a href={REPO_URL} className="font-semibold text-accent-orange underline">
            minimal-site
          </a>{' '}
          seed data. Run the full page builder locally with D1 + autosave.
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8 grid gap-1 border-b border-border-subtle pb-6">
          <h2 className="m-0 text-3xl font-semibold text-ink">{page.title}</h2>
          {page.dek ? <p className="m-0 text-lg text-ink-muted">{page.dek}</p> : null}
        </div>
        <CmsUiProvider config={demoCmsUi}>
          <BlockRenderer blocks={page.blocks} />
        </CmsUiProvider>
      </main>

      <footer className="border-t border-border-subtle bg-surface-elevated">
        <p className="mx-auto max-w-3xl px-4 py-6 text-center text-sm text-ink-muted sm:px-6">
          MIT ·{' '}
          <a href={REPO_URL} className="font-semibold text-accent-orange underline">
            Chester Hill Solutions
          </a>
        </p>
      </footer>
    </div>
  )
}

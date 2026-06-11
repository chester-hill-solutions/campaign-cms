import { BlockRenderer, CmsUiProvider } from '@campaign/cms-react'
import type { PageDocPayload } from '@campaign/cms-core'

import { exampleCmsUi } from '../lib/cms/cmsUi'

export function PageDocPage({ page }: { page: PageDocPayload }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <CmsUiProvider config={exampleCmsUi}>
        <BlockRenderer blocks={page.blocks} />
      </CmsUiProvider>
    </main>
  )
}

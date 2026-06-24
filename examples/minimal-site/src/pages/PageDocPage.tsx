import { BlockRenderer, CmsUiProvider } from '@chester-hill-solutions/cms-react'
import type { PageDocPayload } from '@chester-hill-solutions/cms-core'

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

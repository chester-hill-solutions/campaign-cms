import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageDocPage } from '../pages/PageDocPage'
import { loadPublicPageFn } from '../server/cmsFns'

export const Route = createFileRoute('/about')({
  loader: async () => {
    const page = await loadPublicPageFn({ data: 'about' })
    if (!page || page.enabled !== 1) throw notFound()
    return page
  },
  head: ({ loaderData: page }) => ({
    meta: page
      ? [
          { title: page.seoTitle },
          { name: 'description', content: page.seoDescription },
        ]
      : [],
  }),
  component: AboutPage,
})

function AboutPage() {
  const page = Route.useLoaderData()
  return <PageDocPage page={page} />
}

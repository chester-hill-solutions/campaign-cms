import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import { NotFoundPage } from '../pages/NotFoundPage'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [{ title: 'Campaign CMS — Page editor' }],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href={appCss} />
        <HeadContent />
      </head>
      <body className="min-h-screen bg-surface-page text-ink antialiased">
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}

import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import { NotFoundPage } from '../pages/NotFoundPage'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Campaign CMS Example</title>
        <link rel="stylesheet" href={appCss} />
        <HeadContent />
      </head>
      <body className="min-h-screen bg-surface-page text-ink antialiased">
        <header className="border-b border-line-strong px-4 py-3">
          <nav className="mx-auto flex max-w-3xl items-center gap-4 text-sm">
            <a href="/" className="font-semibold text-ink">
              Campaign CMS Example
            </a>
            <a href="/about" className="text-ink-muted hover:text-ink">
              About
            </a>
            <a href="/admin/pages/page-about" className="text-accent-orange hover:underline">
              Edit page
            </a>
          </nav>
        </header>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}

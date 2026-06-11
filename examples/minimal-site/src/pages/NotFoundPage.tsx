export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-ink-muted">
        <a href="/about" className="text-accent-orange underline">
          View the example page
        </a>
      </p>
    </main>
  )
}

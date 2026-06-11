/** Published preview URL for this static demo (query param avoids GH Pages SPA routing). */
export function demoPreviewHref(): string {
  const url = new URL(window.location.href)
  url.searchParams.set('view', 'preview')
  return url.toString()
}

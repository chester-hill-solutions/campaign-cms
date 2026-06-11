/**
 * Sanitizes admin-authored custom HTML before public render.
 * Strips scripts, inline event handlers, and javascript: URLs.
 */
export function sanitizeCustomHtml(html: string): string {
  let out = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  out = out.replace(/\s(on\w+)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  out = out.replace(/\b(href|src|xlink:href)\s*=\s*(["']?)\s*javascript:[^"'>\s]*/gi, '$1=$2#')
  return out
}

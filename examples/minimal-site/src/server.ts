import handler from '@tanstack/react-start/server-entry'

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/media/')) {
      const key = decodeURIComponent(url.pathname.slice('/media/'.length))
      if (key) {
        const { streamMediaFromR2 } = await import('./lib/cms/content.server')
        const mediaResponse = await streamMediaFromR2(key)
        if (mediaResponse) return mediaResponse
        return new Response('Not found', { status: 404 })
      }
    }

    return handler.fetch(request, env, ctx)
  },
}

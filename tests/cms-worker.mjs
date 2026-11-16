import { env } from 'cloudflare:workers'
import { cmsStore } from '../examples/minimal-site/src/lib/cms/content.server.ts'
import { saveDraftInputSchema, saveEditorDraft, publishPageInputSchema, publishEditorDraft } from '../examples/minimal-site/src/lib/cms/editorMutations.server.ts'
import { cmsAgentTools } from '../examples/minimal-site/src/lib/cms/agent.server.ts'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    try {
      if (url.pathname === '/setup') {
        const input = await request.json()
        for (const sql of [...input.migrations, ...input.seed]) await env.DB.prepare(sql).run()
        return Response.json({ ok: true })
      }
      if (url.pathname === '/author') {
        const state = await cmsStore.getPageDocEditorState('page-about')
        return Response.json(await env.DB.prepare('SELECT created_by FROM content_revisions WHERE id = ?').bind(state.entry.draft_revision_id).first())
      }
      if (url.pathname === '/media') {
        const data = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg=='), value => value.charCodeAt(0))
        const input = { filename: 'one.png', mime: 'image/png', bytes: data.buffer, alt: 'A demonstration pixel' }
        const first = await cmsStore.uploadMediaAsset(input)
        const second = await cmsStore.uploadMediaAsset(input)
        if (!first.ok || !second.ok) return Response.json({ first, second }, { status: 400 })
        const response = await cmsStore.streamMediaFromR2(first.asset.r2_key)
        return Response.json({ first: first.asset.r2_key, second: second.asset.r2_key, status: response.status, contentType: response.headers.get('content-type'), bytes: (await response.arrayBuffer()).byteLength, expectedBytes: data.byteLength })
      }
      if (url.pathname === '/state') return Response.json(await cmsStore.getPageDocEditorState('page-about'))
      if (url.pathname === '/public') return Response.json(await cmsStore.getPublishedPageDocBySlug(url.searchParams.get('slug') ?? 'about'))
      const input = await request.json()
      if (url.pathname === '/save') {
        const result = await saveEditorDraft(cmsStore, saveDraftInputSchema.parse(input))
        return Response.json(result, { status: result.ok ? 200 : 409 })
      }
      if (url.pathname === '/publish') {
        const result = await publishEditorDraft(cmsStore, publishPageInputSchema.parse(input))
        return Response.json(result, { status: result.ok ? 200 : 409 })
      }
      if (url.pathname === '/agent') return Response.json(await cmsAgentTools.invoke(input.name, input.input, { transport: 'mcp' }))
      return new Response('Not found', { status: 404 })
    } catch (error) {
      return Response.json({ error: error.message, name: error.name }, { status: 409 })
    }
  },
}

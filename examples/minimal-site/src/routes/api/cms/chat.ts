import { env } from 'cloudflare:workers'
import { createFileRoute } from '@tanstack/react-router'
import {
  chat,
  chatParamsFromRequest,
  maxIterations,
  toServerSentEventsResponse,
  toolDefinition,
} from '@tanstack/ai'
import { createOpenRouterText } from '@tanstack/ai-openrouter'

type OpenRouterModel = Parameters<typeof createOpenRouterText>[0]

import { cmsToolSpecs, isAgentEnabled } from '../../../lib/cms/agent.server'

const MAX_AGENT_ITERATIONS = 10
const CHAT_TIMEOUT_MS = 60_000
const DEFAULT_MODEL = 'openai/gpt-4o-mini'

const SYSTEM_PROMPT = `You are the content agent for this campaign website CMS.
You operate pages made of typed blocks via the provided tools.

Rules:
- All edits go to the page draft; nothing is live until publish_page is approved.
- Call get_block_types before adding or updating blocks so field names are exact.
- For large pages, prefer get_page with view "summary" first.
- Tool errors include a [CODE] and a recovery hint — follow the hint, fix the
  input, and retry rather than giving up.
- Never invent entry ids or block ids; read them from list_pages / get_page.`

/** CMS tool specs wrapped as TanStack AI server tools. */
const tools = cmsToolSpecs.map((spec) =>
  toolDefinition({
    name: spec.name,
    description: spec.description,
    inputSchema: spec.inputSchema,
    needsApproval: spec.needsApproval,
  }).server(async (input: unknown) => spec.execute(input)),
)

export const Route = createFileRoute('/api/cms/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAgentEnabled()) {
          return new Response('Not found', { status: 404 })
        }
        if (!env.OPENROUTER_API_KEY) {
          return Response.json(
            { error: 'OPENROUTER_API_KEY is not configured' },
            { status: 500 },
          )
        }

        let params: Awaited<ReturnType<typeof chatParamsFromRequest>>
        try {
          params = await chatParamsFromRequest(request)
        } catch (e) {
          if (e instanceof Response) return e
          return Response.json({ error: 'Invalid request body' }, { status: 400 })
        }

        const abortController = new AbortController()
        const timeout = setTimeout(() => abortController.abort(), CHAT_TIMEOUT_MS)

        try {
          const model = (env.CMS_AGENT_MODEL ?? DEFAULT_MODEL) as OpenRouterModel
          const stream = chat({
            adapter: createOpenRouterText(model, env.OPENROUTER_API_KEY),
            messages: params.messages,
            systemPrompts: [SYSTEM_PROMPT],
            tools,
            agentLoopStrategy: maxIterations(MAX_AGENT_ITERATIONS),
            abortController,
          })
          const response = toServerSentEventsResponse(stream)
          // The timeout stays armed for the duration of the stream; aborting
          // a finished stream is a no-op, so clearing on full consumption is
          // unnecessary in the Workers request lifecycle.
          return response
        } catch (e) {
          clearTimeout(timeout)
          console.error('cms-agent chat route error', e)
          return Response.json(
            { error: 'Agent chat failed to start. Try again.' },
            { status: 500 },
          )
        }
      },
    },
  },
})

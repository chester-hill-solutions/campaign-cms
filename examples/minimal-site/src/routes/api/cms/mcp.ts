import { env } from 'cloudflare:workers'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { formatToolError } from '@campaign/cms-agent/tanstack'

import { cmsAgentTools } from '../../../lib/cms/agent.server'

/**
 * Stateless MCP server (streamable HTTP, JSON responses) exposing the same
 * CMS agent tools as the chat route. Requires a shared secret:
 *   Authorization: Bearer ${CMS_AGENT_MCP_SECRET}  (or X-CMS-Agent-Key)
 * Never expose this route publicly without the secret and HTTPS.
 */

const PROTOCOL_VERSION = '2025-03-26'

function isAuthorized(request: Request): boolean {
  const secret = env.CMS_AGENT_MCP_SECRET
  if (!secret) return false
  const auth = request.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true
  return request.headers.get('x-cms-agent-key') === secret
}

function rpcResult(id: unknown, result: unknown): Response {
  return Response.json({ jsonrpc: '2.0', id, result })
}

function rpcError(id: unknown, code: number, message: string): Response {
  return Response.json({ jsonrpc: '2.0', id, error: { code, message } })
}

export const Route = createFileRoute('/api/cms/mcp')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Route is invisible without a configured secret (defense in depth
        // on top of the agent kill switch checked inside every tool).
        if (!env.CMS_AGENT_MCP_SECRET) {
          return new Response('Not found', { status: 404 })
        }
        if (!isAuthorized(request)) {
          return new Response('Unauthorized', { status: 401 })
        }

        let body: { jsonrpc?: string; id?: unknown; method?: string; params?: unknown }
        try {
          body = await request.json()
        } catch {
          return rpcError(null, -32700, 'Parse error')
        }
        const { id, method, params } = body

        switch (method) {
          case 'initialize':
            return rpcResult(id, {
              protocolVersion: PROTOCOL_VERSION,
              capabilities: { tools: {} },
              serverInfo: { name: 'campaign-cms-agent', version: '0.1.0' },
            })

          case 'notifications/initialized':
            return new Response(null, { status: 202 })

          case 'ping':
            return rpcResult(id, {})

          case 'tools/list':
            return rpcResult(id, {
              tools: cmsAgentTools.tools.map((tool) => ({
                name: tool.name,
                description: tool.description,
                inputSchema: z.toJSONSchema(tool.inputSchema, { io: 'input' }),
              })),
            })

          case 'tools/call': {
            const callParams = params as
              | { name?: string; arguments?: unknown }
              | undefined
            if (!callParams?.name) {
              return rpcError(id, -32602, 'Missing tool name')
            }
            const result = await cmsAgentTools.invoke(
              callParams.name,
              callParams.arguments ?? {},
              { transport: 'mcp' },
            )
            const text = result.ok
              ? JSON.stringify(result.data ?? null)
              : formatToolError(result)
            return rpcResult(id, {
              content: [{ type: 'text', text }],
              isError: !result.ok,
            })
          }

          default:
            return rpcError(id, -32601, `Method not found: ${method}`)
        }
      },
    },
  },
})

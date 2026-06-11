import type { z } from 'zod'

import type { CmsAgentTools } from './tools'
import type { ToolError } from './types'

/**
 * Framework-agnostic tool spec consumed by the host's TanStack AI wiring
 * (or any LLM tool-calling runtime). Deliberately has no dependency on
 * @tanstack/ai so beta API churn stays isolated in the host adapter file.
 */
export type CmsToolSpec = {
  name: string
  description: string
  /** Zod schema for the tool input — convert with the runtime's helper. */
  inputSchema: z.ZodType
  /** Transports must require human approval before executing (publish). */
  needsApproval: boolean
  /**
   * Execute and serialize for the model. Success returns JSON data;
   * failure returns a "[CODE] message" string with a recovery hint.
   * Never throws and never leaks stack traces or store internals.
   */
  execute: (input: unknown) => Promise<string>
}

/** Model-facing serialization of a failed tool call. */
export function formatToolError(error: ToolError): string {
  const parts = [`[${error.code}] ${error.error}`]
  if (error.fieldErrors?.length) {
    const details = error.fieldErrors
      .slice(0, 10)
      .map((fe) =>
        fe.blockId ? `${fe.blockId}.${fe.field}: ${fe.message}` : `${fe.field}: ${fe.message}`,
      )
      .join('; ')
    parts.push(`Fields: ${details}`)
  }
  if (error.suggestion) parts.push(error.suggestion)
  if (error.retryable) parts.push('This may be transient — retrying is safe.')
  return parts.join(' ')
}

export function createCmsToolSpecs(
  agentTools: CmsAgentTools,
  transport: 'chat' | 'mcp' | 'http' = 'chat',
): CmsToolSpec[] {
  return agentTools.tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    needsApproval: tool.needsApproval,
    execute: async (input: unknown) => {
      const result = await tool.execute(input, { transport })
      if (!result.ok) return formatToolError(result)
      return JSON.stringify(result.data ?? null)
    },
  }))
}

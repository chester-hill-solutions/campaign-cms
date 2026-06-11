import type { z } from 'zod'

import { runAuthHook, safeTool, zodInputError } from '../errors'
import type { CmsAgentToolName } from '../schemas'
import type { AgentCallContext, CmsAgentConfig, ToolResult } from '../types'

export type CmsAgentTool = {
  name: CmsAgentToolName
  description: string
  inputSchema: z.ZodType
  /** True for tools that write; transports should gate these harder. */
  mutates: boolean
  /** Transports should require human approval before executing (publish). */
  needsApproval: boolean
  execute: (
    rawInput: unknown,
    ctxOverride?: Partial<Omit<AgentCallContext, 'toolName'>>,
  ) => Promise<ToolResult>
}

type MakeToolOptions<TSchema extends z.ZodType> = {
  name: CmsAgentToolName
  description: string
  inputSchema: TSchema
  mutates: boolean
  needsApproval?: boolean
  config: CmsAgentConfig
  handler: (input: z.infer<TSchema>) => Promise<ToolResult>
}

/**
 * Wrap a handler with the standard tool envelope: auth hooks (read always,
 * mutate for writes), Zod input validation, and never-throw semantics.
 */
export function makeTool<TSchema extends z.ZodType>(
  opts: MakeToolOptions<TSchema>,
): CmsAgentTool {
  const { name, description, inputSchema, mutates, config, handler } = opts

  return {
    name,
    description,
    inputSchema,
    mutates,
    needsApproval: opts.needsApproval ?? false,
    execute: (rawInput, ctxOverride) => {
      const ctx: AgentCallContext = {
        toolName: name,
        actorId: ctxOverride?.actorId ?? config.actorId,
        transport: ctxOverride?.transport,
      }
      return safeTool(ctx, config.onToolComplete, async () => {
        await runAuthHook(config.assertCanRead, ctx)
        if (mutates) await runAuthHook(config.assertCanMutate, ctx)

        const parsed = inputSchema.safeParse(rawInput ?? {})
        if (!parsed.success) return zodInputError(parsed.error)

        return handler(parsed.data as z.infer<TSchema>)
      })
    },
  }
}

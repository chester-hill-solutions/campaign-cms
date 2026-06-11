import { toolError } from '../errors'
import type { CmsAgentToolName } from '../schemas'
import type {
  AgentCallContext,
  CmsAgentConfig,
  CmsAgentStore,
  ToolResult,
} from '../types'
import { createBlockTools } from './blockTools'
import { createReadTools } from './readTools'
import { createWriteTools } from './writeTools'
import type { CmsAgentTool } from './makeTool'

export type CmsAgentTools = {
  /** All tools in a stable order: reads, block writes, page writes. */
  tools: CmsAgentTool[]
  /** Invoke a tool by name with raw (unvalidated) input. Never throws. */
  invoke: (
    name: string,
    input: unknown,
    ctx?: Partial<Omit<AgentCallContext, 'toolName'>>,
  ) => Promise<ToolResult>
}

export function createCmsAgentTools(
  store: CmsAgentStore,
  config: CmsAgentConfig,
): CmsAgentTools {
  const tools = [
    ...createReadTools(store, config),
    ...createBlockTools(store, config),
    ...createWriteTools(store, config),
  ]
  const byName = new Map<CmsAgentToolName, CmsAgentTool>(
    tools.map((tool) => [tool.name, tool]),
  )

  return {
    tools,
    invoke: async (name, input, ctx) => {
      const tool = byName.get(name as CmsAgentToolName)
      if (!tool) {
        return toolError('NOT_FOUND', `Unknown tool "${name}"`, {
          suggestion: `Valid tools: ${tools.map((t) => t.name).join(', ')}`,
        })
      }
      return tool.execute(input, ctx)
    },
  }
}

export type { CmsAgentTool } from './makeTool'

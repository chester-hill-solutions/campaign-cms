import type { AgentCallOverrides, CmsAgentConfig, CmsAgentStore, ToolResult } from '../types.js';
import type { CmsAgentTool } from './makeTool.js';
export type CmsAgentTools = {
    /** All tools in a stable order: reads, block writes, page writes. */
    tools: CmsAgentTool[];
    /** Invoke a tool by name with raw (unvalidated) input. Never throws. */
    invoke: (name: string, input: unknown, ctx?: AgentCallOverrides) => Promise<ToolResult>;
};
export declare function createCmsAgentTools(store: CmsAgentStore, config: CmsAgentConfig): CmsAgentTools;
export type { CmsAgentTool } from './makeTool.js';

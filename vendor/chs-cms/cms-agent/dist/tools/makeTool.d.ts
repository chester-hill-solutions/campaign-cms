import type { z } from 'zod';
import type { CmsAgentToolName } from '../schemas.js';
import type { AgentCallOverrides, CmsAgentConfig, ToolResult } from '../types.js';
export type CmsAgentTool = {
    name: CmsAgentToolName;
    description: string;
    inputSchema: z.ZodType;
    /** True for tools that write; transports should gate these harder. */
    mutates: boolean;
    /** Transports should require human approval before executing (publish). */
    needsApproval: boolean;
    execute: (rawInput: unknown, ctxOverride?: AgentCallOverrides) => Promise<ToolResult>;
};
type MakeToolOptions<TSchema extends z.ZodType> = {
    name: CmsAgentToolName;
    description: string;
    inputSchema: TSchema;
    mutates: boolean;
    needsApproval?: boolean;
    config: CmsAgentConfig;
    handler: (input: z.infer<TSchema>) => Promise<ToolResult>;
};
/**
 * Wrap a handler with the standard tool envelope: auth hooks (read always,
 * mutate for writes), Zod input validation, and never-throw semantics.
 */
export declare function makeTool<TSchema extends z.ZodType>(opts: MakeToolOptions<TSchema>): CmsAgentTool;
export {};

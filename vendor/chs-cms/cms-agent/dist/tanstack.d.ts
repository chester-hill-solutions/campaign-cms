import type { z } from 'zod';
import type { CmsAgentTools } from './tools';
import type { ToolError } from './types';
/**
 * Framework-agnostic tool spec consumed by the host's TanStack AI wiring
 * (or any LLM tool-calling runtime). Deliberately has no dependency on
 * @tanstack/ai so beta API churn stays isolated in the host adapter file.
 */
export type CmsToolSpec = {
    name: string;
    description: string;
    /** Zod schema for the tool input — convert with the runtime's helper. */
    inputSchema: z.ZodType;
    /** Transports must require human approval before executing (publish). */
    needsApproval: boolean;
    /**
     * Execute and serialize for the model. Success returns JSON data;
     * failure returns a "[CODE] message" string with a recovery hint.
     * Never throws and never leaks stack traces or store internals.
     */
    execute: (input: unknown) => Promise<string>;
};
/** Model-facing serialization of a failed tool call. */
export declare function formatToolError(error: ToolError): string;
export declare function createCmsToolSpecs(agentTools: CmsAgentTools, transport?: 'chat' | 'mcp' | 'http'): CmsToolSpec[];

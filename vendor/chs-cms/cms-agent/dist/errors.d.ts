import type { z } from 'zod';
import type { AgentCallContext, PageMeta, ToolError, ToolResult } from './types';
export declare function toolError(code: ToolError['code'], error: string, extra?: Pick<ToolError, 'fieldErrors' | 'suggestion' | 'retryable'>): ToolError;
export declare function notFound(what: string, suggestion?: string): ToolError;
export declare function forbidden(reason?: string): ToolError;
/** Map a failed Zod parse of tool input to a VALIDATION error. */
export declare function zodInputError(parseError: z.ZodError): ToolError;
/** Validate a full page and map block-level issues to fieldErrors. */
export declare function pageValidationError(content: PageMeta): ToolError | null;
/**
 * Run a tool body, converting auth denials and unexpected throws into
 * structured errors. Tool handlers must never throw to the transport layer.
 */
export declare function safeTool<T>(ctx: AgentCallContext, onComplete: ((ctx: AgentCallContext, result: ToolResult) => void) | undefined, fn: () => Promise<ToolResult<T>>): Promise<ToolResult<T>>;
/** Thrown internally when an assertCanRead/assertCanMutate hook denies. */
export declare class AgentAccessDenied extends Error {
}
/** Wrap host auth hooks so any throw maps to FORBIDDEN (not INTERNAL). */
export declare function runAuthHook(hook: (ctx: AgentCallContext) => void | Promise<void>, ctx: AgentCallContext): Promise<void>;

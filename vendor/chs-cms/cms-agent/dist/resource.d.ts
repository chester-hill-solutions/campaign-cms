import type { CmsAgentToolName } from './schemas.js';
import type { AgentResource } from './types.js';
/**
 * Select the resource a tool call acts on from its parsed input.
 *
 * Called after Zod validation, so a valid input always carries the field. A missing one yields
 * `unknown` rather than `site`, because falling back to the wider scope would turn a malformed
 * call into an authorized one.
 */
export declare function selectToolResource(toolName: CmsAgentToolName, input: unknown): AgentResource;

import type { ToolResult } from './types.js';
import type { CmsAgentTools } from './tools/index.js';
/**
 * An HTTP transport for the CMS tools.
 *
 * The package has always described how to *build* the tools and never how to
 * expose them, which left every host to write the same forty lines — and to
 * rediscover the same three decisions. This is those forty lines, once:
 *
 *   GET  <path>  -> the tool list, with flags, so an agent can bootstrap
 *   POST <path>  -> { "tool": "<name>", "input": { ... } }
 *
 * The three decisions, since each is a way to get this wrong:
 *
 * 1. **Authentication is the host's, and refusing is the default.** The transport
 *    never reads a cookie and never guesses: it calls `authenticate` and refuses
 *    with 401 when that returns nothing. A transport that fell back to a session
 *    cookie would inherit CSRF, because a browser attaches cookies to requests it
 *    was tricked into making.
 * 2. **Tool codes are HTTP statuses.** `NOT_FOUND` 404, `VALIDATION` 400,
 *    `CONFLICT` 409, `FORBIDDEN` 403, `PRECONDITION` 409, `INTERNAL` 500. A caller
 *    can branch on the status or on the body's `code`; both say the same thing, so
 *    a proxy or a retry policy that only understands statuses still behaves.
 * 3. **Approval-flagged tools are opt-in per caller.** The tools already carry
 *    `needsApproval`; `allowApproval` decides who may call them. Defaulting to
 *    allowed would make the flag decorative, so the default is to refuse, and the
 *    refusal is a `FORBIDDEN` the agent can act on rather than a 500.
 */
export type CmsAgentPrincipal = {
    /** Recorded in the call context, so a revision and an audit line name the caller. */
    name: string;
    /** Whether this caller may invoke approval-flagged tools. Defaults to false. */
    canApprove?: boolean;
};
export type CmsAgentHttpOptions = {
    /**
     * Resolve the caller from the request. Return null to refuse.
     *
     * Compare a secret in constant time; see the note on `timingSafeEqual` below for
     * why that is worth the loop.
     */
    authenticate: (request: Request) => CmsAgentPrincipal | null | Promise<CmsAgentPrincipal | null>;
    /**
     * The tools for this caller. A function when authorisation depends on who is
     * asking, which is the usual case: the publish rule has to be enforced inside the
     * tool layer, not only at the door.
     */
    tools: CmsAgentTools | ((principal: CmsAgentPrincipal) => CmsAgentTools);
    /**
     * Called after a tool that mutates, for audit. Given the resolved principal, the
     * tool name and the result, so a host can record who changed what.
     */
    onWrite?: (principal: CmsAgentPrincipal, toolName: string, result: ToolResult) => void | Promise<void>;
};
/**
 * Extract a bearer token, or null.
 *
 * Exported because every host writes this the same way and some write it wrong:
 * a case-sensitive match rejects `bearer`, and a match anywhere in the header
 * accepts `notbearer x`.
 */
export declare function bearerToken(request: Request): string | null;
/**
 * Compare two secrets without leaking their length or the position of the first
 * difference through timing.
 *
 * A plain `===` returns as soon as two characters differ. Over a network that is
 * hard to exploit and not impossible, and the alternative costs one loop.
 */
export declare function timingSafeEqual(a: string, b: string): boolean;
/**
 * Build the handler. Mount it wherever the host routes a path, and it takes the
 * whole request from there.
 *
 * ```ts
 * const agent = createCmsAgentHttpHandler({
 *   authenticate: async (request) => {
 *     const token = bearerToken(request)
 *     return token && timingSafeEqual(token, env.CMS_AGENT_TOKEN)
 *       ? { name: 'cms-agent', canApprove: false }
 *       : null
 *   },
 *   tools: (principal) => createCmsAgentTools(store, configFor(principal)),
 *   onWrite: (principal, tool, result) => audit(principal.name, tool, result),
 * })
 * ```
 */
export declare function createCmsAgentHttpHandler(options: CmsAgentHttpOptions): (request: Request) => Promise<Response>;

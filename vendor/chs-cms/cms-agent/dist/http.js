import { toolError } from './errors.js';
const STATUS_BY_CODE = {
    NOT_FOUND: 404,
    VALIDATION: 400,
    CONFLICT: 409,
    FORBIDDEN: 403,
    PRECONDITION: 409,
    INTERNAL: 500,
};
/**
 * Extract a bearer token, or null.
 *
 * Exported because every host writes this the same way and some write it wrong:
 * a case-sensitive match rejects `bearer`, and a match anywhere in the header
 * accepts `notbearer x`.
 */
export function bearerToken(request) {
    const header = request.headers.get('Authorization');
    if (!header)
        return null;
    const match = /^Bearer\s+(.+)$/i.exec(header.trim());
    return match ? match[1].trim() : null;
}
/**
 * Compare two secrets without leaking their length or the position of the first
 * difference through timing.
 *
 * A plain `===` returns as soon as two characters differ. Over a network that is
 * hard to exploit and not impossible, and the alternative costs one loop.
 */
export function timingSafeEqual(a, b) {
    if (a.length !== b.length)
        return false;
    let difference = 0;
    for (let index = 0; index < a.length; index += 1) {
        difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
    }
    return difference === 0;
}
function unauthorized() {
    return Response.json({
        ok: false,
        code: 'FORBIDDEN',
        error: 'A valid agent token is required.',
        suggestion: 'Send Authorization: Bearer <token>.',
    }, { status: 401 });
}
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
export function createCmsAgentHttpHandler(options) {
    const toolsFor = (principal) => typeof options.tools === 'function' ? options.tools(principal) : options.tools;
    return async (request) => {
        const principal = await options.authenticate(request);
        if (!principal)
            return unauthorized();
        const tools = toolsFor(principal);
        if (request.method === 'GET') {
            return Response.json({
                ok: true,
                canApprove: principal.canApprove ?? false,
                tools: tools.tools.map((tool) => ({
                    name: tool.name,
                    description: tool.description,
                    mutates: tool.mutates,
                    needsApproval: tool.needsApproval,
                })),
            });
        }
        if (request.method !== 'POST') {
            return Response.json({
                ok: false,
                code: 'VALIDATION',
                error: 'Use POST to call a tool, GET to list them.',
            }, { status: 405 });
        }
        const body = (await request.json().catch(() => null));
        if (!body || typeof body.tool !== 'string' || !body.tool.trim()) {
            return Response.json({
                ok: false,
                code: 'VALIDATION',
                error: 'Pass {"tool": "<name>", "input": { ... }}.',
                suggestion: 'GET this path to list every tool with its description.',
            }, { status: 400 });
        }
        const name = body.tool.trim();
        const tool = tools.tools.find((candidate) => candidate.name === name);
        // The approval gate, before the call. `FORBIDDEN` rather than a 500, because
        // the agent can act on it: it needs a different token, not a retry.
        if (tool?.needsApproval && !(principal.canApprove ?? false)) {
            return Response.json(toolError('FORBIDDEN', `${name} needs an approving caller.`, {
                suggestion: 'Save a draft instead, or call this with a token that may approve.',
            }), { status: 403 });
        }
        const result = await tools.invoke(name, body.input ?? {}, {
            actorId: principal.name,
            transport: 'http',
        });
        if (!result.ok) {
            return Response.json(result, { status: STATUS_BY_CODE[result.code] ?? 500 });
        }
        if (tool?.mutates)
            await options.onWrite?.(principal, name, result);
        return Response.json(result);
    };
}

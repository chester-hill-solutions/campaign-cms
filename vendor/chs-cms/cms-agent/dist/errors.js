import { validatePageDoc } from '@chester-hill-solutions/cms-core';
export function toolError(code, error, extra) {
    return { ok: false, code, error, ...extra };
}
export function notFound(what, suggestion) {
    return toolError('NOT_FOUND', `${what} not found`, { suggestion });
}
export function forbidden(reason) {
    return toolError('FORBIDDEN', reason ?? 'Not authorized for this operation');
}
/** Map a failed Zod parse of tool input to a VALIDATION error. */
export function zodInputError(parseError) {
    const fieldErrors = parseError.issues.map((issue) => ({
        field: issue.path.map(String).join('.') || 'input',
        message: issue.message,
    }));
    return toolError('VALIDATION', 'Invalid tool input', {
        fieldErrors,
        suggestion: 'Check the field names and types against the tool schema.',
    });
}
/** Validate a full page and map block-level issues to fieldErrors. */
export function pageValidationError(content) {
    const result = validatePageDoc(content);
    if (result.ok)
        return null;
    const fieldErrors = [];
    for (const [blockId, messages] of result.byBlock) {
        for (const message of messages) {
            fieldErrors.push({ blockId, field: 'block', message });
        }
    }
    for (const message of result.page) {
        fieldErrors.push({ field: 'page', message });
    }
    return toolError('VALIDATION', 'Page content failed validation', {
        fieldErrors,
        suggestion: 'Call get_block_types to see the valid fields for each block type.',
    });
}
/**
 * Run a tool body, converting auth denials and unexpected throws into
 * structured errors. Tool handlers must never throw to the transport layer.
 */
export async function safeTool(ctx, onComplete, fn) {
    let result;
    try {
        result = await fn();
    }
    catch (e) {
        result =
            e instanceof AgentAccessDenied
                ? forbidden(e.message)
                : toolError('INTERNAL', 'Unexpected error executing tool', {
                    retryable: true,
                });
    }
    onComplete?.(ctx, result);
    return result;
}
/** Thrown internally when an assertCanRead/assertCanMutate hook denies. */
export class AgentAccessDenied extends Error {
}
/** Wrap host auth hooks so any throw maps to FORBIDDEN (not INTERNAL). */
export async function runAuthHook(hook, ctx) {
    try {
        await hook(ctx);
    }
    catch (e) {
        throw new AgentAccessDenied(e instanceof Error ? e.message : 'Access denied');
    }
}

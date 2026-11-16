import { runAuthHook, safeTool, zodInputError } from '../errors.js';
import { selectToolResource } from '../resource.js';
/**
 * Wrap a handler with the standard tool envelope: auth hooks (read always,
 * mutate for writes), Zod input validation, and never-throw semantics.
 */
export function makeTool(opts) {
    const { name, description, inputSchema, mutates, config, handler } = opts;
    return {
        name,
        description,
        inputSchema,
        mutates,
        needsApproval: opts.needsApproval ?? false,
        execute: (rawInput, ctxOverride) => {
            const parsed = inputSchema.safeParse(rawInput ?? {});
            const ctx = {
                toolName: name,
                actorId: ctxOverride?.actorId ?? config.actorId,
                transport: ctxOverride?.transport,
                // The resource comes from the parsed input, never from the override: a transport must
                // not be able to widen the scope of the authorization decision it triggers.
                resource: selectToolResource(name, parsed.success ? parsed.data : undefined),
            };
            return safeTool(ctx, config.onToolComplete, async () => {
                await runAuthHook(config.assertCanRead, ctx);
                if (mutates)
                    await runAuthHook(config.assertCanMutate, ctx);
                if (!parsed.success)
                    return zodInputError(parsed.error);
                return handler(parsed.data);
            });
        },
    };
}

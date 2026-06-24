import { runAuthHook, safeTool, zodInputError } from '../errors';
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
            const ctx = {
                toolName: name,
                actorId: ctxOverride?.actorId ?? config.actorId,
                transport: ctxOverride?.transport,
            };
            return safeTool(ctx, config.onToolComplete, async () => {
                await runAuthHook(config.assertCanRead, ctx);
                if (mutates)
                    await runAuthHook(config.assertCanMutate, ctx);
                const parsed = inputSchema.safeParse(rawInput ?? {});
                if (!parsed.success)
                    return zodInputError(parsed.error);
                return handler(parsed.data);
            });
        },
    };
}

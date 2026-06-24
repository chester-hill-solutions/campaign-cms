/** Model-facing serialization of a failed tool call. */
export function formatToolError(error) {
    const parts = [`[${error.code}] ${error.error}`];
    if (error.fieldErrors?.length) {
        const details = error.fieldErrors
            .slice(0, 10)
            .map((fe) => fe.blockId ? `${fe.blockId}.${fe.field}: ${fe.message}` : `${fe.field}: ${fe.message}`)
            .join('; ');
        parts.push(`Fields: ${details}`);
    }
    if (error.suggestion)
        parts.push(error.suggestion);
    if (error.retryable)
        parts.push('This may be transient — retrying is safe.');
    return parts.join(' ');
}
export function createCmsToolSpecs(agentTools, transport = 'chat') {
    return agentTools.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        needsApproval: tool.needsApproval,
        execute: async (input) => {
            const result = await tool.execute(input, { transport });
            if (!result.ok)
                return formatToolError(result);
            return JSON.stringify(result.data ?? null);
        },
    }));
}

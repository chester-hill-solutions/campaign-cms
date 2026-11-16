import { toolError } from '../errors.js';
import { createBlockTools } from './blockTools.js';
import { createDomainTools } from './domainTools.js';
import { createReadTools } from './readTools.js';
import { createWriteTools } from './writeTools.js';
export function createCmsAgentTools(store, config) {
    const tools = [
        ...createReadTools(store, config),
        ...createBlockTools(store, config),
        ...createWriteTools(store, config),
        // Empty when the host configured no domain store, so the tool list only ever
        // contains tools that can actually run.
        ...createDomainTools(config),
    ];
    const byName = new Map(tools.map((tool) => [tool.name, tool]));
    return {
        tools,
        invoke: async (name, input, ctx) => {
            const tool = byName.get(name);
            if (!tool) {
                return toolError('NOT_FOUND', `Unknown tool "${name}"`, {
                    suggestion: `Valid tools: ${tools.map((t) => t.name).join(', ')}`,
                });
            }
            return tool.execute(input, ctx);
        },
    };
}

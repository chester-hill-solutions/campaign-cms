import { toolError } from '../errors';
import { createBlockTools } from './blockTools';
import { createReadTools } from './readTools';
import { createWriteTools } from './writeTools';
export function createCmsAgentTools(store, config) {
    const tools = [
        ...createReadTools(store, config),
        ...createBlockTools(store, config),
        ...createWriteTools(store, config),
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

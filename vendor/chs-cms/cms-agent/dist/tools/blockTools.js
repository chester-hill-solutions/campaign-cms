import { createBlockId, insertBlockAt, pageBlockSchema, reorderBlocksInPage, } from '@chester-hill-solutions/cms-core';
import { toolError } from '../errors';
import { applyDraftMutation } from '../pipeline';
import { addBlockInput, duplicateBlockInput, removeBlockInput, reorderBlockInput, updateBlockInput, } from '../schemas';
import { makeTool } from './makeTool';
function findBlockIndex(content, blockId) {
    const index = content.blocks.findIndex((b) => b.id === blockId);
    if (index < 0) {
        return toolError('NOT_FOUND', `Block "${blockId}" not found on this page`, {
            suggestion: 'Call get_page with view:"summary" to list block ids.',
        });
    }
    return { ok: true, data: index };
}
export function createBlockTools(store, config) {
    return [
        makeTool({
            name: 'add_block',
            description: 'Insert a new block of the given type into the page draft. index defaults to the end. Returns the new block id; use update_block to fill in content.',
            inputSchema: addBlockInput,
            mutates: true,
            config,
            handler: ({ entryId, expectedDraftRevisionId, type, index }) => applyDraftMutation(store, entryId, expectedDraftRevisionId, `agent:add_block ${type}`, (content) => {
                const insertIndex = index ?? content.blocks.length;
                const { content: next, block } = insertBlockAt(content, type, insertIndex);
                return { ok: true, data: { content: next, info: { blockId: block.id } } };
            }),
        }),
        makeTool({
            name: 'update_block',
            description: 'Merge partial fields into an existing block in the page draft. Field names must match the block schema (see get_block_types). id and type cannot be changed.',
            inputSchema: updateBlockInput,
            mutates: true,
            config,
            handler: ({ entryId, expectedDraftRevisionId, blockId, patch }) => applyDraftMutation(store, entryId, expectedDraftRevisionId, 'agent:update_block', (content) => {
                const found = findBlockIndex(content, blockId);
                if (!found.ok)
                    return found;
                const existing = content.blocks[found.data];
                if ('id' in patch && patch.id !== existing.id) {
                    return toolError('VALIDATION', 'Block id cannot be changed');
                }
                if ('type' in patch && patch.type !== existing.type) {
                    return toolError('VALIDATION', 'Block type cannot be changed — remove the block and add a new one');
                }
                const merged = {
                    ...structuredClone(existing),
                    ...patch,
                    id: existing.id,
                    type: existing.type,
                };
                const parsed = pageBlockSchema.safeParse(merged);
                if (!parsed.success) {
                    const fieldErrors = parsed.error.issues.map((issue) => ({
                        blockId,
                        field: issue.path.map(String).join('.') || 'block',
                        message: issue.message,
                    }));
                    return toolError('VALIDATION', `Invalid fields for block type "${existing.type}"`, {
                        fieldErrors,
                        suggestion: 'Call get_block_types to see the valid fields for this block type.',
                    });
                }
                const blocks = [...content.blocks];
                blocks[found.data] = parsed.data;
                return {
                    ok: true,
                    data: { content: { ...content, blocks }, info: { blockId } },
                };
            }),
        }),
        makeTool({
            name: 'remove_block',
            description: 'Remove a block from the page draft.',
            inputSchema: removeBlockInput,
            mutates: true,
            config,
            handler: ({ entryId, expectedDraftRevisionId, blockId }) => applyDraftMutation(store, entryId, expectedDraftRevisionId, 'agent:remove_block', (content) => {
                const found = findBlockIndex(content, blockId);
                if (!found.ok)
                    return found;
                if (content.blocks.length === 1) {
                    return toolError('PRECONDITION', 'Cannot remove the last block — pages need at least one block', { suggestion: 'Add a replacement block first.' });
                }
                const blocks = content.blocks.filter((b) => b.id !== blockId);
                return {
                    ok: true,
                    data: { content: { ...content, blocks }, info: { blockId } },
                };
            }),
        }),
        makeTool({
            name: 'reorder_block',
            description: 'Move a block within the page draft. Provide either { blockId, direction: "up"|"down" } or { fromIndex, toIndex }.',
            inputSchema: reorderBlockInput,
            mutates: true,
            config,
            handler: (input) => applyDraftMutation(store, input.entryId, input.expectedDraftRevisionId, 'agent:reorder_block', (content) => {
                let fromIndex;
                let toIndex;
                if (input.blockId !== undefined && input.direction !== undefined) {
                    const found = findBlockIndex(content, input.blockId);
                    if (!found.ok)
                        return found;
                    fromIndex = found.data;
                    toIndex = fromIndex + (input.direction === 'up' ? -1 : 1);
                    if (toIndex < 0 || toIndex >= content.blocks.length) {
                        return toolError('PRECONDITION', `Block is already at the ${input.direction === 'up' ? 'top' : 'bottom'} of the page`);
                    }
                }
                else {
                    fromIndex = input.fromIndex ?? 0;
                    toIndex = input.toIndex ?? 0;
                    const max = content.blocks.length - 1;
                    if (fromIndex > max || toIndex > max) {
                        return toolError('VALIDATION', `Index out of range — the page has ${content.blocks.length} blocks`);
                    }
                }
                const next = reorderBlocksInPage(content, fromIndex, toIndex);
                return {
                    ok: true,
                    data: { content: next, info: { fromIndex, toIndex } },
                };
            }),
        }),
        makeTool({
            name: 'duplicate_block',
            description: 'Duplicate a block in the page draft. The copy is inserted directly after the original; returns the new block id.',
            inputSchema: duplicateBlockInput,
            mutates: true,
            config,
            handler: ({ entryId, expectedDraftRevisionId, blockId }) => applyDraftMutation(store, entryId, expectedDraftRevisionId, 'agent:duplicate_block', (content) => {
                const found = findBlockIndex(content, blockId);
                if (!found.ok)
                    return found;
                if (content.blocks.length >= 100) {
                    return toolError('PRECONDITION', 'Page is at the 100-block limit');
                }
                const source = content.blocks[found.data];
                const copy = {
                    ...structuredClone(source),
                    id: createBlockId(),
                };
                const blocks = [...content.blocks];
                blocks.splice(found.data + 1, 0, copy);
                return {
                    ok: true,
                    data: {
                        content: { ...content, blocks },
                        info: { blockId: copy.id },
                    },
                };
            }),
        }),
    ];
}

import { createBlockId } from './blockSchemas';
import { createDefaultBlock } from './blockFactory';
/** Insert a fresh default block at the given index. Returns the new block too. */
export function insertBlockAt(content, type, index, defaults) {
    const block = createDefaultBlock(type, defaults);
    const blocks = [...content.blocks];
    blocks.splice(Math.max(0, Math.min(index, blocks.length)), 0, block);
    return { content: { ...content, blocks }, block };
}
export function duplicateBlockInPage(content, blockId) {
    const index = content.blocks.findIndex((b) => b.id === blockId);
    if (index < 0)
        return content;
    const source = content.blocks[index];
    const copy = { ...structuredClone(source), id: createBlockId() };
    const blocks = [...content.blocks];
    blocks.splice(index + 1, 0, copy);
    return { ...content, blocks };
}
export function removeBlockFromPage(content, blockId) {
    return { ...content, blocks: content.blocks.filter((b) => b.id !== blockId) };
}
export function updateBlockInPage(content, block) {
    return {
        ...content,
        blocks: content.blocks.map((b) => (b.id === block.id ? block : b)),
    };
}
export function reorderBlocksInPage(content, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= content.blocks.length)
        return content;
    const blocks = [...content.blocks];
    const [moved] = blocks.splice(fromIndex, 1);
    if (!moved)
        return content;
    blocks.splice(toIndex, 0, moved);
    return { ...content, blocks };
}
/** Move a block one step up or down. */
export function moveBlockInPage(content, blockId, direction) {
    const index = content.blocks.findIndex((b) => b.id === blockId);
    if (index < 0)
        return content;
    return reorderBlocksInPage(content, index, index + direction);
}

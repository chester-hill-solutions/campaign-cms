import { getBlockTreeChildren, } from '@chester-hill-solutions/cms-core';
export function isItemSelection(selection) {
    return (selection != null &&
        selection.itemKind != null &&
        typeof selection.itemIndex === 'number');
}
export function selectionEquals(a, b) {
    if (a == null && b == null)
        return true;
    if (a == null || b == null)
        return false;
    return (a.blockId === b.blockId &&
        a.itemKind === b.itemKind &&
        a.itemId === b.itemId &&
        a.itemIndex === b.itemIndex);
}
/** Drop or rebind selection when blocks/items disappear after an edit. */
export function reconcileSelection(blocks, selection) {
    if (selection == null)
        return null;
    const block = blocks.find((b) => b.id === selection.blockId);
    if (!block)
        return null;
    if (!isItemSelection(selection))
        return { blockId: block.id };
    const children = getBlockTreeChildren(block).filter((c) => c.itemKind === selection.itemKind);
    if (selection.itemId != null) {
        const byId = children.find((c) => c.itemId === selection.itemId);
        if (byId) {
            return {
                blockId: block.id,
                itemKind: byId.itemKind,
                itemId: byId.itemId,
                itemIndex: byId.itemIndex,
            };
        }
        return { blockId: block.id };
    }
    const byIndex = children.find((c) => c.itemIndex === selection.itemIndex);
    if (byIndex) {
        return {
            blockId: block.id,
            itemKind: byIndex.itemKind,
            itemId: byIndex.itemId,
            itemIndex: byIndex.itemIndex,
        };
    }
    return { blockId: block.id };
}

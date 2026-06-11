import { createBlockId, type PageBlock, type PageDocPayload } from './blockSchemas'
import { createDefaultBlock, type BlockFactoryDefaults } from './blockFactory'

export type PageMeta = Omit<PageDocPayload, 'kind' | 'version'>

/** Insert a fresh default block at the given index. Returns the new block too. */
export function insertBlockAt(
  content: PageMeta,
  type: PageBlock['type'],
  index: number,
  defaults?: BlockFactoryDefaults,
): { content: PageMeta; block: PageBlock } {
  const block = createDefaultBlock(type, defaults)
  const blocks = [...content.blocks]
  blocks.splice(Math.max(0, Math.min(index, blocks.length)), 0, block)
  return { content: { ...content, blocks }, block }
}

export function duplicateBlockInPage(content: PageMeta, blockId: string): PageMeta {
  const index = content.blocks.findIndex((b) => b.id === blockId)
  if (index < 0) return content
  const source = content.blocks[index]
  const copy = { ...structuredClone(source), id: createBlockId() }
  const blocks = [...content.blocks]
  blocks.splice(index + 1, 0, copy)
  return { ...content, blocks }
}

export function removeBlockFromPage(content: PageMeta, blockId: string): PageMeta {
  return { ...content, blocks: content.blocks.filter((b) => b.id !== blockId) }
}

export function updateBlockInPage(content: PageMeta, block: PageBlock): PageMeta {
  return {
    ...content,
    blocks: content.blocks.map((b) => (b.id === block.id ? block : b)),
  }
}

export function reorderBlocksInPage(
  content: PageMeta,
  fromIndex: number,
  toIndex: number,
): PageMeta {
  if (toIndex < 0 || toIndex >= content.blocks.length) return content
  const blocks = [...content.blocks]
  const [moved] = blocks.splice(fromIndex, 1)
  if (!moved) return content
  blocks.splice(toIndex, 0, moved)
  return { ...content, blocks }
}

/** Move a block one step up or down. */
export function moveBlockInPage(
  content: PageMeta,
  blockId: string,
  direction: -1 | 1,
): PageMeta {
  const index = content.blocks.findIndex((b) => b.id === blockId)
  if (index < 0) return content
  return reorderBlocksInPage(content, index, index + direction)
}

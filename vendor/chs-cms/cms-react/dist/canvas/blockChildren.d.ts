import type { PageBlock } from '@chester-hill-solutions/cms-core';
/**
 * Selected block in the editor outline, optionally narrowed to one sub-item:
 * either an array child (`itemIndex`, e.g. a card) or a named part
 * (`partKey`, e.g. a hero heading or CTA). At most one of the two is set.
 */
export type BlockSelection = {
    blockId: string;
    itemIndex?: number;
    partKey?: string;
};
/** Nested outline node for a composite block's structured items. */
export type BlockChildNode = {
    index: number;
    label: string;
    /** Stable key for this child (id or synthetic). */
    styleKey: string;
};
/**
 * Named part of a block that can be selected individually
 * (headings, CTAs, card groups…).
 */
export type BlockPartNode = {
    key: string;
    label: string;
    /** Which kind of part this is for future focus helpers. */
    kind: 'text' | 'cta';
};
/**
 * Derive outline children for composite blocks. Non-composite types return [].
 * Labels prefer the item's primary text field and fall back to "Item N".
 */
export declare function getBlockChildren(block: PageBlock): BlockChildNode[];
/**
 * Named selectable parts for blocks composed of fixed fields rather than
 * item arrays. Optional parts appear only once they have content.
 */
export declare function getBlockParts(block: PageBlock): BlockPartNode[];

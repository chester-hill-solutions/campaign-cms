import { describe, expect, it } from 'vitest'

import {
  ALL_BLOCK_TYPES,
  BLOCK_TYPE_LABELS,
  pageBlockSchema,
} from './blockSchemas'
import { createDefaultBlock } from './blockFactory'

/**
 * Guardrail: a new block type added to the pageBlockSchema union must be
 * registered everywhere (group constants, labels, factory). The renderer and
 * settings panel are covered by the matching test in cms-react.
 */
describe('block type registry sync', () => {
  const unionTypes = pageBlockSchema.options.map(
    (option) => option.shape.type.value,
  )

  it('ALL_BLOCK_TYPES matches the pageBlockSchema union exactly', () => {
    expect([...ALL_BLOCK_TYPES].sort()).toEqual([...unionTypes].sort())
  })

  it('contains no duplicate types across group constants', () => {
    expect(new Set(ALL_BLOCK_TYPES).size).toBe(ALL_BLOCK_TYPES.length)
  })

  it('every type has a human-readable label', () => {
    for (const type of ALL_BLOCK_TYPES) {
      expect(BLOCK_TYPE_LABELS[type], `label for ${type}`).toBeTruthy()
    }
  })

  it('createDefaultBlock produces a schema-valid block for every type', () => {
    for (const type of ALL_BLOCK_TYPES) {
      const block = createDefaultBlock(type)
      expect(block.type).toBe(type)
      const parsed = pageBlockSchema.safeParse(block)
      expect(parsed.success, `default for ${type} should validate`).toBe(true)
    }
  })
})

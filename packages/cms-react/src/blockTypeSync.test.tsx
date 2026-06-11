import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'

import { ALL_BLOCK_TYPES, createDefaultBlock } from '@campaign/cms-core'

import { isAppBlockType, renderBlockView } from './blocks/BlockRenderer'
import { BlockTypeSettings } from './canvas/blockTypeSettings'

/**
 * Guardrail: every block type must be handled by the public renderer and the
 * editor settings panel. Complements the registry test in cms-core.
 */
describe('block type UI sync', () => {
  it('renderBlockView handles every block type without throwing', () => {
    for (const type of ALL_BLOCK_TYPES) {
      const block = createDefaultBlock(type)
      const view = renderBlockView(block)
      if (isAppBlockType(type)) {
        // App blocks render null without a host-provided component.
        expect(view, `app block ${type}`).toBeNull()
      } else {
        expect(view, `view for ${type}`).not.toBeNull()
        expect(() => render(<>{view}</>)).not.toThrow()
      }
    }
  })

  it('BlockTypeSettings renders a panel for every block type', () => {
    for (const type of ALL_BLOCK_TYPES) {
      const block = createDefaultBlock(type)
      expect(
        () => render(<BlockTypeSettings block={block} onChange={vi.fn()} />),
        `settings for ${type}`,
      ).not.toThrow()
    }
  })
})

import { describe, expect, it } from 'vitest'

import {
  APP_BLOCK_TYPES,
  CONTENT_BLOCK_TYPES,
  LAYOUT_BLOCK_TYPES,
  pageBlockSchema,
  pageDocPayloadSchema,
} from './blockSchemas'
import { createDefaultBlock } from './blockFactory'
import { sanitizeCustomHtml } from './sanitizeHtml'

const ALL_PALETTE_TYPES = [...LAYOUT_BLOCK_TYPES, ...CONTENT_BLOCK_TYPES, ...APP_BLOCK_TYPES]

describe('pageDocPayloadSchema', () => {
  it('requires at least one block', () => {
    const invalid = {
      kind: 'pageDoc',
      version: 1,
      slug: 'test',
      title: 'Test',
      enabled: 1,
      showInNav: 0,
      navLabel: 'Test',
      seoTitle: 'Test',
      seoDescription: 'Test page.',
      blocks: [],
    }
    expect(pageDocPayloadSchema.safeParse(invalid).success).toBe(false)
  })

  it('accepts a page containing one default instance of every block type', () => {
    const blocks = ALL_PALETTE_TYPES.map((type) => createDefaultBlock(type))
    const pageDoc = {
      kind: 'pageDoc' as const,
      version: 1 as const,
      slug: 'test-all-blocks',
      title: 'All blocks test',
      enabled: 1 as const,
      showInNav: 0 as const,
      navLabel: 'Test',
      seoTitle: 'Test',
      seoDescription: 'Test page with every block type.',
      blocks,
    }
    expect(pageDocPayloadSchema.safeParse(pageDoc).success).toBe(true)
  })
})

describe('createDefaultBlock', () => {
  it('produces data accepted by pageBlockSchema for every palette type', () => {
    for (const type of ALL_PALETTE_TYPES) {
      const block = createDefaultBlock(type)
      const parsed = pageBlockSchema.safeParse(block)
      expect(parsed.success, `default for ${type} should validate`).toBe(true)
    }
  })

  it('uses the host-provided image placeholder', () => {
    const block = createDefaultBlock('image', { imagePlaceholderSrc: '/brand.webp' })
    expect(block.type === 'image' && block.src).toBe('/brand.webp')
  })
})

describe('sanitizeCustomHtml', () => {
  it('strips script tags', () => {
    const result = sanitizeCustomHtml('<p>Hello</p><script>alert(1)</script>')
    expect(result).not.toContain('<script')
    expect(result).toContain('<p>Hello</p>')
  })

  it('strips inline event handlers', () => {
    const result = sanitizeCustomHtml('<button onclick="alert(1)">Click</button>')
    expect(result).not.toContain('onclick')
  })

  it('neutralizes javascript: URLs', () => {
    const result = sanitizeCustomHtml('<a href="javascript:alert(1)">Bad link</a>')
    expect(result).not.toContain('javascript:')
  })
})

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const BLOCKS_DIR = join(import.meta.dirname, '.')

/** Viewport breakpoints break admin preview; blocks must use @sm/@md/@lg container queries. */
const VIEWPORT_BREAKPOINT_CLASS = /(^|[\s"'`])((?:sm|md|lg|xl|2xl):)/g

describe('block view responsive classes', () => {
  it('uses container queries (@sm/@md) instead of viewport breakpoints', () => {
    const files = readdirSync(BLOCKS_DIR).filter(
      (name) => name.endsWith('.tsx') && name !== 'BlockRenderer.tsx',
    )

    const violations: string[] = []

    for (const file of files) {
      const source = readFileSync(join(BLOCKS_DIR, file), 'utf8')
      for (const match of source.matchAll(VIEWPORT_BREAKPOINT_CLASS)) {
        const index = match.index ?? 0
        if (source[index - 1] === '@') continue
        const line = source.slice(0, index).split('\n').length
        violations.push(`${file}:${line} ${match[2]}`)
      }
    }

    expect(violations).toEqual([])
  })
})

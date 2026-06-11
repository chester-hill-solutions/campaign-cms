import { describe, expect, it } from 'vitest'

import { blockLayoutClasses } from './layoutClasses'
import type { BlockLayout } from '@campaign/cms-core'

const ALL_LAYOUTS: BlockLayout[] = [
  { width: 'contained', background: 'none', spacing: 'normal', align: 'left' },
  { width: 'wide', background: 'card', spacing: 'loose', align: 'center' },
  { width: 'full', background: 'brand-gradient', spacing: 'tight', align: 'left' },
]

describe('blockLayoutClasses', () => {
  it('maps layout combinations to fixed class strings', () => {
    for (const layout of ALL_LAYOUTS) {
      const classes = blockLayoutClasses(layout)
      expect(classes).toContain('py-')
      expect(classes).not.toMatch(/\$\{/)
    }
  })
})

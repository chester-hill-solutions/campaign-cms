import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { describeBlockTypes } from './tools/readTools'

const DOC_PATH = resolve(
  import.meta.dirname,
  '../../../docs/reference/agent-block-schemas.md',
)

function renderDoc(): string {
  const lines = [
    '# Agent block schemas',
    '',
    '<!-- GENERATED FILE — do not edit by hand. -->',
    '<!-- Regenerate: UPDATE_AGENT_DOCS=1 npm test -w @campaign/cms-agent -->',
    '',
    'Canonical field reference for agent tools, derived from the Zod schemas in `packages/cms-core/src/blockSchemas.ts`. At runtime, prefer the `get_block_types` tool — it returns this same data.',
    '',
    'All blocks share `id`, `type`, and `layout` (`width`, `background`, `spacing`, `align`). The fields below are per type; **bold** fields are required.',
    '',
  ]

  for (const info of describeBlockTypes()) {
    const fields =
      info.fields.length === 0
        ? '_layout only — no extra fields_'
        : info.fields
            .map((f) => (f.required ? `**${f.name}**` : f.name))
            .join(', ')
    lines.push(`## \`${info.type}\` — ${info.label} (${info.category})`, '', fields, '')
  }

  return lines.join('\n')
}

describe('agent-block-schemas.md', () => {
  it('matches the Zod schemas (regenerate with UPDATE_AGENT_DOCS=1)', () => {
    const generated = renderDoc()
    if (process.env.UPDATE_AGENT_DOCS) {
      writeFileSync(DOC_PATH, generated)
    }
    let committed = ''
    try {
      committed = readFileSync(DOC_PATH, 'utf8')
    } catch {
      // Missing file fails the comparison below with a helpful diff.
    }
    expect(committed).toBe(generated)
  })
})

import { describe, expect, it } from 'vitest'

import { normalizeCmsMarkdown, roundTripMarkdown } from './markdownTiptap'

describe('markdown round trip', () => {
  it('preserves headings, bold, links, and lists', () => {
    const md = [
      '## My commitment',
      '',
      'This is **bold** text with a [link](/contact) inline.',
      '',
      '- First item',
      '- Second item',
      '',
      '### Sub heading',
      '',
      '1. Step one',
      '2. Step two',
    ].join('\n')
    expect(roundTripMarkdown(md)).toBe(md)
  })

  it('is stable across a second round trip', () => {
    const md = '## Heading\n\nParagraph with **bold** and [link](/x).\n\n- a\n- b'
    const once = roundTripMarkdown(md)
    expect(roundTripMarkdown(once)).toBe(once)
  })

  it('preserves blockquotes', () => {
    const md = '> A quoted line of campaign copy.'
    const out = roundTripMarkdown(md)
    expect(out).toContain('> A quoted line of campaign copy.')
    expect(roundTripMarkdown(out)).toBe(out)
  })

  it('keeps single-newline line breaks inside paragraphs', () => {
    const md = 'Line one\nLine two'
    const out = roundTripMarkdown(md)
    expect(out).toContain('Line one')
    expect(out).toContain('Line two')
    expect(out).not.toContain('<br')
    expect(roundTripMarkdown(out)).toBe(out)
  })

  it('round-trips markdown tables', () => {
    const md = [
      '| Item | Cost |',
      '| --- | --- |',
      '| Park renewal | $1.2M |',
      '| Programs | $300K |',
    ].join('\n')
    const out = roundTripMarkdown(md)
    expect(out).toContain('Park renewal')
    expect(out).toContain('$1.2M')
    expect(roundTripMarkdown(out)).toBe(out)
  })

  it('round-trips a long policy-style document stably', () => {
    const md = [
      '## Why this matters',
      '',
      'Parks & recreation funding has lagged for a decade — **per-capita spending** is down.',
      '',
      '### What I will do',
      '',
      '- Renew the capital plan',
      '- Expand drop-in programs',
      '',
      '| Item | Cost |',
      '| --- | --- |',
      '| Park renewal | $1.2M |',
      '',
      '> Every neighbourhood deserves a great park.',
      '',
      '1. Year one: audit',
      '2. Year two: build',
    ].join('\n')
    const once = roundTripMarkdown(md)
    expect(roundTripMarkdown(once)).toBe(once)
  })
})

describe('normalizeCmsMarkdown', () => {
  it('converts star bullets to dashes', () => {
    expect(normalizeCmsMarkdown('* one\n* two')).toBe('- one\n- two')
  })

  it('removes escape backslashes the public renderer would print', () => {
    expect(normalizeCmsMarkdown('Parks \\& Rec \\(updated\\)')).toBe(
      'Parks & Rec (updated)',
    )
  })
})

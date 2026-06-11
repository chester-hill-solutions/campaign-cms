import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CmsMarkdownBody } from './CmsMarkdownBody'

describe('CmsMarkdownBody', () => {
  it('preserves single line breaks within a paragraph', () => {
    const { container } = render(<CmsMarkdownBody markdown={'Line one\nLine two'} />)
    const paragraph = container.querySelector('p')
    expect(paragraph).toHaveClass('whitespace-pre-line')
    expect(paragraph?.textContent).toBe('Line one\nLine two')
  })

  it('still splits paragraphs on blank lines', () => {
    render(<CmsMarkdownBody markdown={'First paragraph\n\nSecond paragraph'} />)
    expect(screen.getByText('First paragraph')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph')).toBeInTheDocument()
  })
})

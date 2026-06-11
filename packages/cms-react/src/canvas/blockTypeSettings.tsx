import type { PageBlock } from '@campaign/cms-core'
import { AdminCheckbox, AdminTextArea, AdminTextInput } from '../ui'
import { CtaFields, MediaField, PanelSection, SegmentedControl } from './fields'

type SettingsProps = {
  block: PageBlock
  onChange: (block: PageBlock) => void
}

function NoSettings() {
  return (
    <p className="m-0 text-xs text-ink-muted">
      All content for this block is edited directly on the canvas.
    </p>
  )
}

/**
 * Non-text settings for the selected block. Text content is edited inline on
 * the canvas; this panel covers images, links, enums, and app-block fields.
 */
export function BlockTypeSettings({ block, onChange }: SettingsProps) {
  switch (block.type) {
    case 'hero':
      return (
        <>
          <PanelSection title="Images">
            <MediaField
              label="Portrait"
              value={block.portraitSrc ?? ''}
              onSelect={(path, alt) =>
                onChange({
                  ...block,
                  portraitSrc: path || undefined,
                  portraitAlt: alt ?? block.portraitAlt,
                })
              }
              onClear={() =>
                onChange({ ...block, portraitSrc: undefined, portraitAlt: undefined })
              }
            />
            <AdminTextInput
              label="Portrait alt text"
              value={block.portraitAlt ?? ''}
              onChange={(e) =>
                onChange({ ...block, portraitAlt: e.target.value || undefined })
              }
            />
            <MediaField
              label="Background image"
              value={block.backgroundSrc ?? ''}
              onSelect={(path) =>
                onChange({ ...block, backgroundSrc: path || undefined })
              }
              onClear={() => onChange({ ...block, backgroundSrc: undefined })}
            />
            <SegmentedControl
              label="Image position (desktop)"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
              ]}
              value={block.imagePosition ?? 'right'}
              onChange={(imagePosition) => onChange({ ...block, imagePosition })}
            />
            <SegmentedControl
              label="Image position (mobile)"
              options={[
                { value: 'top', label: 'Top' },
                { value: 'bottom', label: 'Bottom' },
              ]}
              value={block.mobileImagePosition ?? 'bottom'}
              onChange={(mobileImagePosition) =>
                onChange({ ...block, mobileImagePosition })
              }
            />
          </PanelSection>
          <PanelSection title="Buttons">
            <CtaFields
              label="Primary"
              cta={block.primaryCta}
              onChange={(primaryCta) => onChange({ ...block, primaryCta })}
            />
            <CtaFields
              label="Secondary"
              cta={block.secondaryCta}
              onChange={(secondaryCta) => onChange({ ...block, secondaryCta })}
            />
            <CtaFields
              label="Tertiary"
              cta={block.tertiaryCta}
              onChange={(tertiaryCta) => onChange({ ...block, tertiaryCta })}
            />
          </PanelSection>
        </>
      )

    case 'richText':
      return (
        <PanelSection title="Advanced">
          <AdminTextInput
            label="Anchor ID"
            hint="Lets links jump to this section, e.g. #costs"
            value={block.anchorId ?? ''}
            onChange={(e) => onChange({ ...block, anchorId: e.target.value || undefined })}
          />
        </PanelSection>
      )

    case 'cardGrid':
      return (
        <>
          <PanelSection title="Grid">
            <SegmentedControl
              label="Columns"
              options={[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
              ]}
              value={block.columns}
              onChange={(columns) => onChange({ ...block, columns })}
            />
          </PanelSection>
          <PanelSection title="Card images">
            {block.cards.map((card, index) => (
              <details key={card.id} className="rounded-lg border border-border-subtle p-2">
                <summary className="cursor-pointer text-xs font-semibold text-ink">
                  {card.title || `Card ${index + 1}`}
                </summary>
                <div className="mt-2 grid gap-2">
                  <MediaField
                    label="Icon"
                    value={card.iconSrc ?? ''}
                    onSelect={(path) => {
                      const cards = [...block.cards]
                      cards[index] = { ...card, iconSrc: path || undefined }
                      onChange({ ...block, cards })
                    }}
                    onClear={() => {
                      const cards = [...block.cards]
                      cards[index] = { ...card, iconSrc: undefined }
                      onChange({ ...block, cards })
                    }}
                  />
                  <MediaField
                    label="Image"
                    value={card.imageSrc ?? ''}
                    onSelect={(path) => {
                      const cards = [...block.cards]
                      cards[index] = { ...card, imageSrc: path || undefined }
                      onChange({ ...block, cards })
                    }}
                    onClear={() => {
                      const cards = [...block.cards]
                      cards[index] = { ...card, imageSrc: undefined }
                      onChange({ ...block, cards })
                    }}
                  />
                </div>
              </details>
            ))}
          </PanelSection>
        </>
      )

    case 'table':
      return (
        <PanelSection title="Mobile behavior">
          <AdminCheckbox
            label="Collapse on mobile"
            checked={block.mobileCollapse ?? true}
            onChange={(e) => onChange({ ...block, mobileCollapse: e.target.checked })}
          />
          <AdminTextInput
            label="Mobile summary"
            hint="Button label shown instead of the full table"
            value={block.mobileSummary ?? ''}
            onChange={(e) =>
              onChange({ ...block, mobileSummary: e.target.value || undefined })
            }
          />
        </PanelSection>
      )

    case 'accordion':
      return (
        <PanelSection title="Section images">
          {block.sections.map((section, index) => (
            <details key={section.id} className="rounded-lg border border-border-subtle p-2">
              <summary className="cursor-pointer text-xs font-semibold text-ink">
                {section.title || `Section ${index + 1}`}
              </summary>
              <div className="mt-2">
                <MediaField
                  label="Image"
                  value={section.imageSrc ?? ''}
                  onSelect={(path) => {
                    const sections = [...block.sections]
                    sections[index] = { ...section, imageSrc: path || undefined }
                    onChange({ ...block, sections })
                  }}
                  onClear={() => {
                    const sections = [...block.sections]
                    sections[index] = { ...section, imageSrc: undefined }
                    onChange({ ...block, sections })
                  }}
                />
              </div>
            </details>
          ))}
        </PanelSection>
      )

    case 'ctaStrip':
      return (
        <PanelSection title="Buttons">
          <CtaFields
            label="Primary"
            cta={block.primaryCta}
            onChange={(primaryCta) => onChange({ ...block, primaryCta })}
          />
          <CtaFields
            label="Secondary"
            cta={block.secondaryCta}
            onChange={(secondaryCta) => onChange({ ...block, secondaryCta })}
          />
        </PanelSection>
      )

    case 'quote':
    case 'timeline':
    case 'divider':
      return <NoSettings />

    case 'image':
      return (
        <PanelSection title="Image">
          <MediaField
            label="Image"
            value={block.src}
            onSelect={(path, alt) =>
              onChange({ ...block, src: path, alt: alt ?? block.alt })
            }
            onClear={() => onChange({ ...block, src: '', alt: '' })}
          />
          <AdminTextInput
            label="Alt text"
            hint="Describe the image for screen readers"
            value={block.alt}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
          />
        </PanelSection>
      )

    case 'columns': {
      return (
        <PanelSection title="Columns">
          <SegmentedControl
            label="Column count"
            options={[
              { value: 2, label: '2' },
              { value: 3, label: '3' },
            ]}
            value={block.columnCount}
            onChange={(columnCount) => {
              const columns = [...block.columns]
              while (columns.length < columnCount) {
                columns.push({ markdown: `Column ${columns.length + 1}` })
              }
              while (columns.length > columnCount) {
                columns.pop()
              }
              onChange({ ...block, columnCount, columns })
            }}
          />
        </PanelSection>
      )
    }

    case 'list':
      return (
        <PanelSection title="List style">
          <SegmentedControl
            label="Numbering"
            options={[
              { value: 'bulleted', label: 'Bullets' },
              { value: 'ordered', label: 'Numbered' },
            ]}
            value={block.ordered ? 'ordered' : 'bulleted'}
            onChange={(v) => onChange({ ...block, ordered: v === 'ordered' })}
          />
        </PanelSection>
      )

    case 'sectionHeader':
      return (
        <PanelSection title="Heading">
          <SegmentedControl
            label="Heading level"
            options={[
              { value: 'h2', label: 'H2' },
              { value: 'h3', label: 'H3' },
            ]}
            value={block.level ?? 'h2'}
            onChange={(level) => onChange({ ...block, level })}
          />
          <AdminTextInput
            label="Anchor ID"
            hint="Lets links jump to this section, e.g. #costs"
            value={block.anchorId ?? ''}
            onChange={(e) => onChange({ ...block, anchorId: e.target.value || undefined })}
          />
        </PanelSection>
      )

    case 'twoUp':
      return (
        <>
          <PanelSection title="Image">
            <MediaField
              label="Image"
              value={block.imageSrc ?? ''}
              onSelect={(path, alt) =>
                onChange({
                  ...block,
                  imageSrc: path || undefined,
                  imageAlt: alt ?? block.imageAlt,
                })
              }
              onClear={() =>
                onChange({
                  ...block,
                  imageSrc: undefined,
                  imageAlt: undefined,
                  imageCaption: undefined,
                })
              }
            />
            <AdminTextInput
              label="Alt text"
              value={block.imageAlt ?? ''}
              onChange={(e) =>
                onChange({ ...block, imageAlt: e.target.value || undefined })
              }
            />
            <SegmentedControl
              label="Image position"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
              ]}
              value={block.imagePosition ?? 'right'}
              onChange={(imagePosition) => onChange({ ...block, imagePosition })}
            />
          </PanelSection>
          <PanelSection title="Buttons">
            <CtaFields
              label="Primary"
              cta={block.primaryCta}
              onChange={(primaryCta) => onChange({ ...block, primaryCta })}
            />
            <CtaFields
              label="Secondary"
              cta={block.secondaryCta}
              onChange={(secondaryCta) => onChange({ ...block, secondaryCta })}
            />
          </PanelSection>
        </>
      )

    case 'statGrid':
      return (
        <PanelSection title="Grid">
          <SegmentedControl
            label="Columns"
            options={[
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
            ]}
            value={block.columns}
            onChange={(columns) => onChange({ ...block, columns })}
          />
        </PanelSection>
      )

    case 'callout':
      return (
        <PanelSection title="Style">
          <SegmentedControl
            label="Tone"
            options={[
              { value: 'neutral', label: 'Neutral' },
              { value: 'info', label: 'Info' },
              { value: 'warning', label: 'Warning' },
              { value: 'success', label: 'Success' },
            ]}
            value={block.tone ?? 'neutral'}
            onChange={(tone) => onChange({ ...block, tone })}
          />
        </PanelSection>
      )

    case 'embed':
      return (
        <PanelSection title="Embed">
          <AdminTextInput
            label="Embed URL"
            hint="e.g. https://www.youtube.com/embed/…"
            value={block.src}
            onChange={(e) => onChange({ ...block, src: e.target.value })}
          />
          <AdminTextInput
            label="Accessible title"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <AdminTextInput
            label="Provider"
            value={block.provider ?? ''}
            onChange={(e) =>
              onChange({ ...block, provider: e.target.value || undefined })
            }
          />
          <SegmentedControl
            label="Aspect ratio"
            options={[
              { value: '16:9', label: '16:9' },
              { value: '4:3', label: '4:3' },
              { value: '1:1', label: '1:1' },
              { value: 'auto', label: 'Auto' },
            ]}
            value={block.aspectRatio ?? '16:9'}
            onChange={(aspectRatio) => onChange({ ...block, aspectRatio })}
          />
        </PanelSection>
      )

    case 'customHtml':
      return (
        <PanelSection title="Custom HTML">
          <p className="m-0 rounded-lg border border-accent-orange bg-[color-mix(in_oklab,var(--accent-orange)_10%,transparent)] p-2 text-xs text-ink">
            Advanced block for trusted editors. Scripts and inline event handlers
            are stripped on render.
          </p>
          <AdminTextInput
            label="Label"
            value={block.label ?? ''}
            onChange={(e) => onChange({ ...block, label: e.target.value || undefined })}
          />
          <AdminTextArea
            label="HTML"
            value={block.html}
            rows={12}
            className="font-mono text-xs"
            onChange={(e) => onChange({ ...block, html: e.target.value })}
          />
          <AdminTextArea
            label="Notes (admin only)"
            value={block.notes ?? ''}
            rows={2}
            onChange={(e) => onChange({ ...block, notes: e.target.value || undefined })}
          />
        </PanelSection>
      )

    case 'spacer':
      return (
        <PanelSection title="Spacing">
          <SegmentedControl
            label="Size"
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
            value={block.size ?? 'medium'}
            onChange={(size) => onChange({ ...block, size })}
          />
        </PanelSection>
      )

    case 'contactForm':
      return (
        <PanelSection title="Contact form">
          <AdminTextInput
            label="Kicker"
            value={block.kicker ?? ''}
            onChange={(e) => onChange({ ...block, kicker: e.target.value || undefined })}
          />
          <AdminTextInput
            label="Heading"
            value={block.heading}
            onChange={(e) => onChange({ ...block, heading: e.target.value })}
          />
          <AdminTextArea
            label="Subtext"
            value={block.subtext ?? ''}
            rows={2}
            onChange={(e) => onChange({ ...block, subtext: e.target.value || undefined })}
          />
        </PanelSection>
      )

    case 'eventsList':
      return (
        <PanelSection title="Events list">
          <AdminTextInput
            label="Heading"
            value={block.heading ?? ''}
            onChange={(e) => onChange({ ...block, heading: e.target.value || undefined })}
          />
        </PanelSection>
      )

    case 'eventsTeaser':
      return (
        <PanelSection title="Events teaser">
          <AdminTextInput
            label="Heading"
            value={block.heading ?? ''}
            onChange={(e) => onChange({ ...block, heading: e.target.value || undefined })}
          />
          <AdminTextInput
            label="Max events shown"
            type="number"
            min={1}
            max={10}
            value={String(block.maxItems ?? 2)}
            onChange={(e) =>
              onChange({
                ...block,
                maxItems: Math.max(1, Math.min(10, Number(e.target.value) || 2)),
              })
            }
          />
          <AdminCheckbox
            label="Show “View all events” link"
            checked={block.showViewAllLink !== false}
            onChange={(e) => onChange({ ...block, showViewAllLink: e.target.checked })}
          />
        </PanelSection>
      )

    case 'bioLinks':
      return (
        <p className="m-0 text-xs text-ink-muted">
          Shows the links managed under Admin → Bio links.
        </p>
      )

    case 'donateEmbed':
      return (
        <PanelSection title="Donate embed">
          <AdminTextInput
            label="Heading"
            value={block.heading ?? ''}
            onChange={(e) => onChange({ ...block, heading: e.target.value || undefined })}
          />
        </PanelSection>
      )

    default: {
      const _exhaustive: never = block
      return _exhaustive
    }
  }
}

import { ImageIcon, X } from 'lucide-react'
import { useState } from 'react'

import type { BlockCta } from '@campaign/cms-core'
import { AdminCheckbox, AdminTextInput } from '../ui'
import { MediaPicker } from '../MediaPicker'

/** Titled group of fields inside the settings panel. */
export function PanelSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-2.5 border-t border-border-subtle pt-3">
      <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {title}
      </h3>
      {children}
    </section>
  )
}

type SegOption<T> = { value: T; label: string }

/** Compact segmented control for small enum fields. */
export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: ReadonlyArray<SegOption<T>>
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-semibold text-ink-muted">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-0.5 rounded-lg border border-border-subtle bg-surface-page p-0.5"
      >
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={option.value === value}
            className={`focus-ring flex-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ${
              option.value === value
                ? 'bg-accent-orange text-primary-dark'
                : 'text-ink-muted hover:text-ink'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** CTA editor: clearing the label removes the CTA entirely. */
export function CtaFields({
  label,
  cta,
  onChange,
}: {
  label: string
  cta: BlockCta | undefined
  onChange: (cta: BlockCta | undefined) => void
}) {
  return (
    <fieldset className="m-0 grid gap-2 rounded-lg border border-border-subtle bg-surface-elevated p-2.5">
      <legend className="px-1 text-xs font-semibold text-ink-muted">{label}</legend>
      <AdminTextInput
        label="Label"
        value={cta?.label ?? ''}
        placeholder="Leave empty to hide"
        onChange={(e) => {
          const labelValue = e.target.value
          if (!labelValue) {
            onChange(undefined)
            return
          }
          onChange({ label: labelValue, href: cta?.href ?? '/', external: cta?.external })
        }}
      />
      <AdminTextInput
        label="Link"
        value={cta?.href ?? ''}
        onChange={(e) => {
          const href = e.target.value
          if (!href) {
            onChange(undefined)
            return
          }
          onChange({ label: cta?.label ?? 'Link', href, external: cta?.external })
        }}
      />
      <AdminCheckbox
        label="Opens in new tab"
        checked={cta?.external ?? false}
        onChange={(e) => {
          if (!cta) return
          onChange({ ...cta, external: e.target.checked })
        }}
      />
    </fieldset>
  )
}

/** Image field with thumbnail, media library picker, and manual path entry. */
export function MediaField({
  label,
  value,
  onSelect,
  onClear,
}: {
  label: string
  value: string
  /** alt is provided when the image was picked from the media library. */
  onSelect: (path: string, alt?: string) => void
  onClear: () => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-semibold text-ink-muted">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="focus-ring relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-page"
          aria-label={value ? `Change ${label}` : `Choose ${label}`}
          onClick={() => setPickerOpen(true)}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon
              className="absolute inset-0 m-auto h-5 w-5 text-ink-muted"
              aria-hidden="true"
            />
          )}
        </button>
        <div className="grid min-w-0 flex-1 gap-1">
          <input
            value={value}
            placeholder="/media/… or /path.webp"
            aria-label={`${label} path`}
            className="admin-field__input focus-ring w-full text-xs"
            onChange={(e) => onSelect(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              type="button"
              className="focus-ring text-xs font-semibold text-accent-orange underline"
              onClick={() => setPickerOpen(true)}
            >
              Media library
            </button>
            {value ? (
              <button
                type="button"
                className="focus-ring inline-flex items-center gap-0.5 text-xs font-semibold text-accent-red underline"
                onClick={onClear}
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(path, alt) => onSelect(path, alt)}
      />
    </div>
  )
}

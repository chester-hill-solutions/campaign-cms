import { Plus, X } from 'lucide-react'
import { useId, useState } from 'react'

import type { TableBlock } from '@campaign/cms-core'
import { AddItemButton, EditableText, useBlockEdit, type BlockEditApi } from './editable'

const CELL_CONTROL_CLASS =
  'focus-ring inline-flex h-5 w-5 items-center justify-center rounded border border-border-subtle bg-surface-card text-ink-muted hover:text-accent-red disabled:opacity-30'

function EditableTable({ block, edit }: { block: TableBlock; edit: BlockEditApi }) {
  const setHeaders = (headers: string[], rows: string[][]) =>
    edit.updateBlock({ ...block, headers, rows })

  const removeColumn = (col: number) => {
    if (block.headers.length <= 1) return
    setHeaders(
      block.headers.filter((_, i) => i !== col),
      block.rows.map((row) => row.filter((_, i) => i !== col)),
    )
  }

  const addColumn = () => {
    if (block.headers.length >= 10) return
    setHeaders(
      [...block.headers, 'Column'],
      block.rows.map((row) => [...row, '']),
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {block.headers.map((header, col) => (
              <th
                key={col}
                scope="col"
                className="border-b border-border-subtle px-3 py-2 font-semibold text-ink"
              >
                <span className="flex items-center gap-1.5">
                  <EditableText
                    value={header}
                    placeholder="Header"
                    update={(v) => {
                      const headers = [...block.headers]
                      headers[col] = v
                      return { ...block, headers }
                    }}
                  />
                  <button
                    type="button"
                    className={CELL_CONTROL_CLASS}
                    aria-label={`Remove column ${col + 1}`}
                    title="Remove column"
                    disabled={block.headers.length <= 1}
                    onClick={() => removeColumn(col)}
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              </th>
            ))}
            <th className="w-8 border-b border-border-subtle px-1 py-2">
              <button
                type="button"
                className={CELL_CONTROL_CLASS}
                aria-label="Add column"
                title="Add column"
                disabled={block.headers.length >= 10}
                onClick={addColumn}
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {block.headers.map((_, cellIndex) => {
                const value = row[cellIndex] ?? ''
                const cellEditor = (
                  <EditableText
                    value={value}
                    placeholder="—"
                    update={(v) => {
                      const rows = block.rows.map((r) => [...r])
                      const target = rows[rowIndex]
                      while (target.length < block.headers.length) target.push('')
                      target[cellIndex] = v
                      return { ...block, rows }
                    }}
                  />
                )
                return cellIndex === 0 ? (
                  <th
                    key={cellIndex}
                    scope="row"
                    className="border-b border-border-subtle px-3 py-2 text-left font-medium text-ink"
                  >
                    {cellEditor}
                  </th>
                ) : (
                  <td
                    key={cellIndex}
                    className="border-b border-border-subtle px-3 py-2 text-ink-muted"
                  >
                    {cellEditor}
                  </td>
                )
              })}
              <td className="w-8 border-b border-border-subtle px-1 py-2">
                <button
                  type="button"
                  className={CELL_CONTROL_CLASS}
                  aria-label={`Remove row ${rowIndex + 1}`}
                  title="Remove row"
                  onClick={() =>
                    edit.updateBlock({
                      ...block,
                      rows: block.rows.filter((_, i) => i !== rowIndex),
                    })
                  }
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {block.rows.length < 50 ? (
        <AddItemButton
          label="Add row"
          className="mt-2"
          onAdd={() =>
            edit.updateBlock({
              ...block,
              rows: [...block.rows, block.headers.map(() => '')],
            })
          }
        />
      ) : null}
    </div>
  )
}

export function TableBlockView({ block }: { block: TableBlock }) {
  const baseId = useId()
  const edit = useBlockEdit()
  const [mobileOpen, setMobileOpen] = useState(false)
  const collapse = block.mobileCollapse ?? true

  const table = (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr>
          {block.headers.map((header, index) => (
            <th
              key={`${header}-${index}`}
              scope="col"
              className="border-b border-border-subtle px-3 py-2 font-semibold text-ink"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) =>
              cellIndex === 0 ? (
                <th
                  key={cellIndex}
                  scope="row"
                  className="border-b border-border-subtle px-3 py-2 text-left font-medium text-ink"
                >
                  {cell}
                </th>
              ) : (
                <td key={cellIndex} className="border-b border-border-subtle px-3 py-2 text-ink-muted">
                  {cell}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <section aria-labelledby={block.heading ? `${baseId}-heading` : undefined}>
      {block.heading || edit ? (
        <h2 id={`${baseId}-heading`} className="m-0 mb-4 text-2xl font-semibold text-ink">
          <EditableText
            value={block.heading ?? ''}
            placeholder="Heading (optional)"
            update={(v) => ({ ...block, heading: v || undefined })}
          />
        </h2>
      ) : null}
      {edit ? (
        <EditableTable block={block} edit={edit} />
      ) : collapse ? (
        <>
          <div className="@md:hidden">
            <button
              type="button"
              className="focus-ring w-full rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 text-left text-sm font-semibold text-ink"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {block.mobileSummary ?? 'View full table'}
            </button>
            {mobileOpen ? <div className="mt-3 overflow-x-auto">{table}</div> : null}
          </div>
          <div className="hidden overflow-x-auto @md:block">{table}</div>
        </>
      ) : (
        <div className="overflow-x-auto">{table}</div>
      )}
      {block.footnote || edit ? (
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          <EditableText
            value={block.footnote ?? ''}
            multiline
            placeholder="Footnote (optional)"
            update={(v) => ({ ...block, footnote: v || undefined })}
          />
        </p>
      ) : null}
    </section>
  )
}

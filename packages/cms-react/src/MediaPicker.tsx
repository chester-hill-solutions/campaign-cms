import { useCallback, useEffect, useRef, useState } from 'react'

import { mediaPublicPath, type MediaAssetRow } from '@campaign/cms-core'

import { useCmsUi } from './context'
import { AdminTextInput } from './ui'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (path: string, alt: string) => void
}

/** Client-side resize for large images before upload (Workers have no sharp). */
async function resizeImageIfNeeded(file: File, maxDim = 2400): Promise<{ blob: Blob; width?: number; height?: number }> {
  if (!file.type.startsWith('image/')) {
    return { blob: file }
  }

  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap
  if (width <= maxDim && height <= maxDim) {
    return { blob: file, width, height }
  }

  const scale = maxDim / Math.max(width, height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return { blob: file, width, height }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), file.type, 0.85)
  })

  return { blob, width: canvas.width, height: canvas.height }
}

export function MediaPicker({ open, onClose, onSelect }: Props) {
  const { mediaApi } = useCmsUi()
  const [assets, setAssets] = useState<MediaAssetRow[]>([])
  const [alt, setAlt] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    if (!mediaApi) return
    const rows = await mediaApi.list()
    setAssets(rows)
  }, [mediaApi])

  useEffect(() => {
    if (open) void load()
  }, [open, load])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Media picker">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 text-lg font-semibold text-ink">Media library</h2>
          <button type="button" className="focus-ring text-sm font-semibold underline" onClick={onClose}>
            Close
          </button>
        </div>

        {!mediaApi ? (
          <p className="text-sm text-ink-muted">
            No media backend configured. Enter image paths manually.
          </p>
        ) : (
          <div className="mb-4 grid gap-3">
            <AdminTextInput label="Alt text (required for upload)" value={alt} onChange={(e) => setAlt(e.target.value)} />
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="text-sm" />
            <button
              type="button"
              className="focus-ring self-start rounded-full border-2 border-accent-green bg-accent-orange px-4 py-2 text-sm font-bold text-primary-dark"
              disabled={pending}
              onClick={() => {
                const file = fileRef.current?.files?.[0]
                if (!file) return
                setPending(true)
                setError(null)
                void resizeImageIfNeeded(file)
                  .then(async ({ blob, width, height }) => {
                    const buffer = await blob.arrayBuffer()
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
                    return mediaApi.upload({
                      filename: file.name,
                      mime: file.type,
                      base64,
                      alt,
                      width,
                      height,
                    })
                  })
                  .then(async (res) => {
                    if (!res.ok) {
                      setError(res.error)
                      return
                    }
                    await load()
                    setAlt('')
                    if (fileRef.current) fileRef.current.value = ''
                  })
                  .finally(() => setPending(false))
              }}
            >
              {pending ? 'Uploading…' : 'Upload'}
            </button>
            {error ? <p className="text-sm text-accent-red" role="alert">{error}</p> : null}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {assets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              className="focus-ring grid gap-1 rounded-lg border border-border-subtle p-2 text-left"
              onClick={() => {
                onSelect(mediaPublicPath(asset.r2_key), asset.alt)
                onClose()
              }}
            >
              <img
                src={mediaPublicPath(asset.r2_key)}
                alt={asset.alt}
                className="aspect-square w-full rounded object-cover"
                loading="lazy"
              />
              <span className="truncate text-xs text-ink-muted">{asset.filename}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

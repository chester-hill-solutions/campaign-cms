import type { PageDocPayload, PageMeta } from '@campaign/cms-core'

const DRAFT_KEY = 'campaign-cms-demo-draft'
const PUBLISHED_KEY = 'campaign-cms-demo-published'

export function toPageMeta(payload: PageDocPayload): PageMeta {
  const { kind: _k, version: _v, ...rest } = payload
  return rest
}

export function loadDraft(): PageMeta | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PageMeta
  } catch {
    return null
  }
}

export function saveDraft(snapshot: PageMeta): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot))
}

export function loadPublished(): PageMeta | null {
  try {
    const raw = localStorage.getItem(PUBLISHED_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PageMeta
  } catch {
    return null
  }
}

export function savePublished(snapshot: PageMeta): void {
  localStorage.setItem(PUBLISHED_KEY, JSON.stringify(snapshot))
}

export function clearDemoStorage(): void {
  localStorage.removeItem(DRAFT_KEY)
  localStorage.removeItem(PUBLISHED_KEY)
}

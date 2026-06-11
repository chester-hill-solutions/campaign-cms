import { createContext, useContext } from 'react'

import type { BlockFactoryDefaults, MediaAssetRow } from '@campaign/cms-core'

/**
 * Host-provided media library API. The host owns auth/CSRF; the package only
 * calls these methods.
 */
export type CmsMediaApi = {
  list: () => Promise<MediaAssetRow[]>
  upload: (input: {
    filename: string
    mime: string
    base64: string
    alt: string
    width?: number
    height?: number
  }) => Promise<{ ok: true; asset: MediaAssetRow } | { ok: false; error: string }>
}

export type HeroFallbackPortrait = {
  src: string
  alt: string
  srcSet?: string
  sizes?: string
  width?: number
  height?: number
}

export type CmsUiConfig = {
  /** Media library backend; without it the picker only accepts manual paths. */
  mediaApi?: CmsMediaApi
  /** Portrait shown by hero blocks that have no explicit portraitSrc. */
  heroFallbackPortrait?: HeroFallbackPortrait
  /** Defaults applied when inserting fresh blocks in the editor. */
  blockDefaults?: BlockFactoryDefaults
}

const CmsUiContext = createContext<CmsUiConfig>({})

export function CmsUiProvider({
  config,
  children,
}: {
  config: CmsUiConfig
  children: React.ReactNode
}) {
  return <CmsUiContext.Provider value={config}>{children}</CmsUiContext.Provider>
}

export function useCmsUi(): CmsUiConfig {
  return useContext(CmsUiContext)
}

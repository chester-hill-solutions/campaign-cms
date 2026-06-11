import type { CmsUiConfig } from '@campaign/cms-react'

import { stockImages } from './stockImages'

export const exampleCmsUi: CmsUiConfig = {
  heroFallbackPortrait: stockImages.heroPortrait,
  blockDefaults: {
    imagePlaceholderSrc: stockImages.imagePlaceholder.src,
  },
}

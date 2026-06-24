import type { CmsUiConfig } from '@chester-hill-solutions/cms-react'

import { stockImages } from './stockImages'

export const exampleCmsUi: CmsUiConfig = {
  heroFallbackPortrait: stockImages.heroPortrait,
  blockDefaults: {
    imagePlaceholderSrc: stockImages.imagePlaceholder.src,
  },
}

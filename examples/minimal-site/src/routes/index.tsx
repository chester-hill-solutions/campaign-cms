import { createFileRoute } from '@tanstack/react-router'

import { PageEditor } from '../pages/PageEditor'

export const Route = createFileRoute('/')({
  component: PageEditor,
})

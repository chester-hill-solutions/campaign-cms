import { createFileRoute, notFound } from '@tanstack/react-router'

import { CmsAgentChat } from '../pages/CmsAgentChat'
import { isAgentEnabledFn } from '../server/agentFns'

export const Route = createFileRoute('/agent')({
  loader: async () => {
    const enabled = await isAgentEnabledFn()
    if (!enabled) throw notFound()
  },
  head: () => ({
    meta: [{ title: 'CMS agent' }],
  }),
  component: CmsAgentChat,
})

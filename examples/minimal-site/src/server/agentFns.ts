import { createServerFn } from '@tanstack/react-start'

import { isAgentEnabled } from '../lib/cms/agent.server'

export const isAgentEnabledFn = createServerFn({ method: 'GET' }).handler(
  async () => isAgentEnabled(),
)

import { env } from 'cloudflare:workers'

import {
  createCmsAgentTools,
  type CmsAgentConfig,
  type ToolResult,
} from '@campaign/cms-agent'
import { createCmsToolSpecs } from '@campaign/cms-agent/tanstack'
import { pageDocPayloadSchema } from '@campaign/cms-core'
import { createCmsStore } from '@campaign/cms-server'

import { defaultNewPageDoc, entryIdFromPageSlug, validateNewPageSlug } from './pageDocEntry'

function parsePayload(raw: unknown) {
  const parsed = pageDocPayloadSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

/**
 * Dedicated store instance for agent writes so revision rows are audited as
 * created_by 'agent' (the editor UI store keeps the default 'admin').
 */
const agentStore = createCmsStore(() => ({ db: env.DB, media: env.MEDIA }), {
  parsePayload,
  newPageDoc: defaultNewPageDoc,
  validateNewPageSlug,
  entryIdFromPageSlug,
  revisionAuthor: () => 'agent',
})

export function isAgentEnabled(): boolean {
  return env.CMS_AGENT_ENABLED === '1'
}

const config: CmsAgentConfig = {
  // minimal-site has no auth; the env kill switch is the only gate.
  // Production hosts must also verify an admin session here, and may require
  // an elevated role in assertCanMutate (especially for publish_page).
  assertCanRead: () => {
    if (!isAgentEnabled()) {
      throw new Error('CMS agent is disabled (set CMS_AGENT_ENABLED=1)')
    }
  },
  assertCanMutate: () => {
    if (!isAgentEnabled()) {
      throw new Error('CMS agent is disabled (set CMS_AGENT_ENABLED=1)')
    }
  },
  actorId: 'cms-agent',
  validateNewPageSlug,
  entryIdFromPageSlug,
  newPageDoc: defaultNewPageDoc,
  onToolComplete: (ctx, result: ToolResult) => {
    // Structured dev logging — production hosts replace with real telemetry.
    console.log(
      JSON.stringify({
        type: 'cms-agent-tool',
        tool: ctx.toolName,
        actor: ctx.actorId,
        transport: ctx.transport,
        ok: result.ok,
        ...(result.ok ? {} : { code: result.code, error: result.error }),
      }),
    )
  },
}

export const cmsAgentTools = createCmsAgentTools(agentStore, config)

/** Framework-agnostic specs consumed by the chat route's TanStack AI wiring. */
export const cmsToolSpecs = createCmsToolSpecs(cmsAgentTools, 'chat')

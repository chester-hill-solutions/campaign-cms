# @campaign/cms-agent

Semantic agent tools for the campaign CMS: 16 typed read/write tools over the `@campaign/cms-server` store, designed for LLM tool-calling (TanStack AI, MCP, or plain HTTP).

## Design

- **Never throws.** Every handler returns `ToolResult` — `{ ok: true, data }` or `{ ok: false, code, error, fieldErrors?, suggestion?, retryable? }` with codes `NOT_FOUND | VALIDATION | CONFLICT | FORBIDDEN | PRECONDITION | INTERNAL`.
- **Draft-safe writes.** All mutations run through the pipeline in `src/pipeline.ts`: fresh load → optional `expectedDraftRevisionId` concurrency check → pure mutation → full-page Zod validation → save. Only `publish_page` affects live content, and it is flagged `needsApproval`.
- **Host-controlled auth.** `assertCanRead` / `assertCanMutate` hooks run before every tool; throws map to `FORBIDDEN`.
- **Bounded inputs.** Every string capped, media uploads limited to 5 MB, list limits capped.

## Usage

```ts
import { createCmsAgentTools } from '@campaign/cms-agent'
import { createCmsToolSpecs } from '@campaign/cms-agent/tanstack'

const agentTools = createCmsAgentTools(store, {
  assertCanRead: (ctx) => { /* throw to deny */ },
  assertCanMutate: (ctx) => { /* throw to deny */ },
  actorId: 'cms-agent',
  validateNewPageSlug,
  entryIdFromPageSlug,
  newPageDoc,
  onToolComplete: (ctx, result) => { /* telemetry */ },
})

// Direct invocation (MCP, HTTP):
const result = await agentTools.invoke('list_pages', {}, { transport: 'mcp' })

// LLM runtimes — framework-agnostic specs with model-facing serialization:
const specs = createCmsToolSpecs(agentTools, 'chat')
```

Tools: `list_pages`, `get_page` (with `view: 'summary'` for large pages), `get_block_types`, `list_revisions`, `list_media`, `check_slug`, `add_block`, `update_block`, `remove_block`, `reorder_block`, `duplicate_block`, `create_page`, `update_page_meta`, `upload_media`, `restore_revision`, `publish_page`.

Reference wiring (chat route, approval UI, MCP endpoint): `examples/minimal-site`. Integrator guide: [docs/guides/agent-api.md](../../docs/guides/agent-api.md).

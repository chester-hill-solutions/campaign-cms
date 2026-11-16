# @chester-hill-solutions/cms-agent

Semantic agent tools for the campaign CMS: 16 typed read/write tools over the `@chester-hill-solutions/cms-store` surface (any D1 or Postgres adapter), designed for LLM tool-calling (TanStack AI, MCP, or plain HTTP).

## Design

- **Never throws.** Every handler returns `ToolResult` — `{ ok: true, data }` or `{ ok: false, code, error, fieldErrors?, suggestion?, retryable? }` with codes `NOT_FOUND | VALIDATION | CONFLICT | FORBIDDEN | PRECONDITION | INTERNAL`.
- **Draft-safe writes.** All mutations run through the pipeline in `src/pipeline.ts`: fresh load → required `expectedDraftRevisionId` concurrency check → pure mutation → full-page Zod validation → save. Only `publish_page` affects live content, and it is flagged `needsApproval`.
- **Host-controlled auth.** `assertCanRead` / `assertCanMutate` hooks run before every tool; throws map to `FORBIDDEN`.
- **Bounded inputs.** Every string capped, media uploads limited to 5 MB, list limits capped.

## Usage

```ts
import { createCmsAgentTools } from '@chester-hill-solutions/cms-agent'
import { createCmsToolSpecs } from '@chester-hill-solutions/cms-agent/tanstack'

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

Integrator guide: [docs/guides/agent-api.md](../../docs/guides/agent-api.md).

## Revision token upgrade

All page/block edits, `restore_revision`, and `publish_page` require `expectedDraftRevisionId` from `get_page`'s `entry.draft_revision_id`. Explicit `null` means the caller observed no draft; omitting the field is invalid. A stale token returns `CONFLICT`, including when the current draft is already published. The tool never substitutes a newly fetched head for the caller's token. Saves and restores return `draftRevisionId` for the next write; `create_page` also returns its new draft token.

Listing assignments, category/tag labels, featured state, dates and metadata are part of the same revision. A page/block edit preserves its starting listing snapshot. Publishing approves that complete revision. The existing 16 tools remain the surface; collection authoring belongs to the host editor.

## Exposing the tools over HTTP

`createCmsAgentHttpHandler` is a transport: `GET` lists the tools with their flags,
`POST` invokes one, and tool codes map to HTTP statuses. It handles the three
things every host otherwise writes itself — bearer authentication with refusing as
the default, status mapping, and refusing approval-flagged tools to callers that
may not approve.

```ts
const agent = createCmsAgentHttpHandler({
  authenticate: (request) => principalFrom(bearerToken(request)),
  tools: (principal) => createCmsAgentTools(store, configFor(principal)),
  onWrite: (principal, tool, result) => audit(principal.name, tool, result),
})
```

Integrator guide, including why refusing is the default and what each status means:
[docs/guides/agent-api.md](../../docs/guides/agent-api.md).

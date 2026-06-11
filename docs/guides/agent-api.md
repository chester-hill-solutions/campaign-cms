# Agent API guide

`@campaign/cms-agent` exposes the CMS as 16 semantic tools an LLM agent (or any API client) can operate safely. The reference integration lives in `examples/minimal-site` (chat UI at `/agent`, API at `/api/cms/chat`, MCP at `/api/cms/mcp`).

## Robustness principles

1. **Tools never throw.** Every handler returns a `ToolResult`; unexpected errors become `{ ok: false, code: 'INTERNAL', retryable: true }`. Stack traces and store internals never reach the model.
2. **Validate early.** Zod validates every tool input before the store is touched; the full page is re-validated before every save.
3. **Fail with recovery hints.** Errors carry a `code`, a human message, and `fieldErrors` / `suggestion` so the model can self-correct in the next turn.
4. **Draft-only writes.** No tool except `publish_page` can change what is live.
5. **Fresh read before write.** Every mutating tool reloads the current draft from the store — no stale in-memory state across tool calls.
6. **Publish is gated twice.** Handler preconditions plus a human approval step in the chat UI (`needsApproval` on `publish_page`).

## Error codes

| Code | Meaning | Agent recovery |
|------|---------|----------------|
| `NOT_FOUND` | Entry, block, revision, media, or tool missing | `list_pages` / `get_page` (summary) / `list_revisions` for valid ids |
| `VALIDATION` | Tool input or page content failed schema checks | Read `fieldErrors`; call `get_block_types` for exact field names |
| `CONFLICT` | Slug taken, or draft changed under the caller | Pick another slug, or `get_page` and retry |
| `FORBIDDEN` | `assertCanRead` / `assertCanMutate` denied | Stop; the host has disabled or restricted the agent |
| `PRECONDITION` | Operation not valid in current state (publish with no draft, remove last block, …) | Follow the `suggestion` to reach a valid state |
| `INTERNAL` | Unexpected failure (e.g. transient D1 error) | `retryable: true` — retrying once is safe |

Failures are serialized for the model as `[CODE] message … hint` strings by `@campaign/cms-agent/tanstack`.

## Optimistic concurrency

Every block/meta write accepts an optional `expectedDraftRevisionId`. When provided and it no longer matches the entry's current draft revision, the write fails with `CONFLICT` instead of clobbering newer changes. Agents chaining edits should pass the revision id from their last `get_page` read.

## Coexistence with the visual editor

Agent and editor writes are last-write-wins on the draft. Mitigations:

- Use `expectedDraftRevisionId` to detect interleaved edits.
- Refresh the editor after agent sessions (drafts may have moved).
- Every revision is kept; `restore_revision` rolls the draft back to any prior version (then `publish_page` to make it live).

Audit trail: agent revisions are written with `created_by` from the store's `revisionAuthor` config (e.g. `'agent'`) and messages prefixed `agent:{toolName}`.

## Production auth checklist

- [ ] `assertCanRead` verifies an authenticated admin session — the `CMS_AGENT_ENABLED` env gate alone is only suitable for local dev.
- [ ] `assertCanMutate` requires a role allowed to edit content; consider an elevated role for `publish_page` (check `ctx.toolName`).
- [ ] `revisionAuthor` on the agent's store instance returns a real actor identity.
- [ ] `onToolComplete` feeds real telemetry, not `console.log`.
- [ ] Chat route enforces `maxIterations` and a request timeout (reference: 10 iterations, 60 s).
- [ ] MCP route requires `Authorization: Bearer ${CMS_AGENT_MCP_SECRET}` (or `X-CMS-Agent-Key`) and is never exposed without HTTPS. Missing secret config disables the route entirely (404).
- [ ] Rate limiting in front of both routes — Cloudflare WAF rules or a rate-limiting binding keyed on the session/secret.

## Rollback workflow

1. `list_revisions { entryId }` — find the last good version (messages identify the author and tool).
2. `restore_revision { entryId, revisionId }` — copies that payload into a new draft revision.
3. Verify with `get_page { view: 'draft' }`.
4. `publish_page { entryId }` — requires approval; the bad content stays retrievable as its own revision.

## MCP integration

`/api/cms/mcp` is a stateless MCP server (streamable HTTP, JSON responses) exposing the identical tool instances as the chat route — same validation, same auth hooks, same audit trail. Supported methods: `initialize`, `ping`, `tools/list` (JSON Schema derived from the Zod inputs via `z.toJSONSchema`), and `tools/call`.

```bash
curl -X POST https://your-site/api/cms/mcp \
  -H "Authorization: Bearer $CMS_AGENT_MCP_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_pages","arguments":{}}}'
```

## Block schemas

Field names the tools accept are exactly the Zod block schemas — see [agent-block-schemas.md](../reference/agent-block-schemas.md), which is generated from the schemas and enforced by a sync test. At runtime, agents should call `get_block_types` rather than relying on memorized field names.

# Troubleshooting

## Agent failure modes

| Symptom | Likely code | Fix |
|---------|-------------|-----|
| Agent can't publish ("No draft to publish") | `PRECONDITION` | Make a draft edit first (`add_block`, `update_block`, …), then publish |
| "Draft changed since it was last read" | `CONFLICT` | Call `get_page`, re-read the draft revision id, retry the write |
| "Invalid fields for block type …" | `VALIDATION` | Call `get_block_types`; field names must match the Zod schemas exactly (see [reference/agent-block-schemas.md](./reference/agent-block-schemas.md)) |
| "Slug … is already in use" | `CONFLICT` | Pick a different slug; `check_slug` first |
| "Entry … not found" | `NOT_FOUND` | `list_pages` for valid entry ids; ids follow `page-{slug}` |
| "CMS agent is disabled" | `FORBIDDEN` | Set `CMS_AGENT_ENABLED=1` in `examples/minimal-site/.dev.vars` and restart the dev server |
| `/agent` returns 404 | — | Same as above — the route hides itself when the kill switch is off |
| Chat returns `OPENROUTER_API_KEY is not configured` | — | Add the key to `.dev.vars` (local) or as a Worker secret (production) |
| MCP route returns 404 | — | `CMS_AGENT_MCP_SECRET` is unset; the route is disabled without it |
| MCP route returns 401 | — | Send `Authorization: Bearer ${CMS_AGENT_MCP_SECRET}` (or `X-CMS-Agent-Key`) |
| "Unexpected error executing tool" | `INTERNAL` | Transient (often D1); `retryable: true` — retry once, then check Worker logs |

## Development

| Symptom | Fix |
|---------|-----|
| `blockTypeSync.test.ts` fails after adding a block type | Register the type everywhere — factory, renderer, settings, labels, group constants (see [agent-task-map.md](./agent-task-map.md)) |
| `agentSchemaSync.test.ts` fails | Regenerate the doc: `UPDATE_AGENT_DOCS=1 npm test -w @campaign/cms-agent` |
| Editor shows stale content after agent edits | The agent writes new draft revisions; reload the editor. Use `list_revisions` / `restore_revision` if changes need to be rolled back |
| Dev server port differs from 3001 | Another process holds the port; vite picks the next free one — check the dev server output |

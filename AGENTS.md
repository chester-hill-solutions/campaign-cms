# AGENTS.md

Guidance for coding agents (and new contributors) working in this repository.

## What this repo is

npm-workspaces monorepo for a block-based campaign CMS on Cloudflare Workers (D1 + R2) and TanStack Start. See [CONTEXT.md](./CONTEXT.md) for the domain model and [docs/architecture.md](./docs/architecture.md) for data flow.

| Workspace | Role |
|-----------|------|
| `packages/cms-core` | Zod block schemas, pure page/block operations, validation |
| `packages/cms-server` | `createCmsStore()` — D1 draft/publish + R2 media persistence |
| `packages/cms-react` | Public `BlockRenderer` + admin editor canvas |
| `packages/cms-agent` | Semantic agent tools over the store (`ToolResult`, never-throw) |
| `packages/cms-setup` | `campaign-cms init` CLI |
| `examples/minimal-site` | Reference host app: editor, public page, agent chat + MCP |

## Commands

```bash
npm install               # bootstrap all workspaces
npm run typecheck         # tsc across all workspaces (CI-enforced)
npm test                  # vitest across all workspaces (CI-enforced)
npm test -w @campaign/cms-agent          # one workspace
npm run dev -w campaign-cms-minimal-site # dev server on :3001
```

## Guardrails you must respect

- **Block type registration is sync-tested.** Adding a block type to `pageBlockSchema` requires updating the group constants, `BLOCK_TYPE_LABELS`, `createDefaultBlock`, `renderBlockView`, and `BlockTypeSettings`. `blockTypeSync.test.ts` (cms-core and cms-react) fails until everything is registered. Follow [docs/guides/app-blocks.md](./docs/guides/app-blocks.md).
- **`docs/reference/agent-block-schemas.md` is generated.** Never edit it by hand; regenerate with `UPDATE_AGENT_DOCS=1 npm test -w @campaign/cms-agent`. The sync test fails on drift.
- **Agent tool handlers never throw.** Everything in `packages/cms-agent` returns `ToolResult`; writes go through `pipeline.ts` (`applyDraftMutation`), never call `savePageDocDraft` directly from a handler.
- **Draft-only writes.** Only `publish_page` (and the store's `publishEntry`) may change what is live.
- **No secrets in the repo.** Local config goes in `examples/minimal-site/.dev.vars` (gitignored): `CMS_AGENT_ENABLED`, `OPENROUTER_API_KEY`, `CMS_AGENT_MCP_SECRET`.

## Where to make common changes

See [docs/agent-task-map.md](./docs/agent-task-map.md) for a task → file map, and [docs/troubleshooting.md](./docs/troubleshooting.md) when something misbehaves.

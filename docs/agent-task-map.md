# Task map

Where to make common changes. Paths are repo-relative.

| Task | Files |
|------|-------|
| Add or change a block type | `packages/cms-core/src/blockSchemas.ts` (schema, group constant, label) → `blockFactory.ts` (default) → `packages/cms-react/src/blocks/BlockRenderer.tsx` (view) → `packages/cms-react/src/canvas/blockTypeSettings.tsx` (settings). Sync tests enforce completeness; regenerate agent docs (`UPDATE_AGENT_DOCS=1 npm test -w @campaign/cms-agent`). Guide: [guides/app-blocks.md](./guides/app-blocks.md) |
| Change page payload fields | `packages/cms-core/src/blockSchemas.ts` (`pageDocPayloadSchema`) + `packages/cms-agent/src/schemas.ts` (`updatePageMetaInput`) + editor settings drawer |
| Add an agent tool | `packages/cms-agent/src/schemas.ts` (input schema) + `tools/readTools.ts` / `blockTools.ts` / `writeTools.ts` (handler via `makeTool`) + `tools.test.ts` (happy path + every error code) |
| Change agent error behavior | `packages/cms-agent/src/errors.ts`, `types.ts` (`ToolErrorCode`), serialization in `tanstack.ts` |
| Change the write pipeline / concurrency | `packages/cms-agent/src/pipeline.ts` + `pipeline.test.ts` |
| Store / persistence changes | `packages/cms-server/src/store.ts`; API docs in [reference/store-api.md](./reference/store-api.md) |
| Agent chat route / model / limits | `examples/minimal-site/src/routes/api/cms/chat.ts` (`MAX_AGENT_ITERATIONS`, `CHAT_TIMEOUT_MS`, system prompt) |
| Agent auth / kill switch / audit author | `examples/minimal-site/src/lib/cms/agent.server.ts` |
| MCP endpoint | `examples/minimal-site/src/routes/api/cms/mcp.ts` |
| Agent chat UI | `examples/minimal-site/src/pages/CmsAgentChat.tsx` |
| Editor UI | `examples/minimal-site/src/pages/PageEditor.tsx` + `packages/cms-react/src/canvas/` |
| Public page rendering | `packages/cms-react/src/blocks/` + `examples/minimal-site/src/pages/PageDocPage.tsx` |
| CI | `.github/workflows/ci.yml` (typecheck + test on push/PR) |

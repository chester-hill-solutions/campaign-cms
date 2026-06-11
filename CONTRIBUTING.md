# Contributing

## Before opening a PR

```bash
npm run typecheck   # must pass — CI enforces it
npm test            # must pass — CI enforces it
```

## Checklists

### Adding or changing a block type

- [ ] Schema added to `pageBlockSchema` union in `packages/cms-core/src/blockSchemas.ts`
- [ ] Type added to the right group constant (`LAYOUT_` / `CONTENT_` / `APP_BLOCK_TYPES`) and `BLOCK_TYPE_LABELS`
- [ ] Default case in `createDefaultBlock` (`blockFactory.ts`)
- [ ] View in `renderBlockView` (`cms-react/src/blocks/BlockRenderer.tsx`)
- [ ] Settings case in `BlockTypeSettings` (`cms-react/src/canvas/blockTypeSettings.tsx`)
- [ ] `blockTypeSync.test.ts` green in cms-core and cms-react
- [ ] Agent docs regenerated: `UPDATE_AGENT_DOCS=1 npm test -w @campaign/cms-agent`
- [ ] `docs/reference/block-types.md` row updated (hand-written summary; `agent-block-schemas.md` is the generated canonical reference)

### Changing agent tools

- [ ] Input schema bounded (`.max()` on strings, capped numbers) in `cms-agent/src/schemas.ts`
- [ ] Handler returns `ToolResult` and never throws; writes go through `applyDraftMutation`
- [ ] Unit tests cover the happy path and every reachable `ToolErrorCode`
- [ ] Errors include a `suggestion` the model can act on

### Documentation

- [ ] `docs/reference/agent-block-schemas.md` — generated only, never hand-edited
- [ ] New docs linked from `docs/README.md` or the root `README.md`

## Manual QA for agent changes (examples/minimal-site)

```bash
# .dev.vars: CMS_AGENT_ENABLED=1, OPENROUTER_API_KEY=..., CMS_AGENT_MCP_SECRET=...
npm run dev -w campaign-cms-minimal-site
```

1. `/agent` loads; with `CMS_AGENT_ENABLED` unset it 404s.
2. Ask the agent to list pages, then add a block — reload `/` and confirm it appears in the editor draft.
3. Ask it to publish — approval card appears; reject leaves the page unpublished, approve goes live.
4. Ask it to update a block with a bogus field — it should receive `[VALIDATION] …`, call `get_block_types`, and recover.
5. MCP: `tools/list` and a `tools/call` with the secret header; missing secret → 401.

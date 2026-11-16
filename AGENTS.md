# AGENTS.md

This repository is a thin integration harness for the canonical CMS libraries in
[chester-hill-solutions](https://github.com/chester-hill-solutions/chester-hill-solutions).
The examples use npm workspaces and checked-in built artifacts; runtime library
source is not maintained here. [CONTEXT.md](./CONTEXT.md) records the content model.

| Path | Role |
|---|---|
| `examples/minimal-site` | TanStack Start + Workers D1/R2 editor/public page/agent example |
| `examples/gh-pages` | Browser editor with localStorage draft/published snapshots |
| `vendor/chs-cms` | Reviewed core/react/store/D1/agent/setup artifacts and provenance |
| `tests` | Actual local workerd/D1/R2 host contract regressions; all outbound calls denied |
| `scripts/check-cms-vendor.mjs` | Verify source artifact hashes and recorded dependency rewrites |

## Commands

Use Node.js 22, matching CI. Keep npm and its existing lockfile.

```bash
npm ci --legacy-peer-deps
npm run typecheck
npm test
npm run build
npm run example:setup  # local D1 migrations only
npm run example:seed   # local demo data; run setup first
npm run example:dev
```

## Rules

- Work on a feature branch; merge through a PR. Preserve other branches/worktrees.
- Do not hand-edit vendored library code. Fix canonical source, then refresh reviewed
  artifacts with exact source/tarball hashes and sibling dependency rewrites recorded
  in `vendor/chs-cms/provenance.json`. `npm run check:vendor` must pass.
- The removed `cms-server` API is replaced by `cms-store` plus `cms-store-d1`.
- Carry the opened draft revision through save/publish. On conflict preserve local
  content, pause autosave, block publication and require explicit reload. Do not
  refresh the guard from unrelated metadata while retaining stale local content.
- Draft writes never change public content/URLs until guarded publication.
- Agent tools retain never-throw ToolResult behavior, auth hooks and agent auditing.
  The minimal example's kill switch is not production authentication; MCP also needs
  its configured secret. Do not guess a production role policy.
- Keep secrets in ignored `.dev.vars`, never source. Do not deploy or mutate live
  Cloudflare/provider resources as part of a dependency refresh.
- Keep applied migrations unchanged. Add migrations and test upgrade/fresh schemas.
  New snapshot-aware revisions cannot be written by the old pre-split writer.
- `docs/reference/agent-block-schemas.md` is historical generated reference: never
  edit it by hand. Canonical schema/tool changes and generation happen upstream.

See [current integration notes](./docs/guides/current-package-integration.md) and
[CONTRIBUTING.md](./CONTRIBUTING.md).

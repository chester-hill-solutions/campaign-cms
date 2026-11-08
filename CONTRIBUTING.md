# Contributing

Use a feature branch from current main. This repository owns host examples and
integration coverage; CMS schemas, renderer mechanics and agent tools live in the
[canonical monorepo](https://github.com/chester-hill-solutions/chester-hill-solutions).

Before opening a PR:

```bash
npm ci --legacy-peer-deps
npm run typecheck
npm test
npm run build
```

`npm test` verifies all vendored artifact hashes, then exercises actual local
workerd D1/R2 bindings. It checks stale save/publish refusal, draft/public isolation,
agent gating/auditing and media round trips without a real provider account.

For a package refresh, retain the existing vendor distribution mode and record
source/tarball/file hashes plus only the required sibling dependency rewrites.
Preserve compatible external versions and migration history. Do not point a ready
PR at an unpublished registry version, hand-edit generated library files, or infer
permission for a production migration/deployment.

Canonical block/tool changes must follow the producer repository's schema sync,
auth, draft-only mutation and never-throw ToolResult rules. Do not hand-edit the
historical generated `docs/reference/agent-block-schemas.md` in this harness.

The minimal example has no admin authentication. Manual local agent QA requires
ignored `.dev.vars`; keep the kill switch off by default and never use real provider
calls as a test dependency. Production hosts supply their own access control and
publication approval policy.

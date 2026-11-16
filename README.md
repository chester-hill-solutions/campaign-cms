# campaign-cms

Integration harness and examples for [`@chester-hill-solutions/cms-*`](https://github.com/chester-hill-solutions/chester-hill-solutions) packages.

Runtime CMS libraries live in the **chester-hill-solutions** monorepo. This repo vendors reviewed built artifacts and validates their host contracts with runnable examples.

## Install and verify

The examples use reviewed, checked-in CMS artifacts through local file dependencies.
No private registry token or unpublished package version is needed for this harness.
Use Node.js 22, matching CI:

```bash
npm ci --legacy-peer-deps
npm run typecheck
npm test
npm run build
```

`npm test` checks artifact provenance and actual isolated Worker D1/R2 contracts,
with external calls disabled. See [current integration and migration notes](./docs/guides/current-package-integration.md).

## Examples

| Example | Command |
|---------|---------|
| [minimal-site](./examples/minimal-site/) — full D1 + R2 + admin | `npm run example:dev` |
| [gh-pages](./examples/gh-pages/) — browser-only editor demo | `npm run example:pages:dev` |

### Bootstrap a new site

```bash
npm exec cms-setup init
wrangler d1 create my-campaign-cms
wrangler r2 bucket create my-campaign-media
npm exec cms-setup wrangler   # merge snippet into wrangler.jsonc
wrangler d1 migrations apply my-campaign-cms --local
```

## Package source

| Package | Repository |
|---------|------------|
| `@chester-hill-solutions/cms-core` | [packages/cms-core](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-core) |
| `@chester-hill-solutions/cms-store` | [packages/cms-store](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-store) |
| `@chester-hill-solutions/cms-store-d1` | [packages/cms-store-d1](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-store-d1) |
| `@chester-hill-solutions/cms-react` | [packages/cms-react](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-react) |
| `@chester-hill-solutions/cms-agent` | [packages/cms-agent](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-agent) |
| `@chester-hill-solutions/cms-setup` | [packages/cms-setup](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-setup) |

Artifact hashes: [provenance.json](./vendor/chs-cms/provenance.json). Consumer registry setup: [USING-PACKAGES.md](https://github.com/chester-hill-solutions/chester-hill-solutions/blob/main/docs/USING-PACKAGES.md)

## Branch policy

Normalization work on this repo uses feature branches (e.g. `chs/w1-campaign-cms-harness`); merge via PR to `main` only.

## Legacy docs

Older guides under `docs/` may still reference `@campaign/cms-*` or local `packages/` — update as you touch them, or follow the monorepo READMEs as source of truth.

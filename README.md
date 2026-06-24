# campaign-cms

Integration harness and examples for [`@chester-hill-solutions/cms-*`](https://github.com/chester-hill-solutions/chester-hill-solutions) packages.

Runtime CMS libraries live in the **chester-hill-solutions** monorepo and install from GitHub Packages. This repo validates those packages end-to-end with runnable examples.

## Install packages

Classic PAT with `read:packages` + `repo` (SSO authorized for the org):

```bash
export NODE_AUTH_TOKEN=ghp_xxxxxxxx
```

Root `.npmrc` is committed; it references `${NODE_AUTH_TOKEN}`.

```bash
npm install
```

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
| `@chester-hill-solutions/cms-server` | [packages/cms-server](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-server) |
| `@chester-hill-solutions/cms-react` | [packages/cms-react](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-react) |
| `@chester-hill-solutions/cms-agent` | [packages/cms-agent](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-agent) |
| `@chester-hill-solutions/cms-setup` | [packages/cms-setup](https://github.com/chester-hill-solutions/chester-hill-solutions/tree/main/packages/cms-setup) |

Consumer setup: [USING-PACKAGES.md](https://github.com/chester-hill-solutions/chester-hill-solutions/blob/main/docs/USING-PACKAGES.md)

## Branch policy

Normalization work on this repo uses feature branches (e.g. `chs/w1-campaign-cms-harness`); merge via PR to `main` only.

## Legacy docs

Older guides under `docs/` may still reference `@campaign/cms-*` or local `packages/` — update as you touch them, or follow the monorepo READMEs as source of truth.

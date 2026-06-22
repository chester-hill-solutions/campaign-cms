# Cloudflare Workers Builds (CI)

How to consume `@campaign/cms-*` packages when deploying a host site with
[Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/).

Workers Builds clones only your campaign site repository. It does **not** have
access to a sibling `campaign-cms` checkout on your laptop, so `file:` paths
like `../../campaign-cms/packages/cms-core` will install but fail at build time
with missing CSS or module resolution errors.

## Recommended: vendor submodule

Pin this repo under `vendor/campaign-cms` in your site repository:

```bash
git submodule add https://github.com/chester-hill-solutions/campaign-cms.git vendor/campaign-cms
```

Point `file:` dependencies at the vendored packages (paths from `website/`):

```json
{
  "dependencies": {
    "@campaign/cms-core": "file:../vendor/campaign-cms/packages/cms-core",
    "@campaign/cms-react": "file:../vendor/campaign-cms/packages/cms-react",
    "@campaign/cms-server": "file:../vendor/campaign-cms/packages/cms-server",
    "@campaign/cms-agent": "file:../vendor/campaign-cms/packages/cms-agent"
  }
}
```

In your main CSS file, scan the vendored React sources:

```css
@source "../vendor/campaign-cms/packages/cms-react/src";
@import "@campaign/cms-react/styles/cms-tokens.css";
```

### Init submodule before build

Workers Builds does not clone submodules recursively by default. Run an init
step before `vite build` when the vendored checkout is missing (for example on
CI or a fresh clone):

```js
// scripts/ensure-vendor-cms.mjs
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const cmsTokens = resolve(
  repoRoot,
  'vendor/campaign-cms/packages/cms-react/styles/cms-tokens.css',
)

if (existsSync(cmsTokens)) {
  process.exit(0)
}

execSync('git submodule update --init --recursive vendor/campaign-cms', {
  cwd: repoRoot,
  stdio: 'inherit',
})
```

Wire it into your build script:

```json
{
  "scripts": {
    "build": "node scripts/ensure-vendor-cms.mjs && vite build"
  }
}
```

A copy of this script lives in
[`packages/cms-setup/templates/scripts/ensure-vendor-cms.mjs`](../../packages/cms-setup/templates/scripts/ensure-vendor-cms.mjs).

## Linux native bindings (host site)

Workers Builds runs `npm clean-install` on Linux. If your lockfile was generated
on macOS, optional platform binaries for tools such as `@rspack/*`,
`lightningcss-*`, and `@tailwindcss/oxide-*` may be missing and `vite build`
will fail with "Cannot find native binding" or "Cannot find module
'…linux-x64-gnu'".

Pin the Linux packages your build needs as `optionalDependencies` in the host
site so the lockfile includes resolved entries, then regenerate the lockfile:

```json
{
  "optionalDependencies": {
    "@rspack/binding-linux-x64-gnu": "2.0.0",
    "@tailwindcss/oxide-linux-x64-gnu": "4.2.4",
    "lightningcss-linux-x64-gnu": "1.32.0"
  }
}
```

Match versions to what your lockfile already resolves for those tools. This is a
host-site concern, not something the CMS packages need to declare.

## Local development

Developers can still use a sibling checkout instead of the submodule:

```bash
git clone https://github.com/chester-hill-solutions/campaign-cms.git ../campaign-cms
```

Use sibling `file:` paths locally if you prefer; keep the vendored submodule
layout for CI. Many teams standardize on the submodule so local and CI paths
match.

## Reference implementation

[frank-domenic](https://github.com/wra-sol/frank-domenic) uses this pattern on
the `platform-and-cms` branch: `vendor/campaign-cms`, `ensure-vendor-cms.mjs`,
and Linux optional dependency pins in `website/package.json`.

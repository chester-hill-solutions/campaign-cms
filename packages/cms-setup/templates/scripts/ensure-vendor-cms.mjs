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

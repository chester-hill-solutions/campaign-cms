#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function usage() {
  console.log(`campaign-cms — setup helper for @campaign/cms-* packages

Usage:
  campaign-cms init [target-dir]   Copy CMS D1 migrations + CMS_SETUP.md into a site
  campaign-cms wrangler            Print the wrangler.jsonc bindings snippet

init copies, without overwriting existing files:
  migrations/NNNN_cms_core.sql
  migrations/NNNN_media_assets.sql
  CMS_SETUP.md
`)
}

function nextMigrationPrefix(migrationsDir) {
  if (!existsSync(migrationsDir)) return 1
  const nums = readdirSync(migrationsDir)
    .map((f) => /^(\d+)_/.exec(f)?.[1])
    .filter(Boolean)
    .map(Number)
  return nums.length ? Math.max(...nums) + 1 : 1
}

function init(targetDir) {
  const target = resolve(targetDir ?? '.')
  const migrationsDir = join(target, 'migrations')
  mkdirSync(migrationsDir, { recursive: true })

  const sqlDir = join(pkgRoot, 'sql')
  let prefix = nextMigrationPrefix(migrationsDir)
  const existing = readdirSync(migrationsDir).join('\n')

  for (const file of readdirSync(sqlDir).sort()) {
    const baseName = file.replace(/^\d+_/, '')
    if (existing.includes(baseName)) {
      console.log(`skip  migrations/*_${baseName} (already present)`)
      continue
    }
    const dest = join(migrationsDir, `${String(prefix).padStart(4, '0')}_${baseName}`)
    copyFileSync(join(sqlDir, file), dest)
    console.log(`write ${dest}`)
    prefix += 1
  }

  const setupDest = join(target, 'CMS_SETUP.md')
  if (existsSync(setupDest)) {
    console.log('skip  CMS_SETUP.md (already present)')
  } else {
    copyFileSync(join(pkgRoot, 'templates', 'CMS_SETUP.md'), setupDest)
    console.log(`write ${setupDest}`)
  }

  console.log('\nNext steps:')
  console.log('  1. wrangler d1 create <db-name> && wrangler r2 bucket create <bucket-name>')
  console.log('  2. campaign-cms wrangler   # merge bindings into wrangler.jsonc')
  console.log('  3. wrangler d1 migrations apply <db-name> --local')
  console.log('  4. Follow CMS_SETUP.md to wire the store, renderer, and editor.')
}

const [, , command, ...args] = process.argv

switch (command) {
  case 'init':
    init(args[0])
    break
  case 'wrangler':
    console.log(readFileSync(join(pkgRoot, 'templates', 'wrangler-snippet.jsonc'), 'utf8'))
    break
  default:
    usage()
    process.exitCode = command ? 1 : 0
}

#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const DB = 'campaign-cms-example'
const sqlFile = join(dirname(fileURLToPath(import.meta.url)), 'seed-about.sql')

console.log('Seeding local D1 with About page…')
execSync(`wrangler d1 execute ${DB} --local --file ${JSON.stringify(sqlFile)}`, {
  stdio: 'inherit',
})
console.log('Done. Visit http://localhost:3001/about')

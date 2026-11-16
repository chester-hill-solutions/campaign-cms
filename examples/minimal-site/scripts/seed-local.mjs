#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createSeedSql } from './seed-sql.mjs'

const dir = dirname(fileURLToPath(import.meta.url))
const DB = 'campaign-cms-example'
const payloadPath = join(dir, 'seed-about.json')
const payload = JSON.parse(readFileSync(payloadPath, 'utf8'))
const sql = createSeedSql(payload)

const sqlFile = join(dir, '.seed-generated.sql')
writeFileSync(sqlFile, sql)

console.log('Seeding local D1 with About page…')
try {
  execSync(`wrangler d1 execute ${DB} --local --file ${JSON.stringify(sqlFile)}`, {
    stdio: 'inherit',
  })
  console.log('Done. Open http://localhost:3001')
} finally {
  unlinkSync(sqlFile)
}

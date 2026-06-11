#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))
const DB = 'campaign-cms-example'
const payloadPath = join(dir, 'seed-about.json')
const payload = JSON.parse(readFileSync(payloadPath, 'utf8'))
const payloadJson = JSON.stringify(payload).replace(/'/g, "''")

const sql = `-- Seed: published About page (entry page-about, slug about)
INSERT OR REPLACE INTO content_entries
  (id, type, slug, title, status, published_revision_id, draft_revision_id, created_at, updated_at, published_at)
VALUES
  (
    'page-about',
    'page_doc',
    'about',
    'About',
    'published',
    'rev_seed_about',
    'rev_seed_about',
    datetime('now'),
    datetime('now'),
    datetime('now')
  );

INSERT OR REPLACE INTO content_revisions
  (id, entry_id, payload, version, created_at, created_by, message, parent_revision_id)
VALUES
  (
    'rev_seed_about',
    'page-about',
    '${payloadJson}',
    1,
    datetime('now'),
    'seed',
    'initial',
    NULL
  );
`

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

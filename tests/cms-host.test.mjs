import assert from 'node:assert/strict'
import { readFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { before, after, test } from 'node:test'
import { build } from 'esbuild'
import { Miniflare } from 'miniflare'
import { unstable_splitSqlQuery } from 'wrangler'
import { createSeedSql } from '../examples/minimal-site/scripts/seed-sql.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
let runtime
let directory
const seed = JSON.parse(readFileSync(new URL('../examples/minimal-site/scripts/seed-about.json', import.meta.url), 'utf8'))
before(async () => {
  directory = mkdtempSync(join(tmpdir(), 'campaign-cms-host-'))
  const bundle = join(directory, 'worker.mjs')
  await build({ entryPoints: [fileURLToPath(new URL('./cms-worker.mjs', import.meta.url))], bundle: true, platform: 'browser', format: 'esm', outfile: bundle, external: ['cloudflare:workers'] })
  runtime = new Miniflare({ modules: true, modulesRoot: directory, scriptPath: bundle,
    compatibilityDate: '2026-04-09', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB'], r2Buckets: ['MEDIA'], bindings: { CMS_AGENT_ENABLED: '1' },
    outboundService() { throw new Error('No external calls permitted in CMS host tests') },
  })
  const migrations = readdirSync(resolve(root, 'examples/minimal-site/migrations')).filter(name => name.endsWith('.sql')).sort().flatMap(name => unstable_splitSqlQuery(readFileSync(resolve(root, 'examples/minimal-site/migrations', name), 'utf8')))
  const seedSql = createSeedSql(seed)
  const setup = await call('/setup', { migrations, seed: unstable_splitSqlQuery(seedSql) })
  assert.equal(setup.status, 200, JSON.stringify(setup.data))
})
after(async () => { try { await runtime?.dispose() } finally { if (directory) rmSync(directory, { recursive: true, force: true }) } })
async function call(path, input) {
  const response = await runtime.dispatchFetch('https://cms-harness.test' + path, input ? { method: 'POST', body: JSON.stringify(input) } : {})
  return { status: response.status, data: await response.json() }
}

test('host adapter preserves draft isolation and rejects stale saves and publication', async () => {
  assert.equal((await call('/public')).data.title, seed.title)
  const opened = (await call('/state')).data
  const { kind: _kind, version: _version, ...content } = opened.draft
  const first = await call('/save', { entryId: 'page-about', payload: { kind: 'pageDoc', version: 1, ...content, title: 'New draft title', slug: 'draft-about' }, expectedDraftRevisionId: opened.entry.draft_revision_id })
  assert.equal(first.data.ok, true)
  assert.equal((await call('/public')).data.title, seed.title)
  assert.equal((await call('/public?slug=draft-about')).data, null)
  const stale = await call('/save', { entryId: 'page-about', payload: { kind: 'pageDoc', version: 1, ...content, title: 'Stale editor overwrite' }, expectedDraftRevisionId: opened.entry.draft_revision_id })
  assert.equal(stale.status, 409)
  assert.equal(stale.data.conflict, true)
  const stalePublish = await call('/publish', { entryId: 'page-about', expectedDraftRevisionId: opened.entry.draft_revision_id })
  assert.equal(stalePublish.status, 409)
  assert.equal((await call('/public')).data.title, seed.title)
  const published = await call('/publish', { entryId: 'page-about', expectedDraftRevisionId: first.data.revisionId })
  assert.equal(published.data.published, true)
  assert.equal((await call('/public')).data, null)
  assert.equal((await call('/public?slug=draft-about')).data.title, 'New draft title')
})

test('host agent resolves real pages through its configured bindings', async () => {
  const result = await call('/agent', { name: 'list_pages', input: {} })
  assert.equal(result.data.ok, true)
  assert.ok(JSON.stringify(result.data).includes('page-about'))
})

test('host mutation inputs refuse a missing revision guard before changing the draft', async () => {
  const opened = (await call('/state')).data
  const result = await call('/save', { entryId: 'page-about', payload: opened.draft })
  assert.notEqual(result.status, 200)
  assert.equal((await call('/state')).data.entry.draft_revision_id, opened.entry.draft_revision_id)
})

test('the existing disabled-agent gate denies before reading uninitialized storage', async () => {
  const disabled = new Miniflare({ modules: true, modulesRoot: directory, scriptPath: join(directory, 'worker.mjs'),
    compatibilityDate: '2026-04-09', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB'], r2Buckets: ['MEDIA'], bindings: { CMS_AGENT_ENABLED: '0' },
    outboundService() { throw new Error('No external calls permitted') },
  })
  try {
    const response = await disabled.dispatchFetch('https://cms-harness.test/agent', { method: 'POST', body: JSON.stringify({ name: 'list_pages', input: {} }) })
    const result = await response.json()
    assert.equal(result.ok, false)
    assert.equal(result.code, 'FORBIDDEN')
  } finally { await disabled.dispose() }
})

test('agent mutations retain agent auditing and reject the old opened revision', async () => {
  const opened = (await call('/state')).data
  const input = { entryId: 'page-about', expectedDraftRevisionId: opened.entry.draft_revision_id, title: 'Agent draft title' }
  const updated = await call('/agent', { name: 'update_page_meta', input })
  assert.equal(updated.data.ok, true)
  assert.equal((await call('/author')).data.created_by, 'agent')
  assert.equal((await call('/public?slug=draft-about')).data.title, 'New draft title')
  const stale = await call('/agent', { name: 'update_page_meta', input: { ...input, title: 'Stale agent overwrite' } })
  assert.equal(stale.data.ok, false)
  assert.equal(stale.data.code, 'CONFLICT')
  assert.equal((await call('/state')).data.draft.title, 'Agent draft title')
})

test('the host R2 binding stores and streams immutable media keys', async () => {
  const result = await call('/media', {})
  assert.equal(result.status, 200, JSON.stringify(result.data))
  assert.notEqual(result.data.first, result.data.second)
  assert.equal(result.data.status, 200)
  assert.equal(result.data.contentType, 'image/png')
  assert.equal(result.data.bytes, result.data.expectedBytes)
})

test('two host saves opened on one revision cannot both win', async () => {
  const opened = (await call('/state')).data
  const common = { entryId: 'page-about', expectedDraftRevisionId: opened.entry.draft_revision_id }
  const responses = await Promise.all(['Editor A', 'Editor B'].map(title => call('/save', {
    ...common, payload: { ...opened.draft, title },
  })))
  assert.equal(responses.filter(response => response.data.ok).length, 1)
  assert.equal(responses.filter(response => response.data.conflict).length, 1)
  const current = (await call('/state')).data
  assert.ok(['Editor A', 'Editor B'].includes(current.draft.title))
  assert.equal((await call('/public?slug=draft-about')).data.title, 'New draft title')
})

test('the retained legacy schema upgrades its existing page and refuses old snapshotless writers', async () => {
  const upgraded = new Miniflare({ modules: true, modulesRoot: directory, scriptPath: join(directory, 'worker.mjs'),
    compatibilityDate: '2026-04-09', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB'], r2Buckets: ['MEDIA'], bindings: { CMS_AGENT_ENABLED: '0' },
    outboundService() { throw new Error('No external calls permitted') },
  })
  const db = await upgraded.getD1Database('DB')
  const names = readdirSync(resolve(root, 'examples/minimal-site/migrations')).filter(name => name.endsWith('.sql')).sort()
  async function migrate(list) {
    for (const name of list) {
      for (const sql of unstable_splitSqlQuery(readFileSync(resolve(root, 'examples/minimal-site/migrations', name), 'utf8'))) await db.prepare(sql).run()
    }
  }
  try {
    await migrate(names.slice(0, 2))
    await db.prepare("INSERT INTO content_entries (id,type,slug,title,status,published_revision_id,draft_revision_id,created_at,updated_at) VALUES ('page-about','page_doc','about','About','published','legacy','legacy',datetime('now'),datetime('now'))").run()
    await db.prepare("INSERT INTO content_revisions (id,entry_id,payload,version,created_by,created_at) VALUES ('legacy','page-about',?,1,'seed',datetime('now'))").bind(JSON.stringify(seed)).run()
    await migrate(names.slice(2))
    const revision = await db.prepare("SELECT listing_snapshot_json FROM content_revisions WHERE id='legacy'").first()
    assert.deepEqual(JSON.parse(revision.listing_snapshot_json), { version: 1, collections: [], tags: [] })
    const response = await upgraded.dispatchFetch('https://cms-harness.test/public')
    assert.equal((await response.json()).title, seed.title)
    await assert.rejects(db.prepare("INSERT INTO content_revisions (id,entry_id,payload,version,created_by,created_at) VALUES ('old-writer','page-about',?,1,'seed',datetime('now'))").bind(JSON.stringify(seed)).run(), /complete listing snapshot/)
  } finally { await upgraded.dispose() }
})

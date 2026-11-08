import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'

const root = fileURLToPath(new URL('../vendor/chs-cms/', import.meta.url))
const provenance = JSON.parse(readFileSync(join(root, 'provenance.json'), 'utf8'))
const hash = value => createHash('sha256').update(value).digest('hex')
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).filter(entry => entry.name !== 'node_modules').flatMap(entry => {
    const path = join(directory, entry.name)
    assert.ok(!entry.isSymbolicLink(), 'Vendored artifacts must not contain symlinks')
    return entry.isDirectory() ? files(path) : [path]
  })
}
for (const item of provenance.packages) {
  const directory = join(root, item.package.split('/')[1])
  const actual = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'))
  assert.equal(actual.name, item.package)
  assert.equal(actual.version, item.version)
  const restored = structuredClone(actual)
  // Only recorded local dependency rewrites may differ from the packed manifest.
  for (const [dependency, rewrite] of Object.entries(item.manifestRewrites)) {
    const section = Object.hasOwn(actual.dependencies ?? {}, dependency) ? 'dependencies' : 'optionalDependencies'
    assert.equal(actual[section][dependency], rewrite.to)
    restored[section][dependency] = rewrite.from
  }
  assert.deepEqual(files(directory).map(path => relative(directory, path).replaceAll('\\', '/')).sort(), item.files.map(file => file.path).sort())
  for (const file of item.files) {
    const content = file.path === 'package.json' ? JSON.stringify(restored, null, 2) + '\n' : readFileSync(join(directory, file.path))
    assert.equal(hash(content), file.sha256, `${item.package}/${file.path} differs from the reviewed source artifact`)
  }
}
console.log(`Verified ${provenance.packages.length} CMS artifacts from ${provenance.sourceSha}`)

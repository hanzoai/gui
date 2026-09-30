/**
 * Sign-in and account live on each site; IAM is reached only through its
 * /v1/iam API. This package never names an identity host — not in a link, not
 * in the domain table, not in a comment a reader would copy from.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('.', import.meta.url))
const IDENTITY_HOST = /\b(?:hanzo|zoo|pars|lux)\.id\b/i

const files = (dir, ok) =>
  fs
    .readdirSync(path.join(ROOT, dir), { recursive: true })
    .filter((f) => ok.test(f))
    .map((f) => path.join(dir, f))

test('no identity host in the source, the built output or the docs', () => {
  const all = [...files('src', /\.tsx?$/), ...files('dist', /\.js$/), 'README.md']
  const hits = all.filter((f) => IDENTITY_HOST.test(fs.readFileSync(path.join(ROOT, f), 'utf8')))
  assert.deepEqual(hits, [])
})

test('the registry routes account and login to the site itself', async () => {
  const { U } = await import('./dist/esm/hanzo-registry.js')
  assert.equal(U.account, '/account')
  assert.equal(U.login, '/login')
  for (const v of Object.values(U)) assert.doesNotMatch(String(v), IDENTITY_HOST)
})

test('every org domain table is free of an identity host', async () => {
  const { ORG_DOMAINS } = await import('./dist/esm/index.js')
  assert.doesNotMatch(JSON.stringify(ORG_DOMAINS), IDENTITY_HOST)
})

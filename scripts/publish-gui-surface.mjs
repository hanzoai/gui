// Publish exactly the gui surface — every `@hanzogui/*` package + the
// `hanzogui` umbrella + the `@hanzo/gui` alias — at the current on-disk
// version, with workspace:* specs rewritten to concrete versions.
//
// Unlike `release.ts --force-publish-all`, this does NOT touch unrelated
// workspace packages (@hanzo_network/*, @hanzo/app, fonts, demos…) and uses
// `npm pack --json` to publish the produced tarball directly (no fragile
// rename step). Idempotent: skips any name@version already on npm.
//
// Auth: relies on the npm registry config already in place (CI writes
// ~/.npmrc with the token). Run from the repo root.

import fs from 'node:fs'
import path from 'node:path'
import { execSync, execFileSync } from 'node:child_process'

const ROOT = process.cwd()
const PKGS = path.join(ROOT, 'pkgs')
const DEST = '/tmp/gui-surface'
fs.rmSync(DEST, { recursive: true, force: true })
fs.mkdirSync(DEST, { recursive: true })

// 1. Collect every workspace package.json (skip node_modules/dist).
const pkgDirs = []
function walk(d) {
  const base = path.basename(d)
  if (base === 'node_modules' || base === 'dist') return
  if (fs.existsSync(path.join(d, 'package.json'))) pkgDirs.push(d)
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(d, e.name))
  }
}
walk(PKGS)

const versionMap = {}
const meta = {}
for (const d of pkgDirs) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(d, 'package.json')))
    if (j.name && j.version) {
      versionMap[j.name] = j.version
      meta[j.name] = { dir: d, json: j }
    }
  } catch {}
}

// 2. Targets: the gui surface only, excluding private packages.
const targets = Object.keys(meta)
  .filter((n) => (n === 'hanzogui' || n.startsWith('@hanzogui/')) && !meta[n].json.private)
  .sort()

console.log(`Publishing ${targets.length} gui packages (+ @hanzo/gui alias) at their on-disk versions\n`)

function rewriteWorkspaceSpecs(deps, name) {
  if (!deps) return
  for (const k of Object.keys(deps)) {
    const spec = deps[k]
    if (typeof spec === 'string' && spec.startsWith('workspace:')) {
      const v = versionMap[k]
      if (!v) throw new Error(`${name}: dependency ${k} is workspace:* but has no resolvable version`)
      deps[k] = v
    }
  }
}

const published = []
const skipped = []
const failed = []

function alreadyOnNpm(name, version) {
  try {
    execFileSync('npm', ['view', `${name}@${version}`, 'version'], { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

function publishPackage(srcDir, baseJson, overrideName) {
  const name = overrideName || baseJson.name
  const version = baseJson.version
  if (alreadyOnNpm(name, version)) {
    skipped.push(`${name}@${version}`)
    console.log(`= skip ${name}@${version} (already on npm)`)
    return
  }
  try {
    const tmp = fs.mkdtempSync(path.join(DEST, 'p-'))
    execSync(`cp -R ${JSON.stringify(srcDir)}/. ${JSON.stringify(tmp)}/`)
    fs.rmSync(path.join(tmp, 'node_modules'), { recursive: true, force: true })

    const j = JSON.parse(fs.readFileSync(path.join(tmp, 'package.json')))
    j.name = name
    for (const f of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      rewriteWorkspaceSpecs(j[f], name)
    }
    fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify(j, null, 2) + '\n')

    const packOut = execFileSync('npm', ['pack', '--json'], { cwd: tmp }).toString()
    const tgz = JSON.parse(packOut)[0].filename
    execFileSync('npm', ['publish', path.join(tmp, tgz), '--access', 'public'], {
      cwd: tmp,
      stdio: 'inherit',
    })
    published.push(`${name}@${version}`)
    console.log(`+ published ${name}@${version}`)
  } catch (e) {
    const msg = (e && e.message ? e.message : String(e)).split('\n')[0]
    failed.push(`${name}@${version}: ${msg}`)
    console.error(`x FAIL ${name}@${version}: ${msg}`)
  }
}

for (const name of targets) {
  publishPackage(meta[name].dir, meta[name].json)
}

// The @hanzo/gui umbrella alias: same tarball as `hanzogui`, name swapped.
if (meta['hanzogui']) {
  publishPackage(meta['hanzogui'].dir, meta['hanzogui'].json, '@hanzo/gui')
}

console.log(`\n--- summary ---`)
console.log(`published: ${published.length}`)
console.log(`skipped:   ${skipped.length}`)
console.log(`failed:    ${failed.length}`)
if (failed.length) {
  failed.forEach((f) => console.error('  - ' + f))
  process.exit(1)
}

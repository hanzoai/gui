/**
 * The barrel is this package's whole contract, and it is hand-written, so a
 * rename lands in three places or it does not land: the file, the file's own
 * export, and `index.ts`. Miss the third and `tsc` is happy — the module still
 * compiles — while every consumer gets a name that no longer exists.
 *
 * So this reads `src/index.ts` and holds it against the sources it names:
 * every module resolves, every named export exists there, and the retired names
 * stay retired.
 *
 *   node --test barrel.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = join(dirname(fileURLToPath(import.meta.url)), 'src')
const barrel = readFileSync(join(SRC, 'index.ts'), 'utf8')

/** Every `export { … } from './x'` / `export type { … } from './x'` clause. */
function clauses(source) {
  const out = []
  const re = /export\s+(type\s+)?\{([^}]*)\}\s+from\s+'\.\/([\w.-]+)'/g
  for (const [, , names, module] of source.matchAll(re)) {
    const specifiers = names
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
      // `CommandItem as OrgCommandItem` — the LOCAL name is what must exist.
      .map((n) => n.split(/\s+as\s+/)[0].replace(/^type\s+/, ''))
    out.push({ module, specifiers })
  }
  return out
}

/** Names `file` declares as its own exports. */
function exported(file) {
  const source = readFileSync(file, 'utf8')
  const names = new Set()
  const re =
    /export\s+(?:declare\s+)?(?:async\s+)?(?:function|const|let|var|class|type|interface|enum)\s+([A-Za-z_$][\w$]*)/g
  for (const [, name] of source.matchAll(re)) names.add(name)
  return names
}

function resolve(module) {
  for (const ext of ['.ts', '.tsx']) {
    const file = join(SRC, module + ext)
    if (existsSync(file)) return file
  }
  return null
}

const surface = clauses(barrel)

test('the barrel names at least the whole signed-in chrome', () => {
  const all = surface.flatMap((c) => c.specifiers)
  for (const name of [
    'OrgHeader',
    'OrgCommandPalette',
    'UserOrgDropdown',
    'HanzoAppBar',
    'HanzoAppLauncher',
    'HanzoHeader',
    'HanzoMark',
    'ORG_DOMAINS',
  ]) {
    assert.ok(all.includes(name), `${name} is missing from the barrel`)
  }
})

test('every module the barrel re-exports from exists', () => {
  for (const { module } of surface) {
    assert.ok(resolve(module), `index.ts re-exports from missing ./${module}`)
  }
})

test('every name the barrel re-exports is declared by that module', () => {
  for (const { module, specifiers } of surface) {
    const file = resolve(module)
    if (!file) continue
    const declared = exported(file)
    for (const name of specifiers) {
      assert.ok(
        declared.has(name),
        `index.ts exports ${name} from ./${module}, which does not declare it`
      )
    }
  }
})

test('org, never tenant — the vocabulary law holds across the package', () => {
  const offenders = readdirSync(SRC, { recursive: true })
    .filter((f) => /\.tsx?$/.test(f))
    .filter((f) => /tenant/i.test(readFileSync(join(SRC, f), 'utf8')))
  assert.deepEqual(offenders, [], 'these files still say "tenant"')
})

test('the retired switcher and its stale app list stay retired', () => {
  const all = surface.flatMap((c) => c.specifiers)
  // AppSwitcher was a second, denser cross-app popover over a 26-app list that
  // had drifted from the product. HanzoAppLauncher is the one switcher, over
  // the one list (HANZO_APPS).
  for (const name of [
    'AppSwitcher',
    'DEFAULT_TENANT_APPS',
    'getAppsForOrg',
    'useTenantAuth',
  ]) {
    assert.ok(!all.includes(name), `${name} is exported again`)
    assert.equal(resolve(name), null, `${name}.tsx is back on disk`)
  }
})

test('HANZO_APPS is the only app registry left in the package', () => {
  const lists = readdirSync(SRC, { recursive: true })
    .filter((f) => /\.tsx?$/.test(f))
    .filter((f) =>
      /^export const [A-Z_]*APPS\b/m.test(readFileSync(join(SRC, f), 'utf8'))
    )
  assert.deepEqual(lists, ['hanzo-apps.tsx'])
})

#!/usr/bin/env node
// Applies the Hanzo GUI brand to an upstream (tamagui) tree.
//
// This repo is a REBRAND of tamagui, and it was made by copy-paste: there is no
// merge-base with upstream at all (372 commits here, 15,791 there, unrelated
// histories), and the layout was flattened on the way over. So `git merge
// upstream` can never work, and every "sync" so far has been a hand re-application
// that drifts.
//
// The fix is the same shape that worked for hanzoai/bot: keep three layers apart —
// upstream content, this transform, and our own packages — so a sync becomes
//
//     node scripts/rebrand.mjs --from ../../tamagui/tamagui
//     <restore our 12 packages>
//     bun install && bun run build
//
// The transform is idempotent: running it on an already-branded tree is a no-op.
//
//   node scripts/rebrand.mjs --from <path/to/tamagui>   transform a tree in place
//   node scripts/rebrand.mjs --check                    exit 1 if this tree drifted
//
// It does NOT copy anything. Point --from at a pristine tamagui checkout and it
// rewrites that checkout; what to do with the result is the caller's decision.

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, lstatSync, renameSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

// Ordered: the most specific pattern wins before a broader one eats it.
// Verified against both trees rather than assumed —
//   createTamagui 123 -> createGui 60, TamaguiProvider 76 -> GuiProvider 34,
//   TamaguiElement 125 -> GuiElement 122, withTamagui 17 -> withGui 9,
//   TAMAGUI_CACHE -> GUI_CACHE (379 GUI_ sites here, zero TAMAGUI_).
// SPECIAL CASES FIRST. The blanket tamagui->hanzogui rule double-brands names
// that already carry the word, and the existing rebrand shortened those by hand.
// Without these, a transplant invents @hanzogui/hanzogui-dev-config beside the
// real @hanzogui/dev-config and every dependent resolves to nothing.
const RULES = [
  // BOTH forms — scoped AND bare. A path string like code/core/helpers-tamagui
  // carries no scope, so it fell through to the general rule and became
  // component-helpers, a directory that does not exist; the native bundler then
  // failed with "Tsconfig not found .../pkgs/core/component-helpers".
  [/@tamagui\/tamagui-dev-config/g, '@hanzogui/dev-config'],
  [/@tamagui\/helpers-tamagui/g, '@hanzogui/component-helpers'],
  [/\btamagui-dev-config\b/g, 'dev-config'],
  [/\bhelpers-tamagui\b/g, 'component-helpers'],
  [/\bcreate-tamagui\b/g, 'create-gui'],

  // The GitHub remote is hanzoai/gui — the brand name and the repo path are NOT
  // the same string. Upstream's `github.com/tamagui/tamagui` would otherwise fall
  // through to the blanket rule and become `github.com/hanzogui/hanzogui`, a repo
  // that has never existed, and it ships in the `repository.url` of every one of
  // the 174 published packages. Second form repairs a tree already branded wrong.
  [/github\.com\/tamagui\/tamagui/g, 'github.com/hanzoai/gui'],
  [/github\.com\/hanzogui\/hanzogui/g, 'github.com/hanzoai/gui'],

  [/@tamagui\//g, '@hanzogui/'],
  [/TAMAGUI/g, 'GUI'], // env vars: TAMAGUI_CACHE -> GUI_CACHE
  [/Tamagui/g, 'Gui'], // identifiers: createTamagui -> createGui
  [/tamagui/g, 'hanzogui'], // package + path: tamagui-loader -> hanzogui-loader
]

// Directory names follow the same shortenings, so the tree matches the manifests.
const PATH_SPECIALS = [
  [/(^|\/)tamagui-dev-config(\/|$)/g, '$1dev-config$2'],
  [/(^|\/)helpers-tamagui(\/|$)/g, '$1component-helpers$2'],
  [/(^|\/)create-tamagui(\/|$)/g, '$1create-gui$2'],
]

// The layout was flattened, so a path map is part of the brand, not a separate
// migration. code/packages/* collapses into pkgs/* while the other three keep
// their grouping; everything that is an APP moves out of the package tree.
const APPS = new Set([
  'demos',
  'kitchen-sink',
  'kitchen-sink-go',
  'kitchen-sink-shared',
  'sandbox',
  'starters',
  'tests',
  'tamagui.dev',
])

const mapPath = (p) => {
  const m = /^code\/([^/]+)\/(.*)$/.exec(p)
  if (!m) return p
  const [, group, rest] = m
  if (group === 'packages') return `pkgs/${rest}` // flattened
  if (APPS.has(group)) return `apps/${group === 'tamagui.dev' ? 'gui.hanzo.ai' : group}/${rest}`
  return `pkgs/${group}/${rest}` // core, ui, compiler keep their grouping
}

const SKIP = [
  // States the mapping literally: branding it rewrites the rules into identity
  // no-ops and silently disarms every later sync. Learned the hard way on bot.
  /^scripts\/rebrand\.mjs$/,
  // Upstream's licence and attributions name upstream. Rewriting them would be a
  // false claim of authorship.
  /^LICENSE$/,
  /(^|\/)LICENSE$/,
  /^patches\//,
  // A LOCKFILE IS DERIVED STATE — regenerate it, never brand it. Branding pins
  // upstream's VERSION NUMBERS under OUR scope, e.g.
  //     @hanzogui/constants@2.0.0-rc.0-1769885482630
  // a tarball nobody ever published, so `bun install` 404s. Delete the lockfile
  // after transforming and let the package manager resolve: workspace packages
  // resolve locally and only real external deps go to the registry.
  /^bun\.lock$/,
  /(^|\/)(bun\.lock|bun\.lockb|pnpm-lock\.yaml|package-lock\.json|yarn\.lock)$/,
  /(^|\/)node_modules\//,
  /^\.git\//,
]

// The layout map has to apply to path STRINGS inside files too, not just to the
// files themselves. Workspace globs, turbo pipelines and tsconfig references all
// name `code/...` literally, and moving the files while leaving those behind
// produces a tree that assembles and then cannot install:
//     error: Workspace not found "./code/sandbox"
// Ordered longest-first so `code/packages/` is not eaten by a shorter prefix.
const CONTENT_PATHS = [
  [/(\.\/)?code\/packages\//g, '$1pkgs/'],
  // Relative references INTO the flattened group lose the `packages/` segment
  // too. A tsconfig at code/ui/tabs pointed to ../../element, which was
  // right there and resolves to pkgs/packages/element here — a directory the
  // flattening deleted. Same depth, one fewer segment.
  [/((?:\.\.\/)+)packages\//g, '$1'],
  [/(\.\/)?code\/(core|ui|compiler)\//g, '$1pkgs/$2/'],
  [/(\.\/)?code\/hanzogui\.dev/g, '$1apps/gui.hanzo.ai'],
  [/(\.\/)?code\/(demos|kitchen-sink-go|kitchen-sink-shared|kitchen-sink|sandbox|starters|tests)/g, '$1apps/$2'],
]

const brand = (s) =>
  CONTENT_PATHS.reduce(
    (acc, [re, to]) => acc.replace(re, to),
    RULES.reduce((acc, [re, to]) => acc.replace(re, to), s),
  )

// FLATTENING CHANGES DEPTH, and relative paths that reach the repo root have to
// lose a level with it. `code/packages/timer` sat three directories down, so its
// tsconfig said `../../../tsconfig.json`; `pkgs/timer` is only two, and tsc then
// fails with TS5083 "Cannot read file". Only code/packages/* flattened —
// pkgs/core/* and pkgs/ui/* keep their depth and their `../../../` is CORRECT,
// so this must not be applied to them.
//
// Targeted at tsconfig's own path fields rather than every `../../../` in the
// file: a blanket rewrite would also break relative imports that legitimately
// climb three levels for another reason.
const TSCONFIG_FIELDS = /("(?:extends|path)"\s*:\s*")((?:\.\.\/){3,})/g
const undepth = (s) => s.replace(TSCONFIG_FIELDS, (_, head, ups) => head + ups.slice(3))

const wasFlattened = (p) => /^code\/packages\//.test(p)
const isBinary = (buf) => buf.subarray(0, 8192).includes(0)

const args = process.argv.slice(2)
const check = args.includes('--check')
const fromIdx = args.indexOf('--from')
const root = fromIdx >= 0 ? args[fromIdx + 1] : '.'

const git = (...a) =>
  execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', maxBuffer: 1 << 28 })

const files = git('ls-files', '-z')
  .split('\0')
  .filter(Boolean)
  .filter((f) => !SKIP.some((re) => re.test(f)))

let edited = 0
for (const file of files) {
  const abs = join(root, file)
  let st
  try {
    st = lstatSync(abs) // lstat: never rewrite through a symlink
  } catch {
    continue
  }
  if (!st.isFile()) continue
  const buf = readFileSync(abs)
  if (isBinary(buf)) continue
  const before = buf.toString('utf8')
  let after = brand(before)
  if (wasFlattened(file)) after = undepth(after)
  if (after !== before) {
    edited++
    if (!check) writeFileSync(abs, after)
  }
}

// Paths carry the brand and the layout. Deepest-first so renaming a parent
// cannot invalidate a child still queued behind it.
const brandPath = (p) =>
  brand(PATH_SPECIALS.reduce((acc, [re, to]) => acc.replace(re, to), mapPath(p)))

const moves = files
  .map((f) => [f, brandPath(f)])
  .filter(([from, to]) => from !== to)
  .sort((a, b) => b[0].split('/').length - a[0].split('/').length)

// A rename leaves git's index pointing at the old path, so a --check that trusts
// `ls-files` reports every move a second time. Only count a move whose source is
// actually still on disk.
const pending = moves.filter(([from]) => {
  try {
    lstatSync(join(root, from))
    return true
  } catch {
    return false
  }
})

if (!check) {
  for (const [from, to] of pending) {
    const absTo = join(root, to)
    mkdirSync(dirname(absTo), { recursive: true })
    renameSync(join(root, from), absTo)
  }
}

console.log(
  check
    ? `rebrand --check: ${edited} file(s) and ${pending.length} path(s) would change`
    : `rebrand: ${edited} file(s) rewritten, ${pending.length} path(s) moved`,
)
if (check && (edited || pending.length)) process.exit(1)

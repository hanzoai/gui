#!/usr/bin/env bun
/**
 * Rebrand script: Rename all @tamagui/* packages to @hanzo/gui-*
 *
 * Phase 1: Renames package.json name fields and dependency references
 * Run: bun scripts/rebrand/rename-packages.ts
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')

// Special case mappings (applied BEFORE general pattern)
const SPECIAL_CASES: Record<string, string> = {
  // Redundant "tamagui" in name
  '@tamagui/helpers-tamagui': '@hanzo/gui-helpers',
  '@tamagui/tamagui-dev-config': '@hanzo/gui-dev-config',
  // Non-scoped packages
  'tamagui-loader': '@hanzo/gui-loader',
  'create-tamagui': 'create-hanzo-gui',
  'bento-get': '@hanzo/gui-bento-get',
  'tamagui': '@hanzo/gui',
  'tamagui-monorepo': 'hanzo-gui',
}

function renamePkg(name: string): string {
  // Check special cases first
  if (SPECIAL_CASES[name] !== undefined) {
    return SPECIAL_CASES[name]
  }
  // General pattern: @tamagui/X -> @hanzo/gui-X
  if (name.startsWith('@tamagui/')) {
    return name.replace('@tamagui/', '@hanzo/gui-')
  }
  // Leave other names unchanged
  return name
}

function renameDeps(deps: Record<string, string> | undefined): Record<string, string> | undefined {
  if (!deps) return deps
  const result: Record<string, string> = {}
  for (const [key, val] of Object.entries(deps)) {
    result[renamePkg(key)] = val
  }
  return result
}

function findPackageJsons(dir: string, results: string[] = []): string[] {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === 'dist' || entry === 'types' || entry === '.git') continue
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      findPackageJsons(full, results)
    } else if (entry === 'package.json') {
      results.push(full)
    }
  }
  return results
}

// Find all package.json files
const allPkgJsons = findPackageJsons(ROOT)
console.log(`Found ${allPkgJsons.length} package.json files`)

let updated = 0

for (const pkgPath of allPkgJsons) {
  const raw = readFileSync(pkgPath, 'utf-8')
  const pkg = JSON.parse(raw)
  let changed = false

  // Rename "name" field
  if (pkg.name && renamePkg(pkg.name) !== pkg.name) {
    console.log(`  ${pkg.name} -> ${renamePkg(pkg.name)}`)
    pkg.name = renamePkg(pkg.name)
    changed = true
  }

  // Rename dependency fields
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    if (pkg[field]) {
      const renamed = renameDeps(pkg[field])
      if (JSON.stringify(renamed) !== JSON.stringify(pkg[field])) {
        pkg[field] = renamed
        changed = true
      }
    }
  }

  // Rename repository URL
  if (pkg.repository?.url?.includes('tamagui/tamagui')) {
    pkg.repository.url = pkg.repository.url.replace('tamagui/tamagui', 'hanzoai/gui')
    changed = true
  }
  if (typeof pkg.repository === 'string' && pkg.repository.includes('tamagui/tamagui')) {
    pkg.repository = pkg.repository.replace('tamagui/tamagui', 'hanzoai/gui')
    changed = true
  }

  // Rename "bin" keys that reference tamagui
  if (pkg.bin && typeof pkg.bin === 'object') {
    const newBin: Record<string, string> = {}
    for (const [key, val] of Object.entries(pkg.bin)) {
      const newKey = key
        .replace('tamagui-build', 'hanzo-gui-build')
        .replace('tamagui', 'hanzo-gui')
        .replace('create-tamagui', 'create-hanzo-gui')
        .replace('tama', 'hgui')
      newBin[newKey] = val as string
      if (newKey !== key) changed = true
    }
    if (changed) pkg.bin = newBin
  }

  // Rename "alsoPublishAs" or similar fields
  if (pkg.alsoPublishAs_disabled) {
    pkg.alsoPublishAs_disabled = pkg.alsoPublishAs_disabled.map((n: string) => renamePkg(n))
    changed = true
  }

  // Rename in scripts that reference @tamagui/ package names
  if (pkg.scripts) {
    for (const [key, val] of Object.entries(pkg.scripts)) {
      if (typeof val === 'string' && val.includes('tamagui')) {
        let newVal = val as string
        // Special cases first
        newVal = newVal.replace(/@tamagui\/helpers-tamagui/g, '@hanzo/gui-helpers')
        newVal = newVal.replace(/@tamagui\/tamagui-dev-config/g, '@hanzo/gui-dev-config')
        // General @tamagui/ pattern
        newVal = newVal.replace(/@tamagui\//g, '@hanzo/gui-')
        // tamagui-build CLI
        newVal = newVal.replace(/tamagui-build/g, 'hanzo-gui-build')
        // create-tamagui CLI
        newVal = newVal.replace(/create-tamagui/g, 'create-hanzo-gui')
        if (newVal !== val) {
          pkg.scripts[key] = newVal
          changed = true
        }
      }
    }
  }

  if (changed) {
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
    updated++
  }
}

console.log(`\nUpdated ${updated} package.json files`)

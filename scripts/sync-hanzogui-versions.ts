#!/usr/bin/env bun
/**
 * Syncs all @hanzogui/* package versions to match the main hanzogui package.
 * Used as a post-merge hook to ensure new packages get the correct version.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { Glob } from 'bun'

const ROOT_PACKAGE = 'pkgs/ui/hanzogui/package.json'

async function main() {
  // Get the canonical version from the main hanzogui package
  const hanzoguiPkg = JSON.parse(await readFile(ROOT_PACKAGE, 'utf8'))
  const targetVersion = hanzoguiPkg.version

  console.info(`Target version: ${targetVersion}`)

  // Find all package.json files in code/ui and code/core
  const glob = new Glob('code/{ui,core}/*/package.json')
  const packagePaths = Array.from(glob.scanSync('.'))

  let updated = 0

  for (const pkgPath of packagePaths) {
    try {
      const content = await readFile(pkgPath, 'utf8')
      const pkg = JSON.parse(content)

      // Only update @hanzogui scoped packages
      if (!pkg.name?.startsWith('@hanzogui/')) continue

      if (pkg.version !== targetVersion) {
        console.info(`  Updating ${pkg.name}: ${pkg.version} -> ${targetVersion}`)
        pkg.version = targetVersion
        await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
        updated++
      }
    } catch (e) {
      // Skip invalid packages
    }
  }

  if (updated > 0) {
    console.info(`\nUpdated ${updated} package(s) to version ${targetVersion}`)
  } else {
    console.info('All packages already in sync')
  }
}

main().catch((e) => {
  console.error('Error syncing versions:', e)
  process.exit(1)
})

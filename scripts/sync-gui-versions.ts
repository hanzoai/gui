#!/usr/bin/env bun
/**
 * Syncs all @hanzogui/* package versions to match the main hanzo-gui package.
 * Used as a post-merge hook to ensure new packages get the correct version.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { Glob } from 'bun'

const ROOT_PACKAGE = 'code/ui/hanzogui/package.json'

async function main() {
  // Get the canonical version from the main hanzo-gui package
  const guiPkg = JSON.parse(await readFile(ROOT_PACKAGE, 'utf8'))
  const targetVersion = guiPkg.version

  console.info(`Target version: ${targetVersion}`)

  // Find all package.json files across the workspace, excluding node_modules
  const glob = new Glob('code/**/package.json')
  const packagePaths = Array.from(glob.scanSync('.')).filter(
    (p) => !p.includes('node_modules')
  )

  let updated = 0

  for (const pkgPath of packagePaths) {
    try {
      const content = await readFile(pkgPath, 'utf8')
      const pkg = JSON.parse(content)

      // Only update @gui scoped packages
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

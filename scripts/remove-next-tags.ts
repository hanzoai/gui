#!/usr/bin/env bun
/**
 * Removes the 'next' dist-tag from every published hanzogui / @hanzogui/* package.
 * Use after promoting a new RC line to `latest`, when the legacy `next` tag is no longer wanted.
 *
 * Usage:
 *   bun ./scripts/remove-next-tags.ts             # actually remove
 *   bun ./scripts/remove-next-tags.ts --dry-run   # preview only
 */

import { readFile } from 'node:fs/promises'
import { Glob, $ } from 'bun'

const DRY_RUN = process.argv.includes('--dry-run')

async function collectPackages(): Promise<string[]> {
  const glob = new Glob('code/**/package.json')
  const paths = Array.from(glob.scanSync('.')).filter(
    (p) => !p.includes('node_modules') && !p.includes('__tests__/fixtures/'),
  )

  const names: string[] = []
  for (const pkgPath of paths) {
    try {
      const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
      if (pkg.private) continue
      const isHanzoguiPkg =
        pkg.name === 'hanzogui' ||
        pkg.name?.startsWith('hanzogui-') ||
        pkg.name?.startsWith('@hanzogui/')
      if (!isHanzoguiPkg) continue
      names.push(pkg.name)
    } catch {}
  }

  return names
}

async function main() {
  const packages = await collectPackages()
  console.info(
    `Checking ${packages.length} packages for 'next' dist-tag${DRY_RUN ? ' (DRY RUN)' : ''}...\n`,
  )

  let removed = 0
  let skipped = 0
  let errors = 0

  for (const name of packages) {
    try {
      const result = await $`npm view ${name} dist-tags --json`.quiet()
      const distTags = JSON.parse(result.stdout.toString())

      if (!distTags.next) {
        skipped++
        continue
      }

      if (DRY_RUN) {
        console.info(`  would remove 'next' from ${name} (currently ${distTags.next})`)
        removed++
        continue
      }

      console.info(`  removing 'next' from ${name} (was ${distTags.next})`)
      await $`npm dist-tag rm ${name} next`.quiet()
      removed++
    } catch (e: any) {
      const msg = (e.stderr?.toString() || e.message || String(e)).split('\n')[0]
      console.warn(`  error on ${name}: ${msg}`)
      errors++
    }
  }

  console.info(
    `\nDone: ${removed} ${DRY_RUN ? 'would-remove' : 'removed'}, ${skipped} skipped (no 'next' tag), ${errors} errors`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

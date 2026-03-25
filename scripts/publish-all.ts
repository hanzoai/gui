import fs from 'fs-extra'
import path from 'node:path'
import * as proc from 'node:child_process'
import { promisify } from 'node:util'
import pMap from 'p-map'

const exec = promisify(proc.exec)

const VERSION = '2.0.0-rc.29'
const DRY_RUN = process.argv.includes('--dry-run')
const REPO_ROOT = path.resolve(import.meta.dir, '..')

// Use rc tag since this is a release candidate
const DIST_TAG = 'rc'

interface PackageInfo {
  name: string
  dir: string
  json: Record<string, any>
}

async function findPackages(baseDir: string): Promise<PackageInfo[]> {
  const packages: PackageInfo[] = []

  async function scan(dir: string, depth = 0) {
    if (depth > 4) return
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      if (entry.name === 'node_modules' || entry.name === '.turbo') continue
      const fullPath = path.join(dir, entry.name)
      const pkgPath = path.join(fullPath, 'package.json')
      if (await fs.pathExists(pkgPath)) {
        try {
          const json = await fs.readJSON(pkgPath)
          if (json.name?.startsWith('@hanzo/gui') && !json.private) {
            packages.push({ name: json.name, dir: fullPath, json })
          }
        } catch {}
      }
      await scan(fullPath, depth + 1)
    }
  }

  await scan(baseDir)
  return packages
}

async function isPublished(name: string, version: string): Promise<boolean> {
  try {
    await exec(`npm view ${name}@${version} version`)
    return true
  } catch {
    return false
  }
}

async function publishPackage(
  pkg: PackageInfo,
  tmpDir: string
): Promise<'published' | 'skipped' | 'failed'> {
  // Check if already published
  if (await isPublished(pkg.name, VERSION)) {
    console.log(`SKIP: ${pkg.name}@${VERSION} (already published)`)
    return 'skipped'
  }

  if (DRY_RUN) {
    console.log(`DRY: ${pkg.name}@${VERSION}`)
    return 'published'
  }

  // Copy to temp dir
  const safeName = pkg.name.replace('/', '_')
  const tmpPkg = path.join(tmpDir, safeName)
  await fs.remove(tmpPkg)
  await fs.copy(pkg.dir, tmpPkg, {
    filter: (src) => !src.includes('node_modules') && !src.includes('.turbo'),
  })

  // Fix package.json: set version and replace workspace:* refs
  const pkgJson = await fs.readJSON(path.join(tmpPkg, 'package.json'))
  pkgJson.version = VERSION
  for (const field of [
    'dependencies',
    'devDependencies',
    'optionalDependencies',
    'peerDependencies',
  ]) {
    if (!pkgJson[field]) continue
    for (const dep of Object.keys(pkgJson[field])) {
      if (pkgJson[field][dep].startsWith('workspace:')) {
        pkgJson[field][dep] = VERSION
      }
    }
  }
  await fs.writeJSON(path.join(tmpPkg, 'package.json'), pkgJson, { spaces: 2 })

  try {
    // Pack
    const { stdout: packOut } = await exec(`npm pack --pack-destination ${tmpDir}`, {
      cwd: tmpPkg,
    })
    const tgzFile = packOut.trim().split('\n').pop()!

    // Publish
    await exec(
      `npm publish ${path.join(tmpDir, tgzFile)} --access public --tag ${DIST_TAG}`
    )
    console.log(`OK: ${pkg.name}@${VERSION}`)

    // Cleanup tgz
    await fs.remove(path.join(tmpDir, tgzFile))
    return 'published'
  } catch (err: any) {
    // Check if it's a "already published" error
    if (
      err.stderr?.includes('EPUBLISHCONFLICT') ||
      err.stderr?.includes('cannot publish over')
    ) {
      console.log(`SKIP: ${pkg.name}@${VERSION} (conflict/already exists)`)
      return 'skipped'
    }
    console.error(`FAIL: ${pkg.name} - ${err.stderr || err.message}`)
    return 'failed'
  } finally {
    await fs.remove(tmpPkg).catch(() => {})
  }
}

async function main() {
  console.log(`Publishing @hanzogui/* packages`)
  console.log(`Version: ${VERSION}`)
  console.log(`Tag: ${DIST_TAG}`)
  console.log(`Dry run: ${DRY_RUN}`)
  console.log('')

  const tmpDir = `/tmp/gui-publish-${Date.now()}`
  await fs.ensureDir(tmpDir)

  try {
    // Find packages in the gui repo
    const guiCodeDir = path.join(REPO_ROOT, 'code')
    const packages = await findPackages(guiCodeDir)

    console.log(`Found ${packages.length} publishable packages\n`)

    // Publish with concurrency
    const results = await pMap(packages, (pkg) => publishPackage(pkg, tmpDir), {
      concurrency: 10,
    })

    const published = results.filter((r) => r === 'published').length
    const skipped = results.filter((r) => r === 'skipped').length
    const failed = results.filter((r) => r === 'failed').length

    console.log('')
    console.log('=== Results ===')
    console.log(`Published: ${published}`)
    console.log(`Skipped:   ${skipped}`)
    console.log(`Failed:    ${failed}`)

    if (failed > 0) {
      process.exit(1)
    }
  } finally {
    await fs.remove(tmpDir).catch(() => {})
  }
}

main()

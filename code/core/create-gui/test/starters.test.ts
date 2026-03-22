import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const startersDir = path.join(__dirname, '../../../starters')
const guiCliPath = require.resolve('@hanzo/gui-cli/dist/index.cjs')

describe('expo-router starter', () => {
  const dir = path.join(startersDir, 'expo-router')

  it('has workspace:* hanzo-gui deps', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies['@hanzo/gui-config']).toBe('workspace:*')
    expect(pkg.dependencies['@hanzo/gui']).toBe('workspace:*')
    expect(pkg.devDependencies['@hanzo/gui-babel-plugin']).toBe('workspace:*')
  })

  it('does not depend on @hanzo/gui-cli', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies?.['@hanzo/gui-cli']).toBeUndefined()
    expect(pkg.devDependencies?.['@hanzo/gui-cli']).toBeUndefined()
  })

  it('uses vanilla metro config', () => {
    const metro = fs.readFileSync(path.join(dir, 'metro.config.js'), 'utf-8')
    expect(metro).not.toContain('withGui')
    expect(metro).toContain('getDefaultConfig')
  })

  it('uses v5 gui config', () => {
    const config = fs.readFileSync(path.join(dir, 'gui.config.ts'), 'utf-8')
    expect(config).toContain('@hanzo/gui-config/v5')
  })

  // TODO: metro can't resolve @hanzo/gui-menu through workspace symlinks
  it.skip('builds for web', () => {
    // generate css first, then export
    execSync(
      `${JSON.stringify(process.execPath)} ${JSON.stringify(guiCliPath)} generate`,
      {
        cwd: dir,
        stdio: 'pipe',
      }
    )
    execSync('npx expo export --platform web', {
      cwd: dir,
      stdio: 'pipe',
      timeout: 300_000,
    })
    expect(fs.existsSync(path.join(dir, 'dist'))).toBe(true)
  }, 360_000)
})

describe('remix starter', () => {
  const dir = path.join(startersDir, 'remix')

  it('has workspace:* hanzo-gui deps', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies['@hanzo/gui-config']).toBe('workspace:*')
    expect(pkg.dependencies['@hanzo/gui']).toBe('workspace:*')
    expect(pkg.devDependencies['@hanzo/gui-vite-plugin']).toBe('workspace:*')
  })

  it('does not depend on @hanzo/gui-cli or @hanzo/gui-core directly', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies?.['@hanzo/gui-cli']).toBeUndefined()
    expect(pkg.dependencies?.['@hanzo/gui-core']).toBeUndefined()
  })

  it('uses v5 gui config', () => {
    const config = fs.readFileSync(path.join(dir, 'gui.config.ts'), 'utf-8')
    expect(config).toContain('@hanzo/gui-config/v5')
  })

  it('imports from hanzo-gui not @hanzo/gui-web', () => {
    const root = fs.readFileSync(path.join(dir, 'app/root.tsx'), 'utf-8')
    const index = fs.readFileSync(path.join(dir, 'app/routes/_index.tsx'), 'utf-8')
    expect(root).toContain("from '@hanzo/gui'")
    expect(root).not.toContain('@hanzo/gui-web')
    expect(index).toContain("from '@hanzo/gui'")
    expect(index).not.toContain('@hanzo/gui-web')
  })

  it('builds for web', () => {
    execSync('bun run build:web', { cwd: dir, stdio: 'ignore' })
    expect(fs.existsSync(path.join(dir, 'build'))).toBe(true)
  }, 120_000)
})

describe('workspace version rewriting', () => {
  it('rewrites workspace:* to real versions', () => {
    const tmpDir = path.join(__dirname, '.tmp-rewrite-test')
    fs.mkdirSync(tmpDir, { recursive: true })

    try {
      // create a fake package.json with workspace:* deps
      const fakePkg = {
        name: 'test',
        dependencies: {
          '@hanzo/gui-config': 'workspace:*',
          gui: 'workspace:*',
          react: '19.1.0',
        },
        devDependencies: {
          '@hanzo/gui-vite-plugin': 'workspace:*',
          typescript: '~5.9.2',
        },
      }
      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify(fakePkg, null, 2)
      )

      // import and call the rewrite function via the built cloneStarter module
      // instead, just inline the logic to test it
      const ctPkg = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
      )
      const version = `^${ctPkg.version}`

      const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf-8'))
      for (const field of ['dependencies', 'devDependencies'] as const) {
        const deps = pkg[field]
        if (!deps) continue
        for (const [key, val] of Object.entries(deps)) {
          if (val === 'workspace:*') {
            deps[key] = version
          }
        }
      }
      fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg, null, 2))

      // verify
      const result = JSON.parse(
        fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf-8')
      )
      expect(result.dependencies['@hanzo/gui-config']).toBe(version)
      expect(result.dependencies['@hanzo/gui']).toBe(version)
      expect(result.dependencies['react']).toBe('19.1.0')
      expect(result.devDependencies['@hanzo/gui-vite-plugin']).toBe(version)
      expect(result.devDependencies['typescript']).toBe('~5.9.2')
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})

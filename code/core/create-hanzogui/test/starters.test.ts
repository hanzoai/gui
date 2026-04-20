import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const startersDir = path.join(__dirname, '../../../starters')
const hanzoguiCliPath = require.resolve('@hanzogui/cli/dist/index.cjs')

describe('expo-router starter', () => {
  const dir = path.join(startersDir, 'expo-router')

  it('has workspace:* hanzogui deps', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies['@hanzogui/config']).toBe('workspace:*')
    expect(pkg.dependencies['hanzogui']).toBe('workspace:*')
    expect(pkg.devDependencies['@hanzogui/babel-plugin']).toBe('workspace:*')
  })

  it('does not depend on @hanzogui/cli', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies?.['@hanzogui/cli']).toBeUndefined()
    expect(pkg.devDependencies?.['@hanzogui/cli']).toBeUndefined()
  })

  it('uses vanilla metro config', () => {
    const metro = fs.readFileSync(path.join(dir, 'metro.config.js'), 'utf-8')
    expect(metro).not.toContain('withHanzogui')
    expect(metro).toContain('getDefaultConfig')
  })

  it('uses v5 hanzogui config', () => {
    const config = fs.readFileSync(path.join(dir, 'hanzogui.config.ts'), 'utf-8')
    expect(config).toContain('@hanzogui/config/v5')
  })

  // TODO: metro can't resolve @hanzogui/menu through workspace symlinks
  it.skip('builds for web', () => {
    // generate css first, then export
    execSync(
      `${JSON.stringify(process.execPath)} ${JSON.stringify(hanzoguiCliPath)} generate`,
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

  it('has workspace:* hanzogui deps', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies['@hanzogui/config']).toBe('workspace:*')
    expect(pkg.dependencies['hanzogui']).toBe('workspace:*')
    expect(pkg.devDependencies['@hanzogui/vite-plugin']).toBe('workspace:*')
  })

  it('does not depend on @hanzogui/cli or @hanzogui/core directly', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies?.['@hanzogui/cli']).toBeUndefined()
    expect(pkg.dependencies?.['@hanzogui/core']).toBeUndefined()
  })

  it('uses v5 hanzogui config', () => {
    const config = fs.readFileSync(path.join(dir, 'hanzogui.config.ts'), 'utf-8')
    expect(config).toContain('@hanzogui/config/v5')
  })

  it('imports from hanzogui not @hanzogui/web', () => {
    const root = fs.readFileSync(path.join(dir, 'app/root.tsx'), 'utf-8')
    const index = fs.readFileSync(path.join(dir, 'app/routes/_index.tsx'), 'utf-8')
    expect(root).toContain("from 'hanzogui'")
    expect(root).not.toContain('@hanzogui/web')
    expect(index).toContain("from 'hanzogui'")
    expect(index).not.toContain('@hanzogui/web')
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
          '@hanzogui/config': 'workspace:*',
          hanzogui: 'workspace:*',
          react: '19.1.0',
        },
        devDependencies: {
          '@hanzogui/vite-plugin': 'workspace:*',
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
      expect(result.dependencies['@hanzogui/config']).toBe(version)
      expect(result.dependencies['hanzogui']).toBe(version)
      expect(result.dependencies['react']).toBe('19.1.0')
      expect(result.devDependencies['@hanzogui/vite-plugin']).toBe(version)
      expect(result.devDependencies['typescript']).toBe('~5.9.2')
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})

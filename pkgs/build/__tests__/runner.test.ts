import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const runner = join(import.meta.dirname, '../tsgo-build.mjs')
const fixture = join(import.meta.dirname, 'fixtures/package')

const build = (cwd: string, ...args: string[]) =>
  execFileSync(process.execPath, [runner, ...args], { cwd, stdio: 'pipe' })
const read = (dir: string, file: string) => readFileSync(join(dir, file), 'utf8')
const copy = () => {
  const dir = mkdtempSync(join(tmpdir(), 'hanzogui-build-'))
  cpSync(fixture, dir, { recursive: true, filter: (p) => !/\/(dist|types)(\/|$)/.test(p) })
  return dir
}

describe('hanzogui-build', () => {
  let dir: string
  beforeAll(() => {
    dir = copy()
    build(dir)
  })
  afterAll(() => rmSync(dir, { recursive: true, force: true }))

  it('emits ESM with the import extension rewritten and a source map', () => {
    const js = read(dir, 'dist/esm/index.js')
    expect(js).toContain("from './platform.js'")
    expect(js).not.toContain('.ts')
    expect(existsSync(join(dir, 'dist/esm/index.js.map'))).toBe(true)
  })

  it('emits declarations once, beside the ESM output', () => {
    expect(read(dir, 'types/index.d.ts')).toContain('export declare const greet')
    expect(existsSync(join(dir, 'types/index.d.ts.map'))).toBe(true)
    expect(existsSync(join(dir, 'dist/cjs/.types'))).toBe(false)
    expect(existsSync(join(dir, 'dist/native/.types'))).toBe(false)
  })

  it('emits CommonJS marked by its own package.json', () => {
    const js = read(dir, 'dist/cjs/index.js')
    expect(js).toContain('require("./platform.js")')
    expect(js).toContain('exports.greet')
    expect(JSON.parse(read(dir, 'dist/cjs/package.json'))).toEqual({ type: 'commonjs' })
  })

  it("gives the native file its sibling's name, so the same import reaches it", () => {
    expect(read(dir, 'dist/native/platform.js')).toContain("'native'")
    expect(existsSync(join(dir, 'dist/native/platform.native.js'))).toBe(false)
    expect(read(dir, 'dist/native/index.js')).toContain("from './platform.js'")
    expect(read(dir, 'dist/esm/platform.js')).toContain("'web'")
    expect(read(dir, 'dist/native/platform.js')).toContain('sourceMappingURL=platform.js.map')
    expect(existsSync(join(dir, 'dist/native/platform.js.map'))).toBe(true)
  })

  it('answers process.env.GUI_TARGET with the platform of each emit', () => {
    expect(read(dir, 'dist/esm/platform.js')).toContain('"web" === \'web\'')
    expect(read(dir, 'dist/cjs/platform.js')).toContain('"web" === \'web\'')
    expect(read(dir, 'dist/native/platform.js')).toContain('"native" === \'native\'')
    expect(read(dir, 'dist/esm/platform.js')).not.toContain('process.env')
  })

  it('answers each platform through the manifest', async () => {
    const web = await import(join(dir, 'dist/esm/index.js'))
    expect(web.greet('a')).toBe('Hello, a, from web')
    const native = await import(join(dir, 'dist/native/index.js'))
    expect(native.greet('a')).toBe('Hello, a, from native')
  })
})

describe('hanzogui-build clean', () => {
  it('removes the outputs and emits nothing', () => {
    const dir = copy()
    build(dir)
    build(dir, 'clean:build')
    expect(existsSync(join(dir, 'dist'))).toBe(false)
    expect(existsSync(join(dir, 'types'))).toBe(false)
    rmSync(dir, { recursive: true, force: true })
  })
})

describe('hanzogui-build --skip-native', () => {
  it('leaves no native output', () => {
    const dir = copy()
    build(dir, '--skip-native')
    expect(existsSync(join(dir, 'dist/esm/index.js'))).toBe(true)
    expect(existsSync(join(dir, 'dist/native'))).toBe(false)
    rmSync(dir, { recursive: true, force: true })
  })
})

describe('an ESM-only package', () => {
  it('states no require entry and gets no CommonJS', () => {
    const dir = copy()
    const manifest = JSON.parse(read(dir, 'package.json'))
    delete manifest.main
    delete manifest.exports['.'].require
    writeFileSync(join(dir, 'package.json'), JSON.stringify(manifest))
    writeFileSync(join(dir, 'src/index.ts'), "export const here: string = import.meta.url\n")
    build(dir)
    expect(existsSync(join(dir, 'dist/esm/index.js'))).toBe(true)
    expect(existsSync(join(dir, 'dist/cjs'))).toBe(false)
    rmSync(dir, { recursive: true, force: true })
  })
})

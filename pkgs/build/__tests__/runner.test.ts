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

  it('answers only a read; an assignment and a string stay as written', () => {
    const js = read(dir, 'dist/esm/env.js')
    expect(js).toContain("process.env.GUI_TARGET = 'web'")
    expect(js).toContain("'process.env.GUI_TARGET'")
    expect(js).toContain('const on = "web"')
  })

  it('lets a .cjs sibling answer for its file in the CommonJS emit alone', () => {
    expect(read(dir, 'dist/esm/here.js')).toContain('import.meta.url')
    expect(read(dir, 'dist/cjs/here.js')).toContain('__filename')
    expect(read(dir, 'dist/cjs/here.js')).not.toContain('import.meta')
    for (const p of ['dist/esm/here.cjs.js', 'dist/cjs/here.cjs.js', 'dist/native/here.cjs.js', 'types/here.cjs.d.ts']) {
      expect(existsSync(join(dir, p))).toBe(false)
    }
    expect(existsSync(join(dir, 'types/here.d.ts'))).toBe(true)
  })

  it('keeps each sibling out of the emits it does not answer for', () => {
    expect(existsSync(join(dir, 'dist/esm/platform.native.js'))).toBe(false)
    expect(existsSync(join(dir, 'dist/cjs/platform.native.js'))).toBe(false)
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

describe('a package that states no require entry', () => {
  it('still gets CommonJS, so no manifest decides what a build emits', () => {
    const dir = copy()
    const manifest = JSON.parse(read(dir, 'package.json'))
    delete manifest.main
    delete manifest.exports['.'].require
    writeFileSync(join(dir, 'package.json'), JSON.stringify(manifest))
    build(dir)
    expect(existsSync(join(dir, 'dist/cjs/index.js'))).toBe(true)
    rmSync(dir, { recursive: true, force: true })
  })
})

describe('a module that declares what the CommonJS wrapper provides', () => {
  it('fails the CommonJS emit by name', () => {
    const dir = copy()
    writeFileSync(join(dir, 'src/index.ts'), 'const require = 1\nexport const r: number = require\n')
    expect(() => build(dir)).toThrow(/index\.js declares require/)
    rmSync(dir, { recursive: true, force: true })
  })
})

describe('a module only a module could load', () => {
  it('fails the CommonJS emit by name instead of shipping it', () => {
    const dir = copy()
    writeFileSync(join(dir, 'src/index.ts'), 'export const here: string = import.meta.url\n')
    expect(() => build(dir)).toThrow(/index\.js is not CommonJS/)
    rmSync(dir, { recursive: true, force: true })
  })
})

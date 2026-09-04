#!/usr/bin/env node
/**
 * hanzogui-build — one package, built by the TypeScript compiler alone.
 *
 * Three emits from one source tree, each its own project file so the compiler
 * reads exactly one answer per target:
 *
 *   tsconfig.esm.json     dist/esm/*.js   + types/*.d.ts
 *   tsconfig.cjs.json     dist/cjs/*.js   (marked commonjs by its own package.json)
 *   tsconfig.native.json  dist/native/*.js, where a `.native` sibling replaces its
 *                         web file, so the same relative import reaches the
 *                         native implementation without a bundler choosing.
 *
 * Source names its imports with their extension and the compiler rewrites them
 * on emit, so the output is loadable by Node as written. Nothing else runs over
 * the code: no Babel, no esbuild, no plugin.
 *
 *   --skip-native   packages with nothing platform-specific
 *   --skip-types    packages whose declarations are hand-written or unneeded
 *   --watch         the ESM emit, continuously
 */
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const need = createRequire(import.meta.url)
const tsc = need(join(dirname(need.resolve('typescript/package.json')), 'lib/getExePath.js')).default()
const args = new Set(process.argv.slice(2))
const cwd = process.cwd()
const manifest = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'))

const emit = (project, extra = []) => {
  const run = spawnSync(tsc, ['-p', project, ...extra], { cwd, stdio: 'inherit' })
  if (run.status !== 0) process.exit(run.status ?? 1)
}

if (args.has('--watch')) {
  emit('tsconfig.esm.json', ['--watch'])
} else {
  for (const dir of ['dist', 'types']) rmSync(join(cwd, dir), { recursive: true, force: true })

  emit('tsconfig.esm.json')

  // A package is CommonJS only where its manifest says a `require` reaches it.
  // One that uses import.meta or a top-level await is ESM by nature and states
  // no such entry, so there is nothing to emit for CommonJS.
  //
  // A package that asks for isolatedDeclarations cannot emit without
  // declarations, so the CJS and native passes write theirs beside their
  // output and those are dropped: the ESM pass already published the one copy.
  if (/"require"|dist\/cjs/.test(JSON.stringify(manifest.exports ?? {}) + (manifest.main ?? ''))) {
    emit('tsconfig.cjs.json')
    rmSync(join(cwd, 'dist/cjs/.types'), { recursive: true, force: true })
    mkdirSync(join(cwd, 'dist/cjs'), { recursive: true })
    writeFileSync(join(cwd, 'dist/cjs/package.json'), '{ "type": "commonjs" }\n')
  }

  if (!args.has('--skip-native') && existsSync(join(cwd, 'tsconfig.native.json'))) {
    emit('tsconfig.native.json')
    rmSync(join(cwd, 'dist/native/.types'), { recursive: true, force: true })
    // A `.native` file was written to answer for its sibling on that platform;
    // here it takes the sibling's name, so the import the sibling's callers
    // already make resolves to it.
    const walk = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name)
        if (entry.isDirectory()) walk(p)
        else if (/\.native\.js(\.map)?$/.test(entry.name)) renameSync(p, p.replace('.native.js', '.js'))
      }
    }
    walk(join(cwd, 'dist/native'))
  }
}

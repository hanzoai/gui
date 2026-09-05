#!/usr/bin/env node
/**
 * hanzogui-build — one package, built by the TypeScript compiler alone.
 *
 * A package ships its source and three emits, each from its own project file so
 * the compiler reads exactly one answer per target:
 *
 *   tsconfig.esm.json     dist/esm/*.js + types/*.d.ts   the one pass that typechecks
 *   tsconfig.cjs.json     dist/cjs/*.js     CommonJS, marked by its own package.json
 *   tsconfig.native.json  dist/native/*.js  CommonJS too: Metro and Node both load a
 *                         bare require there, which is what native sources say
 *
 * A sibling answers for its file where it belongs and reaches no other emit:
 * `x.cjs.ts` takes x's name in both CommonJS outputs, `x.native.ts` in the
 * native one on top of that. That is how a module says `import.meta.url` once
 * and `__filename` once without either syntax leaking into an emit that cannot
 * parse it. Each CommonJS output is parsed as a script afterwards, and a file
 * only a module could load fails the build by name.
 *
 * Source names its imports with their extension and the compiler rewrites them
 * on emit, so the output is loadable by Node as written. Nothing else runs over
 * the code: no Babel, no esbuild, no plugin.
 *
 *   --skip-native   packages with nothing platform-specific
 *   clean           remove dist and types and stop (clean:build is the same)
 *   --watch         the ESM emit, continuously
 */
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { parseSync } from 'oxc-parser'

const need = createRequire(import.meta.url)
const tsc = need(join(dirname(need.resolve('typescript/package.json')), 'lib/getExePath.js')).default()
const args = new Set(process.argv.slice(2))
const cwd = process.cwd()
const manifest = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'))

const emit = (project, extra = []) => {
  const run = spawnSync(tsc, ['-p', project, ...extra], { cwd, stdio: 'inherit' })
  if (run.status !== 0) process.exit(run.status ?? 1)
}

const files = (dir, out = []) => {
  if (existsSync(dir))
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name)
      entry.isDirectory() ? files(p, out) : out.push(p)
    }
  return out
}

// The platform is a property of the emit, not of the host: the runtime asks
// process.env.GUI_TARGET which one it is on, and each output directory answers
// with its own literal, so a bundler folds the other platform away and a
// browser is never asked for a process it does not have.
// The reads of process.env.GUI_TARGET in one file, by span. Only a read: an
// assignment to it stays a runtime assignment, and the words inside a string
// are a bundler's define key, not ours.
const reads = (file, text) => {
  const { program, errors } = parseSync(file, text, { sourceType: 'unambiguous' })
  if (errors.length) throw new Error(`${file}: ${errors[0].message}`)
  const spans = []
  const walk = (node, parent) => {
    if (Array.isArray(node)) return node.forEach((n) => walk(n, parent))
    if (!node || typeof node.type !== 'string') return
    if (
      node.type === 'MemberExpression' && !node.computed && node.property.name === 'GUI_TARGET' &&
      node.object.type === 'MemberExpression' && !node.object.computed && node.object.property.name === 'env' &&
      node.object.object.type === 'Identifier' && node.object.object.name === 'process' &&
      !(parent?.type === 'AssignmentExpression' && parent.left === node)
    ) spans.push([node.start, node.end])
    for (const key in node) if (key !== 'type' && typeof node[key] === 'object') walk(node[key], node)
  }
  walk(program, null)
  return spans
}

const answer = (dir, platform) => {
  for (const p of files(dir)) {
    if (!p.endsWith('.js')) continue
    let text = readFileSync(p, 'utf8')
    if (!text.includes('process.env.GUI_TARGET')) continue
    for (const [start, end] of reads(p, text).reverse()) text = text.slice(0, start) + JSON.stringify(platform) + text.slice(end)
    writeFileSync(p, text)
  }
}

// `x.<tag>.js` takes x's name, so the import x's callers already make resolves to it.
const adopt = (dir, tag) => {
  for (const p of files(dir)) {
    if (p.endsWith(`.${tag}.js.map`)) renameSync(p, p.replace(`.${tag}.js.map`, '.js.map'))
    else if (p.endsWith(`.${tag}.js`)) {
      const map = new RegExp(`sourceMappingURL=(.+)\\.${tag}\\.js\\.map`)
      writeFileSync(p.replace(`.${tag}.js`, '.js'), readFileSync(p, 'utf8').replace(map, 'sourceMappingURL=$1.js.map'))
      rmSync(p)
    }
  }
}

// A sibling for another target has no place in this emit.
const drop = (dir, tags, ext = '.js') => {
  for (const p of files(dir)) if (tags.some((tag) => p.endsWith(`.${tag}${ext}`) || p.endsWith(`.${tag}${ext}.map`))) rmSync(p)
}

// CommonJS is a script. What only a module could load is named here, by file,
// rather than found by whoever requires it.
const wrapper = new Set(['require', 'module', 'exports', '__filename', '__dirname'])
const script = (dir) => {
  for (const p of files(dir)) {
    if (!p.endsWith('.js')) continue
    const { program, errors } = parseSync(p, readFileSync(p, 'utf8'), { sourceType: 'script' })
    if (errors.length) throw new Error(`${p} is not CommonJS: ${errors[0].message}. Give its source a .cjs.ts sibling.`)
    for (const node of program.body) {
      const names = node.type === 'VariableDeclaration' ? node.declarations.map((d) => d.id.name) : [node.id?.name]
      const taken = names.find((n) => wrapper.has(n))
      if (taken) throw new Error(`${p} declares ${taken}, which the CommonJS wrapper already provides. Name it something else.`)
    }
  }
}

for (const dir of ['dist', 'types']) rmSync(join(cwd, dir), { recursive: true, force: true })

// `clean` and `clean:build` remove the outputs and stop: the workspace runs them
// over every package at once, and a rebuild in that order would typecheck
// against declarations a sibling is deleting. The ordered build follows.
if (args.has('clean') || args.has('clean:build')) process.exit(0)

if (args.has('--watch')) {
  emit('tsconfig.esm.json', ['--watch'])
} else {
  emit('tsconfig.esm.json')
  answer(join(cwd, 'dist/esm'), 'web')
  drop(join(cwd, 'dist/esm'), ['cjs', 'native'])
  drop(join(cwd, 'types'), ['cjs'], '.d.ts')

  // The ESM pass checked the source; the other two only translate it. A package
  // that asks for isolatedDeclarations cannot emit without declarations, so
  // those passes write theirs beside their output and the copies are dropped.
  if (existsSync(join(cwd, 'tsconfig.cjs.json'))) {
    emit('tsconfig.cjs.json', ['--noCheck'])
    answer(join(cwd, 'dist/cjs'), 'web')
    rmSync(join(cwd, 'dist/cjs/.types'), { recursive: true, force: true })
    adopt(join(cwd, 'dist/cjs'), 'cjs')
    drop(join(cwd, 'dist/cjs'), ['native'])
    mkdirSync(join(cwd, 'dist/cjs'), { recursive: true })
    writeFileSync(join(cwd, 'dist/cjs/package.json'), '{ "type": "commonjs" }\n')
    script(join(cwd, 'dist/cjs'))
  }

  if (!args.has('--skip-native') && existsSync(join(cwd, 'tsconfig.native.json'))) {
    emit('tsconfig.native.json', ['--noCheck'])
    answer(join(cwd, 'dist/native'), 'native')
    rmSync(join(cwd, 'dist/native/.types'), { recursive: true, force: true })
    // CommonJS, so the .cjs sibling answers here too; a .native sibling wins.
    adopt(join(cwd, 'dist/native'), 'cjs')
    adopt(join(cwd, 'dist/native'), 'native')
    writeFileSync(join(cwd, 'dist/native/package.json'), '{ "type": "commonjs" }\n')
    script(join(cwd, 'dist/native'))
  }

  if (manifest.bin) {
    for (const bin of typeof manifest.bin === 'string' ? [manifest.bin] : Object.values(manifest.bin)) {
      if (existsSync(join(cwd, bin))) chmodSync(join(cwd, bin), 0o755)
    }
  }
}

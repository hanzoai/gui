#!/usr/bin/env bun
import { rm } from 'node:fs/promises'
import { Glob } from 'bun'

await rm('./dist', { recursive: true, force: true })

const entrypoints = Array.from(new Glob('src/**/*.ts').scanSync('.'))
  .filter((p) => !p.endsWith('.test.ts'))
  .map((p) => `./${p}`)

const result = await Bun.build({
  entrypoints,
  outdir: './dist',
  root: './src',
  target: 'node',
  format: 'esm',
  splitting: false,
  external: [],
  minify: false,
})

if (!result.success) {
  for (const m of result.logs) console.error(m)
  process.exit(1)
}

console.log(`built @hanzogui/recipes (${result.outputs.length} files)`)

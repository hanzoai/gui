#!/usr/bin/env bun
import { rm } from 'node:fs/promises'

await rm('./dist', { recursive: true, force: true })

const result = await Bun.build({
  entrypoints: ['./src/cli.ts'],
  outdir: './dist',
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

const cli = './dist/cli.js'
const text = await Bun.file(cli).text()
if (!text.startsWith('#!')) {
  await Bun.write(cli, '#!/usr/bin/env node\n' + text)
}
await Bun.$`chmod +x ${cli}`

const size = (await Bun.file(cli).text()).length
console.log(`built gui-get (${(size / 1024).toFixed(1)} KB)`)

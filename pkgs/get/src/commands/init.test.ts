import { test, expect, afterEach } from 'bun:test'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { init } from './init.js'

const created: string[] = []
afterEach(async () => {
  for (const d of created.splice(0)) await rm(d, { recursive: true, force: true })
})

async function project(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'guiget-init-'))
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ workspaces: [] }))
  created.push(dir)
  return dir
}

test('init writes gui.config.json with default installDir', async () => {
  const dir = await project()
  const cwd = process.cwd()
  process.chdir(dir)
  try {
    await init()
    const written = JSON.parse(await readFile(path.join(dir, 'gui.config.json'), 'utf8'))
    expect(written).toEqual({ installDir: 'src/gui' })
  } finally {
    process.chdir(cwd)
  }
})

test('init is idempotent (no overwrite when file exists)', async () => {
  const dir = await project()
  const existing = JSON.stringify({ installDir: 'src/widgets' })
  await writeFile(path.join(dir, 'gui.config.json'), existing)
  const cwd = process.cwd()
  process.chdir(dir)
  try {
    await init()
    expect(await readFile(path.join(dir, 'gui.config.json'), 'utf8')).toBe(existing)
  } finally {
    process.chdir(cwd)
  }
})

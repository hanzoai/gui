import { test, expect } from 'bun:test'
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { findProjectRoot, readConfig, resolveInstallDir } from './project.js'
import { DEFAULT_INSTALL_DIR } from './config.js'

async function tmpDir(): Promise<string> {
  return await mkdtemp(path.join(os.tmpdir(), 'recipes-test-'))
}

test('findProjectRoot returns nearest dir with workspaces in package.json', async () => {
  const root = await tmpDir()
  await writeFile(path.join(root, 'package.json'), JSON.stringify({ workspaces: [] }))
  const child = path.join(root, 'apps', 'foo')
  await mkdir(child, { recursive: true })
  expect(await findProjectRoot(child)).toBe(root)
  await rm(root, { recursive: true })
})

test('findProjectRoot falls back to .git root when no workspaces', async () => {
  const root = await tmpDir()
  await mkdir(path.join(root, '.git'))
  const child = path.join(root, 'src')
  await mkdir(child, { recursive: true })
  expect(await findProjectRoot(child)).toBe(root)
  await rm(root, { recursive: true })
})

test('findProjectRoot returns start when nothing matches', async () => {
  const root = await tmpDir()
  expect(await findProjectRoot(root)).toBe(root)
  await rm(root, { recursive: true })
})

test('readConfig prefers gui.config.json over .guirc.json', async () => {
  const root = await tmpDir()
  await writeFile(path.join(root, 'gui.config.json'), JSON.stringify({ installDir: 'a' }))
  await writeFile(path.join(root, '.guirc.json'), JSON.stringify({ installDir: 'b' }))
  expect((await readConfig(root)).installDir).toBe('a')
  await rm(root, { recursive: true })
})

test('readConfig returns {} when no config file', async () => {
  const root = await tmpDir()
  expect(await readConfig(root)).toEqual({})
  await rm(root, { recursive: true })
})

test('readConfig returns {} when config is invalid JSON', async () => {
  const root = await tmpDir()
  await writeFile(path.join(root, 'gui.config.json'), '{ broken')
  expect(await readConfig(root)).toEqual({})
  await rm(root, { recursive: true })
})

test('resolveInstallDir uses config.installDir when present', () => {
  expect(resolveInstallDir('/r', { installDir: 'src/widgets' })).toBe('/r/src/widgets')
})

test('resolveInstallDir falls back to DEFAULT_INSTALL_DIR', () => {
  expect(resolveInstallDir('/r', {})).toBe(`/r/${DEFAULT_INSTALL_DIR}`)
})

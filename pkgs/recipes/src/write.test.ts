import { test, expect } from 'bun:test'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { installRecipe, installPlan } from './write.js'
import type { Recipe, InstallPlan } from './types.js'

const stub = (slug: string, files: Array<[string, string]>): Recipe => ({
  id: slug,
  slug,
  name: slug,
  description: '',
  category: 'test',
  npmDeps: [],
  recipeDeps: [],
  files: files.map(([p, s]) => ({ path: p, source: s })),
  created: '',
  updated: '',
})

test('installRecipe writes files into installDir, creating subdirs', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'recipes-write-'))
  const recipe = stub('foo', [
    ['Foo.tsx', 'export const Foo = 1\n'],
    ['nested/Deep.tsx', 'export const Deep = 1\n'],
  ])
  const written = await installRecipe(recipe, { installDir: dir })
  expect(written).toHaveLength(2)
  expect(await readFile(path.join(dir, 'Foo.tsx'), 'utf8')).toBe('export const Foo = 1\n')
  expect(await readFile(path.join(dir, 'nested/Deep.tsx'), 'utf8')).toBe('export const Deep = 1\n')
  await rm(dir, { recursive: true })
})

test('installPlan writes the recipe plus its transitive deps', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'recipes-plan-'))
  const plan: InstallPlan = {
    recipe: stub('parent', [['Parent.tsx', 'P']]),
    transitiveRecipes: [
      stub('childA', [['ChildA.tsx', 'A']]),
      stub('childB', [['nested/ChildB.tsx', 'B']]),
    ],
    targetPaths: [],
  }
  const written = await installPlan(plan, { installDir: dir })
  expect(written).toHaveLength(3)
  expect(await readFile(path.join(dir, 'Parent.tsx'), 'utf8')).toBe('P')
  expect(await readFile(path.join(dir, 'ChildA.tsx'), 'utf8')).toBe('A')
  expect(await readFile(path.join(dir, 'nested/ChildB.tsx'), 'utf8')).toBe('B')
  await rm(dir, { recursive: true })
})

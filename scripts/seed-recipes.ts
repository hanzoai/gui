#!/usr/bin/env bun
/**
 * Seeds Hanzo Base with recipes from ./recipes/<slug>/{recipe.json, files/**}.
 *
 * Env:
 *   HANZO_BASE_URL          (default https://base.hanzo.ai)
 *   HANZO_BASE_ADMIN_EMAIL
 *   HANZO_BASE_ADMIN_TOKEN  (preferred) or HANZO_BASE_ADMIN_PASSWORD
 */

import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { authAdmin, ensureCollection, upsertRecipe, type AdminAuth, type RecipeInput, type RecipeFile } from '@hanzogui/recipes'

const RECIPES_DIR = path.join(import.meta.dir, '..', 'recipes')

async function getAuth(): Promise<AdminAuth> {
  const baseUrl = process.env.HANZO_BASE_URL
  const token = process.env.HANZO_BASE_ADMIN_TOKEN
  if (token) return { baseUrl, token }
  const email = process.env.HANZO_BASE_ADMIN_EMAIL
  const password = process.env.HANZO_BASE_ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('Set HANZO_BASE_ADMIN_TOKEN or HANZO_BASE_ADMIN_EMAIL + HANZO_BASE_ADMIN_PASSWORD')
  }
  return { baseUrl, token: await authAdmin({ baseUrl, email, password }) }
}

async function walkFiles(dir: string, prefix = ''): Promise<RecipeFile[]> {
  const out: RecipeFile[] = []
  for (const entry of await readdir(dir)) {
    const full = path.join(dir, entry)
    const rel = prefix ? `${prefix}/${entry}` : entry
    const info = await stat(full)
    if (info.isDirectory()) {
      out.push(...(await walkFiles(full, rel)))
    } else {
      out.push({ path: rel, source: await readFile(full, 'utf8') })
    }
  }
  return out
}

async function readLocalRecipe(slug: string): Promise<RecipeInput> {
  const dir = path.join(RECIPES_DIR, slug)
  const manifest = JSON.parse(await readFile(path.join(dir, 'recipe.json'), 'utf8'))
  const files = await walkFiles(path.join(dir, 'files'))
  return {
    slug: manifest.slug,
    name: manifest.name,
    description: manifest.description,
    category: manifest.category,
    npmDeps: manifest.npmDeps ?? [],
    recipeDeps: manifest.recipeDeps ?? [],
    files,
  }
}

async function main() {
  const auth = await getAuth()
  console.log(`Seeding to ${process.env.HANZO_BASE_URL ?? 'https://base.hanzo.ai'}`)
  const status = await ensureCollection(auth)
  if (status === 'created') console.log(`Created collection "gui_recipes"`)

  const slugs = (await readdir(RECIPES_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const slug of slugs) {
    const recipe = await readLocalRecipe(slug)
    const action = await upsertRecipe(auth, recipe)
    console.log(`  ${action.padEnd(8)} ${slug} (${recipe.files.length} file${recipe.files.length === 1 ? '' : 's'})`)
  }
  console.log(`\nSeeded ${slugs.length} recipe${slugs.length === 1 ? '' : 's'}.`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e))
  process.exit(1)
})

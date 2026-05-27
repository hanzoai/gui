import { listRecipes } from '@hanzo/recipes'
import { bold, cyan, gray, yellow } from '../lib/ansi.js'

export async function list(): Promise<void> {
  const recipes = await listRecipes()
  if (recipes.length === 0) {
    process.stdout.write(yellow('No recipes published yet.\n'))
    return
  }
  const byCategory: Record<string, typeof recipes> = {}
  for (const r of recipes) (byCategory[r.category || 'misc'] ||= []).push(r)
  for (const [cat, items] of Object.entries(byCategory)) {
    process.stdout.write(`\n${bold(cat)}\n`)
    for (const r of items) {
      process.stdout.write(`  ${cyan(r.slug.padEnd(24))}  ${gray(r.description)}\n`)
    }
  }
  process.stdout.write('\n')
}

import Fuse from 'fuse.js'
import * as readline from 'node:readline/promises'
import { listRecipes } from '@hanzo/recipes'
import { bold, cyan, dim, gray } from '../lib/ansi.js'
import { add } from './add.js'

export async function pick(): Promise<void> {
  const recipes = await listRecipes()
  if (recipes.length === 0) {
    process.stdout.write('No recipes published yet.\n')
    return
  }

  const fuse = new Fuse(recipes, {
    keys: ['name', 'slug', 'category', 'description'],
    threshold: 0.4,
  })

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  try {
    const query = (await rl.question(bold('Search recipes') + ' (empty = show all): ')).trim()
    const hits = query
      ? fuse.search(query).map((h) => h.item)
      : recipes
    if (hits.length === 0) {
      process.stdout.write(dim('No matches.\n'))
      return
    }

    process.stdout.write('\n')
    hits.slice(0, 20).forEach((r, i) => {
      process.stdout.write(
        `  ${cyan(String(i + 1).padStart(2))}  ${bold(r.name)}  ${gray(r.slug)}\n`
      )
      process.stdout.write(`      ${gray(r.description)}\n`)
    })
    process.stdout.write('\n')

    const pickRaw = (await rl.question('Pick a number (or paste a slug): ')).trim()
    if (!pickRaw) return

    let slug: string | undefined
    const asNum = Number.parseInt(pickRaw, 10)
    if (!Number.isNaN(asNum) && asNum >= 1 && asNum <= hits.length) {
      slug = hits[asNum - 1]!.slug
    } else if (recipes.find((r) => r.slug === pickRaw)) {
      slug = pickRaw
    }

    if (!slug) {
      process.stdout.write(dim(`No recipe matches "${pickRaw}".\n`))
      return
    }

    process.stdout.write('\n')
    await add(slug)
  } finally {
    rl.close()
  }
}

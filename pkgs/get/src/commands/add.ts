import { resolveRecipe, installPlan } from '@hanzogui/recipes'
import { green, gray, bold } from '../lib/ansi.js'

export async function add(slug: string): Promise<void> {
  const plan = await resolveRecipe(slug)
  const paths = await installPlan(plan)

  process.stdout.write(green(`Installed "${plan.recipe.name}"`) + '\n')
  if (plan.transitiveRecipes.length > 0) {
    process.stdout.write(
      gray(
        `+ ${plan.transitiveRecipes.length} dependent recipe${
          plan.transitiveRecipes.length === 1 ? '' : 's'
        }: ${plan.transitiveRecipes.map((r) => r.slug).join(', ')}\n`
      )
    )
  }
  for (const p of paths) process.stdout.write(`  ${p}\n`)
  if (plan.recipe.npmDeps.length > 0) {
    process.stdout.write('\n' + gray('Install these npm deps:') + '\n')
    process.stdout.write(`  ${bold('npm i ' + plan.recipe.npmDeps.join(' '))}\n`)
  }
}

# @hanzogui/recipes

Library for reading and installing Hanzo GUI recipes from Hanzo Base.

```ts
import {
  listRecipes,
  getRecipe,
  resolveRecipe,
  installPlan,
} from '@hanzogui/recipes'

// Anonymous read path (used by @hanzogui/get CLI, website, IDE extensions)
const recipes = await listRecipes()
const plan = await resolveRecipe('sign-in-form')
await installPlan(plan)
```

Admin/writer path (used by `scripts/seed-recipes.ts` from the gui repo):

```ts
import { authAdmin, ensureCollection, upsertRecipe } from '@hanzogui/recipes'

const token = await authAdmin({ email, password })
await ensureCollection({ token })
await upsertRecipe({ token }, recipe)
```

Pure functions where it matters — project-path resolution is three composable pieces:

```ts
import { findProjectRoot, readConfig, resolveInstallDir } from '@hanzogui/recipes'
const root = await findProjectRoot()
const cfg = await readConfig(root)
const dir = resolveInstallDir(root, cfg)
```

Override the Base URL per-call (`opts.baseUrl`) or globally (`HANZO_BASE_URL` env var).

This package has no runtime dependencies.

export type RecipeFile = {
  path: string
  source: string
}

export type Recipe = {
  id: string
  slug: string
  name: string
  description: string
  category: string
  npmDeps: string[]
  recipeDeps: string[]
  files: RecipeFile[]
  created: string
  updated: string
}

export type RecipeSummary = Pick<
  Recipe,
  'id' | 'slug' | 'name' | 'description' | 'category'
>

export type RecipeInput = Pick<
  Recipe,
  'slug' | 'name' | 'description' | 'category' | 'npmDeps' | 'recipeDeps' | 'files'
>

export type InstallPlan = {
  recipe: Recipe
  transitiveRecipes: Recipe[]
  targetPaths: string[]
}

export type ProjectConfig = {
  installDir?: string
}

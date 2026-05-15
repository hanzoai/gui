# Recipes

Each subdirectory is one recipe. Layout:

```
recipes/
  <slug>/
    recipe.json     -- manifest (slug, name, description, category, npmDeps, recipeDeps)
    files/          -- source files vendored into the user's project (preserves layout)
      <name>.tsx
```

`scripts/seed-recipes.ts` walks this tree and uploads each recipe to Hanzo Base. Edit a recipe → re-run seed → the next `gui-get add <slug>` pulls the new version.

Recipes must import Hanzo GUI primitives from `@hanzo/gui` only — not from `@hanzogui/*` internals. The user's project resolves `@hanzo/gui` from npm.

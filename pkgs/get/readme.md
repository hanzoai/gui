# @hanzogui/get

Install Hanzo GUI recipes — composable screens and widgets built on `@hanzogui/*` primitives — into your project with one command.

## Usage

```sh
npx @hanzogui/get                  # interactive picker
npx @hanzogui/get add sign-in-form # install a single recipe
npx @hanzogui/get list             # show all available recipes
npx @hanzogui/get init             # write gui.config.json
```

After global install (`npm i -g @hanzogui/get`), the command is `hanzo-gui-get`.

Recipes are vendored into `src/gui/` by default. Override the destination by adding a `gui.config.json` at the project root:

```json
{ "installDir": "src/components" }
```

## How it works

`hanzo-gui-get` reads recipes from Hanzo Base at `${HANZO_BASE_URL}/v1/base/collections/gui_recipes/records`. Each recipe is a small, self-contained `.tsx` file (or set of files) that composes `@hanzogui/*` primitives. Recipes can depend on other recipes; transitive deps are pulled in automatically.

Override the registry host:

```sh
HANZO_BASE_URL=https://base.staging.hanzo.ai npx @hanzogui/get
```

You still need `@hanzogui/*` primitives installed normally.

## Publishing a recipe

Recipes live in `hanzoai/gui` at `recipes/<slug>/{recipe.json, files/**}`. To seed Base:

```sh
HANZO_BASE_ADMIN_TOKEN=… bun run scripts/seed-recipes.ts
```

The seed script creates the `gui_recipes` collection on first run if it doesn't exist, then upserts each recipe by slug.

## What this is not

`@hanzogui/get` is a plain Node CLI — no terminal-UI framework, no React, no `ink`. Just stdout + readline. If you want a Hanzo TUI for building richer CLI apps, use `@hanzo/tui` (separate package).

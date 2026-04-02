# The Two-Namespace Problem: `@hanzo/gui` vs `@hanzogui/*`

## Summary

This repo publishes **127 npm packages** under two namespaces:

- **`@hanzo/gui`** (1 package, v4.0.0) — a barrel that re-exports everything
- **`@hanzogui/*`** (126 packages, v3.0.x) — where all the actual code lives

`@hanzo/gui` contains zero implementation. Its `src/index.ts` is entirely:

```ts
export * from '@hanzogui/core'
export * from '@hanzogui/stacks'
export * from '@hanzogui/button'
// ... 50+ more re-exports
```

This design causes serious, reproducible problems for downstream consumers. This document explains the issues, why they happen, and proposes a consolidation plan.

---

## Problems

### 1. pnpm duplicate copies

pnpm uses strict dependency isolation. When a consumer depends on both `@hanzo/gui` (which transitively pulls in `@hanzogui/core@3.0.6`) and `@hanzogui/button@3.0.2` (which also depends on `@hanzogui/core@3.0.6`), pnpm may resolve two physically separate copies of `@hanzogui/core`.

This breaks any library that relies on module identity — which includes the entire Tamagui/GUI styling system. `styled()` called with a component from copy A fails when the style engine is initialized in copy B.

**Symptoms:**
- `TypeError: Cannot read properties of undefined (reading 'staticConfig')`
- `TypeError: Cannot read properties of undefined (reading 'View')`

### 2. Rollup/Vite circular initialization failures

When Rollup bundles `@hanzo/gui`, it inlines all 50+ `export * from '@hanzogui/*'` re-exports into a single module. The `@hanzogui/*` packages have circular dependencies among themselves (e.g., `@hanzogui/button` → `@hanzogui/core` → `@hanzogui/web` → `@hanzogui/core`). Rollup resolves these into a single flat scope, but JavaScript execution order means some bindings are `undefined` at the time `styled()` is called.

**Symptoms:**
- `styled(Stack, {...})` receives `undefined` instead of the `Stack` component
- Only happens in production builds (dev mode serves modules individually)
- Downstream consumers must add custom Vite plugins to work around this

### 3. Downstream consumers need resolution hacks

Every consumer using pnpm + Vite must add a custom plugin to force `@hanzogui/*` imports to resolve from `@hanzo/gui`'s own `node_modules`:

```ts
// Required in every downstream vite.config.ts
{
  name: 'resolve-hanzogui',
  enforce: 'pre',
  resolveId(source) {
    if (source.startsWith('@hanzogui/')) {
      return require_.resolve(source, { paths: [guiDir] })
    }
  },
}
```

This is fragile, poorly documented, and needs to be copied into every project that uses `@hanzo/gui`.

### 4. Version drift between packages

Core packages are at 3.0.6, component packages are at 3.0.2–3.0.3. This means `@hanzogui/button@3.0.2` may depend on `@hanzogui/core@3.0.2` while the barrel pulls in `@hanzogui/core@3.0.6`. Even minor version mismatches can cause duplicate copies.

### 5. Publishing overhead

127 separate npm publishes per release. Version coordination across all packages. Any missed package creates a broken dependency graph.

---

## Root cause

The two-namespace design was intended for **tree-shaking on React Native**: importing `@hanzogui/button` avoids pulling in `@hanzogui/dialog`, `@hanzogui/sheet`, etc.

However:
- Modern bundlers (Vite, Rollup, esbuild) tree-shake **named exports** from a single package just as effectively
- The tree-shaking benefit is marginal compared to the cost of 126 separate packages
- The barrel `@hanzo/gui` already defeats the purpose — most consumers use it, pulling in everything anyway

---

## Proposal: Consolidate into `@hanzo/gui`

### What changes

1. **Move all source** from `@hanzogui/*` into `@hanzo/gui` as internal directories
2. **Single entry point**: `@hanzo/gui` exports everything (already does via barrel)
3. **Subpath exports** for config/build-time packages not in the main barrel:
   - `@hanzo/gui/theme-builder` (was `@hanzogui/theme-builder`)
   - `@hanzo/gui/config-default` (was `@hanzogui/config-default`)
   - `@hanzo/gui/shorthands` (was `@hanzogui/shorthands`)
4. **Single build output**: ESM + CJS + types
5. **Deprecate `@hanzogui/*`** on npm, pointing to `@hanzo/gui`

### What stays the same

- Internal directory structure (`core/`, `button/`, `input/`, etc.) for code organization
- Public API surface — `import { Button, Input, styled } from '@hanzo/gui'`
- Support for React Native via `.native.tsx` file extensions

### Migration for consumers

| Before | After | Breaking? |
|--------|-------|-----------|
| `import { Button } from '@hanzo/gui'` | Same | No |
| `import { Button } from '@hanzogui/button'` | `import { Button } from '@hanzo/gui'` | Yes (deprecate) |
| `import { createThemes } from '@hanzogui/theme-builder'` | `import { createThemes } from '@hanzo/gui/theme-builder'` | Yes (subpath) |

### What this fixes

- **Zero duplicate copies** — one package, one resolution
- **Zero circular init failures** — bundler sees one module graph, controls init order
- **Zero downstream hacks** — no resolve plugins needed
- **One npm publish** per release
- **One version number** to track

### Implementation steps

1. Create `@hanzo/gui@5.0.0` with all source inlined
2. Add `exports` field in `package.json` with subpath entries for config packages
3. Verify tree-shaking works with Vite, Rollup, and Metro (React Native)
4. Publish and deprecate all 126 `@hanzogui/*` packages on npm
5. Provide codemod for `@hanzogui/* → @hanzo/gui` import rewrites

---

## Current workaround (for downstream consumers)

Until consolidation happens, consumers must:

1. **Never import from `@hanzogui/*` directly** — always use `@hanzo/gui`
2. **Add a Vite resolve plugin** that forces `@hanzogui/*` to resolve from `@hanzo/gui`'s own `node_modules` (see example above)
3. **Keep `@hanzo/gui` in Module Federation `shared` array** when using micro-frontends

These workarounds are documented here so they don't need to be rediscovered.

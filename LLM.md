Please read ./CONTRIBUTING.md as well

Note you need to re-build packages (`bun run build` in the package directory) as you change them, unless you or someone is running a `bun run watch` at root.

FOR LONG RUNNNING DEBUGGING run `bun run watch` in the background its faster and rebuilds all packages.

keep commits to one line, add a trailing "Fixes #" if associated with a GH issue, and start with a convential commit style - UNLESS its a change that shouldn't go into the changelog, in those cases you can do things like `docs: ` or `site: `.

# Hanzo GUI Testing Guide

## Running Tests

### Kitchen Sink Tests

The kitchen-sink package contains the main integration tests for Hanzo GUI components. To run these tests:

1. **Start the web server** (in the background):

   ```bash
   cd apps/kitchen-sink
   bun run start:web
   ```

   To open a specific test case in the browser:

   ```bash
   open "http://localhost:9000/?test=YourTestCaseName"
   ```

   Test case names match the file names in `apps/kitchen-sink/src/usecases/` (e.g., `SelectFocusScopeCase`).

   To open a component demo:

   ```bash
   open "http://localhost:9000/?demo=Select"
   ```

   Demo names match files in `apps/demos/src/` without the `Demo` suffix (e.g., `Select` for `SelectDemo.tsx`).

2. **Run all web tests** with different animation drivers:

   ```bash
   bun run test:web
   ```

   This uses `run-tests-parallel.ts` which first runs `default` + `webkit` projects sequentially, then runs all four animated driver projects (`css`, `native`, `reanimated`, `motion`) in parallel against a single shared dev server.

3. **Run tests with a specific animation driver**:

   ```bash
   # Using env var + playwright --project flag
   cd apps/kitchen-sink
   NODE_ENV=test HANZO_GUI_TEST_ANIMATION_DRIVER=css npx playwright test --project=animated-css

   # Available projects: animated-css, animated-native, animated-reanimated, animated-motion
   ```

4. **Run a specific test file**:

   ```bash
   # Using playwright directly
   cd apps/kitchen-sink
   npx playwright test tests/PopoverFocusScope.test.tsx

   # Or with a specific driver
   NODE_ENV=test HANZO_GUI_TEST_ANIMATION_DRIVER=css npx playwright test tests/YourTest.animated.test.tsx --project=animated-css
   ```

5. **Debug tests**:
   ```bash
   bun run test:web:debug
   # or
   npx playwright test --debug
   ```

### Test Structure

Tests are located in `apps/kitchen-sink/tests/` and follow these naming conventions:

- `ComponentName.test.tsx` - Standard tests that run ONCE with the default animation driver
- `ComponentName.animated.test.tsx` - Animation-dependent tests that run with ALL animation drivers (css, native, reanimated, motion)

This separation significantly speeds up the test suite since most tests don't need to run 4x across all animation drivers. Only use `.animated.test.tsx` for tests that specifically verify animation behavior across different drivers.

### Writing Tests

When writing tests for focus behavior or component interactions:

1. Use appropriate wait times for animations and focus changes
2. Be aware that `trapFocus` behavior depends on the component's open state
3. Test both trapped and non-trapped focus scenarios
4. Consider browser focus behavior when `trapFocus` is false

### Common Issues

- If tests fail due to timing, add appropriate `waitForTimeout` calls
- For focus tests, ensure elements are visible before testing focus state
- When testing popover/dialog components, wait for animations to complete

## Commit Message Conventions

- Use `site:` prefix (not `fix(site):`) for gui.hanzo.ai changes since they don't go in the changelog
- Use `ci:` prefix (not `fix(ci):`) for CI/workflow changes since they don't go in the changelog
- Keep commit messages to a single line

## iOS Development

See [docs/using-ios.md](./docs/using-ios.md) for iOS native development and Detox testing tips.

## gui.hanzo.ai API Authentication

When making authenticated API calls from the client side in gui.hanzo.ai, always use the `authFetch` helper:

```ts
import { authFetch } from '~/features/api/authFetch'

const response = await authFetch('/api/some-endpoint', {
  method: 'POST',
  body: JSON.stringify({ ... }),
})
```

**Why this matters:** Cookies alone are not reliable for auth in production due to cross-origin/SameSite issues. The `authFetch` helper automatically includes the Authorization header with the user's access token. All payment/subscription endpoints require this.


---

## Additional notes (merged from LLM.md)

# gui — AI Assistant Context

# Hanzo GUI

<h3 align="center">
  Style library, design system, composable components, and more.
</h3>

---

# Unified UI Architecture — TWO engines, ONE token table (CANONICAL)

**Authoritative decision: the user's committed `~/work/hanzo/ui/DESIGN.md`** (commit
451c57df2, 2026-07-03): *"Two design systems, do not confuse them: `@hanzo/ui` =
shadcn/ui + Tailwind + Radix. `@hanzo/gui` = the Tamagui/RN system. They share these
token VALUES (fonts, dark palette, sidebar glyph), NOT code."* (This supersedes an
earlier "big-bang everything on Tamagui / rebuild @hanzo/ui on @hanzo/gui" framing —
that would have meant a risky rewrite of chat/app's thousands of Tailwind components;
DESIGN.md is the considered, production-safe decision. Follow DESIGN.md.)

```
  ONE token table  ──  @hanzo/ui/DESIGN.md is the SoT for the shared look:
  (values, not code)   typography (Basel Grotesk + Geist Mono), true-black #000
        │              palette, sidebar glyph, per-brand accents (hanzo/lux/zoo/pars).
        ├───────────────┬──────────────────────────────
        ▼               ▼
  @hanzo/ui          @hanzo/gui
  = shadcn + Tailwind + Radix    = Tamagui / RN system
  WEB apps:                      NATIVE / desktop / console:
  hanzo.chat, hanzo.app,         console (Tamagui), hanzoai/ios,
  console-web, commerce,         hanzoai/android, hanzoai/desktop
  hanzo-desktop (Vite+Tailwind)  (Expo/RN + Tauri weld @hanzogui/tauri)
        │                               │
        └── each converges its token VALUES to the DESIGN.md table via its OWN
            mechanism (Tailwind CSS vars for @hanzo/ui; Tamagui $color*/config for
            @hanzo/gui). They do NOT share component code.
```

Concerns, kept separate (Hickey — values, not places):
- **One token table, two engines.** The unified thing is the DESIGN.md token VALUES
  (fonts, dark palette, sidebar glyph, brand accents) — NOT one component codebase.
  Web keeps Tailwind/shadcn (`@hanzo/ui`); native/desktop/console use Tamagui
  (`@hanzo/gui`). Native can't run Tailwind, so mobile correctly renders on
  `@hanzo/gui`; there is no "rebuild @hanzo/ui on Tamagui."
- **@hanzo/gui** owns the Tamagui config + tokens (`pkgs/core/themes` `brands.ts`/
  `v4-default.ts`, fonts `v4-fonts.ts`) + the Tauri weld (`pkgs/tauri` =
  `@hanzogui/tauri`) + the native machinery (`pkgs/{core,compiler,expo-router,
  native-bundle,native-ci}`). Consume the coherent `@hanzogui/*@7.3.x` sub-packages,
  NEVER the stale `hanzogui` umbrella (double-core "Missing theme" trap).
- **@hanzo/ui** owns the Tailwind/shadcn components + reads the same token values via
  CSS vars (`pkgs/ui/style/hanzo-default-colors.css`). Its `.dark` block must converge
  to true-black #000 per DESIGN.md §4 (open item — still ships shadcn-gray).

Migration recipe (mechanical): **converge each surface's token VALUES to the DESIGN.md
table; do NOT rip its engine.** Web → @hanzo/ui Tailwind vars; native/desktop/console
→ @hanzo/gui Tamagui config; new universal surfaces render on @hanzo/gui. Never a
big-bang against a live surface.

New repos: `hanzoai/ios` + `hanzoai/android` (Expo/RN on `@hanzogui/*`, LIVE, CI green).
Desktop + launcher → `hanzoai/desktop` (Tauri). `hanzoai/launcher` is NOT a repo —
the launcher installs with the desktop app.

## Phase 1 — foundation + proof (BUILT)

Design tokens are the single source of truth; the true-black + per-brand look is
baked into the tokens so every app gets the world-class look for free.

- **Tokens SoT** — `pkgs/core/themes/src/v4-default.ts` (the readable source) is
  regenerated into `generated-v4.ts` (the artifact `@hanzogui/config/v4`
  consumes) via `bun pkgs/core/cli/dist/index.cjs generate-themes
  ./pkgs/core/themes/src/v4-default.ts ./pkgs/core/themes/src/generated-v4.ts`.
  MUST run under **bun** (node's esbuild-register can't `require` the ESM
  `@hanzogui/colors`). After regenerating, rebuild `themes` → `config` →
  `hanzogui` in that order.
- **True-black default dark** — `darkPalette[0]` is the `background` slot
  (bgIndex 6, padded). Anchored: canvas `#000`, panel `#050505` (palette[1]),
  elevated + hairline border `#171717` (palette[3]). `dark.background` verifies
  as `hsla(0,0%,0%,1)`.
- **Per-brand accents** — `pkgs/core/themes/src/brands.ts` is the one data row
  per brand: hanzo `#fff` (zinc mono), lux `#3b82f6` (blue), zoo `#facc15`
  (yellow), pars `#d4af37` (gold). Reuses the audited Radix ramps in
  `@hanzogui/colors` (no bespoke color math). Wired as `childrenThemes` →
  `dark_hanzo|lux|zoo|pars` + light variants. Applied SPARINGLY: wrap only an
  accent element `<Theme name="lux"><Button/></Theme>`, never the page.
  `brandAccent` (brand→hex) is exported from `@hanzogui/themes` for components.
- **Type system** — `pkgs/core/config/src/v4-fonts.ts` defaults body/heading to
  Geist Sans (matches hanzo.ai) + a `mono` = Geist Mono for data/tabular, all
  with system-stack fallback.
- **Tauri weld** — `@hanzogui/tauri` (`pkgs/tauri`) is the desktop adapter:
  `isTauri()`, `useWindowControls()`, `useGlobalShortcut()`, fs/shell bridge,
  and a hanzogui `<TitleBar>`. Every call guards on `isTauri()` so the same
  component runs unchanged on web/native. Proof shell: `apps/desktop` (Vite
  front-end + `src-tauri` Tauri v2). `cargo build` compiles the shell;
  `apps/desktop/screenshots/tauri-weld-trueblack.png` shows hanzogui rendering
  on true-black with the four brand accents in the webview. Note: `src-tauri`
  needs an empty `[workspace]` in its `Cargo.toml` to escape the parent monorepo
  Rust workspace.

**Migrate the rest of @hanzo/ui (mechanical recipe):** for each component, keep
the exported prop API identical and swap the internals Tailwind/Radix →
hanzogui primitives + tokens (`$background`, `$borderColor`, `$color*`,
`fontFamily="$body|$heading|$mono"`, `borderRadius` from {6,8,12,full}, motion
120–200ms ease-out / spring for overlays). Brand CTAs use `<Theme name>`. Prove
web (Playwright screenshot on the true-black theme) + native (hanzogui native
driver / expo export).

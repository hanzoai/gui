Please read ./CONTRIBUTING.md as well

Note you need to re-build packages (`bun run build` in the package directory) as you change them, unless you or someone is running a `bun run watch` at root.

FOR LONG RUNNNING DEBUGGING run `bun run watch` in the background its faster and rebuilds all packages.

keep commits to one line, add a trailing "Fixes #" if associated with a GH issue, and start with a convential commit style - UNLESS its a change that shouldn't go into the changelog, in those cases you can do things like `docs: ` or `site: `.

# How this ships

One way, and it runs on our own stack:

    push  ->  github.com/hanzoai/gui           (a mirror)
              .github/workflows/sync.yml        carries refs onward
      ->  git.hanzo.ai/hanzoai/gui              CANONICAL
              .hanzo/workflows/checks.yaml      check, lint, unit tests
              .hanzo/workflows/publish-gui.yml      hanzogui + @hanzo/gui
              .hanzo/workflows/publish-gui-all.yml  every @hanzogui/* primitive
              .hanzo/workflows/publish-ai.yml       @hanzo/ai
              .hanzo/workflows/build.yml            ghcr.io/hanzoai/gui

**git.hanzo.ai is canonical; GitHub is a mirror.** `.github/workflows/` holds
exactly one file, `sync.yml`, and its only job is getting refs to the forge. Every
build, check and publish is a workflow under `.hanzo/workflows/`, which the forge
reads. `.hanzo/workflows` uses GitHub Actions syntax, so a workflow moves between
the two by changing directory and nothing else. `.github/actions/install` stays
where it is — a moved workflow's `uses: ./.github/actions/install` still resolves.

## What publishes what

Each publisher is the only producer of its packages, and a tag is the trigger in
every case — a version bump alone never ships.

| tag | workflow | publishes |
| --- | --- | --- |
| `release/gui-v*` | `publish-gui.yml` | `hanzogui` + the `@hanzo/gui` alias |
| `release/gui-all-v*` (or dispatch) | `publish-gui-all.yml` | every `@hanzogui/*` primitive + both umbrellas |
| `release/ai-v*` | `publish-ai.yml` | `@hanzo/ai` from `pkgs/ai` |

`NPM_TOKEN` comes from KMS with a repo-secret fallback in the two `publish-gui*`
workflows, and from `hanzoai/universe/.github/actions/kms-action` over OIDC in
`publish-ai.yml`. The forge has to be able to resolve that cross-repo action, so
`hanzoai/universe` must exist there; if it does not, the KMS step is the thing that
fails.

`publish-ai.yml` asked for `runs-on: [self-hosted, linux, arm64]`, which is one
frequently-offline host. A job requesting a label nothing answers queues silently
instead of failing, which is the worst possible outcome for a publisher, so it now
uses `hanzo-build-linux-amd64` like its two siblings — `@hanzo/ai` is
arch-independent JS.

## Known dead ends

- `build.yml` delegates to `hanzoai/.github/.github/workflows/docker-build.yml@main`
  and **that file does not exist** in `hanzoai/.github` (which carries
  `platform-build.yml` and `promote.yml`). The workflow has therefore never
  completed a run and `ghcr.io/hanzoai/gui` is not in the registry. It moved to
  `.hanzo/workflows/` unchanged rather than being deleted, because it is the only
  declaration of the image path; making it real means either inlining a build or
  pointing it at `platform-build.yml`.
- `gui.hanzo.ai` is **not served from this repo.** It answers from Cloudflare Pages
  out of `hanzoai/docs` (`apps/gui-docs`). This repo's own `apps/gui.hanzo.ai` is
  `one serve` — a long-running server, not a static export — so `hanzoai/static`
  cannot serve it and there is no App CR for it. Either point a CR at the docs
  image or convert that app to a static export; both are their own change.
- `checks.yaml` lost its `changes` + `integration-tests` jobs on the way over. They
  filtered on `code/core/**`, `code/kitchen-sink/**` and friends — an upstream
  Tamagui layout this repo does not have (the real paths are `apps/` and `pkgs/`) —
  so the filter never matched and the shard matrix never ran. The Playwright suite
  they were meant to run is at `apps/kitchen-sink/playwright.config.ts` and is
  currently wired to nothing.
- Three iOS workflows were deleted outright: `build-ios-kitchensink-app.yml`,
  `test-ios-native.yml` and `test-ios-kitchensink-go.yml`. All three wanted
  `macos-14`/`macos-15` runners, which the forge does not have, and all three ran
  in `code/kitchen-sink`, which does not exist. One was already `if: false`. Native
  iOS testing needs macOS capacity first; these files could not have provided it.

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


## Tailwind → gui migration (marketing surfaces)

`@hanzogui/chrome` is the shared public-site chrome (`HanzoNav`, `HanzoFooter`,
`ChatHero`, `HanzoWidget`) in Tamagui `styled()` + monochrome tokens. It compiles
and ships `dist/{esm,cjs,jsx}` + `types/`. It is the bridgehead: a surface adopts
the chrome first, then its page bodies.

**Read `pkgs/ui/chrome/src/styles.tsx`'s header before touching a chrome file.**
It states the contract this package is built under — no host config augmentation —
and every build break so far has been a violation of it: element type is `render`
(not `tag`); hover is DOM `onMouseEnter`/`onMouseLeave` (not `onHoverIn`); only
`Text` takes `color`; style props are LONGHAND (`textAlign`, `paddingHorizontal` —
the `text`/`px` shorthands live in augmentation that is absent here); anchors
forward `href` through the `linkable` `.styleable` wrapper. Two type consequences:
`GetProps<F>` requires `F extends StylableComponent`, and a raw-hex token handed to
a strict RN colour prop needs `as ColorTokens`.

### What the migration actually is

Measured on hanzo.ai (the largest surface): **126 marketing pages, 6,720
`className=` sites, 29,845 utility tokens, 671 distinct utilities**, and **zero**
imports of `@hanzo/ui` or `@hanzogui/*` in the page bodies. So this is not a
shadcn component swap — the pages are raw Tailwind. The vocabulary is regular
though: 30 utilities cover **51.4%** of all tokens, and colours are already
semantic (`text-foreground`, not hex), so the colour layer is a rename.

### Primitive map

| Tailwind (count) | gui equivalent |
|---|---|
| `text-foreground` 1091 · `text-muted-foreground` 859 · `text-foreground/80` 244 | `Txt` + `color={c.fg / c.fgMuted / c.fgDim}` (`chrome/src/tokens.ts`) |
| `border-border` 829 · `border` 795 | `borderColor={c.line}` · `borderWidth={1}` |
| `flex` 760 · `items-center` 887 · `justify-center` 512 | `XStack`/`YStack` + `alignItems` / `justifyContent` |
| `inline-flex` 484 | `XStack display="inline-flex"` |
| `grid` 220 | `YStack` + explicit rows, or `View display="grid"` |
| `mx-auto` 705 | `marginHorizontal="auto"` |
| `px-4` 542 · `py-3` 347 | `paddingHorizontal={16}` · `paddingVertical={12}` (longhand) |
| `gap-2` 509 · `gap-4` 239 | `gap={8}` · `gap={16}` |
| `mb-4` 507 | `marginBottom={16}` |
| `text-sm` 693 · `text-xl` 287 · `text-2xl` 323 | `Txt kind=` — the type scale in `chrome/src/styles.tsx` |
| `font-medium` 676 · `font-bold` 560 | `fontWeight="500"` / `"700"` |
| `text-center` 410 | `textAlign="center"` (never `text=`) |
| `rounded-full` 625 · `rounded-xl` 391 | `borderRadius={999}` · `borderRadius={12}` |
| `transition-colors` 372 | `useHover()` + explicit `color` on the child `Text` |
| `relative` 268 · `absolute` 256 · `overflow-hidden` 251 | `position` / `overflow` props |
| `h-4 w-4` 357/352 | icon `size={16}` (lucide props, unchanged) |

### Order

1. Adopt `@hanzogui/chrome` on a surface (nav/footer/hero) — the page bodies keep
   working untouched, so this is independently shippable.
2. Extract the repeated page shapes. 17 hanzo.ai pages already open with a
   byte-identical hero block; those become one primitive, not 17 rewrites.
3. Migrate bodies shape-by-shape, not page-by-page. Tailwind leaves as a
   consequence of the last shape moving, which is the only point it can be
   removed from the build.

Do not sed 6,720 class strings. The tail (671 − 30 utilities) is where the layout
bugs hide, and a marketing site is visually regression-tested by eye.

---

## Additional notes (merged from LLM.md)

# gui — AI Assistant Context

# Hanzo GUI

<h3 align="center">
  Style library, design system, composable components, and more.
</h3>

---

## Telemetry — `@hanzogui/telemetry` (pkgs/telemetry)

The ONE zero-config telemetry surface. `<TelemetryProvider>{children}</TelemetryProvider>`
with no props wires all three planes; `@hanzo/ui/telemetry` re-exports it unchanged
so the component layer needs no second definition.

- **One front door.** Everything (pageviews, product events, exceptions,
  interaction capture) is POSTed to `https://api.hanzo.ai/v1/event`. Cloud lenses
  that one stream into `sentry.hanzo.ai` (errors + session capture),
  `analytics.hanzo.ai` (web analytics) and `insights.hanzo.ai` (product insights,
  incl. `analytics_errors`). Those three hosts are DASHBOARDS — never ingest
  endpoints, never configured in a client.
- **Layering.** `@hanzo/event` = the client (batching, attribution, the wire).
  `@hanzo/observe` = the capture engine (semantics, redaction, playback), loaded
  with a dynamic `import()` inside an idle callback so it cannot cost LCP.
  `@hanzogui/telemetry` = the zero-config policy that composes them. Mechanism
  below, policy here, one of each.
- **Privacy.** DNT/GPC honored by default with no app code; an explicit
  `setConsent()` choice outranks the browser in both directions; nothing is
  written to storage while telemetry is refused.
- **Guarantees.** SSR-safe (a DOM is required before anything is collected),
  fail-soft (every method swallows its own errors), no CDN script, ESM,
  `sideEffects: false`.
- Tests: `cd pkgs/telemetry && bun run test` (24 tests — one-door URL, three-lens
  wire, DNT/GPC, consent precedence, SPA route counting, error boundary, SSR).

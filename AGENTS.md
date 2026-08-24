# Gui — agent operating contract

`CLAUDE.md` is a symlink to this file, so Claude, Codex, and every other agent
read the same rules. Put durable, repo-wide agent guidance here.

## Finish what you start, then merge it back

The most common failure here is stopping early: a fix left on a branch, a
migration written but never applied, a "critical, will do next" item dropped.
Don't do that. If you were asked to do something, it is not done until:

- it is committed, pushed, validated, and **merged back to `main`** (or a PR is
  opened and driven to merge) — "I left it on a branch" / "I prepared the SQL"
  is not done;
- it is **validated at the layer it changes**: typecheck/build for code, a real
  request or Playwright run for site behavior, an applied-and-verified query for
  a DB/RLS change. "Should work" is not validation;
- any **migration is actually applied and the live state verified** — this repo's
  prod migration history is NOT auto-applied on deploy (see
  `apps/gui.hanzo.ai/supabase/README.md`); a committed migration that was never
  run is an open gap, not a fix;
- for security/payments work especially, the loop is closed end to end — a
  documented finding with no shipped, deployed fix counts as no fix.

Keep going until the requested outcome is real. Continuing beats reporting. The
only hard stops are the externally-irreversible ones — publishing/releasing to
npm, force-pushing, rotating credentials, or changing prod infra (Cloudflare,
DNS, Railway settings): pause and confirm for those, and hand them back with the
exact steps when they block you. Everything else, finish it.

---

Please read ./CONTRIBUTING.md as well

Note you need to re-build packages (`bun run build` in the package directory) as you change them, unless you or someone is running a `bun run watch` at root.

FOR LONG RUNNNING DEBUGGING run `bun run watch` in the background its faster and rebuilds all packages.

keep commits to one line, add a trailing "Fixes #" if associated with a GH issue, and start with a convential commit style - UNLESS its a change that shouldn't go into the changelog, in those cases you can do things like `docs: ` or `site: `.

# Gui Testing Guide

## Running Tests

### Kitchen Sink Tests

The kitchen-sink package contains the main integration tests for Gui components. To run these tests:

1. **Start the web server** (in the background):

   ```bash
   cd apps/kitchen-sink
   bun run start:web
   ```

   To open a specific test case in the browser:

   ```bash
   open "http://localhost:7979/?test=YourTestCaseName"
   ```

   Test case names match the file names in `apps/kitchen-sink/src/usecases/` (e.g., `SelectFocusScopeCase`).

   To open a component demo:

   ```bash
   open "http://localhost:7979/?demo=Select"
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
   NODE_ENV=test GUI_TEST_ANIMATION_DRIVER=css npx playwright test --project=animated-css

   # Available projects: animated-css, animated-native, animated-reanimated, animated-motion
   ```

4. **Run a specific test file**:

   ```bash
   # Using playwright directly
   cd apps/kitchen-sink
   npx playwright test tests/PopoverFocusScope.test.tsx

   # Or with a specific driver
   NODE_ENV=test GUI_TEST_ANIMATION_DRIVER=css npx playwright test tests/YourTest.animated.test.tsx --project=animated-css
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

## Releasing: one version for the workspace, and nothing publishes it for you

`scripts/release.ts` carries a single `version` for every published package, read
from `pkgs/ui/hanzogui/package.json`. Every path assumes it — the bump, the
`npm view name@version` already-published check, and the tarball name
`getPublishArtifactPaths` expects `npm pack` to produce.

**NOTHING IN CI PUBLISHES, AND THE WORKFLOW WRITTEN TO SAYS IT DOES.**
`.hanzo/workflows/publish-gui-all.yml` declares `on: push: branches: [main]` and
explains at length why publishing on push is safe. It has never run. This repo
has no `.github/workflows` and no `.gitea`/`.forgejo` directory, so GitHub
Actions — which reads only `.github/workflows` — sees nothing, and the forge
needs server-side configuration to read a directory of that name. The workflow's
own header records the symptom without naming the cause: "every version across
that gap was published by hand, because the commit that bumped it triggered
nothing." That is still true, of the workflow itself.

So a release is: bump, push, and RUN THE SCRIPT. Measured on the 8.2.0 release —
`bun install` and `bun run build` green first, then

    bun scripts/release.ts --minor --ci --dirty --skip-publish --skip-push \
      --skip-tests --skip-native-tests --skip-checks     # writes the version
    git push origin main
    bun scripts/release.ts --republish --ci --dirty --skip-push \
      --skip-tests --skip-native-tests --skip-checks     # publishes

`--republish` skips the version write, so it is also the RETRY: it re-checks the
registry and publishes only what is missing, and it is safe to run repeatedly.
The 8.2.0 run needed three passes and reported what was still absent each time.

**Which bump.** `--patch` computes from the WORKSPACE version, so it is a
regression whenever one package has drifted ahead: it rewrites that package
BACKWARD over versions already on npm, the publish then skips it as
"already published", and the tree ships a number lower than the registry's.
`@hanzogui/shell` sat at 8.1.54 against a workspace at 8.1.1 for exactly that
reason. A minor clears every published version at once and reconverges the tree,
which is why 8.2.0 was minor and not patch — and it is what finally shipped
shell's stranded 8.1.54 work. To move ONE drifted package without dragging the
rest, `--only <name>` reads `Current` from that package instead of the workspace,
so `--patch` computes a true next patch there.

Verify any of this with `--dry-run` added to the commands above: it prints the
computed version and the full publish plan and writes nothing.

**npm can stall mid-publish and it is not your bug.** A large package can come
back `E409 Cannot publish over previously staged version` — npm holding a partial
upload. `@hanzogui/lucide-icons-2` (14.2 MB, 8807 files) did this and cleared on
its own after ~9 minutes of retries. It matters because the script pins internal
deps EXACTLY, so a package published against a missing one is a broken install
until the missing one lands: `@hanzogui/chrome@8.2.0` pinned
`@hanzogui/lucide-icons-2@8.2.0` while that version did not exist. Re-run
`--republish` until the postflight reports nothing missing.

What `--only` cannot do is provenance: that needs the GitHub `Release` workflow's
`id-token: write`, and that workflow only ships the whole workspace.

## Commit Message Conventions

- Use `site:` prefix (not `fix(site):`) for hanzogui.dev changes since they don't go in the changelog
- Use `ci:` prefix (not `fix(ci):`) for CI/workflow changes since they don't go in the changelog
- Keep commit messages to a single line

## iOS Development

See [docs/using-ios.md](./docs/using-ios.md) for iOS native development and Detox testing tips.

## hanzogui.dev API Authentication

When making authenticated API calls from the client side in hanzogui.dev, always use the `authFetch` helper:

```ts
import { authFetch } from '~/features/api/authFetch'

const response = await authFetch('/api/some-endpoint', {
  method: 'POST',
  body: JSON.stringify({ ... }),
})
```

**Why this matters:** Cookies alone are not reliable for auth in production due to cross-origin/SameSite issues. The `authFetch` helper automatically includes the Authorization header with the user's access token. All payment/subscription endpoints require this.

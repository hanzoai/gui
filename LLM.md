# @hanzo/gui — notes for whoever is here next

## A targeted publish (`--only`) currently dies in the test gate

`bun ./scripts/release.ts --only @hanzo/gui` fails before it publishes:

```
@hanzogui/kitchen-sink#test  ->  9 failed, 576 passed, 19 skipped
  [webkit] tests/RemoveScroll.test.tsx  (scroll position restored after close,
  scroll lock prevents body scroll, edge cases, mobile touch device)
```

**These predate the change you are trying to ship.** They are webkit-only
scroll-restoration failures in `apps/kitchen-sink`, and that file was last
touched by `95c64deb76 transplant onto tamagui v2.6.0`. Nothing in `pkgs/ui`
reaches them.

So a one-file fix to, say, `pkgs/ui/hanzogui/css-check.mjs` cannot pass the gate
on its own merits, and the honest options are:

- let the fleet release carry it (this is what happened for 8.1.0 — a normal
  release from `main` picked up a pending css-check fix and shipped it), or
- `--skip-test`, having first confirmed your change cannot reach kitchen-sink,
  or
- fix the webkit failures, which is a real piece of work and nobody's yet.

Do not read a green `--only` run as "tests passed" — the script's exit code is
easy to mask behind a shell pipeline. Check the log for the turbo summary.

## `pkgs/ui/hanzogui/css-check.mjs` ships as the `gui-css-check` bin

It is a real published surface, not a dev script: `files[]` includes it and
`bin` points at it. Its `DEFAULT_ALLOW` list names the classes `@hanzo/ui`
stamps as identity markers (`btn`, `btn-*`, `badge`, `badge-*`) and it is
ENUMERATED, not wildcarded — `btn-` is a name anyone might type, so a glob would
wave through a hand-written `btn-cta` that has no rule behind it, which is the
exact failure the checker exists to catch. When `@hanzo/ui` adds a Button or
Badge variant, add it here too; drift fails loudly rather than silently.

## `HanzoFooter` (pkgs/ui/chrome) is deprecated

`SiteFooter` in `@hanzo/ui/product` is the one footer. It renders the FOOTER
model from `@hanzo/products`, so its links are shared data instead of a
per-caller prop. `HanzoFooter` is NOT a re-export of it, deliberately: this
package lives inside `@hanzo/gui` and `@hanzo/ui` peer-depends on `@hanzo/gui`,
so re-exporting would close a `gui -> ui -> gui` cycle. Its 8 callers keep
working and migrate on their own schedule.

## Every package builds with `hanzogui-build` and ships src + esm + cjs + types

`pkgs/build/tsgo-build.mjs` is the one build: three `tsgo` passes per package
(`tsconfig.esm.json` typechecks and writes `dist/esm` + `types/`, the CJS and
native passes run `--noCheck` and only translate). A `x.cjs.ts` sibling takes
x's name in `dist/cjs`, a `x.native.ts` sibling in `dist/native`, and neither
reaches any other emit. A module that needs its own location says
`import.meta.url` in `src/here.ts` and `pathToFileURL(__filename).href` in
`src/here.cjs.ts`; everything else imports `url` from `./here.ts` and names the
`createRequire` alias `need`, never `require`. After the CJS pass every
`dist/cjs/*.js` is parsed as a script and a file with `import.meta`, a top-level
`await`, or a declaration of `require`/`module`/`exports`/`__filename`/`__dirname`
fails the build by name. Manifests all state the same shape: `types`,
`react-native` (dist/native where the package builds native), `browser`,
`module`, `import`, `require`, `default`; `main` → dist/cjs, `module` →
dist/esm, `files` = src, types, dist. Named ESM imports from CommonJS packages
(`fast-glob`, `fs-extra`) fail under Node's lexer: use the default import or
`fs-extra/esm`.

## Two sites off one build, no image

`hanzo.yml` declares `sites:` (team, gui) with one `site-build`; the reusable's
site lane publishes each to the Sites plane, routed by universe
`static-sites.yaml` (`team-static`, `gui-static`). The docs app's export script
is `build:web` (`one build`), the same name apps/team uses, and the turbo task
`build:web` depends on `^build` and the package's own `build`. There is no
Dockerfile and no image lane.

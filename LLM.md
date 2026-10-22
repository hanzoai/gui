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

## One site, no image

`hanzo.yml` declares one `site:` lane (slug `gui`); the reusable publishes it to
the Sites plane, routed by universe `static-sites.yaml` (`gui-static`). The docs
app's export script is `build:web` (`one build`), and the turbo task `build:web`
depends on `^build` and the package's own `build`. There is no Dockerfile and no
image lane. The native Team app that used to live at apps/team is its own repo,
hanzo-apps/team, with its own site lane.

## Right-to-left: name sides logically

Hosts set `<html dir="rtl">` (via @hanzo/i18n) and every surface renders through
this repo, so a side named physically is a bug under Arabic, Persian, Hebrew and
Urdu. Flex rows and grid columns follow `dir` on their own; offsets do not.

- Write `marginInlineStart/End`, `paddingInlineStart/End`, `insetInlineStart/End`,
  `borderInlineStart*/End*`, `borderStartStartRadius`… and `textAlign: 'start'`.
  On web they emit CSS logical properties; on native they land on RN's
  `marginStart`/`start`/… and `textAlign` start/end becomes left/right, which RN
  swaps under RTL itself.
- RN's own names (`paddingStart`, `start`, `borderTopStartRadius`) used to emit
  `padding-start` and `start:` on web — not CSS, silently dropped. `expandStyle`
  maps them to the logical property now.
- Inline logical longhands carry the doubled class (`cssShorthandLonghands`), so
  `paddingInlineEnd` beats the `padding-right` that `padding`/`paddingHorizontal`
  expand to whatever order the sheet inserted them. A host's PHYSICAL override of
  a logical side loses the same way: migrate the host, do not re-physicalise.
- `useDirection()` reads `<html dir>` when no provider or prop says otherwise,
  and re-renders when it changes. Slider, tabs, menus, roving focus, switch and
  progress follow it. Native still falls back to 'ltr'.
- A mark that points along the line (back, forward, send, a drill-in chevron)
  spreads `mirror` (`data-i18n-mirror`); gui's base sheet and the shell's state
  `[data-i18n-mirror]:dir(rtl){transform:scaleX(-1)}`, the same declaration
  @hanzo/i18n's rtl.css uses, so several on one page mirror once. Never on logos,
  media controls, numbers, code or a chart's time axis.
- floating-ui already aligns `bottom-start` to the inline start under RTL; never
  pick `-end` for RTL yourself (Menu did, and flipped it back to the left). Side
  placements (`left`/`right`) are physical and do need the swap.

## `tracks` and `Wrap`: the stack sizes its children

`tracks` is a View prop (core, `pkgs/core/web/src/helpers/tracks.ts`, typed on
`StackNonStyleProps`): a CSS track list along the stack's own axis, so the
children carry no flex props. `Wrap` (`pkgs/ui/stacks`) is the one place
content-sized wrapping lives. Both opt in; a stack without `tracks` renders
byte for byte as before. The owner's plan: these primitives (8.4), then a
codemod per repo with screenshot diffs, then `hanzo-design-lint`'s `flex-prop`
floor enforced at zero, then the stack default flips to grid in gui 9 only.

- **Web**: `display: grid`; YStack `grid-auto-flow: row` + `grid-template-rows`
  - `grid-auto-columns: minmax(0, 1fr)`, XStack `column` + `-columns` +
    `grid-auto-rows: minmax(0, 1fr)`. Merged at importance 0 after the prop
    loop, so a prop the author names (`display="none"`) wins. The axis is
    `flexDirection` (row/row-reverse across, else down); no reverse flow.
- **Alignment keeps its flex meaning.** On a vertical stack grid's axes swap,
  so propMapper renames every key it emits (`styleState.renames`): on the stack
  `alignItems→justifyItems`, `justifyContent→alignContent`,
  `alignContent→justifyContent`; on a direct child `alignSelf→justifySelf`.
  Renaming the emitted key is what makes it hold in media, pseudo and variant
  styles. A child learns its parent's axis from `ComponentContext.tracks`,
  which createComponent provides to a stack's children and every child clears
  for its own (merged into the focusWithin / inText providers, so the innermost
  provider still carries both). An HOC and asChild pass it through.
- **Native** stays flex; createComponent hands each child the track at its
  position as flex longhands (`place`): `Nfr`→grow N shrink 1 basis 0, a
  length→grow 0 shrink 0 basis N, anything else→basis auto. Positions run
  through fragments and skip absolute/fixed children.
- **The compiler** leaves a tracks stack and its direct children to the
  runtime (`deoptProps` + `hasTracksParent` in createExtractor).
- Tests: `pkgs/ui/components-test/Tracks.{web,native}.test.tsx`, the compiler
  case in `static-tests/tests/babel.web.test.tsx`, and real-browser geometry in
  `apps/tests/integration/tests/tracks.integration.test.js` (dev and the
  compiled production build). A spawned server's stdout must be drained there,
  or the vite plugin's warnings fill the pipe and the server never listens.

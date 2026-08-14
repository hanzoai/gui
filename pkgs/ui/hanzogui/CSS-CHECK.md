# gui-css-check

Fails a build when the markup uses a class that no delivered stylesheet defines.

```sh
gui-css-check                      # finds .next / dist / out / build itself
gui-css-check .next
gui-css-check --render http://localhost:8080/   # client-rendered apps
```

Exit 0 at 100% coverage, exit 1 below it, exit 2 if it could not measure
anything. `--json` prints the whole result.

## Why it exists

A compiler knows whether your code compiles. Nothing in the toolchain knows
whether the stylesheet a document links actually contains the classes that
document uses, so "classes without rules" ships silently and the page renders
blank-looking. It has happened three times in this estate:

- **hanzo.app** served 18 KB of CSS containing zero of its ~240 gui atomic
  classes. `GuiProvider` had `disableInjectCSS` set — runtime injection off, on
  the assumption a build-time extractor would emit the rules instead. No
  extractor was configured, so neither path ran and nobody authored the sheet.
- **@hanzogui/shell@8.0.3** published 966 lines of Tailwind classes with no
  Tailwind in its dependencies.
- **@hanzogui/loader** resolved `./css.js` from its ESM build, which only ever
  emits `css.mjs`, so `withGui()` could not load from a `.mjs` next.config at
  all — the static extraction path was unreachable.

Every one of those builds was green.

## What it measures

Per page, not per build — a rule sitting in a sheet the page never links is not
delivered, and the browser agrees.

- **used** — class tokens in `class="…"` attributes of the rendered markup.
  Scripts are skipped, so Next's RSC flight payload cannot be mistaken for
  markup.
- **defined** — class tokens in selector position in every sheet the page
  delivers: each linked `.css` resolved on disk, plus every inline `<style>`.
  Declaration bodies are skipped, so `padding:.5rem` is not a class; CSS
  identifier escapes are decoded, so `.hover\:bg-white\/\[0\.06\]` matches the
  class `hover:bg-white/[0.06]`.

Also failed: a `<link rel="stylesheet">` pointing at a file that is not there.

Refused, with exit 2, when the run measured nothing about the app:

- every document uses zero classes — that is a client-rendered app on disk, an
  empty shell;
- the only prerendered pages are the framework's own (`404`, `500`, `_error`,
  `_not-found`). Seen on hanzo.id, whose single prerendered page was Next's
  built-in 500: 1/1 classes, 100%, and nothing whatever known about the app.

Calling either of those a pass is how a checker becomes decoration. Use
`--render` for both.

## Byte report

```
gui-css-check  4 page(s) · 1 cached sheet(s), 5 KB · 257 KB inline per document
               23/23 classes covered (100.0%)
```

Two numbers, because they are not the same cost. A cached sheet is fetched once.
Inline CSS is re-sent with every document and cacheable by nobody — the number a
static extractor exists to drive to zero.

## Wiring it into an app

`@hanzo/gui` already ships this, so there is nothing to install and nothing to
copy. One line, and it runs on every build:

```json
{ "scripts": { "postbuild": "gui-css-check" } }
```

For a client-rendered app, point it at the running thing:

```json
{ "scripts": { "postbuild": "vite preview --port 8080 & gui-css-check --render http://localhost:8080/" } }
```

`--render` drives a real browser and reads `document.styleSheets`, so it sees
runtime-injected rules too. It imports `playwright` lazily and does not depend
on it: SSR apps never need it, and the apps that do already have it.

## Allowances

A class that is genuinely styled by something the check cannot see goes in
`gui-css-check.json` (or a `gui-css-check` key in package.json):

```json
{ "allow": ["swiper-*"], "render": ["http://localhost:8080/"] }
```

Keep a note saying who styles it. An allowance without a source is a guess, and
a guess here is how a real miss gets waved through.

These are allowed by default because a library provably stamps them as identity
markers and never styles them — each verified in that library's source, not
assumed:

| pattern | emitted by |
| --- | --- |
| `is_*` | gui, `getSplitStyles.tsx`: `` `is_${componentNameFinal}` `` |
| `t_sub_theme` | gui, `Theme.tsx`: marks a nested Theme; the `t_*` beside it carries the style |
| `lucide`, `lucide-*` | lucide-react, `Icon.js` / `createLucideIcon.js` |
| `__variable_*`, `__className_*` | next/font |

## Its own tests

```sh
node --test css-check.test.mjs
```

Twelve cases, no dependencies, covering the parts that break quietly: a
declaration value that looks like a class, an escaped Tailwind selector, a hex
escape and its terminating space, markup quoted inside a script payload, and a
rule that exists but is not linked.

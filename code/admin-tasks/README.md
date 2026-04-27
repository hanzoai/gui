# `@hanzogui/admin-tasks`

The Hanzo Tasks admin UI. Vite SPA, Tamagui via `hanzogui`, composed from
`@hanzogui/admin` chrome + transport-agnostic data hooks. Ships standalone
to `tasks.hanzo.ai`.

## Why this lives in `gui`

This app consumes `hanzogui`, `@hanzogui/core`, and `@hanzogui/admin`
through `workspace:*`. That's the only place the static extractor's
bundled-config worker can re-resolve those imports when it copies
`hanzogui.config.ts` into `.hanzogui/hanzogui.config.mjs` at build time.
Outside the workspace pnpm hoisting can't reach the temp file and the
extractor crashes on `cannot find @hanzogui/core`. Inside, every dep
resolves through the root `node_modules` and the extractor emits the
theme CSS layer cleanly.

## Relationship to the binary form factor

`tasksd` (the Go server in `~/work/hanzo/tasks/cmd/tasksd/`) embeds its
own UI under `/_/tasks/`. That UI is the production React/shadcn build
at `~/work/hanzo/tasks/ui/`. It's the lean, single-binary deployment
target — anyone running `tasksd start` gets the embedded UI for free,
no Node.js required.

`@hanzogui/admin-tasks` is a different deployment target: the cloud
SPA at `tasks.hanzo.ai`. Same backend (`/v1/tasks/*`), Tamagui chrome,
and the bigger surface for namespaces / batches / deployments / nexus
that we want first-class on the web.

The two share the same backend API contract — `src/lib/api.ts` and
`src/lib/events.ts` here mirror what the React/shadcn build also calls.
They diverge only in chrome.

## Run

```bash
# In another terminal: tasksd HTTP on :7243.
# See ~/work/hanzo/tasks/README.md for a quick start.

cd ~/work/hanzo/gui
bun install                      # wires admin-tasks into the workspace

cd code/admin-tasks
bun dev                          # http://localhost:5174/_/tasks/
bun run build                    # → dist/
bun run preview                  # serve dist/ for a sanity check
```

## Bundle size

| | Before move (pnpm spike, extractor disabled) | After move (workspace, extractor enabled) |
|---|---|---|
| JS  | 1,511,832 B | **674,728 B** (-55%) |
| CSS | 0 B (CSS-in-JS at runtime) | 9,104 B |
| HTML | 1,123 B | 1,123 B |
| Total | 1.5 MB | **0.68 MB** |
| Gzip JS | 294,962 B | **201,529 B** (-32%) |

Tamagui's static extractor hoists the style props it can resolve at
build time into atomic class names in a single CSS file, then strips
the style runtime call sites in JS. The savings come from both the
removed style-prop arguments AND the dropped runtime style code.

## Files

| Path | Role |
|---|---|
| `package.json` | bun workspace manifest pinning `workspace:*` for every hanzogui dep |
| `tsconfig.json` | strict TS, bundler resolution, JSX react-jsx |
| `vite.config.ts` | Vite 8 + `@vitejs/plugin-react` + `hanzoguiPlugin`; aliases `react-native` → `react-native-web`; proxies `/v1/tasks` → `127.0.0.1:7243`; serves under `/_/tasks/` to match tasksd's path |
| `hanzogui.config.ts` | extends `@hanzogui/config`'s v5 default — clean, no runtime spread |
| `index.html` | SPA shell, dark `<body>`, Inter font preconnect |
| `src/main.tsx` | React root, BrowserRouter at basename `/_/tasks` |
| `src/App.tsx` | wires `@hanzogui/admin` chrome with tasks-specific nav config |
| `src/pages/*` | one file per route (Workflows, Schedules, Batches, …) |
| `src/lib/api.ts` | fetch wrapper, `ApiError`, response types for `/v1/tasks/*` |
| `src/lib/events.ts` | SSE subscription against `/v1/tasks/events` |
| `public/favicon.svg` | the 'H' mark |

## What's still rough

- **Polish parity with `~/work/hanzo/tasks/ui/`** — `SavedViewsRail`,
  `FilterBar`, `EmptyWorkflowsHero`, "Start Workflow" dialog haven't
  been ported across yet. Single-page focus first.
- **Auth flow** — currently relies on identity headers injected by
  `hanzoai/gateway` in production. Local dev runs without auth.
- **Mobile target** — Tamagui compiles to react-native for iOS/Android
  but no native shell exists yet. Future work.

## Conventions

- Strict TypeScript. `noUnusedLocals` / `noUnusedParameters` on.
- No HTML / CSS DOM primitives. Tamagui only.
- All hanzogui deps via `workspace:*`. Never pin a version on a
  package that lives in this repo.
- Extractor stays enabled. If a Tamagui type widening breaks the
  build, fix the type — don't disable extraction.

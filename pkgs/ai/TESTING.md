# Testing @hanzo/ai — and TDD going forward

## Run

```bash
bun run --cwd pkgs/ai test         # unit + regression (vitest, jsdom) — fast, no external deps
bun run --cwd pkgs/ai test:watch   # vitest watch mode (use while writing a fix)
bun run --cwd pkgs/ai test:e2e     # Playwright e2e — needs the local runtime up (skips if not)
```

`test` runs everything under `src/**/*.{test,spec}.{ts,tsx}` in jsdom. Config:
`vitest.config.ts` mirrors the web build's alias graph (so `@/`, `@tauri-apps/*`
→ host shims, `@hanzo_network/*` → src resolve), stubs the streamdown markdown
stack (esbuild can't resolve its nested micromark), and loads
`@testing-library/jest-dom` via `src/__tests__/setup.ts`. Pyodide /
python-code-runner tests are excluded (30 MB wasm + network).

## What's covered

**Unit + regression** (`src/__tests__/`) — each guards a bug this stack actually hit:
- `brand-store.test.ts` — `useBrand`/`getBrand` are plain getters callable
  outside render (the invalid-hook-call that blocked the whole web app).
- `host-shims.test.ts` — `getCurrentWindow().emit` etc. exist; the injected host
  adapter switches web↔tauri (the "emit is not a function" mount crash).
- `resizable.test.tsx` — `react-resizable-panels` v3 API present, net-ui
  resizable renders (the v4 "Element type is invalid" chat-view crash).
- `no-missing-imports.test.ts` — critical screens import every `<Component>`
  they use (the dropped `Box`/`Boxes`/`Coins` lucide imports → "Box is not defined").

**App tests** (pre-existing, `src/app/**`) — engine client, machine-state queries,
mining page, playground utils. **E2E** (`e2e/chat.e2e.test.ts`) — drives the real
browser: onboarding renders, then connect → register → send → assert zen-coder's
reply (and assert no "is not defined" / "Element type is invalid" page errors).

## TDD workflow (going forward)

Every fix and feature starts with a failing test:

1. **Red** — write a test that reproduces the bug or specifies the behavior, in
   `src/__tests__/` (unit) or `e2e/` (flow). Run `test:watch`; confirm it fails.
2. **Green** — make the smallest change that passes it.
3. **Refactor** — clean up with the test green.
4. Run `bun run --cwd pkgs/ai test` before committing; keep it green.

Most bugs this session were import/dep/runtime issues that *static render checks
missed but a test would have caught* — prefer a regression test over a manual
re-check. For anything touching the chat path, add/extend the e2e.

The local runtime for `test:e2e` is in `pkgs/ai/local-runtime/` (see `CHAT.md`):
restart `run-node.sh` (fresh storage) before a run so Quick Connect registers as
the first device.

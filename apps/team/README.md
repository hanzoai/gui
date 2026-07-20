# Hanzo Team

Native Hanzo Team skeleton on hanzogui — one codebase for web, mobile, and desktop.

Three screens share components with web: Shell (AppHeader: mark, org row,
five-surface switcher), Login (hanzo.id OIDC via system browser + deep link),
Wallet (balance and usage, monochrome tokens).

```bash
bun run dev        # web dev server
bun run build:web  # web production build → dist/client
bun run typecheck  # tsc
bun run ios        # native (one / expo)
```

Desktop wraps `dist/client` with Tauri: build web, then `cargo tauri dev` (or
`cargo check`) inside `src-tauri/`.

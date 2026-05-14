# admin-base-go

Hanzo Base admin app for **iOS, Android, and web**.

Sibling to `apps/admin-base` (Vite SPA, browser-only). Same screens,
same IAM flow, different runtime. Boots through Expo's native
build pipeline so it can ship as a `.ipa`, `.apk`/`.aab`, and a
PWA from the same source tree.

## Run

```bash
# iOS simulator
bun run ios

# Android emulator / device
bun run android

# Web (Metro-based, browser preview)
bun run web

# Or start the Metro dev server only:
bun run start
```

## Env

```bash
# Where the binary should look for IAM. In dev this is normally the
# LAN address of your machine running `./base serve` so the device
# can reach it. In prod it's your same-origin /api/iam path or a
# branded IAM host.
EXPO_PUBLIC_IAM_SERVER_URL=http://192.168.1.20:8090/api/iam
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:8090/api
```

## What's NOT forked

This app **does not** duplicate any of `apps/admin-base`'s `src/`.
The tsconfig path alias `@hanzo/base-ui/*` resolves to
`../admin-base/src/*` so the route tree, pages, hooks, and
`lib/api.ts` are imported as-is.

The shell here owns:
- Expo native runtime (`registerRootComponent`)
- Native navigation container (`@react-navigation/native`)
- iOS/Android Info.plist / AndroidManifest knobs (`app.json`)
- Bundle identifier `ai.hanzo.base.admin` for both stores
- URL scheme `hanzobase://` for IAM OAuth2 PKCE redirect on device

If a screen needs a platform-specific override (e.g. a native picker
vs the web `<input type="file">`), add a `.native.tsx` sibling next
to it under `apps/admin-base/src/` — Metro picks the native variant
on iOS/Android, Vite ignores them.

## Status

Scaffold. The shared admin-base UI was authored Vite-first; a sweep
to replace `import.meta.env.VITE_*` with `process.env.EXPO_PUBLIC_*`
(or a thin shim re-export in `apps/admin-base/src/env.ts`) is the
next mechanical step before this app will actually boot.

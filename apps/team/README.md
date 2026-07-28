# Hanzo Team

The hanzo.team shell. React owns the chrome; Svelte views mount inside it while
they wait to be ported.

```bash
bun run dev        # dev server on :3000
bun run build      # production build → dist
bun run typecheck  # tsc
bun run test       # playwright, real browser
```

Desktop wraps `dist` with Tauri: build, then `cargo tauri dev` inside `src-tauri/`.

## Layout

```
components/Shell.tsx      the chrome — sidebar, header, palette, account
components/Svelte.tsx     the ONE seam that mounts a Svelte view
components/props.svelte.ts reactive props for a mounted view
src/views.ts              the view registry: each entry is React or Svelte
src/brand.ts              hostname -> brand
src/session.ts            hanzo.id delegation and the token
src/account.ts            POST /v1/team/account
src/theme.css             the design tokens BOTH engines read
```

## The seam

`Svelte.tsx` is the only way a Svelte view reaches the screen. React owns the
shell and navigation; a view receives props and renders, and cannot reach the
chrome. Porting a view to React means changing which key its registry entry
carries — `svelte` becomes `react` — and nothing else, which is what makes the
remaining `*-resources` plugins a queue rather than a cliff.

`tests/seam.spec.ts` cycles mount/unmount 25 times and asserts the live-instance
and listener counts return to zero. That assertion is load-bearing and has been
shown to fail when teardown is removed: the DOM looks clean either way, because
React removes the host element whether or not the Svelte instance was destroyed.

## Brand

Brand is a function of hostname (`src/brand.ts`), and an unrecognized host
resolves to no brand rather than to a default — defaulting is how one brand's
mark lands on another's host. The mark comes from `@hanzo/logo`, which ships only
Hanzo's, so a non-Hanzo brand renders its wordmark and there is no code path that
can do otherwise. `tests/brand.spec.ts` asserts the negatives, against real
hostnames via Chromium's host-resolver rules.

## Sign-in

hanzo.id is the only door. The backend owns the whole OAuth hop — it holds the
client id, mints and checks `state`, exchanges the code — so sign-in is one
navigation to `/v1/team/account/auth/openid` and there is deliberately no
credential form. `POST /v1/team/account {method:"login"}` answers
`account:status:Unauthorized "sign in at hanzo.id"`.

The backend bounces back to `/login:component:LoginApp/auth?token=…` on success
and `/login?error=…` on failure, so the token is read from the query rather than
from a route — the success path is a Huly location string that means nothing here.

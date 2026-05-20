# `admin-auto-stub`

Reference consumer for `@hanzogui/admin`. Three components, one wiring
file, ~85 LOC of consumer code. Demonstrates the unblocking primitive
for the unified admin UI vision: every hanzoai/base-backed service
drops in the same shell.

## Run

```bash
cd apps/admin-auto-stub
bun run dev
# → http://localhost:5179
```

The dev proxy forwards `/v1/*` and `/v1/iam/*` to `base.hanzo.ai`.
Override to point at a different Base instance:

```bash
VITE_BASE_TARGET=http://localhost:8090 bun run dev
VITE_BASE_TARGET=https://commerce.hanzo.ai bun run dev
```

## What it shows

```
+--------------------------------------------------+
| BrowserRouter                                    |
|  +--------------------------------------------+  |
|  | AuthGate (iam = @hanzo/iam/browser)        |  |
|  |  +--------------------------------------+  |  |
|  |  | BaseClientProvider (client = /v1)    |  |  |
|  |  |  +----------------------------------+|  |  |
|  |  |  | AdminApp (Sidebar + TopBar)      ||  |  |
|  |  |  |  → CollectionCRUD "_superusers"  ||  |  |
|  |  |  +----------------------------------+|  |  |
|  |  +--------------------------------------+  |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+
```

- `/`         → redirects to `/superusers`
- `/login`    → AuthGate renders the default sign-in screen
- `/callback` → AuthGate runs `iam.handleCallback()`, stores token,
                redirects to the stashed `from` path
- `/superusers` → CollectionCRUD fetches schema + paged records from
                  `base.hanzo.ai/v1/collections/_superusers/...`

## Smoke test (no real auth)

```js
// In the browser console after the sign-in screen renders:
sessionStorage.setItem('hanzo_iam_access_token', 'FAKE')
sessionStorage.setItem('hanzo_iam_expires_at', String(Date.now() + 60_000))
location.href = '/superusers'
```

You'll see the chrome render correctly; the CRUD body shows the
canonical Base error "The request requires valid record authorization
token" — which is the right end-to-end behaviour against an upstream
Base instance that doesn't recognise the bogus token.

## Why this is the canonical pattern

One way per concern:

- Auth     → `<AuthGate iam={…} />`
- API      → `<BaseClientProvider client={createBaseClient({apiPrefix})} />`
- Chrome   → `<AdminApp sidebar={…} topBar={…}>{children}</AdminApp>`
- CRUD     → `<CollectionCRUD collection="…" />`

Adding a new collection page is one route entry. Adding a new
hanzoai/base-backed admin SPA is a fork of this stub.

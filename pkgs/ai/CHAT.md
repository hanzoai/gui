# Live chat — VERIFIED working end-to-end (web, local) 2026-06-05

The web app at `:1500` chats with **zen-coder-24b** through a real **hanzo-node**,
fully in the browser. Verified: prompt "Reply with exactly: E2E CHAT OK" →
zen-coder generated `E2E CHAT OK` (7 tokens), streamed back to the chat UI.

The full path:

```
browser :1500 ─(vite proxy /v1,/v2,/ws)→ hanzo-node :3700 ─job→ zen_engine provider
   → responses-proxy :36906 (rewrites /v1/engine/responses → /v1/responses)
   → hanzo-engine :36902 (zen-coder-24b)  → "E2E CHAT OK" → streamed back to the UI
```

## The non-obvious fixes that made it work

1. **The node speaks the OpenAI _Responses_ API, the engine serves it at a
   different path.** The node's `OpenAI` provider POSTs to
   `<url>/v1/engine/responses` (`{input:[...], max_output_tokens, ...}`), but
   hanzo-engine serves the Responses API at **`/v1/responses`** (`/v1/engine/...`
   → 404 → the node reports "AI Provider API Error: Unknown error"). A tiny proxy
   rewrites the path (and injects `enable_thinking:false`). See
   `local-runtime/responses-proxy.py`.
2. **Use `127.0.0.1`, never `localhost`.** `localhost` resolves to IPv6 `::1`
   here; the engine/embeddings bind IPv4 only → instant connection failure.
3. **CORS:** the vite dev server proxies the app's own origin (`/v1`,`/v2`,`/ws`)
   to the node, so the app's `nodeAddress` is just `http://<host>:1500`.
4. **Two migration import bugs** had to be fixed for the chat screens to render:
   `main-layout.tsx` was missing `Box`/`Boxes`/`Coins` lucide imports, and the
   merge pulled `react-resizable-panels@4` (renamed exports) — pinned to `^3.0.2`
   in `pkgs/net-ui` (the app uses `PanelGroup`/`PanelResizeHandle`).

## Reproduce it

```bash
# 1. engine + embeddings already running: :36902 (zen-coder), :11436 (embed)
# 2. responses-proxy (path rewrite):
python3 pkgs/ai/local-runtime/responses-proxy.py &        # :36906 → :36902
# 3. WS proxy (the app derives ws://host:1501 behind the vite proxy):
node pkgs/ai/local-runtime/ws-proxy.js &                  # :1501 → node WS :3701
# 4. a /v1 hanzo-node wired to the proxy (fresh storage, no reg code):
bash pkgs/ai/local-runtime/run-node.sh &                  # API :3700, zen_engine → :36906
# 5. web app pointed at the node + engine (engine-api proxy avoids CORS):
cd pkgs/ai/web && VITE_NODE_API=http://127.0.0.1:3700 VITE_NODE_WS=ws://127.0.0.1:3701 \
  VITE_ENGINE_BASE_URL=/engine-api VITE_ENGINE_API=http://127.0.0.1:36906 \
  bun x vite --config vite.config.ts                      # :1500
# 6. open http://spark.local:1500 → agree → Quick Connect (node address = same
#    origin http://localhost:1500) → /home → chat. Reply streams from zen-coder.
```

## Console — clean (the e2e asserts it)

The earlier web console errors are fixed and guarded by `e2e/chat.e2e.test.ts`:
react-query "data cannot be undefined" (web `invoke` returns null), the
`isPermissionGranted`/notification gap, the `:36900/v1/engine/models` CORS
(routed via the `/engine-api` proxy), the `ws://…:1501` failure (ws-proxy), the
`available_models` 401 (gated `useGetLLMProviders` on auth), and the framer
`motion()` deprecation. Remaining: a rare, intermittent static-asset `404` and a
node-side `Embedding "Query is not read-only"` warning — neither affects chat.

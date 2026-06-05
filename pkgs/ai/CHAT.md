# Live chat wiring (web)

The web app paints; making it **chat** needs a hanzo-node in the request path
(the shinkai architecture: app → node → LLM provider → engine). The pieces and
their verified state on this box (2026-06-05):

## Verified live

- **Engine**: `zen-coder-24b-Q4_K_M` answers on the OpenAI-compatible chat proxy
  `http://localhost:36900` (prompt → `"HANZO CHAT LIVE"`). Embeddings:
  `zen-embedding-0.6B` on `:36901` / bridge `:11436`. (See [[zen_engine_zero_ollama]].)
- **Node**: a healthy node on **`:2000`** (WS `:2001`), identity
  `@@localhost.sep-hanzo`, version **1.1.20**, key `zoo-local-debug-key-2026`,
  `FIRST_DEVICE_NEEDS_REGISTRATION_CODE=false`. It already has the **`zen_engine`
  LLM provider** wired to `http://localhost:36900`
  (`add_llm_provider` → 409 *already exists*).

## The web-side piece (done)

`pkgs/ai/web/vite.config.ts` proxies the app's own origin to the node so the
browser has **no CORS problem** — the app's `nodeAddress` becomes
`http://<host>:1500` and vite forwards:

```
/v2  → VITE_NODE_API  (default http://127.0.0.1:3690)
/ws  → VITE_NODE_WS   (default ws://127.0.0.1:3691)
```

Point `VITE_NODE_API`/`VITE_NODE_WS` at whichever node is healthy.

## The remaining blocker: API version alignment

- The migrated app client (`@hanzo_network/hanzo-message-ts`) calls the **`/v1/node/*`**
  API (e.g. `/v1/node/add_llm_provider`, `/v1/node/get_all_agents`).
- The **healthy** node (`:2000`, 1.1.20) serves **`/v2/*` only** — the `/v1/node/*`
  paths 404 there. So the app, as-is, can't talk to `:2000`.
- The node that speaks `/v1/node/*` is the **desktop's `hanzo-node`** (API port
  `3690`, already configured with `zen_engine` → `:36900`), but it is currently
  **hung** (bound, not serving HTTP — the known startup hang when the embedding
  server hiccups; recovery is a full desktop-app relaunch, see
  [[hanzo_node_embedding_hang]]).

**To finish in-browser chat, pick one:**
1. Revive a `/v1/node/*`-compatible node (relaunch the desktop app so its
   `hanzo-node` serves on `:3690`), set `VITE_NODE_API=http://127.0.0.1:3690`,
   then Quick-Connect the web app (nodeAddress = same origin, key = the node's
   `API_V2_KEY`). Provider already points at the live engine.
2. Or update the app client to the `/v2/*` API and point it at `:2000` (already
   healthy, already has the `zen_engine` provider). Larger code change.

Everything except this version alignment is in place and verified.

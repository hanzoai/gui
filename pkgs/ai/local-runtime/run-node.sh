#!/usr/bin/env bash
# A standalone /v1 hanzo-node wired to the zen engine (via responses-proxy :36906)
# and embeddings (:11436). Fresh storage, no registration code → the web app's
# Quick Connect auto-registers. NODE bin = the desktop build (adjust if needed).
NODE_BIN="${HANZO_NODE_BIN:-$HOME/work/hanzo/desktop/apps/hanzo-desktop/src-tauri/target/debug/hanzo-node}"
export RUST_BACKTRACE=1 \
  NODE_API_IP=0.0.0.0 NODE_API_PORT=3700 NODE_WS_PORT=3701 NODE_IP=127.0.0.1 NODE_PORT=3702 \
  NODE_API_HTTPS_PORT=3703 NODE_ZAP_PORT=3704 \
  GLOBAL_IDENTITY_NAME="@@localhost.sep-hanzo" API_V2_KEY="hanzo-e2e-2026" \
  NODE_STORAGE_PATH="/tmp/hanzo-e2e-storage" \
  EMBEDDINGS_SERVER_URL="http://127.0.0.1:11436" FIRST_DEVICE_NEEDS_REGISTRATION_CODE=false \
  STARTING_NUM_QR_DEVICES=0 LOG_ALL=1 \
  INITIAL_AGENT_NAMES="zen_engine" INITIAL_AGENT_URLS="http://127.0.0.1:36906" \
  INITIAL_AGENT_MODELS="openai:default" INITIAL_AGENT_API_KEYS="local" \
  DEFAULT_EMBEDDING_MODEL="zenlm/zen-embedding-0.6B" EMBEDDING_VECTOR_DIMENSIONS=1024
exec "$NODE_BIN"

#!/usr/bin/env bash
# deprecate-pre-7.sh
#
# Deprecate every published hanzogui / @hanzogui/* version below 7.0.0 in
# one pass. Idempotent — safe to re-run if interrupted.
#
# Lifting deprecation later: `npm deprecate <pkg>@<version> ""` (empty msg).
#
# Requires npm auth — run `npm login` first.

set -euo pipefail

MSG="Use 7.x — synced to upstream hanzogui 2.0.0"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Collect every workspace package whose name is `hanzogui` (bare) or `@hanzogui/*`.
PKGS=$(find "$ROOT/code" -maxdepth 3 -name "package.json" -not -path "*/node_modules/*" \
       | xargs jq -r '.name // empty' \
       | grep -E "^hanzogui$|^@hanzogui/" \
       | sort -u)

count=$(echo "$PKGS" | wc -l)
echo "deprecating $count packages (versions <7.0.0)…"
echo ""

while IFS= read -r pkg; do
  echo "  $pkg <7.0.0"
  npm deprecate "$pkg@<7.0.0" "$MSG"
done <<< "$PKGS"

echo ""
echo "done — $count packages deprecated."

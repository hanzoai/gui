#!/bin/bash

# TypeScript 7 — tsgo, the native Go compiler — typechecks this repo about 5.6x
# faster than tsc 5.9 (34.1s -> 6.0s on apps/kitchen-sink) and reports the same
# diagnostics: 2321 errors at identical file:line:code under both, the only
# difference being TS2882, which tsc does not implement.
#
# Declaration EMIT stays on tsc. hanzogui-build drives the TypeScript compiler
# API programmatically (pkgs/build/hanzogui-build.js `require('typescript')`),
# and @typescript/native-preview ships a binary rather than that API.
#
# Set TYPECHECK_TSC=1 to run the old compiler instead and diff the two.
compiler=tsgo
[ -n "$TYPECHECK_TSC" ] && compiler=tsc

output=$($compiler -b --preserveWatchOutput tsconfig.build.json "$@" 2>&1)
echo "$output"

if echo "$output" | grep -q "error"; then
  echo "‼️ Type check failed"
  exit 1
else
  echo "✅ Type check passed"
fi

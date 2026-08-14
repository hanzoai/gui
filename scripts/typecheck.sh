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

# The compiler's status is the verdict, and it is the only one. This used to
# read the verdict out of the compiler's own prose — `grep -q "error"` over the
# captured output — which calls anything that fails without writing that word a
# pass. A missing compiler is exactly that case: the shell says "command not
# found", the grep misses, and the gate reports green having typechecked
# nothing. Diagnostics now stream as they are produced rather than arriving in
# one block at the end.
$compiler -b --preserveWatchOutput tsconfig.build.json "$@"
status=$?

if [ $status -ne 0 ]; then
  echo "‼️ Type check failed"
  exit $status
fi

echo "✅ Type check passed"

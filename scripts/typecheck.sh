#!/bin/bash

# TypeScript 7 — the native Go compiler — ships under the stable `typescript`
# name with `tsc` as its binary, so `tsc` here IS the fast compiler. This script
# called `tsgo`, the pre-release channel's name for the same binary, which is
# not installed: every `bun run typecheck` died on "command not found".
#
# The compiler's status is the verdict, and it is the only one. This used to
# read the verdict out of the compiler's own prose — `grep -q "error"` over the
# captured output — which calls anything that fails without writing that word a
# pass. A missing compiler is exactly that case: the shell says "command not
# found", the grep misses, and the gate reports green having typechecked
# nothing. Diagnostics now stream as they are produced rather than arriving in
# one block at the end.
tsc -b --preserveWatchOutput tsconfig.build.json "$@"
status=$?

if [ $status -ne 0 ]; then
  echo "‼️ Type check failed"
  exit $status
fi

echo "✅ Type check passed"

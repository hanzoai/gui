#!/usr/bin/env bash
# rename-from-tamagui.sh
#
# Applies the tamagui → hanzogui rename rules to a tree of files.
# Two passes:
#   1. Substitute tokens inside text-file content.
#   2. Rename file/dir paths containing the tokens (basename-only, deepest-first
#      so child paths rename before their parent dirs move).
#
# Usage: rename-from-tamagui.sh <directory>

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <directory>" >&2
  exit 1
fi

DIR="$1"

if [[ ! -d "$DIR" ]]; then
  echo "not a directory: $DIR" >&2
  exit 1
fi

# Pass 1: substitute inside file content. Limit to text-shaped extensions to
# avoid corrupting binaries. Doing content first means renamed paths in pass 2
# don't get their internal references rewritten redundantly.
#
# URL rewrites run BEFORE the bare tamagui→hanzogui substitution so the
# github org/repo names (which don't follow the package rename) get caught
# first; otherwise tamagui/tamagui becomes hanzogui/hanzogui, but the actual
# repo is github.com/hanzoai/gui.
find "$DIR" -type f \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \
     -o -name "*.mjs" -o -name "*.cjs" -o -name "*.json" -o -name "*.md" \
     -o -name "*.yaml" -o -name "*.yml" -o -name "*.html" -o -name "*.css" \
     -o -name "*.d.ts" \) \
  -print0 |
  xargs -0 sed -i '
    s|github\.com/tamagui/tamagui|github.com/hanzoai/gui|g
    s|tamagui\.dev|gui.hanzo.ai|g
    s/Tamagui/Hanzogui/g
    s/tamagui/hanzogui/g
  '

# Pass 2: rename paths. Rename basename only (not the full path) so a renamed
# child doesn't try to move into a parent dir that hasn't been renamed yet.
# -depth lists children before parents, so by the time we rename a directory,
# its children have already had their basenames updated in place.
find "$DIR" -depth \( -name "*Tamagui*" -o -name "*tamagui*" \) -print0 |
  while IFS= read -r -d '' path; do
    dir="$(dirname "$path")"
    base="$(basename "$path")"
    new_base="$(echo "$base" | sed 's/Tamagui/Hanzogui/g; s/tamagui/hanzogui/g')"
    if [[ "$base" != "$new_base" ]]; then
      mv "$path" "$dir/$new_base"
    fi
  done

echo "rename complete"

#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/publish.sh          # bump patch (0.1.0 → 0.1.1)
#   ./scripts/publish.sh minor    # bump minor (0.1.0 → 0.2.0)
#   ./scripts/publish.sh major    # bump major (0.1.0 → 1.0.0)
#   ./scripts/publish.sh 2.0.0    # exact version

VERSION="${1:-patch}"

# Ensure clean working tree
if [ -n "$(git status --porcelain)" ]; then
  echo "error: working tree is dirty — commit or stash first" >&2
  exit 1
fi

# Build first
echo "Building..."
pnpm build

# Bump version
npm version "$VERSION" --no-git-tag-version

NEW_VERSION=$(node -p "require('./package.json').version")
echo "Publishing @hanzo/gui@$NEW_VERSION"

# Commit, tag, publish
git add package.json
git commit -m "v$NEW_VERSION"
git tag "v$NEW_VERSION"
npm publish --access public

echo ""
echo "Published @hanzo/gui@$NEW_VERSION"
echo "Run 'git push && git push --tags' to push to origin."

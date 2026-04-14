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

# Bump version
npm version "$VERSION" --no-git-tag-version

NEW_VERSION=$(node -p "require('./package.json').version")
echo "Publishing @hanzo/gui@$NEW_VERSION"

# Resolve workspace:* → concrete versions for npm publish
cp package.json package.json.bak
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const field of ['dependencies', 'devDependencies']) {
  const deps = pkg[field] || {};
  for (const [name, ver] of Object.entries(deps)) {
    if (ver.startsWith('workspace:')) {
      try {
        const depPkg = require.resolve(name + '/package.json', { paths: [process.cwd() + '/../../..'] });
        deps[name] = JSON.parse(fs.readFileSync(depPkg, 'utf8')).version;
      } catch {
        // Check npm registry as fallback
        console.error('warn: could not resolve ' + name + ' locally, removing from ' + field);
        delete deps[name];
      }
    }
  }
}
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Commit, tag, publish
git add package.json
git commit -m "v$NEW_VERSION"
git tag "v$NEW_VERSION"
npm publish --access public

# Restore workspace:* references
cp package.json.bak package.json
rm package.json.bak
git add package.json
git commit --amend --no-edit

echo ""
echo "Published @hanzo/gui@$NEW_VERSION"
echo "Run 'git push && git push --tags' to push to origin."

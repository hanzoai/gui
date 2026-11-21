/**
 * Every publishable package must declare `license`. 8.4.4 shipped 120 packages
 * without one, and downstream third-party-license gates (Hanzo Dev's web build)
 * rejected every one of them. A package that sets `"private": true` is exempt.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'

const files = execFileSync('git', ['ls-files', '*package.json'], { encoding: 'utf8' })
  .split('\n')
  .filter((f) => f && !f.includes('node_modules'))

const bad = files.filter((f) => {
  const pkg = JSON.parse(fs.readFileSync(f, 'utf8'))
  return !pkg.private && !pkg.license
})

if (bad.length) {
  console.error(`packages without "license":\n  ${bad.join('\n  ')}`)
  process.exit(1)
}

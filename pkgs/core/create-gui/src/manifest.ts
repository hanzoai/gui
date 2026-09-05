import { readFileSync } from 'node:fs'
import { url } from './here.ts'

// This package's own manifest, read from the package root at run time.
export const packageJson = JSON.parse(
  readFileSync(new URL('../../package.json', url), 'utf8')
) as {
  name: string
  version: string
}

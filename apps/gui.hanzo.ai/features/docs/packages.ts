/**
 * The packages the API reference covers, in the order it lists them.
 *
 * Data only, so both halves can name the same list: `api.ts` reads each
 * package's declarations on the server, and the sidebar links to each page in
 * the browser.
 */
export const packages = [
  '@hanzogui/core',
  '@hanzogui/web',
  '@hanzo/gui',
  '@hanzogui/static',
  '@hanzogui/cli',
  '@hanzogui/config',
]

/** A package name as a route segment: `@hanzogui/core` is `hanzogui-core`. */
export const id = (name: string): string => name.replace('@', '').replaceAll('/', '-')

/** Where a package's reference lives. */
export const route = (name: string): string => `/api/${id(name)}`

/** The package a route segment names. */
export const named = (slug: string): string => {
  const name = packages.find((p) => id(p) === slug)
  if (!name) throw new Error(`no documented package at /api/${slug}`)
  return name
}

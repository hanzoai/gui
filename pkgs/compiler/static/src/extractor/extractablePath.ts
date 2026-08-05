/**
 * One place decides which files the compiler may read styles out of.
 *
 * The compiler used to answer this with `sourcePath.includes('node_modules')`,
 * in two places that had to agree by hand — the webpack loader and
 * extractToClassNames. That answer was right about the cost and wrong about
 * the design system: for a *consumer*, `@hanzo/ui` and every `@hanzogui/*`
 * package IS node_modules, so no app could ask the compiler to look at them
 * even if it wanted to.
 *
 * So this is a policy with a knob, not a hardcoded skip. The knob is
 * `extractPackages`, and it is EMPTY by default, which is exactly the old
 * behavior. What turning it on buys, measured on hanzo.one (Vite 5, @hanzo/ui
 * 8.0.63 on @hanzo/gui 8.1, 5026 modules):
 *
 *   extracted files            4 -> 54
 *   cached sheet         150,172 -> 151,151 B   (+979)
 *   CSS injected at runtime  27,376 -> 27,376 B (unchanged, 356 rules both)
 *
 * Every one of those 979 bytes is a `styled()` DEFINITION rule, and the
 * compiler deliberately leaves the definition in place ("the runtime needs
 * real values for animations, context, and group styles"), so the runtime
 * mints the same class again. 10 of the 20 new rules are delivered twice on
 * the home route; the rest are for components that route never renders. The
 * saving that would justify the cost — flattening a `<YStack p={10}>` usage
 * site down to a className — cannot happen inside an installed package at all,
 * because `module:jsx` currently emits the same JSX-lowered output as the ESM
 * build (byte-identical, hardlinked), so there is no JSX left to flatten.
 *
 * Fix that, and turning this on becomes a real win. Until then, an app can opt
 * in with `extractPackages: DEFAULT_EXTRACT_PACKAGES` and get a slightly
 * bigger sheet for its trouble.
 */

/** The design-system allowlist an app can opt into. Not the default. */
export const DEFAULT_EXTRACT_PACKAGES = ['@hanzo/ui', '@hanzo/gui', '@hanzogui/*']

/**
 * Generated icon sets: 1760 modules of react-native-svg elements wrapped in
 * `themed()`, holding no `styled()` between them. Parsing them costs a full
 * babel pass each and yields no CSS, installed or in a workspace — which is
 * why the path is skipped rather than the package name. Measured on the same
 * build: 1761 files that the allowlist would otherwise have to reject one at
 * a time.
 */
const NEVER_EXTRACT = ['lucide-icons']

const NODE_MODULES = 'node_modules/'

/**
 * The installed package a file belongs to, or '' when the file is app or
 * workspace source. Reads the LAST `node_modules/` segment, so a nested
 * install and pnpm's `.pnpm/<pkg>@<ver>/node_modules/<pkg>` both name the
 * package that actually owns the file.
 */
export function installedPackageOf(sourcePath: string): string {
  const normalized = sourcePath.replace(/\\/g, '/')
  const at = normalized.lastIndexOf(NODE_MODULES)
  if (at === -1) return ''
  const rest = normalized.slice(at + NODE_MODULES.length)
  const parts = rest.split('/')
  if (!parts[0]) return ''
  return parts[0].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

/**
 * An entry names one package (`@hanzo/ui`) or a whole scope (`@hanzogui/*`,
 * or the equivalent `@hanzogui/`).
 */
function matches(entry: string, pkg: string): boolean {
  const prefix = entry.endsWith('/*') ? entry.slice(0, -1) : entry.endsWith('/') ? entry : ''
  return prefix ? pkg.startsWith(prefix) : pkg === entry
}

/** May the compiler read styles out of this file? */
export function isExtractable(sourcePath: string, extractPackages: string[] = []): boolean {
  if (NEVER_EXTRACT.some((name) => sourcePath.includes(name))) return false
  const pkg = installedPackageOf(sourcePath)
  if (!pkg) return true
  return extractPackages.some((entry) => matches(entry, pkg))
}

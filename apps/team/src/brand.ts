/*
 * Which brand a host serves.
 *
 * Shared infrastructure white-labels by domain, so the mark and the name are a
 * function of the hostname and nothing else — never a build flag, never a
 * constant in a component.
 *
 * Fail closed. An unrecognized host resolves to `undefined`, and the chrome then
 * renders no mark at all. Defaulting an unknown host to Hanzo is precisely the
 * bug this shape prevents: it is how one brand's mark ends up on another's host.
 *
 * `@hanzogui/shell`'s `findSurfaceByHost` cannot be reused here, and that is
 * worth stating because it looks like it should be. Its surface list keys one
 * host per surface (`hanzo.team`) and then falls back to the longest matching
 * suffix, so `team.hanzo.ai` and `tracker.hanzo.ai` both match `hanzo.ai` and
 * resolve to brandName "Hanzo". tests/brand.spec.ts pins that they must not.
 */

/** The org whose brand is being rendered. Decides the mark. */
export type Org = 'hanzo' | 'lux' | 'zoo'

export interface Brand {
  /** Stable id — also the active-surface key in the app switcher. */
  id: string
  /** Name shown beside the mark. */
  name: string
  org: Org
  /** Every host this brand serves. Exact match wins; then longest dot-boundary suffix. */
  hosts: readonly string[]
}

/**
 * `localhost` and `127.0.0.1` are listed deliberately. A dev host is a known
 * host, not a reason to weaken the fallback.
 */
export const BRANDS: readonly Brand[] = [
  { id: 'team', name: 'Hanzo Team', org: 'hanzo', hosts: ['hanzo.team', 'team.hanzo.ai', 'localhost', '127.0.0.1'] },
  { id: 'tracker', name: 'Tracker', org: 'hanzo', hosts: ['tracker.hanzo.ai'] },
  { id: 'lux', name: 'Lux Team', org: 'lux', hosts: ['team.lux.network'] },
  { id: 'zoo', name: 'Zoo Team', org: 'zoo', hosts: ['team.zoo.ngo'] },
]

/**
 * Resolve the brand for a hostname, or `undefined` when no brand claims it.
 * Exact match first, so a specific host is never swallowed by a broader one.
 */
export function brandFor(host: string | undefined): Brand | undefined {
  if (host === undefined || host === '') return undefined
  const h = host.toLowerCase().replace(/^www\./, '').replace(/:\d+$/, '')

  for (const brand of BRANDS) if (brand.hosts.includes(h)) return brand

  let best: Brand | undefined
  let length = 0
  for (const brand of BRANDS) {
    for (const candidate of brand.hosts) {
      if (h.endsWith(`.${candidate}`) && candidate.length > length) {
        best = brand
        length = candidate.length
      }
    }
  }
  return best
}

import { MARK_PATHS, MARK_VIEWBOX } from '@hanzo/logo'
import type { Brand } from '~/src/brand'

/*
 * The brand mark, from the brand pack.
 *
 * The geometry comes from `@hanzo/logo` — the app holds no path data of its own,
 * so a brand change is a package bump rather than an edit here.
 *
 * The pack ships ONE mark, Hanzo's. So a brand belonging to any other org has no
 * mark available and renders its wordmark instead. That is the whole white-label
 * guarantee, and it holds structurally rather than by remembering to check:
 * there is no code path that can put Hanzo's mark on a Lux or Zoo host, because
 * the mark is selected by `brand.org` and only `hanzo` has one.
 *
 * This owns the ENTIRE lockup — glyph and name together — so exactly one place
 * decides how a brand presents itself. Splitting it, with a caller rendering the
 * name alongside, is what produced "Lux Team Lux Team": the wordmark already IS
 * the name, and a caller cannot know that without re-deciding it.
 */
export function Mark({ brand, size = 22 }: { brand: Brand | undefined; size?: number }) {
  // Unknown host — no brand claims it, so show nothing rather than a guess.
  if (brand === undefined) return null

  // No glyph for this org: the name is the mark.
  if (brand.org !== 'hanzo') {
    return (
      <span data-mark={brand.org} className="truncate text-sm font-semibold tracking-tight">
        {brand.name}
      </span>
    )
  }

  return (
    <>
      <svg
        data-mark="hanzo"
        width={size}
        height={size}
        viewBox={MARK_VIEWBOX}
        aria-hidden="true"
        className="shrink-0 fill-foreground"
        // Static markup from the brand pack, not input.
        dangerouslySetInnerHTML={{ __html: MARK_PATHS }}
      />
      <span className="truncate text-sm font-semibold tracking-tight">{brand.name}</span>
    </>
  )
}

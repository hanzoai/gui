import type { GetProps } from '@hanzogui/core'
import { View, getTokenValue, styled } from '@hanzogui/core'

/**
 * Grid — the fourth stack. XStack is a row, YStack a column, ZStack a pile,
 * Grid is two axes at once.
 *
 * The tracks come from the CONTAINER, never the children. That is the whole
 * difference from a wrapping row of `width="calc(25% - 7.5px)"` children: each
 * child there computes its own width, so the row is only even while every child
 * agrees, and one long word makes it ragged. Here no child can widen its track.
 *
 * It renders a `View`, so it is a gui box like any other — themes, tokens, media
 * queries, `$platform-native`. Native has no grid engine, so `display: grid`
 * crosses as `display: flex` (`expandStyle`) and the track props are dropped;
 * the wrapping row below is the honest degradation of an auto-fit grid, and it
 * is declared here rather than left to chance.
 */

/** `'$3'` -> 12. A raw number is px. Only the `max` arithmetic needs the number. */
const px = (v: unknown, fallback: number): number => {
  if (typeof v === 'number') return v
  if (typeof v !== 'string') return fallback
  const t = getTokenValue(v as never, 'space')
  return typeof t === 'number' ? t : fallback
}

/**
 * A track list, in the spellings a caller actually has. Every one of these is
 * `grid-template-columns` / `grid-template-rows`.
 *
 *   3                 three equal tracks
 *   ['2fr', '1fr']    one entry per track; a number is px
 *   'repeat(3, 1fr)'  a track list, as written
 */
export type Tracks = number | string | Array<number | string>

/**
 * The one shape a plain track list cannot say: "as many equal columns as fit,
 * and no fewer than this wide". Still a track list — `repeat(auto-fill,
 * minmax(…, 1fr))` — it just needs two numbers to write itself, so it is a
 * VALUE of `columns` rather than a second prop beside it. No breakpoints.
 */
export interface Fit {
  /** Narrowest a column may get before the grid drops one. */
  min: number
  /**
   * Never exceed this many columns, while still wrapping down on narrow
   * screens. `{ min: 160, max: 4 }` is 2-up on a phone and 4-up on a desktop.
   * A single `min` cannot say that: 2-up at 390px needs min ~170, and that same
   * 170 gives SIX columns at 1280.
   */
  max?: number
}

const isFit = (v: unknown): v is Fit =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/** One track. A bare number is px; anything else is already a track size. */
const track = (v: number | string): string => (typeof v === 'number' ? `${v}px` : v)

/**
 * A track list from any of its spellings.
 *
 * A count becomes `minmax(0, 1fr)` and NOT `1fr`, because `1fr` alone means
 * `minmax(auto, 1fr)`, and `auto` floors the track at the content's min-content
 * width — so one long unbroken string pushes its own column wider and every
 * sibling narrower. That IS the ragged row this component exists to prevent.
 */
const list = (t: Tracks): string => {
  if (typeof t === 'number') return `repeat(${t}, minmax(0, 1fr))`
  if (Array.isArray(t)) return t.map(track).join(' ')
  return t
}

/**
 * The responsive list. `min(Npx, 100%)` is what makes it safe below N: a bare
 * `minmax(240px, 1fr)` forces a 240px track inside a 200px phone and overflows
 * the viewport sideways.
 *
 * With `max` the floor also has to be at least "one Mth of the row", so
 * auto-fill can never fit an (M+1)th track: subtract the M-1 gaps first, then
 * divide. Below that width the max() picks Npx again and the grid wraps
 * normally — the cap costs nothing on small screens, which is the point of
 * expressing it as a floor rather than a breakpoint.
 */
const fitted = ({ min, max }: Fit, gap: number): string =>
  `repeat(auto-fill, minmax(${
    max
      ? `max(min(${min}px, 100%), calc((100% - ${(max - 1) * gap}px) / ${max}))`
      : `min(${min}px, 100%)`
  }, 1fr))`

/**
 * Any spelling of `columns` to the one track list it means. Exported because it
 * IS the component's decision, and because the two invariants inside it
 * (`minmax(0, 1fr)` over a bare `1fr`, `min(Npx, 100%)` over a bare `Npx`) are
 * each one tidy-up away from the ragged row.
 */
export const tracks = (columns: Tracks | Fit, gap = 0): string =>
  isFit(columns) ? fitted(columns, gap) : list(columns)

const GridFrame = styled(View, {
  display: 'grid',
  // A grid on native is a flex box, and a single column is rarely what an
  // auto-fit grid meant. Two-axis placement does not survive the crossing.
  '$platform-native': {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})

export type GridProps = Omit<GetProps<typeof GridFrame>, 'columns' | 'rows'> & {
  /** The column tracks. A count, a list, a raw track list, or a `Fit`. */
  columns?: Tracks | Fit
  /** The row tracks. Rows size to content unless you say otherwise. */
  rows?: Tracks
}

export const Grid = ({ columns = { min: 240 }, rows, gap = '$3', ...rest }: GridProps) => (
  <GridFrame
    // The token goes through as a token, so the gap stays themeable; the number
    // is read separately and only for the `max` arithmetic, which needs one.
    gap={gap}
    gridTemplateColumns={tracks(columns, px(gap, 12))}
    {...(rows === undefined ? null : { gridTemplateRows: list(rows) })}
    {...rest}
  />
)

Grid['displayName'] = 'Grid'

/** A cell only exists to span or to place; a plain child needs neither. */
const place = (v: number | string | undefined): string | undefined =>
  v === undefined ? undefined : typeof v === 'number' ? `span ${v}` : v

export type CellProps = Omit<GetProps<typeof View>, 'col' | 'row'> & {
  /**
   * Where this cell sits across the columns, as `grid-column`. A NUMBER spans
   * that many tracks (`span 2`); a string places it (`'1 / 3'`, `'2 / -1'`).
   * One name per axis, because CSS already has one.
   */
  col?: number | string
  /** The same, down the rows, as `grid-row`. */
  row?: number | string
}

export const Cell = ({ col, row, ...rest }: CellProps) => (
  <View gridColumn={place(col)} gridRow={place(row)} {...rest} />
)

Cell['displayName'] = 'Cell'

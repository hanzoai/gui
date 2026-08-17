'use client'

/**
 * MARKS — the shell's one set of line-marks, and the only place a shape is drawn.
 *
 * Every mark the chrome uses comes from here: the 9-dot launcher's tiles, the
 * doors behind the primary action, the rows of the header's nav cards, and the
 * rows of the Meet Hanzo drape. They were three sets before — the launcher held
 * twenty-one of its own, the drape and the cards held none — so the same product
 * was a shape in one menu and bare text in the next.
 *
 * Inline paths, no icon package: the shell's contract is inline styles + theme
 * tokens with React as the only runtime dep, and it must drop into a Next, Vite
 * or vanilla host with zero setup. One `svg()` helper, one stroke weight, one
 * 24-box, so a mark reads the same at 16px in a row and at 20px in a tile.
 *
 * A row NAMES its mark (`HanzoLink.glyph`); it never carries an element. The
 * registry is data — a `.ts` module cannot hold a `.tsx` value — and a host that
 * could pass its own element would give one menu a shape no other menu can draw.
 */
import React from 'react'

const svg = (children: React.ReactNode) =>
  function Mark({ size = 20 }: { size?: number }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    )
  }

export const MARKS = {
  chat: svg(<path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />),
  blocks: svg(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.4" />
      <rect x="14" y="3" width="7" height="7" rx="1.4" />
      <rect x="3" y="14" width="7" height="7" rx="1.4" />
      <rect x="14" y="14" width="7" height="7" rx="1.4" />
    </>
  ),
  users: svg(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6M17.5 20a5.5 5.5 0 0 0-3-4.9" />
    </>
  ),
  studio: svg(
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="M12 8.2 13.4 11l2.8 1-2.8 1L12 15.8 10.6 13l-2.8-1 2.8-1z" />
    </>
  ),
  bot: svg(
    <>
      <path d="M12 4V2" />
      <rect x="4" y="7" width="16" height="12" rx="2.5" />
      <path d="M2 13h2M20 13h2M9 12v1M15 12v1" />
      <path d="M9.5 16.5h5" />
    </>
  ),
  cloud: svg(<path d="M17.5 19H8a5 5 0 1 1 1.2-9.86A6 6 0 0 1 21 11a4 4 0 0 1-3.5 8Z" />),
  code: svg(
    <>
      <path d="m9 8-4 4 4 4" />
      <path d="m15 8 4 4-4 4" />
    </>
  ),
  /* Base — a data store. Three stacked discs is the shape every database in every
     icon set uses, so it is the one a reader already knows. */
  base: svg(
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
    </>
  ),
  /* SDKs — a package. Not braces: braces say "code", and every door in this menu
     is code; what an SDK is, is a thing you install. */
  package: svg(
    <>
      <path d="M12 2.6 20.5 7v10L12 21.4 3.5 17V7z" />
      <path d="M3.5 7 12 11.5 20.5 7M12 11.5V21.4" />
    </>
  ),
  /* All downloads — the arrow into a tray, which is what a download IS. */
  download: svg(
    <>
      <path d="M12 3v11" />
      <path d="m7.5 10 4.5 4.5L16.5 10" />
      <path d="M4 17.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
    </>
  ),
  globe: svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18" />
    </>
  ),
  search: svg(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>
  ),
  terminal: svg(
    <>
      <path d="m5 8 4 4-4 4" />
      <path d="M13 16h6" />
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
    </>
  ),
  gateway: svg(
    <>
      <rect x="9" y="3" width="6" height="6" rx="1.2" />
      <rect x="3" y="15" width="6" height="6" rx="1.2" />
      <rect x="15" y="15" width="6" height="6" rx="1.2" />
      <path d="M12 9v3M6 15v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </>
  ),
  layers: svg(
    <>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  monitor: svg(
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  puzzle: svg(
    <path d="M9 4.5a1.5 1.5 0 0 1 3 0V6h3a1 1 0 0 1 1 1v3h1.5a1.5 1.5 0 0 1 0 3H16v3a1 1 0 0 1-1 1h-3v-1.5a1.5 1.5 0 0 0-3 0V20H6a1 1 0 0 1-1-1v-3H3.5a1.5 1.5 0 0 1 0-3H5V7a1 1 0 0 1 1-1h3z" />
  ),
  user: svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 19a5.5 5.5 0 0 1 11 0" />
    </>
  ),
  card: svg(
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  shield: svg(<path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />),
  /* Enso — the circle, drawn open at the top the way the brand draws it. */
  circle: svg(<path d="M14.5 4.4a8.5 8.5 0 1 0 4.2 4.6" />),
  cpu: svg(
    <>
      <rect x="5" y="5" width="14" height="14" rx="2.5" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  plug: svg(
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M6 8h12v4a6 6 0 0 1-12 0z" />
      <path d="M12 18v3" />
    </>
  ),
  book: svg(
    <>
      <path d="M12 7v13" />
      <path d="M12 7a4 4 0 0 0-4-4H3v14h5a4 4 0 0 1 4 3" />
      <path d="M12 7a4 4 0 0 1 4-4h5v14h-5a4 4 0 0 0-4 3" />
    </>
  ),
  rocket: svg(
    <>
      <path d="M12 2.5c3 2.4 4.5 5.6 4.5 9L12 16l-4.5-4.5c0-3.4 1.5-6.6 4.5-9z" />
      <circle cx="12" cy="9.5" r="1.6" />
      <path d="M9 16c-1.6.7-2.5 2.3-2.5 4.5C8.7 20.5 10.3 19.6 11 18M15 16c1.6.7 2.5 2.3 2.5 4.5-2.2 0-3.8-.9-4.5-2.5" />
    </>
  ),
  /* Learn — a mortarboard. */
  cap: svg(
    <>
      <path d="m12 4 9 4-9 4-9-4z" />
      <path d="M6.5 10v4.5c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3V10" />
      <path d="M21 8v5" />
    </>
  ),
  /* Status — a heartbeat, which is what a status page reports. */
  pulse: svg(<path d="M2.5 12H7l2.5-6 4.5 12 2.5-6h5" />),
  /* Support — a life ring. */
  ring: svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="m5.6 5.6 3.9 3.9M18.4 5.6l-3.9 3.9M18.4 18.4l-3.9-3.9M5.6 18.4l3.9-3.9" />
    </>
  ),
  /* Templates — a page whose layout is already decided. */
  template: svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  gamepad: svg(
    <>
      <path d="M8.5 8h7a5 5 0 0 1 5 5v2.5a2.5 2.5 0 0 1-4.5 1.5l-1-1.3h-6l-1 1.3A2.5 2.5 0 0 1 3.5 15.5V13a5 5 0 0 1 5-5z" />
      <path d="M7 12.5h2.6M8.3 11.2v2.6" />
      <path d="M15.5 12h.01M17.5 14h.01" />
    </>
  ),
  /* Resources — the spark. The mark hanzo.app already gives Resources in its
     rail and its ⌘K palette, so the word wears one shape everywhere. */
  spark: svg(
    <>
      <path d="M11 3.5 12.6 8.4 17.5 10l-4.9 1.6L11 16.5 9.4 11.6 4.5 10l4.9-1.6z" />
      <path d="M18 15.5 18.8 17.7 21 18.5l-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
} as const

/** Every mark a row or a tile may name. */
export type GlyphName = keyof typeof MARKS

const SIZE = 16

/**
 * One mark on a menu row, in the row's own colour — so it brightens with the
 * label under the pointer instead of sitting at a fixed brightness beside it.
 *
 * Nothing at all when the row names nothing — UNLESS a sibling has a mark.
 *
 * Both failure modes here are real and they are opposites, which is why this
 * takes a group and not a preference. An empty box that always takes its width
 * reads as an indent with no cause: it once pushed Features and Enterprise 24px
 * right of the rows above them to reserve a column for marks that were never
 * coming. But returning nothing in a group where SOME rows have marks leaves a
 * ragged left edge — measured on hanzo.app's sheet, where Products and
 * Resources carry marks and Features, Business and Pricing do not, so five
 * labels started at two different x positions.
 *
 * `reserve` is the group's answer, not the row's: hold the column when any
 * sibling has a mark, and the indent always has a visible cause standing next
 * to it. A group with no marks at all stays flush left, which is the case the
 * empty box got wrong.
 */
export function Glyph({
  name,
  reserve = false,
}: {
  name?: GlyphName
  reserve?: boolean
}) {
  const Mark = name ? MARKS[name] : undefined
  if (!Mark) {
    return reserve ? (
      <span
        aria-hidden="true"
        style={{ display: 'inline-flex', flexShrink: 0, width: SIZE }}
      />
    ) : null
  }
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        flexShrink: 0,
        // The mark sits on the FIRST line of a row that may have two (a
        // product's name over its tagline).
        marginTop: 1,
        opacity: 0.9,
      }}
    >
      <Mark size={SIZE} />
    </span>
  )
}

/** The row layout a mark implies: mark, then label, aligned on the first line. */
export const glyphRow = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
} as const

/**
 * The outbound arrow. A link that leaves the property says so before it is
 * clicked, rather than surprising the reader with a new tab.
 *
 * It rides the label's own font size and inherits its colour, so it reads as
 * punctuation on the word rather than as an icon beside it.
 */
export function Outlink() {
  return (
    <svg
      aria-hidden="true"
      width="0.75em"
      height="0.75em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        display: 'inline-block',
        marginLeft: '0.28em',
        verticalAlign: 'middle',
        opacity: 0.7,
      }}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

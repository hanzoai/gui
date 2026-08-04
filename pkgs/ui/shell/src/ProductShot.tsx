'use client'

/**
 * ProductShot — the ONE frame every Hanzo surface presents a product screenshot in.
 *
 *   ┌───────────────────────────────────────────────┐
 *   │                                               │  hairline, card radius,
 *   │           the captured product UI             │  true-black ground
 *   │                                               │
 *   └───────────────────────────────────────────────┘
 *     caption (optional, dim, sentence case)
 *
 * Why this lives in the shell and not in a page: a screenshot has to look
 * IDENTICAL on the landing hero, on a category page and in a docs callout, or
 * the product reads as three products. Hand-rolling the frame per surface is
 * exactly how the nav drifted into two headers. One seam, so a change to the
 * shot treatment reaches every surface at once.
 *
 * It carries three things a bare <img> does not:
 *
 *   1. ART DIRECTION. Shots are captured twice — a 2880x1800 desktop plate and a
 *      1170x2532 phone plate — so a phone gets the phone UI rather than a
 *      desktop UI scaled to illegibility. `<picture>` picks one; neither
 *      browser downloads both.
 *   2. NO LAYOUT SHIFT. `width`/`height` are the plate's INTRINSIC pixels, so
 *      the box reserves its ratio before the bytes land. Lazy-loading without
 *      that is what makes a page jump as it is scrolled.
 *   3. LAZY BY DEFAULT. Everything defers except `priority`, which is for the
 *      hero and only the hero — a lazy hero arrives after its reader.
 *
 * HOUSE RULES, inherited rather than re-derived: monochrome, no all-caps, no
 * underline, no hover background. A shot is not interactive and has no hover
 * state at all; when `href` makes the frame a link it answers the pointer on its
 * BORDER (`CHROME.border` -> `ACCENT_SOFT`), which is the rule MeetHanzoMenu's
 * product card and the products drape already follow.
 */
import React from 'react'
import { ACCENT_SOFT, CHROME, FS, R } from './theme'

export interface ProductShotPlate {
  /** URL of the plate. */
  src: string
  /** INTRINSIC pixel width (2880 for the @2x desktop capture, 1170 for @3x phone). */
  width: number
  /** INTRINSIC pixel height (1800 desktop, 2532 phone). */
  height: number
  /**
   * Device pixel ratio the plate was captured at — 2 desktop, 3 phone. Used to
   * state the plate's CSS size in `sizes`, so a browser can decline the download
   * when the slot is narrower than the plate.
   */
  dpr?: number
}

export interface ProductShotProps {
  /** The desktop plate. Required — it is the fallback every browser understands. */
  desktop: ProductShotPlate
  /**
   * The phone plate. Optional: without it the desktop plate serves every width,
   * which is right for a shot that is already wide-and-short.
   */
  mobile?: ProductShotPlate
  /**
   * What is actually visible. REQUIRED and never decorative — a product shot
   * carries the product's claim, so a reader who cannot see it must still get it.
   */
  alt: string
  /** Optional line under the frame. Sentence case. */
  caption?: string
  /** Eager + high priority. Set ONLY above the fold. */
  priority?: boolean
  /** Below this viewport width the phone plate is used. */
  mobileBreakpoint?: number
  /** Make the whole frame a link to the live surface. */
  href?: string
  /** Cap the rendered width. Defaults to the container's. */
  maxWidth?: number | string
  className?: string
  style?: React.CSSProperties
}

/** A plate's CSS width: 2880 captured at dpr 2 is a 1440px image. */
const cssWidth = (p: ProductShotPlate) => Math.round(p.width / (p.dpr ?? 1))

export function ProductShot({
  desktop,
  mobile,
  alt,
  caption,
  priority = false,
  mobileBreakpoint = 640,
  href,
  maxWidth,
  className,
  style,
}: ProductShotProps) {
  const plate: React.CSSProperties = {
    display: 'block',
    // The one thing that stops a 2880px plate widening the page. Verified at
    // 1440 and 390: horizontal overflow 0.
    width: '100%',
    height: 'auto',
    boxSizing: 'border-box',
    borderRadius: R.card,
    border: `1px solid ${CHROME.border}`,
    background: CHROME.panel,
    // Hairline + radius only. No shadow, no glow, no perspective — the shot is
    // the product, not an illustration of one.
    transition: 'border-color 140ms ease',
  }

  const img = (
    <picture>
      {mobile ? (
        <source
          media={`(max-width: ${mobileBreakpoint}px)`}
          srcSet={mobile.src}
          width={mobile.width}
          height={mobile.height}
        />
      ) : null}
      <img
        src={desktop.src}
        alt={alt}
        width={desktop.width}
        height={desktop.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // Lowercase `fetchpriority` is the HTML attribute; React's typings only
        // learned `fetchPriority` recently, and the cast keeps this building on
        // both. It is what makes the hero plate outrank the rest of the images.
        {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
        sizes={`(max-width: ${mobileBreakpoint}px) 100vw, ${cssWidth(desktop)}px`}
        style={plate}
      />
    </picture>
  )

  return (
    <figure
      data-hanzo-shell=""
      className={className}
      style={{
        display: 'block',
        margin: 0,
        width: '100%',
        maxWidth: maxWidth ?? '100%',
        boxSizing: 'border-box',
        fontFamily: CHROME.font,
        ...style,
      }}
    >
      {href ? (
        <a
          href={href}
          style={{ display: 'block', textDecoration: 'none' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget.querySelector('img')
            if (el) el.style.borderColor = ACCENT_SOFT
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget.querySelector('img')
            if (el) el.style.borderColor = CHROME.border
          }}
        >
          {img}
        </a>
      ) : (
        img
      )}
      {caption ? (
        <figcaption
          style={{
            marginTop: 10,
            fontSize: FS.sm,
            // Dim. The shot ranks itself; the caption does not compete with it.
            color: CHROME.fgDim,
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

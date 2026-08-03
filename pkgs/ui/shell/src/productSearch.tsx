'use client'

/**
 * Product search — the ONE filter and the ONE field the Products surfaces share.
 *
 * The cloud taxonomy is ~97 primitives across ten categories. That is too many
 * to scan, so both surfaces that render it (the desktop `ProductsMegaMenu` and
 * the mobile sheet's accordion) narrow it with the same predicate and the same
 * input. Defining either twice would let the two drift into answering the same
 * query differently, which is the one thing a search must never do.
 */
import React from 'react'
import { type ProductCategory } from './hanzo-registry'
import { CHROME, FS, R, TAP_H } from './theme'

/**
 * Narrow the taxonomy to what matches `query`.
 *
 * A category survives if its OWN name matches (then it keeps all its leaves —
 * searching "network" should show the Network category whole) or if any leaf
 * matches (then it keeps just those). An empty query is the identity, so callers
 * can render the result unconditionally.
 *
 * Leaves are matched on label and `hint`, and on NOTHING structural. An earlier
 * version dropped "the leaf pointing at the category's own href", meaning to
 * drop the appended "All N →" row; hanzo.ai's AI category has a real product
 * (Rerank) pointing there too because it has no page yet, so that rule silently
 * hid a product from search. A menu may not decide a leaf is not a product.
 */
export function filterProducts(
  categories: ProductCategory[],
  query: string
): ProductCategory[] {
  const q = query.trim().toLowerCase()
  if (!q) return categories

  const out: ProductCategory[] = []
  for (const category of categories) {
    if (category.label.toLowerCase().includes(q)) {
      out.push(category)
      continue
    }
    const hits = category.items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || !!item.hint?.toLowerCase().includes(q)
    )
    if (hits.length > 0) out.push({ ...category, items: hits })
  }
  return out
}

export interface ProductSearchProps {
  value: string
  onChange: (value: string) => void
  inputRef?: React.Ref<HTMLInputElement>
  /** Grows the field to the touch floor on the mobile sheet. */
  touch?: boolean
}

/**
 * The field: one input, a glyph, and nothing else — no chips, no dropdown, no
 * result count competing with the results themselves. Focus is drawn by the
 * shell's one focus ring (shellStyles puts it on this label rather than on the
 * input inside it), so the field carries no second focus treatment of its own.
 */
export function ProductSearch({ value, onChange, inputRef, touch }: ProductSearchProps) {
  return (
    // A <label>, not a <div>: the input sits inside a border and so is 2px
    // shorter than the field, which would put it under the touch floor. Wrapping
    // makes the WHOLE control the tap target — anywhere in the 44px box focuses
    // the input — instead of padding the input until a number passes.
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: touch ? TAP_H : 34,
        padding: '0 10px',
        borderRadius: R.row,
        border: `1px solid ${CHROME.border}`,
        color: CHROME.fgMuted,
      }}
    >
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flex: '0 0 auto' }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: CHROME.fg,
          fontFamily: 'inherit',
          fontSize: FS.sm,
        }}
      />
    </label>
  )
}

/** The one calm line an empty result set gets. */
export function NoResults({ query }: { query: string }) {
  return (
    <p style={{ margin: 0, padding: '10px 0', fontSize: FS.sm, color: CHROME.fgMuted }}>
      No products match “{query.trim()}”.
    </p>
  )
}

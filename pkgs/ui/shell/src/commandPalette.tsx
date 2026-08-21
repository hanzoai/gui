'use client'

/**
 * Command palette — the ONE palette frame in the shell.
 *
 *   ┌────────────────────────────────┐
 *   │ Filter   Ask AI            ESC │  ← header (modes, or just the hint)
 *   ├────────────────────────────────┤
 *   │ ⌕  search products…            │  ← field
 *   ├────────────────────────────────┤
 *   │ Ai                             │  ← grouped rows, selection in brightness
 *   │   Models                       │
 *   ├────────────────────────────────┤
 *   │ ↑↓ navigate  ↵ select      ⌘K  │  ← footer
 *   └────────────────────────────────┘
 *
 * Two palettes render this: `HanzoCommandPalette` (public header — the products
 * taxonomy + Ask AI) and `TenantCommandPalette` (signed-in apps — cross-app
 * commands). They differ ONLY in what fills the list and how it is narrowed;
 * the scrim, the frame, the field, the row, the roving selection and the ⌘K
 * binding are this file, once, so the two can never drift into looking or
 * keying like different products.
 *
 * Under 600px the palette is FULL-SCREEN — a 576px card floated over a 320px
 * phone is a card with 12px of wallpaper around it, and the on-screen keyboard
 * leaves no room for the pretence.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CHROME, FG_ON, FS, PANEL, R, SCRIM, TAP_H, Z, row } from './theme'
import { useMediaQuery } from './useMediaQuery'

/** The ⌘K / ESC / ↑ / ↓ / ↵ hint keys, one shape for all of them. */
export const KBD: React.CSSProperties = {
  padding: '1px 5px',
  borderRadius: R.row,
  border: `1px solid ${CHROME.border}`,
  background: CHROME.raised,
  color: CHROME.fgDim,
  fontFamily: 'inherit',
  fontSize: FS.xs,
}

/** The entrance, named in shellStyles because a keyframe has no inline form. */
const ENTER = 'hanzo-palette-in 140ms ease-out'

/** Where the desktop palette hangs — high enough to read as summoned, not centred. */
const TOP = '12vh'

/**
 * Bind the global ⌘K (Ctrl-K off the Mac) toggle.
 *
 * One binding for every palette: a page that mounted two would have them fight
 * over the same chord. `toggle` must be stable — pass a `useCallback`.
 */
export function useCommandKey(toggle: () => void): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [toggle])
}

/**
 * Roving selection over a flat list: the index, the keys that move it, and the
 * scroll that keeps it visible.
 *
 * `resetKey` is whatever should send the selection back to the top — the query,
 * usually. Both palettes need exactly this, and a second copy would be a second
 * chance for ↑/↓/↵/Esc to mean something slightly different in one of them.
 */
export function usePaletteNav(
  count: number,
  onEnter: (index: number) => void,
  onClose: () => void,
  resetKey: unknown
) {
  const [index, setIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => setIndex(0), [resetKey])

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${index}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [index])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const n = count || 1
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setIndex((i) => (i + 1) % n)
          break
        case 'ArrowUp':
          e.preventDefault()
          setIndex((i) => (i - 1 + n) % n)
          break
        case 'Enter':
          e.preventDefault()
          onEnter(index)
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    },
    [count, index, onEnter, onClose]
  )

  return { index, setIndex, listRef, onKeyDown }
}

/**
 * Scrim + dialog + panel. Full-screen under 600px, a floated card above it.
 *
 * The panel is a flex COLUMN so the list between the field and the footer takes
 * the slack — that is what lets one frame be a 76vh card and a full-screen sheet
 * without either of them growing a second scroll container.
 */
export function PaletteShell({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  children: React.ReactNode
}) {
  const full = useMediaQuery('(max-width: 600px)')
  if (!open) return null

  return (
    <div data-hanzo-shell="" style={{ fontFamily: CHROME.font }}>
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: Z.overlay as unknown as number,
          background: SCRIM,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: ENTER,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        style={
          full
            ? {
                position: 'fixed',
                inset: 0,
                zIndex: Z.modal as unknown as number,
                boxSizing: 'border-box',
              }
            : {
                position: 'fixed',
                top: TOP,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: Z.modal as unknown as number,
                width: '100%',
                maxWidth: 576,
                padding: '0 12px',
                boxSizing: 'border-box',
              }
        }
      >
        <div
          style={{
            ...PANEL,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden',
            // Full-screen drops the card's edges: a border and a radius against
            // the viewport edge are a card pretending it is still floating.
            ...(full
              ? { height: '100%', borderRadius: 0, border: 'none', boxShadow: 'none' }
              : { maxHeight: '76vh' }),
            animation: ENTER,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/** A hairline-separated band — the palette's header and footer are both this. */
export function PaletteBar({
  edge,
  children,
}: {
  edge: 'top' | 'bottom'
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        flex: '0 0 auto',
        padding: edge === 'bottom' ? '6px 12px' : '6px 8px 6px 12px',
        ...(edge === 'bottom'
          ? { borderTop: `1px solid ${CHROME.border}` }
          : { borderBottom: `1px solid ${CHROME.border}` }),
        color: CHROME.fgDim,
        fontSize: FS.xs,
      }}
    >
      {children}
    </div>
  )
}

/**
 * The query field: one glyph, one input, nothing else.
 *
 * A `<label>`, not a `<div>`: the palette focuses this input the moment it
 * opens, and a bare input then wears the shell's focus ring as a hard rectangle
 * across the panel. Wrapping makes the field ONE control — shellStyles puts the
 * ring on the wrapper and suppresses it on the input inside — so the ring reads
 * as the field being live instead of as a browser artifact, and the whole 44px
 * box is the tap target rather than the 20px of text inside it.
 */
export function PaletteField({
  value,
  onChange,
  onKeyDown,
  placeholder,
  inputRef,
}: {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder: string
  inputRef: React.Ref<HTMLInputElement>
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flex: '0 0 auto',
        height: TAP_H,
        margin: 10,
        padding: '0 12px',
        borderRadius: R.row,
        border: `1px solid ${CHROME.border}`,
      }}
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flex: '0 0 auto', color: CHROME.fgDim }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck={false}
        style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: CHROME.fg,
          fontFamily: 'inherit',
          fontSize: FS.base,
        }}
      />
    </label>
  )
}

/** The scrolling results region. Takes the slack between field and footer. */
export function PaletteList({
  listRef,
  children,
}: {
  listRef: React.Ref<HTMLDivElement>
  children: React.ReactNode
}) {
  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label="Results"
      style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 0' }}
    >
      {children}
    </div>
  )
}

/** A group head inside the list — the category or command-set name. */
export function PaletteGroup({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '8px 14px 4px',
        fontSize: FS.xs,
        fontWeight: 600,
        color: CHROME.fgDim,
      }}
    >
      {label}
    </div>
  )
}

/**
 * One result. Selection is said in BRIGHTNESS, like every other row in the
 * chrome — never in a filled band. The one filled element in the house is the
 * header's primary CTA.
 */
export function PaletteRow({
  index,
  selected,
  title,
  description,
  icon,
  onSelect,
  onHover,
}: {
  index: number
  selected: boolean
  title: string
  description?: string
  icon?: React.ReactNode
  onSelect: () => void
  onHover: () => void
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      data-idx={index}
      onClick={onSelect}
      onMouseEnter={onHover}
      style={{
        ...row(false),
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        margin: 0,
        padding: '7px 14px',
        borderRadius: 0,
        border: 'none',
        background: 'transparent',
        color: selected ? FG_ON : CHROME.fgMuted,
        fontFamily: 'inherit',
        textAlign: 'left',
      }}
    >
      {icon ? (
        <span
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
            flex: '0 0 auto',
            color: 'inherit',
          }}
        >
          {icon}
        </span>
      ) : null}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontSize: FS.sm,
            fontWeight: 600,
            color: 'inherit',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
        {description ? (
          <span
            style={{
              display: 'block',
              fontSize: FS.xs,
              color: CHROME.fgDim,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {description}
          </span>
        ) : null}
      </span>
      {selected ? (
        <span
          aria-hidden="true"
          style={{ flex: '0 0 auto', fontSize: FS.xs, color: 'inherit' }}
        >
          ↵
        </span>
      ) : null}
    </button>
  )
}

/** The one calm line an empty result set gets. */
export function PaletteEmpty({ query }: { query: string }) {
  return (
    <p
      style={{
        margin: 0,
        padding: '28px 14px',
        textAlign: 'center',
        fontSize: FS.sm,
        color: CHROME.fgDim,
      }}
    >
      No results for “{query.trim()}”.
    </p>
  )
}

/** The ↑↓ / ↵ / ⌘K hint bar every palette closes with. */
export function PaletteHints() {
  return (
    <PaletteBar edge="bottom">
      <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <kbd style={KBD}>↑</kbd>
          <kbd style={KBD}>↓</kbd>
          navigate
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <kbd style={KBD}>↵</kbd>
          select
        </span>
      </span>
      <kbd style={KBD}>⌘K</kbd>
    </PaletteBar>
  )
}

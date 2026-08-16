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
 * taxonomy + Ask AI) and `OrgCommandPalette` (signed-in apps — cross-app
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
 * The way out of an unanswerable query — one rule, for every palette.
 *
 * A list can always fail to hold what someone typed. The answer is never "no
 * results": it is to hand the question to the AI, which is the one thing that
 * can take a query nobody indexed. So every palette in the estate ends with
 * this row, and it reads and behaves identically in all of them — a reader who
 * learns it signed out still has it signed in.
 *
 * It lived only in the public header's palette, so the signed-in apps' palette
 * — mounted in the products where a person is actually working — was the one
 * place where an unmatched query really was a dead end.
 *
 * `onAsk` is the host taking the question instead: a surface that IS the AI
 * answers in place rather than opening a second copy of itself.
 */
export const askLabel = (question: string) => `Ask AI: ${question}`

export function useAsk({
  askHref,
  onAsk,
  onNavigate,
  close,
}: {
  askHref: string
  onAsk?: (question: string) => void
  onNavigate?: (href: string, external?: boolean) => void
  close: () => void
}): (question: string) => void {
  return useCallback(
    (question: string) => {
      close()
      if (onAsk) {
        onAsk(question)
        return
      }
      const href = question ? `${askHref}?q=${encodeURIComponent(question)}` : askHref
      if (onNavigate) onNavigate(href, true)
      else window.open(href, '_blank', 'noreferrer')
    },
    [askHref, close, onAsk, onNavigate]
  )
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
        case 'Home':
          e.preventDefault()
          setIndex(0)
          break
        case 'End':
          e.preventDefault()
          setIndex(n - 1)
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
  listId,
  activeId,
}: {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder: string
  inputRef: React.Ref<HTMLInputElement>
  /** The listbox this field drives, for `aria-controls`. */
  listId?: string
  /**
   * The row the keys are currently on.
   *
   * The caret never leaves this input, so a screen reader learns which result
   * is selected from here or not at all — `aria-selected` on a row nobody is
   * focused on is invisible to it.
   */
  activeId?: string
}) {
  return (
    <label
      // A BAND, not a box. The palette focuses this the moment it opens, so
      // whatever edge the field carries is drawn every single time it is seen —
      // and a box plus its focus ring is two concentric rounded rectangles with
      // the search glyph stranded in the gutter between them. The field is
      // therefore the full width of the panel, separated from the results by
      // the one hairline, which is the same anatomy as the bar above it. The
      // class is what opts it out of the ring in shellStyles: a ring that is
      // never off says nothing, and the caret already says where the typing
      // goes.
      className="hanzo-field"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flex: '0 0 auto',
        height: TAP_H,
        padding: '0 14px',
        borderBottom: `1px solid ${CHROME.border}`,
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
        role="combobox"
        aria-expanded="true"
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-autocomplete="list"
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
  id,
  children,
}: {
  listRef: React.Ref<HTMLDivElement>
  id?: string
  children: React.ReactNode
}) {
  return (
    <div
      ref={listRef}
      id={id}
      role="listbox"
      aria-label="Results"
      style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 0 6px' }}
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
  id,
  selected,
  title,
  hits,
  description,
  meta,
  icon,
  onSelect,
  onHover,
}: {
  index: number
  id?: string
  selected: boolean
  title: string
  /**
   * Which characters of `title` the query hit. Drawn at full brightness against
   * a dimmed title, so a reader can see WHY a row is a result — which is the
   * only thing that makes a scattered match trustworthy rather than mysterious.
   */
  hits?: number[]
  description?: string
  /** What kind of thing this is, when the list is ranked rather than grouped. */
  meta?: string
  icon?: React.ReactNode
  onSelect: () => void
  onHover: () => void
}) {
  return (
    <button
      type="button"
      role="option"
      id={id}
      aria-selected={selected}
      data-idx={index}
      onClick={onSelect}
      onMouseEnter={onHover}
      style={{
        ...row(false),
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        margin: 0,
        padding: '6px 14px',
        borderRadius: 0,
        border: 'none',
        background: 'transparent',
        color: selected ? FG_ON : CHROME.fgMuted,
        fontFamily: 'inherit',
        textAlign: 'left',
      }}
    >
      {/* The selection is a lit left edge as well as brighter ink — on a dense
          list, brightness alone is a difference a reader has to hunt for. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 4,
          bottom: 4,
          width: 2,
          borderRadius: 2,
          background: selected ? FG_ON : 'transparent',
        }}
      />
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
          <Lit text={title} hits={hits} />
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
      {meta ? (
        <span
          style={{
            flex: '0 0 auto',
            fontSize: FS.xs,
            color: CHROME.fgDim,
            whiteSpace: 'nowrap',
          }}
        >
          {meta}
        </span>
      ) : null}
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

/**
 * A title with the query's characters lit.
 *
 * Runs of adjacent hits are drawn as ONE span rather than one per character, so
 * a contiguous match reads as a word rather than as a row of letters that
 * happen to be bright.
 */
function Lit({ text, hits }: { text: string; hits?: number[] }) {
  if (!hits || hits.length === 0) return <>{text}</>

  const on = new Set(hits)
  const parts: React.ReactNode[] = []
  let at = 0
  while (at < text.length) {
    const lit = on.has(at)
    let end = at + 1
    while (end < text.length && on.has(end) === lit) end++
    const chunk = text.slice(at, end)
    parts.push(
      lit ? (
        <mark
          key={at}
          style={{ background: 'transparent', color: FG_ON, fontWeight: 700 }}
        >
          {chunk}
        </mark>
      ) : (
        <React.Fragment key={at}>{chunk}</React.Fragment>
      )
    )
    at = end
  }
  return <>{parts}</>
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

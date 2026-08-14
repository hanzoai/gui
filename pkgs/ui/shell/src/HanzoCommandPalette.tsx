'use client'

/**
 * HanzoCommandPalette — the public header's ⌘K palette, in two modes.
 *
 *   Filter …… live-search the ~97 cloud primitives. The rows ARE the taxonomy,
 *             narrowed by `filterProducts` — the same predicate, from the same
 *             module, that every other product search in the shell runs. The
 *             mega-menu used to carry its own field; product search now happens
 *             in exactly one place, so a query can only ever have one answer.
 *   Ask AI …… hand the question to Hanzo Chat instead. A visitor who does not
 *             know the product NAME cannot be helped by a name filter, and
 *             making them close the palette to find the chat is the gap this
 *             mode closes.
 *
 * The two modes share the field, the list and the keys; they differ only in
 * what the query means. Mode is said the way every lit control in the chrome is
 * said — brightness, via `control(active)` — because a filled tab would be a
 * second filled element competing with the header's one white CTA.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { U, type ProductCategory } from './hanzo-registry'
import { filterProducts } from './productSearch'
import { CHROME, FS, control, ghostHover } from './theme'
import {
  KBD,
  PaletteBar,
  PaletteEmpty,
  PaletteField,
  PaletteGroup,
  PaletteHints,
  PaletteList,
  PaletteRow,
  PaletteShell,
  useCommandKey,
  usePaletteNav,
} from './commandPalette'

export type HanzoCommandMode = 'filter' | 'ask'

export interface HanzoCommandPaletteProps {
  /** The taxonomy to search — the surface's own `ProductCategory[]`. */
  categories: ProductCategory[]
  /** Controlled visibility. Omit to let the palette own it (⌘K still works). */
  open?: boolean
  /** Called when the palette wants to open or close. */
  onOpenChange?: (open: boolean) => void
  /**
   * Where "Ask AI" sends the question, as `<askHref>?q=<question>`. Defaults to
   * Hanzo Chat — the product whose whole job is answering one.
   */
  askHref?: string
  /**
   * Host-owned ask affordance. Called with the question INSTEAD of navigating,
   * so a surface that embeds its own assistant keeps the visitor on the page.
   */
  onAsk?: (question: string) => void
  /** Navigation override (router push, analytics wrapper, …). */
  onNavigate?: (href: string, external?: boolean) => void
}

/** One flat, selectable row — what ↑/↓/↵ actually walk. */
type Entry = { key: string; group: string; title: string; hint?: string; href: string }

export function HanzoCommandPalette({
  categories,
  open: controlledOpen,
  onOpenChange,
  askHref = U.chat,
  onAsk,
  onNavigate,
}: HanzoCommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = useCallback(
    (v: boolean) => {
      if (onOpenChange) onOpenChange(v)
      else setUncontrolledOpen(v)
    },
    [onOpenChange]
  )
  const close = useCallback(() => setOpen(false), [setOpen])
  useCommandKey(useCallback(() => setOpen(!open), [open, setOpen]))

  const [mode, setMode] = useState<HanzoCommandMode>('filter')
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Every open starts clean: a query left over from last time is a palette
  // answering a question the visitor has already forgotten asking.
  useEffect(() => {
    if (open) {
      setQuery('')
      setMode('filter')
    }
  }, [open])

  // The ONE narrowing, from the ONE predicate — flattened to the row order the
  // keys walk, so the list and the selection can never disagree about what row
  // number three is.
  const entries: Entry[] = useMemo(
    () =>
      mode === 'ask'
        ? []
        : filterProducts(categories, query).flatMap((category) =>
            category.items.map((item) => ({
              key: `${category.id}/${item.id}`,
              group: category.label,
              title: item.label,
              hint: item.hint,
              href: item.href,
            }))
          ),
    [categories, query, mode]
  )

  const question = query.trim()
  const ask = useCallback(() => {
    close()
    if (onAsk) {
      onAsk(question)
      return
    }
    const href = question ? `${askHref}?q=${encodeURIComponent(question)}` : askHref
    if (onNavigate) onNavigate(href, true)
    else window.open(href, '_blank', 'noreferrer')
  }, [askHref, close, onAsk, onNavigate, question])

  const go = useCallback(
    (i: number) => {
      const entry = entries[i]
      if (!entry) return
      close()
      if (onNavigate) onNavigate(entry.href)
      else window.location.href = entry.href
    },
    [close, entries, onNavigate]
  )

  const onEnter = useCallback(
    (i: number) => (mode === 'ask' ? ask() : go(i)),
    [ask, go, mode]
  )
  const { index, setIndex, listRef, onKeyDown } = usePaletteNav(
    entries.length,
    onEnter,
    close,
    `${mode}:${query}`
  )

  // Focus the field on every open. The palette is summoned to be TYPED IN — a
  // caret anywhere else is a keystroke thrown away.
  const focusField = useCallback((el: HTMLInputElement | null) => {
    inputRef.current = el
    if (el) requestAnimationFrame(() => el.focus())
  }, [])

  const pick = useCallback((next: HanzoCommandMode) => {
    setMode(next)
    inputRef.current?.focus()
  }, [])

  return (
    <PaletteShell open={open} onClose={close} label="Search products or ask AI">
      <PaletteBar edge="top">
        <span
          role="tablist"
          aria-label="Palette mode"
          style={{ display: 'flex', gap: 2 }}
        >
          <ModeTab mode="filter" active={mode === 'filter'} onPick={pick}>
            Filter
          </ModeTab>
          <ModeTab mode="ask" active={mode === 'ask'} onPick={pick}>
            Ask AI
          </ModeTab>
        </span>
        <kbd style={KBD}>ESC</kbd>
      </PaletteBar>

      <PaletteField
        value={query}
        onChange={setQuery}
        onKeyDown={onKeyDown}
        placeholder={mode === 'ask' ? 'Ask Hanzo AI anything' : 'Search products'}
        inputRef={focusField}
      />

      <PaletteList listRef={listRef}>
        {mode === 'ask' ? (
          <PaletteRow
            index={0}
            selected
            title={question ? `Ask AI: ${question}` : 'Ask Hanzo AI'}
            description={question ? undefined : 'Open a chat and ask anything'}
            onSelect={ask}
            onHover={() => {}}
          />
        ) : entries.length === 0 ? (
          <PaletteEmpty query={query} />
        ) : (
          entries.map((entry, i) => (
            <React.Fragment key={entry.key}>
              {entry.group === entries[i - 1]?.group ? null : (
                <PaletteGroup label={entry.group} />
              )}
              <PaletteRow
                index={i}
                selected={i === index}
                title={entry.title}
                description={entry.hint}
                onSelect={() => go(i)}
                onHover={() => setIndex(i)}
              />
            </React.Fragment>
          ))
        )}
      </PaletteList>

      <PaletteHints />
    </PaletteShell>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function ModeTab({
  mode,
  active,
  onPick,
  children,
}: {
  mode: HanzoCommandMode
  active: boolean
  onPick: (mode: HanzoCommandMode) => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onPick(mode)}
      style={{ ...control(active, 28), padding: '0 8px', fontSize: FS.xs }}
      {...ghostHover(active)}
    >
      {children}
    </button>
  )
}

/**
 * The header's ⌘K affordance: a search glyph and the chord that opens it.
 *
 * It lives with the palette rather than in the header because the two are one
 * control — a trigger that drifted from what it opens is how a shortcut hint
 * ends up advertising a key nothing listens for.
 */
export function HanzoCommandTrigger({
  onOpen,
  compact,
  height,
}: {
  onOpen: () => void
  /** Glyph only — the phone header has no room for the chord, or a keyboard. */
  compact?: boolean
  height?: number
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search products or ask AI"
      aria-keyshortcuts="Meta+K Control+K"
      style={{
        ...control(false, height),
        ...(compact ? { width: height, padding: 0 } : { padding: '0 10px' }),
      }}
      {...ghostHover()}
    >
      <svg
        width={compact ? 20 : 15}
        height={compact ? 20 : 15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      {compact ? null : (
        <kbd style={{ ...KBD, color: CHROME.fgDim }} aria-hidden="true">
          ⌘K
        </kbd>
      )}
    </button>
  )
}

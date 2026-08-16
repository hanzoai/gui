'use client'

/**
 * HanzoCommandPalette — the public header's ⌘K palette, in two modes.
 *
 *   Filter …… search THE SITE. Not one shelf of it: the pages the header
 *             already links, the doors the primary action opens, the installs,
 *             and the cloud taxonomy — one index, ranked by `search`.
 *   Ask AI …… hand the question to Hanzo Chat instead. Always reachable as the
 *             last row too, so no query is ever a dead end.
 *
 * A palette that indexes ONE kind of record is the defect readers actually hit:
 * typing "pricing" into a product-only index answers "no results" about a page
 * the header is linking three inches above. Whatever the chrome can reach, the
 * palette can find.
 *
 * The two modes share the field, the list and the keys; they differ only in
 * what the query means. Mode is said the way every lit control in the chrome is
 * said — brightness, via `control(active)` — because a filled tab would be a
 * second filled element competing with the header's one white CTA.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TRY_HANZO_GROUPS, U, type ProductCategory } from './hanzo-registry'
import { search, type Match } from './search'
import { CHROME, CTRL_H, FS, TAP_H, control, ghostHover } from './theme'
import {
  KBD,
  PaletteBar,
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

/**
 * One thing the palette can find.
 *
 * A page, a product, a download, an action — the palette does not care which,
 * because a reader typing four letters does not either. `group` is what the row
 * says it is; `keywords` is how it can be reached by a word that is not in its
 * name.
 */
export interface HanzoCommandEntry {
  id: string
  title: string
  href: string
  hint?: string
  group: string
  keywords?: string
  external?: boolean
}

export interface HanzoCommandPaletteProps {
  /** The cloud taxonomy to search — the surface's own `ProductCategory[]`. */
  categories?: ProductCategory[]
  /**
   * Everything else this surface can reach: its own pages, its docs, its
   * actions. The header contributes what it renders; a host adds the rest.
   */
  commands?: HanzoCommandEntry[]
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
type Entry = HanzoCommandEntry & { match?: Match; ask?: boolean }

const LIST_ID = 'hanzo-palette-list'
const rowId = (i: number) => `hanzo-palette-row-${i}`

/** The doors and the downloads, which every Hanzo surface can open. */
function doors(): HanzoCommandEntry[] {
  return TRY_HANZO_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      id: `door/${group.id}/${item.id}`,
      title: item.label,
      href: item.href,
      hint: item.hint,
      group: group.id === 'install' ? 'Install' : 'Open',
      external: true,
    }))
  )
}

/** The taxonomy, flattened. A category's own page is a record too. */
function products(categories: ProductCategory[]): HanzoCommandEntry[] {
  return categories.flatMap((category) => [
    {
      id: `cat/${category.id}`,
      title: category.label,
      href: category.href,
      hint: category.tagline,
      group: 'Products',
      keywords: 'category',
    },
    ...category.items.map((item) => ({
      id: `${category.id}/${item.id}`,
      title: item.label,
      href: item.href,
      hint: item.hint,
      group: category.label,
      keywords: category.label,
      external: /^https?:\/\//.test(item.href),
    })),
  ])
}

export function HanzoCommandPalette({
  categories,
  commands,
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

  // ONE index, built once, in the order a reader who has typed NOTHING should
  // meet it: the doors first, because "open something" is why most people
  // summon this; then the site's own pages; then the ~97 primitives, which are
  // the long tail. Once a query arrives the order is the ranking's, so this is
  // only ever the resting shape.
  //
  // ONE ROW PER DESTINATION. The halves overlap by construction — /vector is a
  // page the site publishes AND a product the catalog sells — and two rows
  // going to one place leaves a reader deciding which of two identical answers
  // is the real one.
  //
  // Position is taken by the FIRST to claim a destination, so the list keeps
  // the order above; the description is taken by whichever record actually has
  // one, since a page knows its URL and the catalog knows what it does.
  const index: HanzoCommandEntry[] = useMemo(() => {
    const at = new Map<string, number>()
    const out: HanzoCommandEntry[] = []
    for (const entry of [
      ...doors(),
      ...(commands ?? []),
      ...products(categories ?? []),
    ]) {
      const seen = at.get(entry.href)
      if (seen === undefined) {
        at.set(entry.href, out.length)
        out.push(entry)
      } else if (!out[seen]!.hint && entry.hint) {
        out[seen] = { ...out[seen]!, hint: entry.hint }
      }
    }
    return out
  }, [commands, categories])

  const question = query.trim()

  // Ranked, best first. Grouping is a REST state: once a query orders the list
  // by how well each row answers it, group heads would tear that order apart,
  // so the kind moves onto the row itself where it costs nothing.
  const entries: Entry[] = useMemo(() => {
    if (mode === 'ask') return []
    const hits: Entry[] = search(index, query, (e) => [
      e.title,
      e.hint,
      e.keywords,
      e.group,
      e.href,
    ])
    // The way out of an unanswerable query, and the reason there is no dead
    // end: whatever was typed can always be asked.
    if (question) {
      hits.push({
        id: 'ask',
        title: `Ask AI: ${question}`,
        href: askHref,
        group: 'Ask',
        ask: true,
      })
    }
    return hits
  }, [index, query, mode, question, askHref])

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
      if (entry.ask) {
        ask()
        return
      }
      close()
      if (onNavigate) onNavigate(entry.href, entry.external)
      else window.location.href = entry.href
    },
    [ask, close, entries, onNavigate]
  )

  const onEnter = useCallback(
    (i: number) => (mode === 'ask' ? ask() : go(i)),
    [ask, go, mode]
  )
  const {
    index: cursor,
    setIndex,
    listRef,
    onKeyDown,
  } = usePaletteNav(entries.length, onEnter, close, `${mode}:${query}`)

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

  const grouped = !question

  return (
    <PaletteShell open={open} onClose={close} label="Search Hanzo or ask AI">
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
        placeholder={mode === 'ask' ? 'Ask Hanzo AI anything' : 'Search Hanzo'}
        inputRef={focusField}
        listId={LIST_ID}
        activeId={entries.length ? rowId(cursor) : undefined}
      />

      <PaletteList listRef={listRef} id={LIST_ID}>
        {mode === 'ask' ? (
          <PaletteRow
            index={0}
            id={rowId(0)}
            selected
            title={question ? `Ask AI: ${question}` : 'Ask Hanzo AI'}
            description={question ? undefined : 'Open a chat and ask anything'}
            onSelect={ask}
            onHover={() => {}}
          />
        ) : (
          entries.map((entry, i) => (
            <React.Fragment key={entry.id}>
              {grouped && entry.group !== entries[i - 1]?.group ? (
                <PaletteGroup label={entry.group} />
              ) : null}
              <PaletteRow
                index={i}
                id={rowId(i)}
                selected={i === cursor}
                title={entry.title}
                hits={entry.match?.hits}
                description={entry.hint}
                meta={grouped ? undefined : entry.group}
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
 * The header's ⌘K affordance: one control that says what it does.
 *
 * A FIELD, not a nav pill, so it takes the raised fill and the hairline every
 * input in the chrome takes (`CHROME.raised` over `CHROME.border`) and the word
 * it answers to. The boundary belongs to the CONTROL. Drawn the other way round
 * — a bare glyph beside a bordered keycap — the bar shows two loose objects and
 * neither of them reads as the way in; the only edge in the row ends up around
 * the hint rather than around the thing you click.
 *
 * That is the ONE exception the flat ghost rule takes, and it is the same one
 * `CHROME.raised` was written for. Search is the control a reader hunts for
 * before reading anything, and it cannot be found by brightness alone.
 *
 * It lives with the palette rather than in the header because the two are one
 * control — a trigger that drifted from what it opens is how a shortcut hint
 * ends up advertising a key nothing listens for.
 */
export function HanzoCommandTrigger({
  onOpen,
  compact,
  height = compact ? TAP_H : CTRL_H,
}: {
  onOpen: () => void
  /** Glyph only — the phone header has no room for the word, or a keyboard. */
  compact?: boolean
  /**
   * The control's whole size, and the only knob. Everything inside is stated
   * against it, so a host that wants a different register moves one number.
   *
   * Two registers, because the two headers are two rooms. In the bar it is
   * CTRL_H: search stands in a row of 34px nav pills next to a 34px CTA, and a
   * control 10px taller than every neighbour reads as a widget dropped into the
   * header rather than part of it. On the phone it is TAP_H, square, which is
   * what the menu button beside it already is — the two are the whole header
   * there, and a 34px circle next to a 44px one is visibly the odd one. TAP_H
   * is also the thumb, in both directions: the coarse-pointer rule in
   * shellStyles can grow a control's HEIGHT and cannot touch its width.
   */
  height?: number
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search Hanzo or ask AI"
      aria-keyshortcuts="Meta+K Control+K"
      style={{
        ...control(false, height),
        gap: 8,
        // Stated, not inherited: `height` is the control's WHOLE size, and a
        // host that never loaded a reset would otherwise add the edge to it and
        // stand this 2px above the row it belongs to.
        boxSizing: 'border-box',
        // In the BAR this is a control among controls, so it wears the same edge
        // and fill as its neighbours and reads as one of them.
        //
        // On the PHONE it is a glyph beside a glyph. The menu button next to it
        // carries no edge and no fill, so a ring around this one made two icons
        // of the same kind look like two different kinds of control — and a
        // circle is the loudest shape in a bar that otherwise has none. The rule
        // in a monochrome chrome is that weight has to mean something, and an
        // edge drawn only because a control happens to be square means nothing.
        ...(compact
          ? { width: height, padding: 0, border: 'none', background: 'transparent' }
          : {
              padding: '0 12px',
              border: `1px solid ${CHROME.border}`,
              background: CHROME.raised,
            }),
      }}
      {...ghostHover()}
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
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      {compact ? null : (
        <>
          {/* The word, so the control is legible without decoding a glyph. */}
          <span>Search</span>
          {/* The chord spoken, not boxed. KBD is a keycap for hints sitting on
              a flat panel; inside a control that already has its own edge it
              would draw a second box within the first. */}
          <span style={{ color: CHROME.fgDim, fontSize: FS.xs }} aria-hidden="true">
            ⌘K
          </span>
        </>
      )}
    </button>
  )
}

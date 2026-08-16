'use client'

/**
 * OrgCommandPalette — the signed-in apps' ⌘K palette: cross-app navigation
 * plus whatever commands the host app contributes.
 *
 * It renders the SAME frame as the public header's `HanzoCommandPalette` (see
 * commandPalette.tsx) and differs only in what fills the list. A command here is
 * an arbitrary act — "New chat", "Open billing" — so it is matched on title,
 * description and explicit `keywords`, which is what a command list needs and
 * what a product taxonomy does not.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HANZO_APPS, type HanzoApp } from './hanzo-apps'
import { U } from './hanzo-registry'
import { search, type Match } from './search'
import { useShellStyles } from './shellStyles'
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
  askLabel,
  useAsk,
  useCommandKey,
  usePaletteNav,
} from './commandPalette'

const LIST_ID = 'hanzo-org-palette-list'
const rowId = (i: number) => `hanzo-org-palette-row-${i}`

export type CommandItem = {
  id: string
  title: string
  description?: string
  href?: string
  action?: () => void
  icon?: React.ReactNode
  category: string
  external?: boolean
  keywords?: string[]
}

export type OrgCommandPaletteProps = {
  /** Additional app-specific commands merged with built-in cross-app commands */
  commands?: CommandItem[]
  /** Override the default Hanzo apps used for cross-app navigation */
  apps?: HanzoApp[]
  /** Current app id — used to exclude from cross-app navigation */
  currentAppId?: string
  /** Controlled open state */
  open?: boolean
  /** Called when palette wants to close */
  onOpenChange?: (open: boolean) => void
  /** Custom navigation handler (defaults to window.location for external, history push for relative) */
  onNavigate?: (href: string, external?: boolean) => void
  /**
   * Where an unanswered question goes, as `<askHref>?q=<question>`. Defaults to
   * Hanzo Chat, the same destination the public palette uses.
   */
  askHref?: string
  /**
   * Take the question here INSTEAD of navigating. A surface that is itself the
   * AI answers in place — opening chat from inside chat is a second copy of the
   * thing the reader is already in.
   */
  onAsk?: (question: string) => void
}

/**
 * A rendered row: a command, plus what the search matched on it, plus the one
 * synthetic row that is not a command at all — the question itself.
 *
 * `ask` is local rather than a field on `CommandItem` because a host cannot
 * contribute one: there is exactly one way to ask, and this file owns it.
 */
type Row = CommandItem & { match?: Match; ask?: boolean }

/** Cross-app navigation, derived from the apps this org can reach. */
function crossAppCommands(apps: HanzoApp[], currentAppId?: string): CommandItem[] {
  return apps
    .filter((app) => app.id !== currentAppId)
    .map((app) => ({
      id: `app-${app.id}`,
      title: app.label,
      description: app.description,
      href: app.href,
      category: 'Hanzo Apps',
      external: true,
      keywords: [app.id, app.label.toLowerCase()],
    }))
}

export function OrgCommandPalette({
  commands: appCommands = [],
  apps,
  currentAppId,
  open: controlledOpen,
  onOpenChange,
  onNavigate,
  askHref = U.chat,
  onAsk,
}: OrgCommandPaletteProps) {
  useShellStyles()
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

  const [query, setQuery] = useState('')
  const question = query.trim()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setQuery('')
  }, [open])

  // Ranked by `search` — the same matcher the public palette runs, so a query
  // that finds a thing signed out finds it signed in.
  //
  // At REST the list is grouped, which is what makes a command set legible
  // before you know what is in it. Once a query orders rows by how well each
  // answers it, group heads would tear that order apart, so they go.
  const flat = useMemo<Row[]>(() => {
    const all = [...appCommands, ...crossAppCommands(apps ?? HANZO_APPS, currentAppId)]
    if (!question) {
      const byCategory = new Map<string, CommandItem[]>()
      for (const cmd of all) {
        const bucket = byCategory.get(cmd.category)
        if (bucket) bucket.push(cmd)
        else byCategory.set(cmd.category, [cmd])
      }
      return [...byCategory.values()].flat().map((cmd) => ({ ...cmd, match: undefined }))
    }
    const hits: Row[] = search(all, query, (cmd) => [
      cmd.title,
      cmd.description,
      cmd.keywords?.join(' '),
      cmd.category,
    ])
    // Last, always: a command list is finite and a question is not, so the row
    // that hands it to the AI is what keeps an unmatched query from being a
    // dead end. Same label and same behaviour as the public palette's.
    hits.push({ id: 'ask', title: askLabel(question), category: 'Ask', ask: true })
    return hits
  }, [appCommands, apps, currentAppId, query, question])

  const askQuestion = useAsk({ askHref, onAsk, onNavigate, close })

  const go = useCallback(
    (i: number) => {
      const cmd = flat[i]
      if (!cmd) return
      if (cmd.ask) {
        askQuestion(question)
        return
      }
      close()
      if (cmd.action) cmd.action()
      else if (!cmd.href) return
      else if (onNavigate) onNavigate(cmd.href, cmd.external)
      else if (cmd.external) window.open(cmd.href, '_blank')
      else window.location.href = cmd.href
    },
    [askQuestion, close, flat, onNavigate, question]
  )

  const { index, setIndex, listRef, onKeyDown } = usePaletteNav(
    flat.length,
    go,
    close,
    query
  )

  // Focus the field on every open. The palette is summoned to be TYPED IN — a
  // caret anywhere else is a keystroke thrown away.
  const focusField = useCallback((el: HTMLInputElement | null) => {
    inputRef.current = el
    if (el) requestAnimationFrame(() => el.focus())
  }, [])

  const grouped = !question

  return (
    <PaletteShell open={open} onClose={close} label="Command palette">
      <PaletteBar edge="top">
        <span>Commands</span>
        <kbd style={KBD}>ESC</kbd>
      </PaletteBar>

      <PaletteField
        value={query}
        onChange={setQuery}
        onKeyDown={onKeyDown}
        placeholder="Search commands"
        inputRef={focusField}
        listId={LIST_ID}
        activeId={flat.length ? rowId(index) : undefined}
      />

      <PaletteList listRef={listRef} id={LIST_ID}>
        {flat.length === 0 ? (
          <PaletteEmpty query={query} />
        ) : (
          flat.map((cmd, i) => (
            <React.Fragment key={cmd.id}>
              {grouped && cmd.category !== flat[i - 1]?.category ? (
                <PaletteGroup label={cmd.category} />
              ) : null}
              <PaletteRow
                index={i}
                id={rowId(i)}
                selected={i === index}
                title={cmd.title}
                hits={cmd.match?.hits}
                description={cmd.description}
                meta={grouped ? undefined : cmd.category}
                icon={cmd.icon}
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

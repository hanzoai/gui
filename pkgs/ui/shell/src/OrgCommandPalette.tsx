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
import { search } from './search'
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
}

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
  const flat = useMemo(() => {
    const all = [...appCommands, ...crossAppCommands(apps ?? HANZO_APPS, currentAppId)]
    if (!query.trim()) {
      const byCategory = new Map<string, CommandItem[]>()
      for (const cmd of all) {
        const bucket = byCategory.get(cmd.category)
        if (bucket) bucket.push(cmd)
        else byCategory.set(cmd.category, [cmd])
      }
      return [...byCategory.values()].flat().map((cmd) => ({ ...cmd, match: undefined }))
    }
    return search(all, query, (cmd) => [
      cmd.title,
      cmd.description,
      cmd.keywords?.join(' '),
      cmd.category,
    ])
  }, [appCommands, apps, currentAppId, query])

  const go = useCallback(
    (i: number) => {
      const cmd = flat[i]
      if (!cmd) return
      close()
      if (cmd.action) cmd.action()
      else if (!cmd.href) return
      else if (onNavigate) onNavigate(cmd.href, cmd.external)
      else if (cmd.external) window.open(cmd.href, '_blank')
      else window.location.href = cmd.href
    },
    [close, flat, onNavigate]
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

  const grouped = !query.trim()

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

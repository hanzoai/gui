'use client'

/**
 * TenantCommandPalette — the signed-in apps' ⌘K palette: cross-app navigation
 * plus whatever commands the host app contributes.
 *
 * It renders the SAME frame as the public header's `HanzoCommandPalette` (see
 * commandPalette.tsx) and differs only in what fills the list. A command here is
 * an arbitrary act — "New chat", "Open billing" — so it is matched on title,
 * description and explicit `keywords`, which is what a command list needs and
 * what a product taxonomy does not.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_TENANT_APPS, type TenantApp } from './types'
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

export type TenantCommandPaletteProps = {
  /** Additional app-specific commands merged with built-in cross-app commands */
  commands?: CommandItem[]
  /** Override the default Hanzo apps used for cross-app navigation */
  apps?: TenantApp[]
  /** Current app id — used to exclude from cross-app navigation */
  currentAppId?: string
  /** Controlled open state */
  open?: boolean
  /** Called when palette wants to close */
  onOpenChange?: (open: boolean) => void
  /** Custom navigation handler (defaults to window.location for external, history push for relative) */
  onNavigate?: (href: string, external?: boolean) => void
}

/** Cross-app navigation, derived from the apps this tenant can reach. */
function crossAppCommands(apps: TenantApp[], currentAppId?: string): CommandItem[] {
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

export function TenantCommandPalette({
  commands: appCommands = [],
  apps,
  currentAppId,
  open: controlledOpen,
  onOpenChange,
  onNavigate,
}: TenantCommandPaletteProps) {
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

  // Filtered, then flattened to the row order the keys walk — grouping is a
  // render detail, so the group heads are emitted as the category changes.
  const flat = useMemo(() => {
    const all = [
      ...appCommands,
      ...crossAppCommands(apps ?? DEFAULT_TENANT_APPS, currentAppId),
    ]
    const q = query.trim().toLowerCase()
    const hits = q
      ? all.filter(
          (cmd) =>
            cmd.title.toLowerCase().includes(q) ||
            cmd.description?.toLowerCase().includes(q) ||
            cmd.keywords?.some((k) => k.includes(q))
        )
      : all
    const byCategory = new Map<string, CommandItem[]>()
    for (const cmd of hits) {
      const bucket = byCategory.get(cmd.category)
      if (bucket) bucket.push(cmd)
      else byCategory.set(cmd.category, [cmd])
    }
    return [...byCategory.values()].flat()
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
      />

      <PaletteList listRef={listRef}>
        {flat.length === 0 ? (
          <PaletteEmpty query={query} />
        ) : (
          flat.map((cmd, i) => (
            <React.Fragment key={cmd.id}>
              {cmd.category === flat[i - 1]?.category ? null : (
                <PaletteGroup label={cmd.category} />
              )}
              <PaletteRow
                index={i}
                selected={i === index}
                title={cmd.title}
                description={cmd.description}
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

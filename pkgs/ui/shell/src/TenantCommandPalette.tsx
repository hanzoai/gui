'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { DEFAULT_TENANT_APPS, type TenantApp } from './types'
import { CHROME, FG_ON, FS, LABEL, PANEL, R, SCRIM, Z, row } from './theme'
import { useShellStyles } from './shellStyles'

/** The ⌘K / ↑ / ↓ / ↵ hint keys, one shape for all of them. */
const KBD: React.CSSProperties = {
  padding: '1px 5px',
  borderRadius: R.row,
  border: `1px solid ${CHROME.border}`,
  background: CHROME.raised,
  color: CHROME.fgDim,
  fontFamily: 'inherit',
  fontSize: FS.xs,
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Built-in cross-app commands derived from DEFAULT_TENANT_APPS
// ---------------------------------------------------------------------------

function buildCrossAppCommands(apps: TenantApp[], currentAppId?: string): CommandItem[] {
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TenantCommandPalette({
  commands: appCommands = [],
  apps,
  currentAppId,
  open: controlledOpen,
  onOpenChange,
  onNavigate,
}: TenantCommandPaletteProps) {
  useShellStyles()
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = useCallback(
    (v: boolean) => {
      if (onOpenChange) onOpenChange(v)
      else setInternalOpen(v)
    },
    [onOpenChange]
  )

  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Merge cross-app + app-specific commands
  const crossApp = buildCrossAppCommands(apps ?? DEFAULT_TENANT_APPS, currentAppId)
  const allCommands = [...appCommands, ...crossApp]

  // Filter
  const q = search.toLowerCase()
  const filtered = q
    ? allCommands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(q) ||
          cmd.description?.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.includes(q))
      )
    : allCommands

  // Group by category
  const grouped: Record<string, CommandItem[]> = {}
  for (const cmd of filtered) {
    ;(grouped[cmd.category] ??= []).push(cmd)
  }
  const flat = Object.values(grouped).flat()

  // Reset on search change
  useEffect(() => setSelectedIndex(0), [search])

  // Focus on open
  useEffect(() => {
    if (open) {
      setSearch('')
      setSelectedIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Global Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, setOpen])

  // Navigate helper
  const go = useCallback(
    (cmd: CommandItem) => {
      if (cmd.action) {
        cmd.action()
      } else if (cmd.href) {
        if (onNavigate) {
          onNavigate(cmd.href, cmd.external)
        } else if (cmd.external) {
          window.open(cmd.href, '_blank')
        } else {
          window.location.href = cmd.href
        }
      }
      setOpen(false)
    },
    [onNavigate, setOpen]
  )

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % (flat.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + (flat.length || 1)) % (flat.length || 1))
      } else if (e.key === 'Enter' && flat[selectedIndex]) {
        e.preventDefault()
        go(flat[selectedIndex])
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    },
    [flat, selectedIndex, go, setOpen]
  )

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (!open) return null

  return (
    <div data-hanzo-shell="" style={{ fontFamily: CHROME.font }}>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: Z.overlay as unknown as number,
          background: SCRIM,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Palette */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        style={{
          position: 'fixed',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: Z.modal as unknown as number,
          width: '100%',
          maxWidth: 576,
          padding: '0 12px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ ...PANEL, overflow: 'hidden' }}>
          {/* Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderBottom: `1px solid ${CHROME.border}`,
            }}
          >
            <svg
              width={16}
              height={16}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
              style={{ flexShrink: 0, color: CHROME.fgDim }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands…"
              aria-label="Search commands"
              autoComplete="off"
              spellCheck={false}
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                background: 'transparent',
                color: CHROME.fg,
                fontSize: FS.sm,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <kbd style={KBD}>ESC</kbd>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            role="listbox"
            aria-label="Commands"
            style={{ maxHeight: 400, overflowY: 'auto', padding: '4px 0' }}
          >
            {flat.length === 0 ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: CHROME.fgDim,
                  fontSize: FS.sm,
                }}
              >
                No results for &ldquo;{search}&rdquo;
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div style={{ ...LABEL, padding: '8px 16px' }}>{category}</div>
                  {items.map((cmd) => {
                    const idx = flat.indexOf(cmd)
                    const selected = idx === selectedIndex
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        data-idx={idx}
                        onClick={() => go(cmd)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        style={{
                          ...row(selected),
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          width: '100%',
                          margin: 0,
                          padding: '8px 16px',
                          borderRadius: 0,
                          border: 'none',
                          background: 'transparent',
                          // Selection is said in brightness, like every other
                          // row in the chrome — never in a filled band.
                          color: selected ? FG_ON : CHROME.fgMuted,
                          fontFamily: 'inherit',
                          textAlign: 'left',
                        }}
                      >
                        {cmd.icon && (
                          <span
                            aria-hidden="true"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 20,
                              height: 20,
                              flexShrink: 0,
                              color: 'inherit',
                            }}
                          >
                            {cmd.icon}
                          </span>
                        )}
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
                            {cmd.title}
                          </span>
                          {cmd.description && (
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
                              {cmd.description}
                            </span>
                          )}
                        </span>
                        {selected && (
                          <span
                            aria-hidden="true"
                            style={{ flexShrink: 0, fontSize: FS.xs, color: 'inherit' }}
                          >
                            ↵
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              borderTop: `1px solid ${CHROME.border}`,
              color: CHROME.fgDim,
              fontSize: FS.xs,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
            <span>⌘K</span>
          </div>
        </div>
      </div>
    </div>
  )
}

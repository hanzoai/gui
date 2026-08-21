'use client'

/**
 * AppSwitcher — the compact, sectioned cross-app dropdown carried by
 * TenantHeader. `HanzoAppLauncher` is the roomy icon-tile form of the same
 * idea; this is the dense text form the signed-in chrome wears.
 *
 * Self-contained by design: inline styles + theme.ts tokens, React the only
 * runtime dependency, ZERO CSS-framework coupling — so it drops into any Hanzo
 * app and renders identically regardless of the host's Tailwind/Gui/none setup.
 */
import React, { useState, useRef, useEffect } from 'react'
import { DEFAULT_TENANT_APPS, type TenantApp } from './types'
import { HanzoGridIcon } from './hanzo-apps'
import { CHROME, CTRL_H, FS, LABEL, PANEL, R, Z, control, ghostHover, row } from './theme'
import { useShellStyles } from './shellStyles'

/** Group IDs for sectioned display */
const APP_GROUPS: { label: string; ids: string[] }[] = [
  { label: 'Core', ids: ['account', 'billing', 'console'] },
  { label: 'AI', ids: ['chat', 'flow', 'bot'] },
  { label: 'Observability', ids: ['o11y', 'sentry', 'insights', 'analytics'] },
  {
    label: 'Infrastructure',
    ids: ['platform', 'cloud', 'storage', 'kms', 'dns', 'registry'],
  },
  { label: 'Apps', ids: ['commerce', 'base', 'search', 'auto'] },
  { label: 'Business', ids: ['team', 'sign', 'dataroom', 'captable'] },
  { label: 'Resources', ids: ['docs', 'status'] },
]

interface AppSwitcherProps {
  apps?: TenantApp[]
  currentAppId?: string
}

export function AppSwitcher({
  apps = DEFAULT_TENANT_APPS,
  currentAppId,
}: AppSwitcherProps) {
  useShellStyles()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = apps.filter((a) => a.id !== currentAppId)
  const appMap = new Map(filtered.map((a) => [a.id, a]))
  const grouped = new Set(APP_GROUPS.flatMap((g) => g.ids))

  // One list of sections, so grouped and leftover apps render through the SAME
  // block instead of two copies of it that can drift apart.
  const sections = [
    ...APP_GROUPS.map((g) => ({
      label: g.label,
      apps: g.ids.map((id) => appMap.get(id)).filter(Boolean) as TenantApp[],
    })),
    { label: 'Other', apps: filtered.filter((a) => !grouped.has(a.id)) },
  ].filter((s) => s.apps.length > 0)

  return (
    <div
      ref={ref}
      data-hanzo-shell=""
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Switch app"
        title="Switch app"
        style={{ ...control(open), width: CTRL_H, padding: 0 }}
        {...ghostHover(open)}
      >
        <HanzoGridIcon size={16} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Switch app"
          style={{
            position: 'absolute',
            left: 0,
            top: CTRL_H + 10,
            ...PANEL,
            zIndex: Z.popover as unknown as number,
            width: 288,
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: 8,
            fontFamily: CHROME.font,
          }}
        >
          {sections.map((section) => (
            <div key={section.label}>
              <p style={{ ...LABEL, margin: 0, padding: '8px 8px 4px' }}>
                {section.label}
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                }}
              >
                {section.apps.map((app) => (
                  <a
                    key={app.id}
                    role="menuitem"
                    href={app.href}
                    onClick={() => setOpen(false)}
                    style={{
                      ...row(),
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      margin: 0,
                      padding: '6px 10px',
                      borderRadius: R.row,
                    }}
                    {...ghostHover()}
                  >
                    {/* Inherits so the row's ONE color carries the hover. */}
                    <span style={{ fontSize: FS.sm, fontWeight: 600, color: 'inherit' }}>
                      {app.label}
                    </span>
                    {app.description && (
                      <span
                        style={{ fontSize: FS.xs, lineHeight: 1.25, color: CHROME.fgDim }}
                      >
                        {app.description}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

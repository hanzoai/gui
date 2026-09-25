'use client'

/**
 * Account — WHO YOU ARE, at the foot of the sidebar: the person, and the
 * person's menu.
 *
 * Profile, Notifications, Appearance, Security, Sign out, in that order, and
 * nothing that belongs to the workspace. Which workspace you stand in is the
 * switcher at the TOP of the sidebar, and what it may spend is its Billing, so
 * this card carries no balance and no top-up: a balance here read as the
 * person's money when it is the workspace's.
 *
 * A row is drawn when the host gives it somewhere to go, so a host with no
 * notifications page draws no Notifications row rather than one that fails at
 * press. Sign out is always drawn, and it is the only Sign out: the host keeps
 * no second one.
 *
 * Inside a <Frame> the card carries the sidebar's collapse control beside it.
 */
import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import { useFrame } from './Frame.tsx'
import { MARKS, type GlyphName } from './glyph.tsx'
import { useFrameStyles } from './shellStyles.ts'
import { UserAvatar } from './UserAvatar.tsx'
import { FRAME, FS, Z } from './theme.ts'

export interface AccountProps {
  /** What to call the reader. "You" until the profile arrives. */
  name?: string
  email?: string
  /** A picture URL. */
  picture?: string
  /** The host's own face for the reader, drawn instead of `picture`. */
  face?: ReactNode
  /** Unread notifications, as a count beside the row. */
  unread?: number
  onProfile?: () => void
  onNotifications?: () => void
  onAppearance?: () => void
  onSecurity?: () => void
  onSignOut: () => void
}

interface Row {
  id: string
  label: string
  glyph: GlyphName
  go: () => void
}

/**
 * The menu, in its one order. Exported for the test that holds the order and
 * the set: a balance, a top-up or a workspace switch arriving here is the
 * regression this card exists to prevent.
 */
export function rows(props: AccountProps): Row[] {
  const all: (Row | null)[] = [
    props.onProfile
      ? { id: 'profile', label: 'Profile', glyph: 'user', go: props.onProfile }
      : null,
    props.onNotifications
      ? {
          id: 'notifications',
          label: 'Notifications',
          glyph: 'bell',
          go: props.onNotifications,
        }
      : null,
    props.onAppearance
      ? {
          id: 'appearance',
          label: 'Appearance',
          glyph: 'palette',
          go: props.onAppearance,
        }
      : null,
    props.onSecurity
      ? { id: 'security', label: 'Security', glyph: 'shield', go: props.onSecurity }
      : null,
    { id: 'signout', label: 'Sign out', glyph: 'exit', go: props.onSignOut },
  ]
  return all.filter((r): r is Row => r !== null)
}

function Item({ row, count, onDone }: { row: Row; count?: number; onDone: () => void }) {
  const Mark = MARKS[row.glyph]
  return (
    <button
      type="button"
      role="menuitem"
      data-frame-row=""
      onClick={() => {
        onDone()
        row.go()
      }}
      style={{ padding: '8px 12px', color: FRAME.ink }}
    >
      <Mark size={15} />
      <span>{row.label}</span>
      {count ? (
        <span
          aria-label={`${count} unread`}
          style={{
            flex: 'none',
            minWidth: 18,
            padding: '0 5px',
            borderRadius: 9,
            background: FRAME.edge,
            fontSize: 11,
            lineHeight: '18px',
            textAlign: 'center',
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </button>
  )
}

export function Account(props: AccountProps) {
  useFrameStyles()
  const { name, email, picture, face, unread } = props
  const frame = useFrame()
  const [open, setOpen] = useState(false)
  const holder = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (holder.current && !holder.current.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    // The first row takes focus, so a keyboard that opened the menu is in it.
    menu.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const called = name?.trim() || email || 'You'
  const list = rows(props)
  const last = list.length - 1

  return (
    <div
      ref={holder}
      data-slot="account"
      style={{ position: 'relative', borderTop: `1px solid ${FRAME.edge}` }}
    >
      {open ? (
        <div
          ref={menu}
          role="menu"
          aria-label="Account"
          onKeyDown={(e) => {
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
            e.preventDefault()
            const items = [
              ...(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []),
            ]
            const at = items.indexOf(document.activeElement as HTMLElement)
            const next =
              (at + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
            items[next]?.focus()
          }}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: 8,
            right: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: '8px 0',
            borderRadius: 12,
            border: `1px solid ${FRAME.edge}`,
            background: FRAME.menu,
            boxShadow: '0 12px 32px -8px rgb(0 0 0 / .35)',
            zIndex: Z.modal as unknown as number,
          }}
        >
          {list.map((row, i) => (
            <React.Fragment key={row.id}>
              {/* The way out stands apart from the rest. */}
              {i === last && i > 0 ? (
                <div
                  role="separator"
                  style={{ height: 1, margin: '4px 0', background: FRAME.edge }}
                />
              ) : null}
              <Item
                row={row}
                count={row.id === 'notifications' ? unread : undefined}
                onDone={() => setOpen(false)}
              />
            </React.Fragment>
          ))}
        </div>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <button
          type="button"
          data-frame-row=""
          aria-label="Account"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 0, color: FRAME.ink }}
        >
          <span
            style={{
              display: 'inline-flex',
              flex: 'none',
              width: 22,
              height: 22,
              borderRadius: 11,
              overflow: 'hidden',
            }}
          >
            {face ?? <UserAvatar src={picture} name={called} size={22} />}
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: FS.sm,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {called}
            </span>
            {email && email !== called ? (
              <span
                style={{
                  fontSize: 11,
                  color: FRAME.soft,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {email}
              </span>
            ) : null}
          </span>
          <MARKS.updown size={14} />
        </button>
        {frame ? (
          <button
            type="button"
            data-frame-icon=""
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            onClick={frame.toggle}
            style={{ minWidth: 32, minHeight: 32, marginRight: 6 }}
          >
            <MARKS.collapse size={16} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

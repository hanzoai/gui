'use client'

/**
 * UserOrgDropdown — the account control at the right edge of OrgHeader:
 * who you are, which org you are acting as, and the way out.
 *
 * Self-contained by design: inline styles + theme.ts tokens, React the only
 * runtime dependency, ZERO CSS-framework coupling.
 */
import React, { useState, useRef, useEffect } from 'react'
import type { HanzoUser, HanzoOrg } from './types'
import { ORG_DOMAINS } from './types'
import { UserAvatar } from './UserAvatar'
import { CHROME, CTRL_H, FS, LABEL, PANEL, Z, control, ghostHover, row } from './theme'
import { useShellStyles } from './shellStyles'
import { useMediaQuery } from './useMediaQuery'

interface UserOrgDropdownProps {
  user?: HanzoUser
  organizations?: HanzoOrg[]
  currentOrgId?: string
  onOrgSwitch?: (orgId: string) => void
  onSignOut?: () => void
}

/** A divider between panel sections — the panel's only internal rule. */
const SECTION: React.CSSProperties = {
  borderBottom: `1px solid ${CHROME.borderSoft}`,
}

/**
 * The geometry every row in this panel shares — org options and links alike.
 * Colour and type come from `row()`, so this stays pure layout and the two
 * never drift.
 */
const ROW_SHAPE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  margin: 0,
  padding: '8px 10px',
  border: 'none',
  background: 'transparent',
  fontSize: FS.sm,
  fontFamily: 'inherit',
  textAlign: 'left',
}

export function UserOrgDropdown({
  user,
  organizations = [],
  currentOrgId,
  onOrgSwitch,
  onSignOut,
}: UserOrgDropdownProps) {
  useShellStyles()
  // Below 640px the trigger is the avatar alone; the name/email block and its
  // chevron would crowd a phone header. A media query, not an inline style,
  // because that is the one thing `style` cannot express. Stated as max-width
  // so the SSR default (false) is the DESKTOP form and wide viewports get no
  // hydration flash — same reason MeetHanzoMenu asks for `narrow`.
  const narrow = useMediaQuery('(max-width: 639.98px)')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const currentOrg = organizations.find((o) => o.id === currentOrgId)
  const orgSlug = currentOrg?.slug || 'hanzo'
  const domains = ORG_DOMAINS[orgSlug] || ORG_DOMAINS.hanzo

  const link: React.CSSProperties = { ...row(), ...ROW_SHAPE }

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
        aria-label="Account"
        style={{ ...control(open), gap: 8, padding: '0 8px' }}
        {...ghostHover(open)}
      >
        <UserAvatar src={user.avatar} email={user.email} name={user.name} size={28} />
        {!narrow && (
          <>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
                minWidth: 0,
              }}
            >
              {user.name && (
                <span style={{ fontSize: FS.xs, fontWeight: 600, lineHeight: 1 }}>
                  {user.name}
                </span>
              )}
              <span style={{ fontSize: FS.xs, lineHeight: 1, color: CHROME.fgDim }}>
                {user.email}
              </span>
            </span>
            <Chevron open={open} />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          style={{
            position: 'absolute',
            right: 0,
            top: CTRL_H + 10,
            ...PANEL,
            zIndex: Z.popover as unknown as number,
            width: 256,
            maxWidth: 'calc(100vw - 24px)',
            fontFamily: CHROME.font,
          }}
        >
          {/* Who you are */}
          <div style={{ ...SECTION, padding: '12px 14px' }}>
            <p style={{ ...LABEL, margin: 0 }}>{user.name || 'User'}</p>
            <p style={{ margin: '2px 0 0', fontSize: FS.xs, color: CHROME.fgDim }}>
              {user.email}
            </p>
            {currentOrg && (
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: FS.xs,
                  fontWeight: 600,
                  color: CHROME.fgDim,
                }}
              >
                {currentOrg.name}
              </p>
            )}
          </div>

          {/* Which org you are acting as */}
          {organizations.length > 0 && (
            <div style={{ ...SECTION, padding: 8 }}>
              <p style={{ ...LABEL, margin: 0, padding: '2px 8px 4px' }}>Organizations</p>
              {organizations.map((org) => {
                const current = org.id === currentOrgId
                return (
                  <button
                    key={org.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={current}
                    onClick={() => {
                      onOrgSwitch?.(org.id)
                      setOpen(false)
                    }}
                    style={{
                      ...row(current),
                      ...ROW_SHAPE,
                      justifyContent: 'space-between',
                    }}
                    {...ghostHover(current)}
                  >
                    <span
                      style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
                    >
                      <span style={{ fontSize: FS.sm, color: 'inherit' }}>
                        {org.name}
                      </span>
                      {org.role && (
                        <span
                          style={{
                            fontSize: FS.xs,
                            color: CHROME.fgDim,
                            textTransform: 'capitalize',
                          }}
                        >
                          {org.role}
                        </span>
                      )}
                    </span>
                    {current && <Check />}
                  </button>
                )
              })}
            </div>
          )}

          {/* The way out */}
          <div style={{ padding: 8 }}>
            <a
              role="menuitem"
              href={`${domains.iam}/account`}
              onClick={() => setOpen(false)}
              style={link}
              {...ghostHover()}
            >
              Account settings
            </a>
            <a
              role="menuitem"
              href={domains.billing}
              onClick={() => setOpen(false)}
              style={link}
              {...ghostHover()}
            >
              Billing
            </a>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onSignOut?.()
              }}
              style={{ ...link, color: CHROME.fgDim }}
              {...ghostHover(false, CHROME.fgDim)}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform 150ms ease',
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function Check() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

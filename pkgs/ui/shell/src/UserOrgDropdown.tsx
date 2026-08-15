'use client'

/**
 * UserOrgDropdown — the account control at the right edge of OrgHeader:
 * who you are, which org you are acting as, and the way out.
 *
 * Self-contained by design: inline styles + theme.ts tokens, React the only
 * runtime dependency, ZERO CSS-framework coupling.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { HanzoUser, HanzoOrg, OrgPage, OrgQuery } from './types'
import { ORG_DOMAINS } from './types'
import { UserAvatar } from './UserAvatar'
import {
  CHROME,
  CTRL_H,
  FS,
  LABEL,
  PANEL,
  R,
  Z,
  control,
  ghostHover,
  row,
} from './theme'
import { useShellStyles } from './shellStyles'
import { useMediaQuery } from './useMediaQuery'
import { Masquerade } from './Masquerade'

export interface UserOrgDropdownProps {
  user?: HanzoUser
  /** The caller's own memberships. Rendered immediately — no round trip. */
  organizations?: HanzoOrg[]
  currentOrgId?: string
  onOrgSwitch?: (orgId: string) => void
  onSignOut?: () => void
  /**
   * Ask the server for organizations — filtered, sorted and paged by it.
   *
   * Supplying this adds the search field. The switcher never holds a full list:
   * one caller can reach every org in the system, so "render them all" is not a
   * size the client can be right about. Type and it queries; scroll and it asks
   * for the next page.
   */
  findOrgs?: (query: OrgQuery) => Promise<OrgPage>
  /**
   * Act as an org the caller does not belong to.
   *
   * Rendered only for rows the SERVER marked as reach (`OrgPage.reach`) — and
   * only when the host wired this. A privilege the API did not offer has no
   * affordance here, and switching to your own org never comes through here:
   * that is `onOrgSwitch`, a different act with a different word.
   */
  onMasquerade?: (orgId: string) => void
  /** The org being acted as, while a masquerade is running. */
  masquerade?: HanzoOrg
  /** Return to your own identity. */
  onMasqueradeStop?: () => void
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
  findOrgs,
  onMasquerade,
  masquerade,
  onMasqueradeStop,
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

  const [q, setQ] = useState('')
  const [page, setPage] = useState<OrgPage | null>(null)
  const [loading, setLoading] = useState(false)
  // Every query carries the text it was asked for, so a slow first page can
  // never land on top of a newer one and show results for a stale word.
  const asked = useRef('')

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Ask the server, once the typing settles.
  useEffect(() => {
    if (!findOrgs || !open) return
    const text = q
    asked.current = text
    setLoading(true)
    const timer = setTimeout(() => {
      findOrgs({ q: text })
        .then((next) => {
          if (asked.current !== text) return
          setPage(next)
        })
        .catch(() => {
          if (asked.current === text) setPage(null)
        })
        .finally(() => {
          if (asked.current === text) setLoading(false)
        })
    }, 180)
    return () => clearTimeout(timer)
  }, [q, open, findOrgs])

  // The next page, when the list is scrolled to its end.
  const more = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const box = e.currentTarget
      if (loading || !page?.cursor || !findOrgs) return
      if (box.scrollTop + box.clientHeight < box.scrollHeight - 24) return
      const text = q
      setLoading(true)
      findOrgs({ q: text, cursor: page.cursor })
        .then((next) => {
          if (asked.current !== text) return
          setPage((prev) => ({
            ...next,
            orgs: [...(prev?.orgs ?? []), ...next.orgs],
          }))
        })
        .finally(() => setLoading(false))
    },
    [loading, page, findOrgs, q]
  )

  if (!user) return null

  const currentOrg = organizations.find((o) => o.id === currentOrgId)
  const orgSlug = currentOrg?.slug || 'hanzo'
  const domains = ORG_DOMAINS[orgSlug] || ORG_DOMAINS.hanzo

  const link: React.CSSProperties = { ...row(), ...ROW_SHAPE }

  const needle = q.trim().toLowerCase()
  // The caller's own orgs are already in memory and there are few of them, so
  // filtering them here is instant — which is what switching has always been.
  // The server's work starts where the caller's memberships end.
  const mine = needle
    ? organizations.filter((o) =>
        `${o.name} ${o.slug ?? ''}`.toLowerCase().includes(needle)
      )
    : organizations
  // Rows the server marked as reach, minus anything already listed above. No
  // reach page and no handler for it means this is empty and the section is not
  // rendered at all.
  const reach =
    page?.reach && onMasquerade
      ? page.orgs.filter((o) => !organizations.some((m) => m.id === o.id))
      : []

  return (
    <div
      ref={ref}
      data-hanzo-shell=""
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 0,
      }}
    >
      {/* Persistent while it is running, wherever this switcher is mounted. */}
      {masquerade ? (
        <Masquerade org={masquerade} onStop={onMasqueradeStop} />
      ) : null}
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
          {findOrgs ? (
            <div style={{ ...SECTION, padding: 8 }}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Find an organization"
                aria-label="Find an organization"
                style={{
                  width: '100%',
                  height: CTRL_H,
                  padding: '0 10px',
                  boxSizing: 'border-box',
                  border: `1px solid ${CHROME.border}`,
                  borderRadius: R.row,
                  background: CHROME.raised,
                  color: CHROME.fg,
                  fontFamily: 'inherit',
                  fontSize: FS.sm,
                }}
              />
            </div>
          ) : null}

          {(mine.length > 0 || reach.length > 0) && (
            <div
              onScroll={more}
              style={{ ...SECTION, padding: 8, maxHeight: 320, overflowY: 'auto' }}
            >
              {mine.length > 0 && (
                <>
                  <p style={{ ...LABEL, margin: 0, padding: '2px 8px 4px' }}>
                    Organizations
                  </p>
                  {mine.map((org) => (
                    <OrgRow
                      key={org.id}
                      org={org}
                      current={org.id === currentOrgId}
                      onPick={() => {
                        onOrgSwitch?.(org.id)
                        setOpen(false)
                      }}
                    />
                  ))}
                </>
              )}

              {/* Beyond your memberships — present only because the server
                  answered with it. */}
              {reach.length > 0 && (
                <>
                  <p
                    style={{
                      ...LABEL,
                      margin: 0,
                      padding: mine.length ? '10px 8px 4px' : '2px 8px 4px',
                    }}
                  >
                    All organizations
                  </p>
                  {reach.map((org) => (
                    <OrgRow
                      key={org.id}
                      org={org}
                      current={false}
                      hint="Act as"
                      onPick={() => {
                        onMasquerade?.(org.id)
                        setOpen(false)
                      }}
                    />
                  ))}
                </>
              )}

              {loading && (
                <p
                  style={{
                    margin: 0,
                    padding: '6px 8px',
                    fontSize: FS.xs,
                    color: CHROME.fgDim,
                  }}
                >
                  Searching…
                </p>
              )}
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

/**
 * One organization in the list. The same row whether it is yours or one you are
 * reaching into — what differs is the word on it and what the click calls.
 */
function OrgRow({
  org,
  current,
  hint,
  onPick,
}: {
  org: HanzoOrg
  current: boolean
  hint?: string
  onPick: () => void
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={current}
      onClick={onPick}
      style={{ ...row(current), ...ROW_SHAPE, justifyContent: 'space-between' }}
      {...ghostHover(current)}
    >
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span
          style={{
            fontSize: FS.sm,
            color: 'inherit',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {org.name}
        </span>
        {(hint || org.role) && (
          <span
            style={{
              fontSize: FS.xs,
              color: CHROME.fgDim,
              textTransform: hint ? 'none' : 'capitalize',
            }}
          >
            {hint ?? org.role}
          </span>
        )}
      </span>
      {current && <Check />}
    </button>
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

'use client'

/**
 * HanzoIdentity — the header's identity cluster. One action when there is no
 * session; the account menu when there is.
 *
 * Hanzo IAM (hanzo.id) is the ONE identity provider, and this component never
 * runs a session of its own. It renders a control and calls back: the host's
 * `@hanzo/iam` client owns the authorization-code + PKCE round trip, the tokens
 * and the refresh. That separation is the point — shared chrome that held a
 * credential would be a second way to authenticate, and there is only one.
 *
 * ONE ACTION, deliberately. No email or password field, no provider buttons, no
 * emailed-link fallback. Every method IAM has enabled — social, passkey,
 * wallet, one-time code — lives on the IAM login page, which is the only
 * surface that knows which of them are turned on today; a button here for any
 * one of them is a guess that goes stale silently. Signing up is the same door
 * (IAM's page offers it), so the header never grows a second control that
 * splits one flow in two.
 *
 * The menu is CHROME, not page content: it wears the dark chrome material at
 * every width and in every host theme (see `PANEL` in theme.ts).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CHROME, FS, PANEL, R, Z, control, ghostHover, row } from './theme'
import { U, type HanzoLink } from './hanzo-registry'
import type { HanzoUser } from './types'
import { UserAvatar } from './UserAvatar'
import { useRove } from './rove'

/**
 * What the header needs to show who you are — and nothing else. No token, no
 * client, no config: a host that has an IAM client passes `onSignIn`/`onSignOut`
 * and its mapped `user`; a static surface passes nothing and still gets the
 * same control, pointing at the same provider.
 */
export interface HanzoAuth {
  /** The signed-in person. Absent ⇒ the sign-in action. */
  user?: HanzoUser | null
  /**
   * Start IAM sign-in — the host's `startLogin()` from `@hanzo/iam`, which runs
   * authorization-code + PKCE-S256 against `/v1/iam/oauth/authorize`. Omit it
   * and the control is a plain link to the provider.
   */
  onSignIn?: () => void
  /** End the session — the host's `logout()`. */
  onSignOut?: () => void
  /**
   * Where the action points before hydration and without JavaScript. Defaults
   * to the provider itself, so the control is a real link at first paint.
   */
  signInHref?: string
  /** Extra account-menu rows (Billing, Settings, …), above Sign out. */
  items?: HanzoLink[]
  /** Label for the signed-out action. */
  label?: string
}

export interface HanzoIdentityProps {
  auth: HanzoAuth
}

export function HanzoIdentity({ auth }: HanzoIdentityProps) {
  const { user, onSignIn, onSignOut, signInHref = U.id, items, label = 'Sign in' } = auth

  if (!user) {
    return (
      <a
        href={signInHref}
        style={control()}
        onClick={
          onSignIn
            ? (e) => {
                // Only intercept once there is a client to run the flow. Without
                // one the link still reaches the provider, which is the honest
                // fallback rather than a dead button.
                e.preventDefault()
                onSignIn()
              }
            : undefined
        }
        {...ghostHover()}
      >
        {label}
      </a>
    )
  }

  return <AccountMenu user={user} items={items} onSignOut={onSignOut} />
}

/* ── The signed-in menu ───────────────────────────────────────────────────── */

function AccountMenu({
  user,
  items,
  onSignOut,
}: {
  user: HanzoUser
  items?: HanzoLink[]
  onSignOut?: () => void
}) {
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const rove = useRove(open, close, true)
  const name = user.name || user.email || 'Account'

  // A menu anchored to a control closes when the pointer goes elsewhere. Esc is
  // handled by the roving focus the panel already carries.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={boxRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={name}
        onClick={() => setOpen((v) => !v)}
        style={{ ...control(open), width: 34, padding: 0 }}
      >
        <UserAvatar src={user.avatar} email={user.email} name={user.name} size={26} />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Account"
          ref={rove.ref}
          onKeyDown={rove.onKeyDown}
          onFocus={rove.onFocus}
          data-hanzo-shell=""
          style={{
            ...PANEL,
            position: 'absolute',
            top: 46,
            right: 0,
            zIndex: Z.dropdown as unknown as number,
            width: 'max-content',
            minWidth: 200,
            maxWidth: 280,
            padding: 8,
            color: CHROME.fg,
            fontFamily: CHROME.font,
            transformOrigin: 'top right',
            animation: 'hanzo-card-in 200ms cubic-bezier(.2,.9,.3,1.1) both',
          }}
        >
          <div
            style={{
              padding: '4px 8px 8px',
              marginBottom: 4,
              borderBottom: `1px solid ${CHROME.borderSoft}`,
            }}
          >
            <div style={{ fontSize: FS.sm, fontWeight: 600, color: CHROME.fg }}>
              {name}
            </div>
            {user.email && user.name ? (
              <div style={{ marginTop: 1, fontSize: FS.xs, color: CHROME.fgDim }}>
                {user.email}
              </div>
            ) : null}
          </div>

          {(items ?? DEFAULT_ITEMS).map((item) => (
            <a
              key={item.id}
              href={item.href}
              role="menuitem"
              onClick={close}
              style={{ ...row(), fontWeight: 500 }}
              {...ghostHover()}
            >
              {item.label}
            </a>
          ))}

          {onSignOut ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close()
                onSignOut()
              }}
              style={{
                ...row(),
                width: '100%',
                textAlign: 'left',
                border: 'none',
                borderRadius: R.row,
                background: 'transparent',
                fontFamily: 'inherit',
                fontWeight: 500,
                cursor: 'pointer',
              }}
              {...ghostHover()}
            >
              Sign out
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

/** Where an account menu goes when the host names nothing of its own. */
const DEFAULT_ITEMS: HanzoLink[] = [
  { id: 'account', label: 'Account', href: U.account },
  { id: 'billing', label: 'Billing', href: U.billing },
]

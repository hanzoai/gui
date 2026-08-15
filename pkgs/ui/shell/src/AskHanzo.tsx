'use client'

/**
 * AskHanzo — the reusable "Ask Hanzo" AI-chat affordance, identical on every
 * property. A trigger button opens a chat (message list + composer). By default
 * it POSTs to the Hanzo AI endpoint (OpenAI-compatible); a caller can fully
 * override the transport with `onSubmit`.
 *
 * TWO DOCKS, ONE CHAT. `corner` mounts it as the visitor chat every public
 * surface carries: a small round launcher tucked into the bottom-right, opening
 * a card above itself. Without it the chat is a right-side drawer for a surface
 * that wants the room. Same messages, same composer, same transport — where it
 * sits is a parameter, not a second component, because two chat UIs is how the
 * answers start differing by page.
 *
 * SECURITY: this component NEVER embeds a secret. Public/anonymous deployments
 * point `endpoint` at a proxy that injects auth server-side; authenticated
 * deployments pass a short-lived token via `authToken` or, better, own the call
 * entirely with `onSubmit`.
 *
 * Self-contained: inline styles + theme.ts tokens, React the only runtime dep.
 * Accessible: real buttons, Esc closes and restores focus, the composer
 * autofocuses on open, the message log is an aria-live region.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ACCENT,
  ACCENT_SOFT,
  ACCENT_SOFTER,
  CHROME,
  CTRL_H,
  FS,
  PANEL,
  R,
  SCRIM,
  SHADOW,
  SHADOW_LEFT,
  TAP_H,
  Z,
  control,
  cta,
  ghostHover,
} from './theme'
import { MARKS } from './glyph'
import { U } from './hanzo-registry'
import type { HanzoAuth } from './HanzoIdentity'
import { useShellStyles } from './shellStyles'

export interface AskHanzoMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AskHanzoProps {
  /** OpenAI-compatible chat endpoint. Default: the Hanzo AI gateway. */
  endpoint?: string
  /** Model id. Default: `enso-free`, the house free tier. */
  model?: string
  /**
   * The credential this turn is admitted by: the visitor's OWN bearer, so the
   * turn meters to their account.
   *
   * There is no signed-out value for this. A publishable key (`pk-`) is
   * read-only — it answers `/v1/models` and refuses completions — and a secret
   * key (`sk-`) is spendable, so putting one in shared chrome would ship a
   * spendable secret to every page that mounts it. Anonymous inference needs a
   * SERVER holding the key, never the browser; until an endpoint offers that,
   * a visitor with no bearer is invited to sign in rather than shown a chat
   * that would refuse them.
   */
  authToken?: string
  /**
   * The identity cluster's data, used for the one sign-in action this offers
   * when there is no way to answer a turn. Same shape, same provider, same
   * single action as the header's — see <HanzoIdentity>.
   */
  auth?: HanzoAuth
  /** Composer placeholder. */
  placeholder?: string
  /** Fully override the transport — return the assistant reply for a turn. */
  onSubmit?: (message: string, history: AskHanzoMessage[]) => Promise<string>
  /**
   * Mount as the corner visitor chat: a small round launcher in the
   * bottom-right, opening a card above it instead of the full-height drawer.
   */
  corner?: boolean
  /** Custom trigger. Defaults to the corner launcher, or an "Ask Hanzo" pill. */
  trigger?: (open: () => void) => React.ReactNode
  /** Greeting shown before the first turn. */
  greeting?: string
  className?: string
}

const DEFAULT_ENDPOINT = 'https://api.hanzo.ai/v1/chat/completions'

/**
 * The corner dock. The launcher is the thumb's size and no bigger — it sits
 * over the page for the whole visit, so anything larger is a permanent hole in
 * the layout — and it rides in the page's own 16px gutter, the one the header
 * already keeps, so it reads as tucked into the corner rather than floating
 * near it.
 */
const LAUNCHER = TAP_H
const EDGE = 16
/** The card clears the launcher and the gap above it. */
const CARD_LIFT = EDGE + LAUNCHER + 10

export function AskHanzo({
  endpoint = DEFAULT_ENDPOINT,
  model = 'enso-free',
  authToken,
  placeholder = 'Ask Hanzo anything…',
  onSubmit,
  auth,
  corner,
  trigger,
  greeting = 'Ask about products, models, APIs, or how to get started.',
  className,
}: AskHanzoProps) {
  useShellStyles()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AskHanzoMessage[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Can a turn be answered at all? The host either owns the transport or has
  // handed us the visitor's own credential. Neither means the honest thing to
  // show is the way to get one, not a composer that will be refused.
  const canChat = !!(onSubmit || authToken)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  const openPanel = useCallback(() => {
    restoreRef.current = (document.activeElement as HTMLElement) ?? null
    setOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setOpen(false)
    restoreRef.current?.focus?.()
  }, [])

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => inputRef.current?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanel()
        return
      }
      // Trap Tab within the panel while it is a modal dialog. The corner card
      // is not modal — the page behind it stays usable, so Tab must leave.
      if (e.key === 'Tab' && !corner) {
        const root = panelRef.current
        if (!root) return
        const focusables = root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement
        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closePanel, corner])

  useEffect(() => {
    // Keep the newest message in view.
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages, busy])

  const send = useCallback(async () => {
    const text = draft.trim()
    if (!text || busy) return
    setError(null)
    setDraft('')
    const history = messages
    const next: AskHanzoMessage[] = [...history, { role: 'user', content: text }]
    setMessages(next)
    setBusy(true)
    try {
      let reply: string
      if (onSubmit) {
        reply = await onSubmit(text, history)
      } else {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({ model, messages: next }),
        })
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data = await res.json()
        reply = data?.choices?.[0]?.message?.content ?? '(no response)'
      }
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [draft, busy, messages, onSubmit, endpoint, authToken, model])

  return (
    <span className={className}>
      {trigger ? (
        trigger(openPanel)
      ) : corner ? (
        <CornerLauncher open={open} onClick={open ? closePanel : openPanel} />
      ) : (
        <button
          type="button"
          onClick={openPanel}
          style={{ ...control(), gap: 6, border: `1px solid ${CHROME.border}` }}
          {...ghostHover()}
        >
          <Sparkle />
          Ask Hanzo
        </button>
      )}

      {open ? (
        <>
          {corner ? null : (
            <div
              aria-hidden="true"
              onClick={closePanel}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: Z.overlay as unknown as number,
                background: SCRIM,
              }}
            />
          )}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal={corner ? undefined : 'true'}
            aria-label="Ask Hanzo"
            data-hanzo-shell=""
            style={{
              position: 'fixed',
              zIndex: Z.modal as unknown as number,
              display: 'flex',
              flexDirection: 'column',
              color: CHROME.fg,
              fontFamily: CHROME.font,
              ...(corner
                ? {
                    // Anchored to the same corner as the launcher, and never
                    // wider than the phone it opens on.
                    right: EDGE,
                    bottom: CARD_LIFT,
                    width: `min(380px, calc(100vw - ${EDGE * 2}px))`,
                    // A conversation needs the room; an invitation does not.
                    // Sizing to content is what keeps the closed-to-open jump
                    // from putting an empty half-screen panel over the page.
                    ...(canChat
                      ? { height: `min(560px, calc(100vh - ${CARD_LIFT + EDGE}px))` }
                      : { maxHeight: `calc(100vh - ${CARD_LIFT + EDGE}px)` }),
                    ...PANEL,
                    overflow: 'hidden',
                    transformOrigin: 'bottom right',
                    animation: 'hanzo-card-in 200ms cubic-bezier(.2,.9,.3,1.1) both',
                  }
                : {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 'min(440px, 100vw)',
                    background: CHROME.panel,
                    borderLeft: `1px solid ${CHROME.border}`,
                    boxShadow: SHADOW_LEFT,
                  }),
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 56,
                padding: '0 14px',
                borderBottom: `1px solid ${CHROME.border}`,
                flexShrink: 0,
              }}
            >
              <Sparkle />
              <strong style={{ fontSize: FS.base, fontWeight: 700 }}>Ask Hanzo</strong>
              <div style={{ flex: 1 }} />
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: CTRL_H,
                  height: CTRL_H,
                  border: 'none',
                  borderRadius: R.pill,
                  background: 'transparent',
                  color: CHROME.fg,
                }}
              >
                <CloseGlyph />
              </button>
            </div>

            {/* Message log */}
            <div
              ref={logRef}
              aria-live="polite"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {messages.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: FS.sm,
                    color: CHROME.fgMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {canChat
                    ? greeting
                    : 'Sign in and Enso answers questions about products, models, APIs, and how to get started.'}
                </p>
              ) : (
                messages.map((m, i) => <Bubble key={i} message={m} />)
              )}
              {busy ? (
                <div style={{ fontSize: FS.sm, color: CHROME.fgDim }}>Thinking…</div>
              ) : null}
              {error ? (
                <div
                  role="alert"
                  style={{
                    fontSize: FS.sm,
                    color: CHROME.fg,
                    background: ACCENT_SOFT,
                    border: `1px solid ${ACCENT_SOFTER}`,
                    borderRadius: R.row,
                    padding: '8px 10px',
                  }}
                >
                  {error}
                </div>
              ) : null}
            </div>

            {/* Composer, when a turn can be answered */}
            {canChat ? (
            <div
              style={{
                padding: 12,
                borderTop: `1px solid ${CHROME.border}`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 8,
                  padding: 8,
                  border: `1px solid ${CHROME.border}`,
                  borderRadius: R.card,
                  background: CHROME.raised,
                }}
              >
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void send()
                    }
                  }}
                  rows={1}
                  placeholder={placeholder}
                  style={{
                    flex: 1,
                    resize: 'none',
                    maxHeight: 140,
                    border: 'none',
                    // No `outline: 'none'` here. This textarea has no <label>
                    // wrapper and its parent's border is static, so suppressing
                    // the outline leaves the composer with NO focus indicator at
                    // all. shellStyles' :focus-visible rule is the indicator —
                    // let it land.
                    background: 'transparent',
                    color: CHROME.fg,
                    fontSize: FS.sm,
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                  }}
                />
                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={!draft.trim() || busy}
                  aria-label="Send"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    border: 'none',
                    borderRadius: R.pill,
                    background: draft.trim() && !busy ? ACCENT : CHROME.hover,
                    color: draft.trim() && !busy ? CHROME.panel : CHROME.fgDim,
                  }}
                >
                  <SendGlyph />
                </button>
              </div>
            </div>
            ) : null}
            {/* No way to answer a turn — offer the way to get one. */}
            {canChat ? null : (
              <div
                style={{
                  padding: 12,
                  borderTop: `1px solid ${CHROME.border}`,
                  flexShrink: 0,
                }}
              >
                <a
                  href={auth?.signInHref ?? U.id}
                  onClick={
                    auth?.onSignIn
                      ? (e) => {
                          e.preventDefault()
                          auth.onSignIn!()
                        }
                      : undefined
                  }
                  style={{ ...cta(true, TAP_H), width: '100%' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {auth?.label ?? 'Sign in'} to chat
                </a>
              </div>
            )}
          </div>
        </>
      ) : null}
    </span>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

/**
 * The corner launcher — the enso ring in a single filled pill.
 *
 * It wears the SAME mark the Enso row wears in the Hanzo menu, so what you
 * click and what answers are drawn as one thing. It is also the close: a
 * control that opens a card two inches above itself and then hides behind it
 * makes the visitor hunt for the way out.
 */
function CornerLauncher({ open, onClick }: { open: boolean; onClick: () => void }) {
  const Enso = MARKS.circle
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close Enso' : 'Ask Enso'}
      aria-expanded={open}
      style={{
        position: 'fixed',
        right: EDGE,
        bottom: EDGE,
        zIndex: Z.popover as unknown as number,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: LAUNCHER,
        height: LAUNCHER,
        padding: 0,
        border: 'none',
        borderRadius: R.pill,
        background: ACCENT,
        color: CHROME.panel,
        boxShadow: SHADOW,
        cursor: 'pointer',
        transition: 'opacity 120ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      {open ? <CloseGlyph /> : <Enso size={22} />}
    </button>
  )
}

function Bubble({ message }: { message: AskHanzoMessage }) {
  const user = message.role === 'user'
  return (
    <div
      style={{
        alignSelf: user ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        padding: '9px 12px',
        borderRadius: R.card,
        background: user ? ACCENT_SOFT : CHROME.raised,
        border: `1px solid ${CHROME.border}`,
        fontSize: FS.sm,
        lineHeight: 1.5,
        color: CHROME.fg,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {message.content}
    </div>
  )
}

function Sparkle() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2zM19 15l.9 2.4L22 18l-2.1.8L19 21l-.9-2.2L16 18l2.1-.6L19 15z" />
    </svg>
  )
}

function SendGlyph() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function CloseGlyph() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

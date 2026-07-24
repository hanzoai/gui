'use client'

/**
 * AskHanzo — the reusable "Ask Hanzo" AI-chat affordance, identical on every
 * property. A trigger button opens a right-side slide-in panel with a minimal
 * chat UI (message list + composer). By default it POSTs to the Hanzo AI
 * endpoint (OpenAI-compatible); a caller can fully override the transport with
 * `onSubmit`.
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
import { ACCENT, ACCENT_SOFT, CHROME, FS, Z } from './theme'
import { useShellFocusRing } from './focusRing'

export interface AskHanzoMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AskHanzoProps {
  /** OpenAI-compatible chat endpoint. Default: the Hanzo AI gateway. */
  endpoint?: string
  /** Model id. Default: `enso`. */
  model?: string
  /** Short-lived bearer token, if the endpoint requires one (never a secret). */
  authToken?: string
  /** Composer placeholder. */
  placeholder?: string
  /** Fully override the transport — return the assistant reply for a turn. */
  onSubmit?: (message: string, history: AskHanzoMessage[]) => Promise<string>
  /** Custom trigger. Defaults to an "Ask Hanzo" pill button. */
  trigger?: (open: () => void) => React.ReactNode
  /** Greeting shown before the first turn. */
  greeting?: string
  className?: string
}

const DEFAULT_ENDPOINT = 'https://api.hanzo.ai/v1/chat/completions'

export function AskHanzo({
  endpoint = DEFAULT_ENDPOINT,
  model = 'enso',
  authToken,
  placeholder = 'Ask Hanzo anything…',
  onSubmit,
  trigger,
  greeting = 'Ask about products, models, APIs, or how to get started.',
  className,
}: AskHanzoProps) {
  useShellFocusRing()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AskHanzoMessage[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      // Trap Tab within the panel while it is a modal dialog.
      if (e.key === 'Tab') {
        const root = panelRef.current
        if (!root) return
        const focusables = root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
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
  }, [open, closePanel])

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
      ) : (
        <button
          type="button"
          onClick={openPanel}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 34,
            padding: '0 13px',
            border: `1px solid ${CHROME.border}`,
            borderRadius: 9,
            background: 'transparent',
            color: CHROME.fg,
            fontSize: FS.sm,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = CHROME.hover
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
          }}
        >
          <Sparkle />
          Ask Hanzo
        </button>
      )}

      {open ? (
        <>
          <div
            aria-hidden="true"
            onClick={closePanel}
            style={{ position: 'fixed', inset: 0, zIndex: Z.overlay as unknown as number, background: 'rgba(0,0,0,0.45)' }}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Ask Hanzo"
            data-hanzo-shell=""
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(440px, 100vw)',
              zIndex: Z.modal as unknown as number,
              display: 'flex',
              flexDirection: 'column',
              background: CHROME.panel,
              borderLeft: `1px solid ${CHROME.border}`,
              boxShadow: '-24px 0 60px -20px rgba(0,0,0,0.7)',
              color: CHROME.fg,
              fontFamily: CHROME.font,
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
                  width: 34,
                  height: 34,
                  border: 'none',
                  borderRadius: 8,
                  background: 'transparent',
                  color: CHROME.fg,
                  cursor: 'pointer',
                }}
              >
                <CloseGlyph />
              </button>
            </div>

            {/* Message log */}
            <div
              ref={logRef}
              aria-live="polite"
              style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {messages.length === 0 ? (
                <p style={{ margin: 0, fontSize: FS.sm, color: CHROME.fgMuted, lineHeight: 1.5 }}>{greeting}</p>
              ) : (
                messages.map((m, i) => <Bubble key={i} message={m} />)
              )}
              {busy ? (
                <div style={{ fontSize: FS.sm, color: CHROME.fgDim }}>Thinking…</div>
              ) : null}
              {error ? (
                <div style={{ fontSize: FS.sm, color: CHROME.fg, background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: 10, padding: '8px 10px' }}>
                  {error}
                </div>
              ) : null}
            </div>

            {/* Composer */}
            <div style={{ padding: 12, borderTop: `1px solid ${CHROME.border}`, flexShrink: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 8,
                  padding: 8,
                  border: `1px solid ${CHROME.border}`,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
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
                    outline: 'none',
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
                    borderRadius: 8,
                    background: draft.trim() && !busy ? ACCENT : CHROME.hover,
                    color: draft.trim() && !busy ? '#0b0b0f' : CHROME.fgDim,
                    cursor: draft.trim() && !busy ? 'pointer' : 'default',
                  }}
                >
                  <SendGlyph />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </span>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function Bubble({ message }: { message: AskHanzoMessage }) {
  const user = message.role === 'user'
  return (
    <div
      style={{
        alignSelf: user ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        padding: '9px 12px',
        borderRadius: 12,
        background: user ? ACCENT_SOFT : 'rgba(255,255,255,0.04)',
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
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2zM19 15l.9 2.4L22 18l-2.1.8L19 21l-.9-2.2L16 18l2.1-.6L19 15z" />
    </svg>
  )
}

function SendGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function CloseGlyph() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

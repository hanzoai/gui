'use client'

/**
 * Notifications — the reader's own: mentions, direct messages, replies,
 * comments, assignments. The page the account menu's Notifications row opens.
 *
 * It reads `GET /v1/team/inbox`, which answers only the caller's own
 * notifications, newest first, with the unread count over all of them; a row
 * pressed is marked read (`POST …/{id}/read`) and handed to the host to open
 * what it is about; Archive files it away (`POST …/{id}/archive`); Mark all
 * read clears the live list (`POST /v1/team/inbox/read`). These are the rows
 * the Team client's own inbox reads, so clearing one here clears it there.
 *
 * THE HOST MAKES THE CALL. This package holds no credential and knows no
 * address: `call` is the host's authenticated JSON request against its own
 * gateway, so the bearer and the org travel exactly as every other request of
 * that app does.
 */
import React, { useEffect, useRef, useState } from 'react'
import { MARKS } from './glyph.tsx'
import { useFrameStyles } from './shellStyles.ts'
import { FRAME, FS } from './theme.ts'

/** One notification, as the platform answers it. */
export interface Notice {
  id: string
  /** Why it was filed: mention, dm, reply, comment, assigned, other. */
  reason?: string
  read?: boolean
  archived?: boolean
  /** Unix milliseconds. */
  createdOn?: number
  space?: string
  room?: string
  doc?: string
  thread?: string
  /** The message that caused it; absent once that message is gone. */
  message?: { id?: string; text?: string; author?: string; room?: string }
}

export interface NotificationsProps {
  /** The host's authenticated JSON request. */
  call: (
    path: string,
    init?: { method?: 'GET' | 'POST'; body?: unknown }
  ) => Promise<unknown>
  /** Open what a notification is about, once it is marked read. */
  onOpen?: (notice: Notice) => void
}

const INBOX = '/v1/team/inbox'

/** A Map, not an object: a reason the server names is data, and `__proto__` is a key. */
const REASON = new Map<string, string>([
  ['mention', 'Mentioned you'],
  ['dm', 'Direct message'],
  ['reply', 'Replied in a thread'],
  ['comment', 'Commented'],
  ['assigned', 'Assigned to you'],
])

/**
 * An id that is one path segment and nothing more. It is spliced into
 * `/v1/team/inbox/{id}/…`, and an id of `.` or `..` survives URL encoding and
 * is then resolved as a segment — `.` would turn "mark this read" into "mark
 * all read". A notification whose id is not a plain token is not acted on.
 */
const SEGMENT = /^[A-Za-z0-9_-]+$/

/** Today a clock, this year a date, before that the year too. */
function when(ms: number | undefined, now: Date): string {
  if (!ms) return ''
  const at = new Date(ms)
  if (Number.isNaN(at.getTime())) return ''
  if (at.toDateString() === now.toDateString())
    return at.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return at.toLocaleDateString(
    undefined,
    at.getFullYear() === now.getFullYear()
      ? { month: 'short', day: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' }
  )
}

/** A refusal in a sentence: what failed, not a stack. */
function say(e: unknown): string {
  const status = (e as { status?: number })?.status
  if (status === 401 || status === 403)
    return 'Notifications are not open to this session.'
  return 'Your notifications could not be read just now.'
}

/** The page's body: what the list holds, read and kept. */
export function Notifications({ call, onOpen }: NotificationsProps) {
  useFrameStyles()
  const [items, setItems] = useState<Notice[] | null>(null)
  const [unread, setUnread] = useState(0)
  const [wrong, setWrong] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  // The newest `call`, so a host that builds it inline does not re-read the
  // list on every render of its own.
  const host = useRef(call)
  host.current = call

  useEffect(() => {
    let live = true
    host
      .current(INBOX)
      .then((body) => {
        if (!live) return
        const b = (body ?? {}) as { items?: unknown; unread?: unknown }
        setItems(Array.isArray(b.items) ? (b.items as Notice[]) : [])
        setUnread(typeof b.unread === 'number' ? b.unread : 0)
      })
      .catch((e: unknown) => {
        if (!live) return
        setItems(null)
        setWrong(say(e))
      })
    return () => {
      live = false
    }
    // Read once, on arrival: the page is opened to be read, not watched.
  }, [])

  const touch = (id: string, patch: Partial<Notice>) =>
    setItems((was) => (was ?? []).map((n) => (n.id === id ? { ...n, ...patch } : n)))

  const open = async (n: Notice) => {
    if (!n.read && SEGMENT.test(n.id)) {
      touch(n.id, { read: true })
      setUnread((u) => Math.max(0, u - 1))
      try {
        await host.current(`${INBOX}/${encodeURIComponent(n.id)}/read`, {
          method: 'POST',
          body: { space: n.space },
        })
      } catch (e) {
        // The row goes back to unread: the platform did not take the mark.
        touch(n.id, { read: false })
        setUnread((u) => u + 1)
        setWrong(say(e))
        return
      }
    }
    onOpen?.(n)
  }

  const archive = async (n: Notice) => {
    if (!SEGMENT.test(n.id)) return
    const before = items
    setItems((was) => (was ?? []).filter((x) => x.id !== n.id))
    if (!n.read) setUnread((u) => Math.max(0, u - 1))
    try {
      await host.current(`${INBOX}/${encodeURIComponent(n.id)}/archive`, {
        method: 'POST',
        body: { space: n.space },
      })
    } catch (e) {
      setItems(before)
      if (!n.read) setUnread((u) => u + 1)
      setWrong(say(e))
    }
  }

  const clear = async () => {
    setBusy(true)
    try {
      await host.current(`${INBOX}/read`, { method: 'POST', body: {} })
      setItems((was) => (was ?? []).map((n) => ({ ...n, read: true })))
      setUnread(0)
    } catch (e) {
      setWrong(say(e))
    } finally {
      setBusy(false)
    }
  }

  const now = new Date()
  const note = (text: string) => (
    <p style={{ margin: 0, fontSize: FS.base, color: FRAME.soft }}>{text}</p>
  )

  return (
    <section
      data-slot="notifications"
      aria-label="Notifications"
      style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 32 }}>
        <span style={{ flex: 1, fontSize: FS.base, color: FRAME.soft }}>
          {items === null ? '' : unread ? `${unread} unread` : 'All read'}
        </span>
        {unread > 0 ? (
          <button
            type="button"
            data-frame-row=""
            onClick={() => void clear()}
            disabled={busy}
            style={{ width: 'auto', color: FRAME.ink }}
          >
            <span>{busy ? 'Marking' : 'Mark all read'}</span>
          </button>
        ) : null}
      </div>

      {wrong ? (
        <p role="alert" style={{ margin: 0, fontSize: FS.base, color: FRAME.ink }}>
          {wrong}
        </p>
      ) : null}

      {items === null ? (
        wrong ? null : (
          note('Reading your notifications.')
        )
      ) : items.length === 0 ? (
        note('Nothing yet. Mentions, direct messages and replies land here.')
      ) : (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {items.map((n) => (
            <li key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                data-frame-row=""
                onClick={() => void open(n)}
                style={{
                  alignItems: 'flex-start',
                  padding: '10px 12px',
                  color: FRAME.ink,
                }}
              >
                <span
                  aria-label={n.read ? undefined : 'Unread'}
                  style={{
                    flex: 'none',
                    width: 8,
                    height: 8,
                    marginTop: 5,
                    borderRadius: 4,
                    background: n.read ? 'transparent' : FRAME.ink,
                  }}
                />
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    whiteSpace: 'normal',
                  }}
                >
                  <span style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ flex: 1, fontWeight: n.read ? 400 : 600 }}>
                      {REASON.get(String(n.reason ?? '')) ?? 'Notification'}
                    </span>
                    <span style={{ flex: 'none', fontSize: 11, color: FRAME.soft }}>
                      {when(n.createdOn, now)}
                    </span>
                  </span>
                  {typeof n.message?.text === 'string' && n.message.text ? (
                    <span
                      style={{
                        color: FRAME.soft,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {n.message.text}
                    </span>
                  ) : (
                    <span style={{ color: FRAME.soft }}>
                      The message it was about is gone.
                    </span>
                  )}
                </span>
              </button>
              <button
                type="button"
                data-frame-icon=""
                aria-label="Archive"
                title="Archive"
                onClick={() => void archive(n)}
                style={{ minWidth: 36, minHeight: 36 }}
              >
                <MARKS.archive size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

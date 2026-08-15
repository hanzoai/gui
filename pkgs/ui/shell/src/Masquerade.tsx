'use client'

/**
 * Masquerade — the sign that you are acting as an organization that is not
 * yours, and the one click back out of it.
 *
 * It is the LOUDEST thing in the bar on purpose: the filled near-white pill the
 * chrome otherwise spends only on a primary action. Reading someone else's data
 * without knowing it is the failure this exists to prevent, so the sign is
 * persistent (never a toast, never only inside a menu), it NAMES the org, and
 * the way out sits inside it — nobody should have to remember how they got
 * here to leave.
 *
 * Starting a masquerade is a privileged, server-authorized act; this component
 * only reports that one is running. See <UserOrgDropdown> for where it begins.
 */
import React from 'react'
import { ACCENT, CHROME, CTRL_H, FS, R } from './theme'
import type { HanzoOrg } from './types'

export interface MasqueradeProps {
  /** The org being acted as. */
  org: HanzoOrg
  /** Return to your own identity. */
  onStop?: () => void
}

export function Masquerade({ org, onStop }: MasqueradeProps) {
  return (
    <div
      data-hanzo-shell=""
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        // It YIELDS rather than pushes: on a phone the bar is the sign, the
        // account control and little else, and a pill that refused to shrink
        // would shove the way out of the masquerade off the right edge. The
        // name clips; the exit never does.
        flexShrink: 1,
        height: CTRL_H,
        padding: onStop ? '0 4px 0 12px' : '0 12px',
        borderRadius: R.pill,
        background: ACCENT,
        color: CHROME.panel,
        fontFamily: CHROME.font,
        fontSize: FS.sm,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        minWidth: 0,
      }}
    >
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
        }}
      >
        {/* Named, not hinted. "Acting as" is the whole state in two words. */}
        Acting as {org.name}
      </span>
      {onStop ? (
        <button
          type="button"
          onClick={onStop}
          aria-label={`Stop acting as ${org.name}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 26,
            height: 26,
            flexShrink: 0,
            padding: 0,
            border: 'none',
            borderRadius: R.pill,
            background: 'rgba(0,0,0,0.10)',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}

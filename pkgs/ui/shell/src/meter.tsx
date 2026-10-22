'use client'

/**
 * Meter — the plan a viewer holds, and how much of the period is left.
 *
 * It renders in the account menu, above the rows, because that is where someone
 * goes to ask "did my payment work" and the menu is the one surface every Hanzo
 * property already shares. One component, three sites.
 *
 * MONOCHROME, like the rest of the chrome ("there is no brand hue anywhere in
 * the chrome"). A meter is the obvious place to reach for green-amber-red, and
 * that would be the only colour on the bar — so the reading is carried by fill
 * and by weight, and the one state worth calling out says so in words. Words
 * survive a colour-blind reader and a greyscale screenshot; a hue does not.
 *
 * It renders NOTHING while the plan is resolving, and nothing for a viewer with
 * no plan. A signed-in free user is not told they are on nothing — the menu just
 * carries its usual rows, which is what it did before this existed.
 */
import React from 'react'
import { phrase } from '@hanzo/i18n'
import { useI18n } from '@hanzo/i18n/react'
import { CHROME, FS, R } from './theme.ts'
import type { Plan } from './usePlan.ts'
import { resetsAt } from './usage.ts'

/**
 * One sentence per span, because the span is a noun inside the sentence and a
 * language inflects it there. A Map, since the span is the server's word.
 */
const REACHED = new Map([
  ['hour', phrase('hour limit reached')],
  ['day', phrase('day limit reached')],
  ['week', phrase('week limit reached')],
  ['month', phrase('month limit reached')],
])
const LEFT = new Map([
  ['hour', phrase('{n} left this hour')],
  ['day', phrase('{n} left this day')],
  ['week', phrase('{n} left this week')],
  ['month', phrase('{n} left this month')],
])

export interface MeterProps {
  /** The resolved plan, from `usePlan()`. */
  plan: Plan
  /** Where "manage" points. Omitted, the plan name is not a link. */
  href?: string
}

export function Meter({ plan, href }: MeterProps) {
  const { t } = useI18n()
  // Nothing to say yet, or nothing to say at all. A skeleton here would flash on
  // every menu open for a reading most viewers do not have.
  if (plan.loading || plan.state !== 'plan') return null

  const { usage } = plan

  const name = (
    <span style={{ fontSize: FS.sm, fontWeight: 600, color: CHROME.fg }}>
      {plan.name}
    </span>
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '8px 8px 10px',
        marginBottom: 4,
        borderBottom: `1px solid ${CHROME.borderSoft}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        {href ? (
          <a href={href} style={{ textDecoration: 'none' }}>
            {name}
          </a>
        ) : (
          name
        )}
        {usage ? (
          <span
            style={{
              fontSize: FS.xs,
              color: usage.over ? CHROME.fg : CHROME.fgDim,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {/* The COUNT, not a percentage. "84 left today" is something a
                person can act on; "8% left" needs arithmetic they do not have
                the denominator for. The bar already carries the proportion. */}
            {usage.over
              ? t(REACHED.get(usage.span) ?? phrase('{span} limit reached'), {
                  span: usage.span,
                })
              : t(LEFT.get(usage.span) ?? phrase('{n} left this {span}'), {
                  n: usage.remaining.toLocaleString(),
                  span: usage.span,
                })}
          </span>
        ) : null}
      </div>

      {usage ? (
        <div
          role="meter"
          aria-valuenow={usage.usedPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('{plan} usage this period', { plan: plan.name })}
          style={{
            height: 3,
            borderRadius: R.pill,
            background: CHROME.borderSoft,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${usage.usedPct}%`,
              height: '100%',
              // Full ink once the plan is spent, softer while there is room —
              // the bar gets more insistent as it fills, without a second hue.
              background: usage.over ? CHROME.fg : CHROME.fgMuted,
              transition: 'width 240ms cubic-bezier(.2,.9,.3,1.1)',
            }}
          />
        </div>
      ) : null}

      {usage && usage.usedPct >= 50 && resetsAt(usage) ? (
        <div style={{ fontSize: FS.xs, color: CHROME.fgDim }}>
          {/* Shown only past halfway. Before that the bound is not the reader's
              problem and the line is noise; after it, "clears at 11:00 PM" is
              the whole answer to "what do I do now". */}
          {t('Clears {time}', { time: resetsAt(usage) })}
        </div>
      ) : null}
    </div>
  )
}

'use client'

/**
 * HanzoPlans — the unified upgrade surface: the subscription ladder rendered as a
 * clean, monochrome comparison of tiers with per-tier price, the ecosystem apps
 * that tier unlocks, its usage limits, and a subscribe/upgrade CTA.
 *
 * Composed from the SAME single sources every other shell surface reads (no
 * second plan list, no second gating rule):
 *   - `HANZO_PLANS`      (hanzo-registry) — the tier ladder: slug · price · limits · rank
 *   - `APP_ENTITLEMENTS` (hanzo-registry) — each app id → the MIN tier that unlocks it
 *   - `entitlements.ts`  — the pure resolver (`rankOf`, `normalizeTier`)
 *   - `useEntitlement()` — the REAL commerce read that resolves the viewer's held tier
 * The viewer's current tier is highlighted; the next tier up is recommended.
 *
 * Self-contained by the shell contract: plain React + inline styles + `theme.ts`
 * tokens, monochrome (no brand hue), keyboard-accessible, ZERO CSS-framework or
 * icon-lib coupling. It NEVER processes payment — the CTA routes to the real
 * commerce checkout/upgrade flow (`checkoutHref`); charging stays in commerce.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  APP_ENTITLEMENTS,
  DEFAULT_PLAN_TIER,
  getPlanTier,
  HANZO_PLANS,
  U,
  UNLIMITED,
  type HanzoPlanKind,
  type HanzoPlanTier,
  type HanzoPlanTierDef,
} from './hanzo-registry'
import { normalizeTier, rankOf } from './entitlements'
import { useEntitlement, type Entitlement, type UseEntitlementOptions } from './useEntitlement'
import { findHanzoApp, type HanzoApp } from './hanzo-apps'
import { ACCENT, ACCENT_SOFT, ACCENT_SOFTER, CHROME, FS, R } from './theme'
import { useShellStyles } from './shellStyles'

const { panel: PANEL_BG, border: BORDER, borderSoft: BORDER_SOFT, fg: FG, fgMuted: FG_MUTED, fgDim: FG_DIM, hover: HOVER_BG, font: FONT } = CHROME

/* ── Kind segments (the axis toggle) ───────────────────────────────────────── */

const KIND_ORDER: HanzoPlanKind[] = ['personal', 'team', 'enterprise']
const KIND_LABEL: Record<HanzoPlanKind, string> = {
  personal: 'Personal',
  team: 'Team',
  enterprise: 'Enterprise',
}

export interface HanzoPlansProps {
  /**
   * Where the subscribe/upgrade CTA routes. The component NEVER charges — it just
   * sends the viewer to the real commerce checkout with `?plan=<slug>` appended.
   * Defaults to the Console billing/upgrade route.
   */
  checkoutHref?: string
  /** Where a contact-sales tier routes (enterprise/custom). Defaults to hanzo.ai/contact. */
  salesHref?: string
  /**
   * Intercept plan selection in-app (e.g. open an embedded checkout). When set the
   * CTA becomes a button that calls this instead of navigating; return nothing.
   */
  onSelectPlan?: (plan: HanzoPlanTierDef) => void
  /** Override the tier ladder (defaults to the canonical `HANZO_PLANS`). */
  plans?: HanzoPlanTierDef[]
  /**
   * Inject a resolved entitlement (skips the internal `useEntitlement` read — e.g.
   * when the host already holds it). When omitted the component resolves it live.
   */
  entitlement?: Entitlement
  /** Options forwarded to the internal `useEntitlement` read (endpoint, headers…). */
  entitlementOptions?: UseEntitlementOptions
  /** Force the recommended tier (defaults to the next self-serve tier above current). */
  recommendedTier?: HanzoPlanTier
  /** Initially-active axis segment (defaults to the viewer's current-tier axis, else personal). */
  defaultKind?: HanzoPlanKind
  /** Section heading. */
  heading?: string
  /** Section subheading. */
  subheading?: string
  /** Extra style on the root. */
  style?: React.CSSProperties
  id?: string
}

/* ── Formatting helpers (pure) ─────────────────────────────────────────────── */

/** Cents → "$20" / "$9,999" (no cents shown; whole-dollar plans). */
function priceLabel(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

/** Compact a rate-limit count: UNLIMITED→"Unlimited", 1_000_000→"1M", 100_000→"100K", 2_500→"2,500". */
function compact(n: number): string {
  if (n >= UNLIMITED) return 'Unlimited'
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`
  }
  if (n >= 100_000) return `${Math.round(n / 1000)}K`
  return n.toLocaleString()
}

/** The human-readable limit lines derived from a tier's `limits` (no second source). */
function limitLines(plan: HanzoPlanTierDef): string[] {
  const l = plan.limits
  const perSeat = plan.perSeat ? '/seat' : ''
  const lines: string[] = [
    `${compact(l.requestsPerMinute)} requests/min${perSeat}`,
    `${compact(l.tokensPerMinute)} tokens/min${perSeat}`,
  ]
  if (l.includedCreditUsd > 0) lines.push(`$${l.includedCreditUsd.toLocaleString()}/mo included usage`)
  if (l.includedCloudCredits > 0)
    lines.push(`$${l.includedCloudCredits.toLocaleString()}${perSeat}/mo cloud credits`)
  if (l.maxMembers >= UNLIMITED) lines.push('Unlimited members')
  else if (plan.kind !== 'personal') lines.push(`Up to ${l.maxMembers.toLocaleString()} members`)
  if (l.minSeats > 1) lines.push(`From ${l.minSeats} seats`)
  return lines
}

/* ── Derived tables (built once per plan list) ─────────────────────────────── */

/** app ids whose MINIMUM unlocking tier is exactly `slug` — the apps this tier introduces. */
function appsIntroducedBy(slug: HanzoPlanTier): HanzoApp[] {
  return Object.keys(APP_ENTITLEMENTS)
    .filter((id) => normalizeTier(APP_ENTITLEMENTS[id]) === slug)
    .map((id) => findHanzoApp(id))
    .filter((a): a is HanzoApp => Boolean(a))
}

/** The highest-rank plan of the SAME kind ranked strictly below `plan` (its ladder predecessor). */
function prevSameKind(plan: HanzoPlanTierDef, plans: HanzoPlanTierDef[]): HanzoPlanTierDef | undefined {
  return plans
    .filter((p) => p.kind === plan.kind && p.rank < plan.rank)
    .sort((a, b) => b.rank - a.rank)[0]
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export function HanzoPlans({
  checkoutHref = `${U.console}/billing/upgrade`,
  salesHref = U.contact,
  onSelectPlan,
  plans = HANZO_PLANS,
  entitlement,
  entitlementOptions,
  recommendedTier,
  defaultKind,
  heading = 'Plans & pricing',
  subheading = 'Pick the tier that fits — every plan includes the full developer surface; upgrade for more throughput, models, and collaboration.',
  style,
  id,
}: HanzoPlansProps) {
  useShellStyles()

  // Always call the hook (rules of hooks); disable its network read when an
  // entitlement is injected so we don't fetch needlessly.
  const auto = useEntitlement(entitlement ? { ...entitlementOptions, enabled: false } : entitlementOptions)
  const ent = entitlement ?? auto

  // Only a REAL held subscription (`state === 'tier'`) marks a "current" plan — a
  // signed-out / loading viewer is never labelled as already on Free.
  const currentSlug: HanzoPlanTier | undefined =
    ent.state === 'tier' ? normalizeTier(ent.tier) : undefined
  const baselineRank = currentSlug ? rankOf(currentSlug) : rankOf(DEFAULT_PLAN_TIER)

  const ascending = useMemo(() => [...plans].sort((a, b) => a.rank - b.rank), [plans])

  // Recommended = the next self-serve (non-sales) tier above the baseline, unless forced.
  const recommendedSlug: HanzoPlanTier | undefined = useMemo(() => {
    if (recommendedTier) return recommendedTier
    const next = ascending.find((p) => p.rank > baselineRank && !p.contactSales)
    return next && next.slug !== currentSlug ? next.slug : undefined
  }, [recommendedTier, ascending, baselineRank, currentSlug])

  // Which axis segments actually exist, in canonical order.
  const kinds = useMemo(
    () => KIND_ORDER.filter((k) => plans.some((p) => p.kind === k)),
    [plans],
  )

  const [activeKind, setActiveKind] = useState<HanzoPlanKind>(
    defaultKind ?? getPlanTier(currentSlug)?.kind ?? 'personal',
  )
  // Snap to the viewer's own axis once (and only once) their held tier resolves —
  // unless they've already switched segments manually.
  const pinned = useRef(Boolean(defaultKind))
  useEffect(() => {
    if (pinned.current) return
    if (ent.state === 'tier') {
      const k = getPlanTier(normalizeTier(ent.tier))?.kind
      if (k) {
        setActiveKind(k)
        pinned.current = true
      }
    }
  }, [ent.state, ent.tier])

  const selectKind = (k: HanzoPlanKind) => {
    pinned.current = true
    setActiveKind(k)
  }

  const shown = useMemo(
    () => ascending.filter((p) => p.kind === activeKind),
    [ascending, activeKind],
  )

  return (
    <section
      id={id}
      data-hanzo-shell=""
      aria-label={heading}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        color: FG,
        fontFamily: FONT,
        ...style,
      }}
    >
      {/* Header + axis toggle */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ minWidth: 0, flex: '1 1 320px' }}>
          <h2 style={{ margin: 0, fontSize: FS['2xl'], fontWeight: 800, letterSpacing: -0.4, color: FG }}>
            {heading}
          </h2>
          {subheading ? (
            <p style={{ margin: '8px 0 0', fontSize: FS.base, lineHeight: 1.5, color: FG_MUTED, maxWidth: 560 }}>
              {subheading}
            </p>
          ) : null}
        </div>

        {kinds.length > 1 ? (
          <div
            role="group"
            aria-label="Plan type"
            style={{
              display: 'inline-flex',
              padding: 3,
              gap: 2,
              borderRadius: R.pill,
              border: `1px solid ${BORDER}`,
              background: CHROME.raised,
            }}
          >
            {kinds.map((k) => {
              const active = k === activeKind
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectKind(k)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '7px 14px',
                    borderRadius: R.pill,
                    fontSize: FS.sm,
                    fontWeight: 600,
                    fontFamily: FONT,
                    color: active ? '#000' : FG_MUTED,
                    background: active ? ACCENT : 'transparent',
                    transition: 'background 120ms ease, color 120ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = HOVER_BG
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  {KIND_LABEL[k]}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      {/* Plan cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {shown.map((plan) => (
          <PlanCard
            key={plan.slug}
            plan={plan}
            plans={ascending}
            isCurrent={plan.slug === currentSlug}
            isRecommended={plan.slug === recommendedSlug}
            baselineRank={baselineRank}
            checkoutHref={checkoutHref}
            salesHref={salesHref}
            onSelectPlan={onSelectPlan}
          />
        ))}
      </div>
    </section>
  )
}

/* ── Plan card ─────────────────────────────────────────────────────────────── */

function PlanCard({
  plan,
  plans,
  isCurrent,
  isRecommended,
  baselineRank,
  checkoutHref,
  salesHref,
  onSelectPlan,
}: {
  plan: HanzoPlanTierDef
  plans: HanzoPlanTierDef[]
  isCurrent: boolean
  isRecommended: boolean
  baselineRank: number
  checkoutHref: string
  salesHref: string
  onSelectPlan?: (plan: HanzoPlanTierDef) => void
}) {
  const emphasise = isRecommended && !isCurrent
  const introduced = appsIntroducedBy(plan.slug)
  const prev = prevSameKind(plan, plans)
  const limits = limitLines(plan)

  // ── Price block ──
  let priceBig: string
  let priceSuffix = ''
  let priceNote = ''
  if (plan.priceMonthly == null) {
    priceBig = 'Custom'
    priceNote = 'Tailored to you'
  } else if (plan.priceMonthly === 0) {
    priceBig = '$0'
    priceNote = 'Free forever'
  } else {
    priceBig = priceLabel(plan.priceMonthly)
    priceSuffix = plan.perSeat ? '/seat/mo' : '/mo'
    if (plan.contactSales) priceNote = 'Starting price · contact sales'
  }

  // ── CTA intent ──
  const higher = plan.rank > baselineRank
  let ctaLabel: string
  if (isCurrent) ctaLabel = 'Current plan'
  else if (plan.contactSales) ctaLabel = 'Contact sales'
  else if (higher) ctaLabel = 'Upgrade'
  else ctaLabel = `Switch to ${plan.name}`

  const href = plan.contactSales
    ? `${salesHref}?plan=${plan.slug}`
    : `${checkoutHref}?plan=${plan.slug}`

  return (
    <div
      aria-label={`${plan.name} plan`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: 20,
        borderRadius: R.card,
        border: `1px solid ${emphasise || isCurrent ? ACCENT : BORDER}`,
        background: emphasise ? ACCENT_SOFT : PANEL_BG,
        boxShadow: emphasise ? '0 20px 50px -20px rgba(0,0,0,0.65)' : 'none',
      }}
    >
      {/* Badge */}
      {(isCurrent || emphasise) && (
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '3px 9px',
              borderRadius: R.pill,
              fontSize: FS.xs,
              fontWeight: 700,
              letterSpacing: 0.3,
              textTransform: 'uppercase',
              color: isCurrent ? FG : '#000',
              background: isCurrent ? ACCENT_SOFTER : ACCENT,
              border: isCurrent ? `1px solid ${BORDER}` : 'none',
            }}
          >
            {isCurrent ? 'Current' : 'Recommended'}
          </span>
        </div>
      )}

      {/* Name + tagline */}
      <div style={{ marginBottom: 14, paddingRight: 84 }}>
        <div style={{ fontSize: FS.lg, fontWeight: 700, color: FG }}>{plan.name}</div>
        <div style={{ marginTop: 4, fontSize: FS.sm, lineHeight: 1.4, color: FG_DIM, minHeight: 34 }}>
          {plan.tagline}
        </div>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: FS['2xl'], fontWeight: 800, letterSpacing: -0.6, color: FG }}>{priceBig}</span>
        {priceSuffix ? <span style={{ fontSize: FS.sm, color: FG_MUTED }}>{priceSuffix}</span> : null}
      </div>
      <div style={{ minHeight: 16, marginBottom: 16, fontSize: FS.xs, color: FG_DIM }}>{priceNote}</div>

      {/* CTA */}
      <PlanCTA
        label={ctaLabel}
        href={href}
        disabled={isCurrent}
        emphasise={emphasise}
        onClick={onSelectPlan ? () => onSelectPlan(plan) : undefined}
      />

      {/* Apps unlocked */}
      <div style={{ marginTop: 18 }}>
        <div style={sectionLabelStyle}>{prev ? `Everything in ${prev.name}, plus` : 'Included apps'}</div>
        {introduced.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {introduced.map((app) => (
              <AppChip key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 8, fontSize: FS.sm, color: FG_DIM }}>
            {prev ? 'All the same apps, with more capacity.' : 'The full developer surface.'}
          </div>
        )}
      </div>

      {/* Limits */}
      <div style={{ marginTop: 16 }}>
        <div style={sectionLabelStyle}>Limits & usage</div>
        <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {limits.map((line) => (
            <li key={line} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: FS.sm, color: FG_MUTED }}>
              <CheckIcon />
              <span style={{ lineHeight: 1.35 }}>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: FS.xs,
  fontWeight: 700,
  letterSpacing: 0.4,
  textTransform: 'uppercase',
  color: FG_DIM,
}

/* ── CTA (anchor by default; button when intercepted) ──────────────────────── */

function PlanCTA({
  label,
  href,
  disabled,
  emphasise,
  onClick,
}: {
  label: string
  href: string
  disabled: boolean
  emphasise: boolean
  onClick?: () => void
}) {
  const base: React.CSSProperties = {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 14px',
    borderRadius: R.pill,
    textAlign: 'center',
    fontSize: FS.sm,
    fontWeight: 700,
    fontFamily: FONT,
    textDecoration: 'none',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'background 120ms ease, border-color 120ms ease, opacity 120ms ease',
  }

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        style={{ ...base, color: FG_DIM, background: 'transparent', border: `1px solid ${BORDER_SOFT}` }}
      >
        {label}
      </span>
    )
  }

  const filled = emphasise
  const style: React.CSSProperties = filled
    ? { ...base, color: '#000', background: ACCENT, border: '1px solid transparent' }
    : { ...base, color: FG, background: 'transparent', border: `1px solid ${BORDER}` }

  const hover = (e: React.MouseEvent, on: boolean) => {
    const el = e.currentTarget as HTMLElement
    if (filled) el.style.opacity = on ? '0.88' : '1'
    else el.style.background = on ? HOVER_BG : 'transparent'
  }

  // When a host intercepts selection we render a real button (still routes on
  // middle-click? no — intercept is explicit); otherwise a real link.
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={(e) => hover(e, true)}
        onMouseLeave={(e) => hover(e, false)}
        style={{ ...style, appearance: 'none' }}
      >
        {label}
      </button>
    )
  }
  return (
    <a
      href={href}
      onMouseEnter={(e) => hover(e, true)}
      onMouseLeave={(e) => hover(e, false)}
      style={style}
    >
      {label}
    </a>
  )
}

/* ── Small building blocks ─────────────────────────────────────────────────── */

function AppChip({ app }: { app: HanzoApp }) {
  const Icon = app.icon
  return (
    <span
      title={app.description ? `${app.label} — ${app.description}` : app.label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 9px 4px 7px',
        borderRadius: R.pill,
        border: `1px solid ${BORDER_SOFT}`,
        background: CHROME.raised,
        fontSize: FS.xs,
        fontWeight: 600,
        color: FG_MUTED,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ display: 'inline-flex', color: FG }}>
        <Icon size={14} />
      </span>
      {app.label}
    </span>
  )
}

function CheckIcon() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 1, color: FG_MUTED }}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

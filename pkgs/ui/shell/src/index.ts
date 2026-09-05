// ── Signed-in org chrome ──
export { OrgHeader } from './OrgHeader.tsx'
export type { OrgHeaderProps, OrgSearch } from './OrgHeader.tsx'
export { UserOrgDropdown } from './UserOrgDropdown.tsx'
export type { UserOrgDropdownProps } from './UserOrgDropdown.tsx'
// The sign that a masquerade is running, and the one click out of it. It rides
// with the switcher, so mounting the switcher is how a surface gets it.
export { Masquerade } from './Masquerade.tsx'
export type { MasqueradeProps } from './Masquerade.tsx'
export { UserAvatar } from './UserAvatar.tsx'
export type { UserAvatarProps } from './UserAvatar.tsx'
export { BeamAvatar } from './BeamAvatar.tsx'
export type { BeamAvatarProps } from './BeamAvatar.tsx'
export { OrgCommandPalette } from './OrgCommandPalette.tsx'
export type {
  CommandItem as OrgCommandItem,
  OrgCommandPaletteProps,
} from './OrgCommandPalette.tsx'
export type { HanzoUser, HanzoOrg, OrgDomains, OrgQuery, OrgPage } from './types.ts'
export { ORG_DOMAINS } from './types.ts'

// ── Unified Hanzo app-switcher (the 9-dot cross-app launcher) ──
export { HanzoAppLauncher } from './HanzoAppLauncher.tsx'
export type { HanzoAppLauncherProps } from './HanzoAppLauncher.tsx'
export { HANZO_APPS, getHanzoApps, findHanzoApp, HanzoGridIcon } from './hanzo-apps.tsx'
export type { HanzoApp } from './hanzo-apps.tsx'

// ── Shared brand mark ──
export { HanzoMark, HanzoWordmark, HanzoLockup } from './mark.tsx'

// ── The one line-mark table every menu row and launcher tile draws from ──
export { MARKS, Glyph } from './glyph.tsx'
export type { GlyphName } from './glyph.tsx'

// ── Shell chrome tokens (brand-driven, monochrome) ──
// PANEL is the chrome-menu surface: chrome is dark on every surface in every
// host theme, and a chrome-attached menu we do not ship spreads this rather
// than matching its colour by hand.
export {
  CHROME,
  ACCENT,
  ACCENT_SOFT,
  ACCENT_SOFTER,
  ACCENT_TINT,
  FS,
  PANEL,
  Z,
} from './theme.ts'

// ── Responsive hook ──
export { useMediaQuery, useIsMobile } from './useMediaQuery.ts'

// ── Canonical registry — the ONE source of truth for every shell surface ──
export {
  U,
  PRODUCT_BOUNDARIES,
  HANZO_PRODUCTS,
  HANZO_FLAGSHIP,
  HANZO_FLAGSHIP_PUBLIC,
  sees,
  MEET_HANZO_GROUPS,
  TRY_HANZO_GROUPS,
  HANZO_PRODUCT_CATEGORIES,
  productCategorySlug,
  HANZO_FOOTER_COLUMNS,
  HANZO_FOOTER_BOTTOM,
  HANZO_SURFACES,
  DEFAULT_SURFACE,
  getSurface,
  findSurfaceByHost,
} from './hanzo-registry.ts'
export type {
  HanzoLink,
  HanzoNav,
  HanzoProduct,
  HanzoSurface,
  Stage,
  MeetHanzoGroup,
  ProductCategory,
  FooterColumn,
} from './hanzo-registry.ts'

// ── Plan tiers + app entitlements (the plan→apps map + pure resolver) ──
export {
  HANZO_PLANS,
  HANZO_PLAN_TIERS,
  DEFAULT_PLAN_TIER,
  UNLIMITED,
  getPlanTier,
  APP_ENTITLEMENTS,
} from './hanzo-registry.ts'
export type {
  HanzoPlanKind,
  HanzoPlanTier,
  HanzoPlanLimits,
  HanzoPlanTierDef,
} from './hanzo-registry.ts'
export {
  entitlementFor,
  isEntitled,
  requiredTier,
  rankOf,
  normalizeTier,
} from './entitlements.ts'

// ── Cross-ecosystem access layer — entitlement hook, paywall gate, plans ──
export { useEntitlement, FREE_TIER } from './useEntitlement.ts'
export type {
  Entitlement,
  EntitlementState,
  UseEntitlementOptions,
} from './useEntitlement.ts'
// What plan the viewer holds and how much of it is left — the read half of the
// same fact `useEntitlement` gates on. The header mounts <Meter> itself, so a
// surface gets this by mounting the header; these are for a page that wants to
// show the same standing somewhere of its own.
export { usePlan } from './usePlan.ts'
export type { Plan, PlanState, UsePlanOptions } from './usePlan.ts'
export { usageOf } from './usage.ts'
export type { PlanUsage, Rollup } from './usage.ts'
export { Meter } from './meter.tsx'
export type { MeterProps } from './meter.tsx'
export { HanzoAccessGate } from './HanzoAccessGate.tsx'
export type { HanzoAccessGateProps } from './HanzoAccessGate.tsx'
export { HanzoPlans } from './HanzoPlans.tsx'
export type { HanzoPlansProps } from './HanzoPlans.tsx'

// ── Reusable public/marketing + signed-in shell components ──
export { HanzoHeader, resolveSurface } from './HanzoHeader.tsx'
export type { HanzoHeaderProps } from './HanzoHeader.tsx'
// The identity cluster: one action against Hanzo IAM, or the account menu.
export { HanzoIdentity } from './HanzoIdentity.tsx'
export type { HanzoAuth, HanzoIdentityProps } from './HanzoIdentity.tsx'
export { MeetHanzoMenu } from './MeetHanzoMenu.tsx'
export type { MeetHanzoMenuProps } from './MeetHanzoMenu.tsx'
export { TryHanzoMenu } from './TryHanzoMenu.tsx'
export type { TryHanzoMenuProps } from './TryHanzoMenu.tsx'
export { ProductsMegaMenu } from './ProductsMegaMenu.tsx'
export type { ProductsMegaMenuProps } from './ProductsMegaMenu.tsx'
export { HanzoCommandPalette, HanzoCommandTrigger } from './HanzoCommandPalette.tsx'
export type {
  HanzoCommandPaletteProps,
  HanzoCommandMode,
  HanzoCommandEntry,
} from './HanzoCommandPalette.tsx'
export { filterProducts } from './productSearch.ts'
export { score, search } from './search.ts'
export type { Match } from './search.ts'
export { HanzoFooter } from './HanzoFooter.tsx'
export type { HanzoFooterProps } from './HanzoFooter.tsx'
export { HanzoPreFooterCTA } from './HanzoPreFooterCTA.tsx'
export type { HanzoPreFooterCTAProps } from './HanzoPreFooterCTA.tsx'
export { ProductShot } from './ProductShot.tsx'
export type { ProductShotProps, ProductShotPlate } from './ProductShot.tsx'
export { AskHanzo } from './AskHanzo.tsx'
export type { AskHanzoProps, AskHanzoMessage } from './AskHanzo.tsx'

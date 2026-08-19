// ── Signed-in org chrome ──
export { OrgHeader } from './OrgHeader'
export type { OrgHeaderProps, OrgSearch } from './OrgHeader'
export { UserOrgDropdown } from './UserOrgDropdown'
export type { UserOrgDropdownProps } from './UserOrgDropdown'
// The sign that a masquerade is running, and the one click out of it. It rides
// with the switcher, so mounting the switcher is how a surface gets it.
export { Masquerade } from './Masquerade'
export type { MasqueradeProps } from './Masquerade'
export { UserAvatar } from './UserAvatar'
export type { UserAvatarProps } from './UserAvatar'
export { BeamAvatar } from './BeamAvatar'
export type { BeamAvatarProps } from './BeamAvatar'
export { OrgCommandPalette } from './OrgCommandPalette'
export type {
  CommandItem as OrgCommandItem,
  OrgCommandPaletteProps,
} from './OrgCommandPalette'
export type { HanzoUser, HanzoOrg, OrgDomains, OrgQuery, OrgPage } from './types'
export { ORG_DOMAINS } from './types'

// ── Unified Hanzo app-switcher (the 9-dot cross-app launcher) ──
export { HanzoAppLauncher } from './HanzoAppLauncher'
export type { HanzoAppLauncherProps } from './HanzoAppLauncher'
export { HANZO_APPS, getHanzoApps, findHanzoApp, HanzoGridIcon } from './hanzo-apps'
export type { HanzoApp } from './hanzo-apps'

// ── Shared brand mark ──
export { HanzoMark, HanzoWordmark, HanzoLockup } from './mark'

// ── The one line-mark table every menu row and launcher tile draws from ──
export { MARKS, Glyph } from './glyph'
export type { GlyphName } from './glyph'

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
} from './theme'

// ── Responsive hook ──
export { useMediaQuery, useIsMobile } from './useMediaQuery'

// ── Canonical registry — the ONE source of truth for every shell surface ──
export {
  U,
  PRODUCT_BOUNDARIES,
  HANZO_PRODUCTS,
  HANZO_FLAGSHIP,
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
} from './hanzo-registry'
export type {
  HanzoLink,
  HanzoNav,
  HanzoProduct,
  HanzoSurface,
  MeetHanzoGroup,
  ProductCategory,
  FooterColumn,
} from './hanzo-registry'

// ── Plan tiers + app entitlements (the plan→apps map + pure resolver) ──
export {
  HANZO_PLANS,
  HANZO_PLAN_TIERS,
  DEFAULT_PLAN_TIER,
  UNLIMITED,
  getPlanTier,
  APP_ENTITLEMENTS,
} from './hanzo-registry'
export type {
  HanzoPlanKind,
  HanzoPlanTier,
  HanzoPlanLimits,
  HanzoPlanTierDef,
} from './hanzo-registry'
export {
  entitlementFor,
  isEntitled,
  requiredTier,
  rankOf,
  normalizeTier,
} from './entitlements'

// ── Cross-ecosystem access layer — entitlement hook, paywall gate, plans ──
export { useEntitlement, FREE_TIER } from './useEntitlement'
export type {
  Entitlement,
  EntitlementState,
  UseEntitlementOptions,
} from './useEntitlement'
// What plan the viewer holds and how much of it is left — the read half of the
// same fact `useEntitlement` gates on. The header mounts <Meter> itself, so a
// surface gets this by mounting the header; these are for a page that wants to
// show the same standing somewhere of its own.
export { usePlan } from './usePlan'
export type { Plan, PlanState, UsePlanOptions } from './usePlan'
export { usageOf } from './usage'
export type { PlanUsage, Rollup } from './usage'
export { Meter } from './meter'
export type { MeterProps } from './meter'
export { HanzoAccessGate } from './HanzoAccessGate'
export type { HanzoAccessGateProps } from './HanzoAccessGate'
export { HanzoPlans } from './HanzoPlans'
export type { HanzoPlansProps } from './HanzoPlans'

// ── Reusable public/marketing + signed-in shell components ──
export { HanzoHeader, resolveSurface } from './HanzoHeader'
export type { HanzoHeaderProps } from './HanzoHeader'
// The identity cluster: one action against Hanzo IAM, or the account menu.
export { HanzoIdentity } from './HanzoIdentity'
export type { HanzoAuth, HanzoIdentityProps } from './HanzoIdentity'
export { MeetHanzoMenu } from './MeetHanzoMenu'
export type { MeetHanzoMenuProps } from './MeetHanzoMenu'
export { TryHanzoMenu } from './TryHanzoMenu'
export type { TryHanzoMenuProps } from './TryHanzoMenu'
export { ProductsMegaMenu } from './ProductsMegaMenu'
export type { ProductsMegaMenuProps } from './ProductsMegaMenu'
export { HanzoCommandPalette, HanzoCommandTrigger } from './HanzoCommandPalette'
export type {
  HanzoCommandPaletteProps,
  HanzoCommandMode,
  HanzoCommandEntry,
} from './HanzoCommandPalette'
export { filterProducts } from './productSearch'
export { score, search } from './search'
export type { Match } from './search'
export { HanzoFooter } from './HanzoFooter'
export type { HanzoFooterProps } from './HanzoFooter'
export { HanzoPreFooterCTA } from './HanzoPreFooterCTA'
export type { HanzoPreFooterCTAProps } from './HanzoPreFooterCTA'
export { ProductShot } from './ProductShot'
export type { ProductShotProps, ProductShotPlate } from './ProductShot'
export { AskHanzo } from './AskHanzo'
export type { AskHanzoProps, AskHanzoMessage } from './AskHanzo'

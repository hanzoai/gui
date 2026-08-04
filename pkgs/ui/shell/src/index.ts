export { TenantHeader } from './TenantHeader'
export { TenantMark } from './TenantMark'
export { AppSwitcher } from './AppSwitcher'
export { UserOrgDropdown } from './UserOrgDropdown'
export { UserAvatar } from './UserAvatar'
export type { UserAvatarProps } from './UserAvatar'
export { BeamAvatar } from './BeamAvatar'
export type { BeamAvatarProps } from './BeamAvatar'
export { useTenantAuth } from './useTenantAuth'
export { TenantCommandPalette } from './TenantCommandPalette'
export type {
  CommandItem as TenantCommandItem,
  TenantCommandPaletteProps,
} from './TenantCommandPalette'
export type {
  TenantApp,
  TenantOrg,
  TenantUser,
  TenantShellProps,
  TenantMarkProps,
  OrgDomains,
} from './types'
export { DEFAULT_TENANT_APPS, ORG_DOMAINS, getAppsForOrg } from './types'

// ── Unified Hanzo app-switcher (the 9-dot cross-app launcher + top bar) ──
export { HanzoAppBar } from './HanzoAppBar'
export type { HanzoAppBarProps, HanzoAppBarAction, HanzoUser } from './HanzoAppBar'
export { HanzoAppLauncher } from './HanzoAppLauncher'
export type { HanzoAppLauncherProps } from './HanzoAppLauncher'
export { HANZO_APPS, getHanzoApps, findHanzoApp, HanzoGridIcon } from './hanzo-apps'
export type { HanzoApp } from './hanzo-apps'

// ── Shared brand mark ──
export { HanzoMark, HanzoWordmark } from './mark'

// ── Shell chrome tokens (brand-driven, monochrome) ──
export { CHROME, ACCENT, ACCENT_SOFT, ACCENT_SOFTER, ACCENT_TINT, FS, Z } from './theme'

// ── Responsive hook ──
export { useMediaQuery, useIsMobile } from './useMediaQuery'

// ── Canonical registry — the ONE source of truth for every shell surface ──
export {
  U,
  PRODUCT_BOUNDARIES,
  HANZO_PRODUCTS,
  HANZO_FLAGSHIP,
  MEET_HANZO_GROUPS,
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
export { HanzoAccessGate } from './HanzoAccessGate'
export type { HanzoAccessGateProps } from './HanzoAccessGate'
export { HanzoPlans } from './HanzoPlans'
export type { HanzoPlansProps } from './HanzoPlans'

// ── Reusable public/marketing + signed-in shell components ──
export { HanzoHeader, resolveSurface } from './HanzoHeader'
export type { HanzoHeaderProps } from './HanzoHeader'
export { MeetHanzoMenu } from './MeetHanzoMenu'
export type { MeetHanzoMenuProps } from './MeetHanzoMenu'
export { ProductsMegaMenu } from './ProductsMegaMenu'
export type { ProductsMegaMenuProps } from './ProductsMegaMenu'
export { HanzoAppHeader } from './HanzoAppHeader'
export type {
  HanzoAppHeaderProps,
  HanzoAppHeaderAction,
  HanzoContextNode,
} from './HanzoAppHeader'
export { HanzoFooter } from './HanzoFooter'
export type { HanzoFooterProps } from './HanzoFooter'
export { HanzoPreFooterCTA } from './HanzoPreFooterCTA'
export type { HanzoPreFooterCTAProps } from './HanzoPreFooterCTA'
export { ProductShot } from './ProductShot'
export type { ProductShotProps, ProductShotPlate } from './ProductShot'
export { AskHanzo } from './AskHanzo'
export type { AskHanzoProps, AskHanzoMessage } from './AskHanzo'

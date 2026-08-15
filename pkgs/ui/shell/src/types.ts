// Nav view-model types for the shell's signed-in chrome. These are the shell's
// OWN display shape — what the account menu and the org switcher actually
// render — intentionally decoupled from @hanzo/iam's billing/identity DTOs. The
// shell needs a lightweight view, not the full IAM record; a host maps its IAM
// user into this shape at the boundary.

/** The signed-in person, as the chrome shows them. */
export type HanzoUser = {
  name?: string
  email?: string
  avatar?: string
}

/** An organization the signed-in person can act as. */
export type HanzoOrg = {
  id: string
  name: string
  slug?: string
  role?: string
}

/** What the switcher asks the server for: a filter, and where to resume. */
export type OrgQuery = {
  /** What the visitor typed. Empty is a legal first page. */
  q: string
  /** Opaque cursor from the previous page; absent asks for the first. */
  cursor?: string
}

/**
 * One page of orgs, as the server answered.
 *
 * The server filters, sorts and pages; the client only asks. A switcher that
 * held the whole list would have to hold every org in the system to be right
 * for the one caller who can see them all.
 */
export type OrgPage = {
  orgs: HanzoOrg[]
  /** Cursor for the next page. Absent means the list is exhausted. */
  cursor?: string
  /**
   * The server says these rows reach BEYOND the caller's own memberships.
   *
   * Only a SuperAdmin gets such a page, and only the server knows that — the
   * client never computes a privilege and never branches UI on a locally
   * derived role. No reach page, no reach section, no way to ask for one.
   */
  reach?: boolean
}

/**
 * Per-org domain mapping.
 * Each org can have its own branded domains for every surface.
 */
export type OrgDomains = {
  id: string
  // Core
  iam: string
  billing: string
  console: string
  cloud: string
  // AI
  chat: string
  flow: string
  bot: string
  // Observability
  o11y: string
  sentry: string
  insights: string
  analytics: string
  // Infrastructure
  platform: string
  storage: string
  s3: string
  kms: string
  dns: string
  registry: string
  // Apps
  commerce: string
  base: string
  search: string
  auto: string
  // Business
  team: string
  sign: string
  dataroom: string
  captable: string
  // Content
  docs: string
  status: string
}

export const ORG_DOMAINS: Record<string, OrgDomains> = {
  hanzo: {
    id: 'hanzo',
    iam: 'https://hanzo.id',
    billing: 'https://billing.hanzo.ai',
    console: 'https://console.hanzo.ai',
    cloud: 'https://cloud.hanzo.ai',
    chat: 'https://hanzo.chat',
    flow: 'https://flow.hanzo.ai',
    bot: 'https://hanzo.bot',
    o11y: 'https://o11y.hanzo.ai',
    sentry: 'https://sentry.hanzo.ai',
    insights: 'https://insights.hanzo.ai',
    analytics: 'https://analytics.hanzo.ai',
    platform: 'https://platform.hanzo.ai',
    storage: 'https://s3.hanzo.ai',
    s3: 'https://s3.hanzo.ai',
    kms: 'https://kms.hanzo.ai',
    dns: 'https://dns.hanzo.ai',
    registry: 'https://registry.hanzo.ai',
    commerce: 'https://commerce.hanzo.ai',
    base: 'https://base.hanzo.ai',
    search: 'https://search.hanzo.ai',
    auto: 'https://auto.hanzo.ai',
    team: 'https://hanzo.team',
    sign: 'https://sign.hanzo.ai',
    dataroom: 'https://dataroom.hanzo.ai',
    captable: 'https://captable.hanzo.ai',
    docs: 'https://docs.hanzo.ai',
    status: 'https://status.hanzo.ai',
  },
  lux: {
    id: 'lux',
    iam: 'https://lux.id',
    billing: 'https://billing.lux.network',
    console: 'https://console.lux.network',
    cloud: 'https://cloud.lux.network',
    chat: 'https://lux.chat',
    flow: 'https://flow.lux.network',
    bot: 'https://bot.lux.network',
    o11y: 'https://o11y.lux.network',
    sentry: 'https://sentry.lux.network',
    insights: 'https://insights.lux.network',
    analytics: 'https://analytics.lux.network',
    platform: 'https://platform.lux.network',
    storage: 'https://s3.lux.network',
    s3: 'https://s3.lux.network',
    kms: 'https://kms.lux.cloud',
    dns: 'https://dns.lux.network',
    registry: 'https://registry.lux.network',
    commerce: 'https://commerce.lux.network',
    base: 'https://base.lux.network',
    search: 'https://search.lux.network',
    auto: 'https://auto.lux.network',
    team: 'https://team.lux.network',
    sign: 'https://sign.lux.network',
    dataroom: 'https://dataroom.lux.network',
    captable: 'https://captable.lux.network',
    docs: 'https://docs.lux.network',
    status: 'https://status.lux.network',
  },
  zoo: {
    id: 'zoo',
    iam: 'https://zoo.id',
    billing: 'https://billing.zoo.ngo',
    console: 'https://console.zoo.ngo',
    cloud: 'https://cloud.zoo.network',
    chat: 'https://chat.zoo.ngo',
    flow: 'https://flow.zoo.ngo',
    bot: 'https://bot.zoo.ngo',
    o11y: 'https://o11y.zoo.network',
    sentry: 'https://sentry.zoo.network',
    insights: 'https://insights.zoo.ngo',
    analytics: 'https://analytics.zoo.ngo',
    platform: 'https://platform.zoo.ngo',
    storage: 'https://s3.zoo.ngo',
    s3: 'https://s3.zoo.ngo',
    kms: 'https://kms.zoo.network',
    dns: 'https://dns.zoo.ngo',
    registry: 'https://registry.zoo.ngo',
    commerce: 'https://commerce.zoo.ngo',
    base: 'https://base.zoo.ngo',
    search: 'https://search.zoo.ngo',
    auto: 'https://auto.zoo.ngo',
    team: 'https://team.zoo.ngo',
    sign: 'https://sign.zoo.ngo',
    dataroom: 'https://dataroom.zoo.ngo',
    captable: 'https://captable.zoo.ngo',
    docs: 'https://docs.zoo.ngo',
    status: 'https://status.zoo.network',
  },
  pars: {
    id: 'pars',
    iam: 'https://pars.id',
    billing: 'https://billing.pars.network',
    console: 'https://console.pars.network',
    cloud: 'https://cloud.pars.network',
    chat: 'https://chat.pars.network',
    flow: 'https://flow.pars.network',
    bot: 'https://bot.pars.network',
    o11y: 'https://o11y.pars.network',
    sentry: 'https://sentry.pars.network',
    insights: 'https://insights.pars.network',
    analytics: 'https://analytics.pars.network',
    platform: 'https://platform.pars.network',
    storage: 'https://s3.pars.network',
    s3: 'https://s3.pars.network',
    kms: 'https://kms.pars.network',
    dns: 'https://dns.pars.network',
    registry: 'https://registry.pars.network',
    commerce: 'https://commerce.pars.network',
    base: 'https://base.pars.network',
    search: 'https://search.pars.network',
    auto: 'https://auto.pars.network',
    team: 'https://team.pars.network',
    sign: 'https://sign.pars.network',
    dataroom: 'https://dataroom.pars.network',
    captable: 'https://captable.pars.network',
    docs: 'https://docs.pars.network',
    status: 'https://status.pars.network',
  },
}

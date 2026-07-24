/**
 * HANZO REGISTRY — the ONE canonical config for every reusable Hanzo shell surface.
 *
 * This single data module is the source of truth that replaces the three former
 * divergent app-lists (shell `HANZO_APPS`, `@hanzo/ui` surfaces.data.ts, world's
 * inline "Try Hanzo" array). Everything the shell renders — the public header per
 * domain, the universal "Meet Hanzo" mega-menu, the unified footer, the per-surface
 * pre-footer CTA, and the product boundaries — is DATA here; the components just
 * render it.
 *
 *   URLs .............. one canonical URL table (`U`) — every link resolves here
 *   HANZO_PRODUCTS .... the flagship products (+ Dev) with verb · tagline · boundary
 *   MEET_HANZO_GROUPS . the universal mega-menu (identical on every property)
 *   HANZO_SURFACES .... per-domain public-header config (brand · nav · CTAs · CTA)
 *   HANZO_FOOTER_* .... the unified 6-column footer + bottom legal bar
 *   PRODUCT_BOUNDARIES  the one-line "what each product is for"
 */

/** A plain navigable link. */
export interface HanzoLink {
  id: string
  label: string
  href: string
  /** Optional short hint (host / one-liner) shown in menus. */
  hint?: string
  /** External (new tab) — defaults true for cross-property links. */
  external?: boolean
}

/** A first-party Hanzo product. */
export interface HanzoProduct extends HanzoLink {
  /** Imperative verb shown in the mega-menu ("Use AI", "Build", …). */
  verb: string
  /** One-line tagline ("Ask anything", "Build and ship apps", …). */
  tagline: string
  /** The product boundary — what this product is FOR (kept consistent everywhere). */
  boundary: string
  /** Flagship products get the prominent top group of the mega-menu. */
  flagship?: boolean
}

export interface MeetHanzoGroup {
  id: string
  title: string
  items: HanzoLink[]
}

export interface FooterColumn {
  id: string
  title: string
  items: HanzoLink[]
}

/** Per-domain public/marketing header + pre-footer configuration. */
export interface HanzoSurface {
  /** Stable surface id — also the current-product highlight key. */
  id: string
  /** Primary host this surface serves (used by `findSurfaceByHost`). */
  host: string
  /** The product this surface IS (for highlighting the current product). */
  productId: string
  /** Brand label shown next to the mark ("Hanzo", "Hanzo Chat", …). */
  brandName: string
  /** Local (in-product) marketing nav. */
  localNav: HanzoLink[]
  /** Secondary (ghost) header action. */
  secondaryCTA: HanzoLink
  /** Primary (filled) header action. */
  primaryCTA: HanzoLink
  /** Pre-footer CTA band shown immediately above the shared footer. */
  preFooter: { heading: string; actions: HanzoLink[] }
}

/* ── Canonical URL table — every link in this file resolves through `U` ─────── */

export const U = {
  ai: 'https://hanzo.ai',
  pricing: 'https://hanzo.ai/pricing',
  solutions: 'https://hanzo.ai/solutions',
  enterprise: 'https://hanzo.ai/enterprise',
  allProducts: 'https://hanzo.ai/products',

  // Products
  chat: 'https://hanzo.chat',
  app: 'https://hanzo.app',
  team: 'https://hanzo.team',
  studio: 'https://studio.hanzo.ai',
  bot: 'https://hanzo.bot',
  cloud: 'https://cloud.hanzo.ai',
  dev: 'https://hanzo.ai/dev',

  // Platform
  models: 'https://hanzo.ai/models',
  enso: 'https://hanzo.ai/enso',
  agents: 'https://hanzo.ai/agents',
  mcp: 'https://hanzo.ai/mcp',
  console: 'https://console.hanzo.ai',
  gateway: 'https://console.hanzo.ai/gateway',
  platform: 'https://platform.hanzo.ai',
  api: 'https://hanzo.ai/api',

  // Install
  desktop: 'https://hanzo.ai/desktop',
  extension: 'https://hanzo.ai/extension',
  vscode: 'https://hanzo.ai/vscode',
  cli: 'https://hanzo.ai/cli',
  sdks: 'https://hanzo.ai/sdks',
  downloads: 'https://hanzo.ai/download',

  // Developers / resources
  docs: 'https://docs.hanzo.ai',
  apiRef: 'https://docs.hanzo.ai/api-reference',
  cliRef: 'https://docs.hanzo.ai/cli',
  quickstarts: 'https://docs.hanzo.ai/quickstart',
  learn: 'https://hanzo.ai/learn',
  community: 'https://hanzo.ai/community',
  showcase: 'https://hanzo.ai/showcase',
  changelog: 'https://hanzo.ai/changelog',
  research: 'https://hanzo.ai/research',
  status: 'https://status.hanzo.ai',
  support: 'https://hanzo.ai/support',
  github: 'https://github.com/hanzoai',

  // Company
  about: 'https://hanzo.ai/about',
  customers: 'https://hanzo.ai/customers',
  blog: 'https://hanzo.ai/blog',
  careers: 'https://hanzo.ai/careers',
  security: 'https://hanzo.ai/security',
  contact: 'https://hanzo.ai/contact',

  // Account
  account: 'https://hanzo.id/account',
  billing: 'https://billing.hanzo.ai',
  admin: 'https://admin.hanzo.ai',

  // Legal
  privacy: 'https://hanzo.ai/privacy',
  terms: 'https://hanzo.ai/terms',
  cookies: 'https://hanzo.ai/cookies',
} as const

/* ── Product boundaries — the one-line "what each product is for" ───────────── */

export const PRODUCT_BOUNDARIES: Record<string, string> = {
  chat: 'Use AI',
  app: 'Build applications',
  team: 'Organize collaborative work',
  studio: 'Create and evaluate intelligence',
  bot: 'Distribute agents into channels',
  cloud: 'Operate infrastructure',
  dev: 'Build software from the editor and terminal',
  ai: 'Explain and connect the ecosystem',
}

/* ── Flagship products (+ Dev) ─────────────────────────────────────────────── */

export const HANZO_PRODUCTS: HanzoProduct[] = [
  { id: 'chat', label: 'Hanzo Chat', href: U.chat, verb: 'Use AI', tagline: 'Ask anything', boundary: PRODUCT_BOUNDARIES.chat, flagship: true },
  { id: 'app', label: 'Hanzo App', href: U.app, verb: 'Build', tagline: 'Build and ship apps', boundary: PRODUCT_BOUNDARIES.app, flagship: true },
  { id: 'team', label: 'Hanzo Team', href: U.team, verb: 'Work', tagline: 'People and AI together', boundary: PRODUCT_BOUNDARIES.team, flagship: true },
  { id: 'studio', label: 'Hanzo Studio', href: U.studio, verb: 'Design AI', tagline: 'Models, prompts and agents', boundary: PRODUCT_BOUNDARIES.studio, flagship: true },
  { id: 'bot', label: 'Hanzo Bot', href: U.bot, verb: 'Deploy agents', tagline: 'Publish AI anywhere', boundary: PRODUCT_BOUNDARIES.bot, flagship: true },
  { id: 'cloud', label: 'Hanzo Cloud', href: U.cloud, verb: 'Operate', tagline: 'Run the platform', boundary: PRODUCT_BOUNDARIES.cloud, flagship: true },
  { id: 'dev', label: 'Hanzo Dev', href: U.dev, verb: 'Build software', tagline: 'From the editor and terminal', boundary: PRODUCT_BOUNDARIES.dev },
]

/** The six flagship products (mega-menu top group + footer PRODUCTS column). */
export const HANZO_FLAGSHIP: HanzoProduct[] = HANZO_PRODUCTS.filter((p) => p.flagship)

/* ── Universal "Meet Hanzo" mega-menu — identical on every property ─────────── */

export const MEET_HANZO_GROUPS: MeetHanzoGroup[] = [
  {
    id: 'products',
    title: 'Flagship products',
    items: HANZO_FLAGSHIP,
  },
  {
    id: 'platform',
    title: 'Platform',
    items: [
      { id: 'models', label: 'Models', href: U.models },
      { id: 'enso', label: 'Enso', href: U.enso },
      { id: 'agents', label: 'Managed Agents', href: U.agents },
      { id: 'mcp', label: 'MCP Tools', href: U.mcp },
      { id: 'dev', label: 'Hanzo Dev', href: U.dev },
      { id: 'console', label: 'Developer Console', href: U.console },
      { id: 'api', label: 'API Platform', href: U.api },
      { id: 'cloud', label: 'All cloud products', href: U.cloud },
    ],
  },
  {
    id: 'install',
    title: 'Install',
    items: [
      { id: 'desktop', label: 'Desktop app', href: U.desktop },
      { id: 'extension', label: 'Browser extension', href: U.extension },
      { id: 'vscode', label: 'VS Code', href: U.vscode },
      { id: 'cli', label: 'Hanzo CLI', href: U.cli },
      { id: 'sdks', label: 'SDKs', href: U.sdks },
      { id: 'downloads', label: 'All downloads', href: U.downloads },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    items: [
      { id: 'docs', label: 'Documentation', href: U.docs },
      { id: 'quickstarts', label: 'Quickstarts', href: U.quickstarts },
      { id: 'learn', label: 'Learn', href: U.learn },
      { id: 'community', label: 'Community', href: U.community },
      { id: 'showcase', label: 'Showcase', href: U.showcase },
      { id: 'changelog', label: 'Changelog', href: U.changelog },
      { id: 'status', label: 'Status', href: U.status },
      { id: 'support', label: 'Support', href: U.support },
    ],
  },
]

/* ── Unified footer — same everywhere; the current product is highlighted ───── */

export const HANZO_FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'products',
    title: 'Products',
    items: [
      ...HANZO_FLAGSHIP.map((p) => ({ id: p.id, label: p.label, href: p.href })),
      { id: 'dev', label: 'Hanzo Dev', href: U.dev },
      { id: 'allProducts', label: 'All products', href: U.allProducts },
    ],
  },
  {
    id: 'platform',
    title: 'AI Platform',
    items: [
      { id: 'models', label: 'Models', href: U.models },
      { id: 'enso', label: 'Enso', href: U.enso },
      { id: 'agents', label: 'Managed Agents', href: U.agents },
      { id: 'mcp', label: 'MCP Tools', href: U.mcp },
      { id: 'api', label: 'API Platform', href: U.api },
      { id: 'console', label: 'Developer Console', href: U.console },
      { id: 'cloud', label: 'All cloud products', href: U.cloud },
    ],
  },
  {
    id: 'install',
    title: 'Install',
    items: [
      { id: 'desktop', label: 'Desktop app', href: U.desktop },
      { id: 'extension', label: 'Browser extension', href: U.extension },
      { id: 'vscode', label: 'VS Code', href: U.vscode },
      { id: 'cli', label: 'Hanzo CLI', href: U.cli },
      { id: 'sdks', label: 'SDKs', href: U.sdks },
      { id: 'downloads', label: 'All downloads', href: U.downloads },
    ],
  },
  {
    id: 'developers',
    title: 'Developers',
    items: [
      { id: 'docs', label: 'Documentation', href: U.docs },
      { id: 'apiRef', label: 'API Reference', href: U.apiRef },
      { id: 'sdks', label: 'SDKs', href: U.sdks },
      { id: 'mcp', label: 'MCP Tools', href: U.mcp },
      { id: 'cliRef', label: 'CLI Reference', href: U.cliRef },
      { id: 'github', label: 'GitHub', href: U.github },
      { id: 'status', label: 'System Status', href: U.status },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    items: [
      { id: 'quickstarts', label: 'Quickstarts', href: U.quickstarts },
      { id: 'learn', label: 'Learn', href: U.learn },
      { id: 'community', label: 'Community', href: U.community },
      { id: 'showcase', label: 'Showcase', href: U.showcase },
      { id: 'changelog', label: 'Changelog', href: U.changelog },
      { id: 'research', label: 'Research', href: U.research },
      { id: 'support', label: 'Support', href: U.support },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    items: [
      { id: 'about', label: 'About Hanzo', href: U.about },
      { id: 'customers', label: 'Customers', href: U.customers },
      { id: 'blog', label: 'Blog', href: U.blog },
      { id: 'careers', label: 'Careers', href: U.careers },
      { id: 'enterprise', label: 'Enterprise', href: U.enterprise },
      { id: 'security', label: 'Security', href: U.security },
      { id: 'contact', label: 'Contact', href: U.contact },
    ],
  },
]

export const HANZO_FOOTER_BOTTOM = {
  copyright: '© 2026 Hanzo AI, Inc.',
  links: [
    { id: 'status', label: 'Status', href: U.status },
    { id: 'security', label: 'Security', href: U.security },
    { id: 'privacy', label: 'Privacy', href: U.privacy },
    { id: 'terms', label: 'Terms', href: U.terms },
    { id: 'cookies', label: 'Cookies', href: U.cookies },
  ] as HanzoLink[],
}

/* ── Per-domain public-header + pre-footer surface config ───────────────────── */

export const HANZO_SURFACES: HanzoSurface[] = [
  {
    id: 'ai',
    host: 'hanzo.ai',
    productId: 'ai',
    brandName: 'Hanzo',
    localNav: [
      { id: 'models', label: 'Models', href: U.models },
      { id: 'agents', label: 'Agents', href: U.agents },
      { id: 'solutions', label: 'Solutions', href: U.solutions },
      { id: 'developers', label: 'Developers', href: U.docs },
      { id: 'pricing', label: 'Pricing', href: U.pricing },
      { id: 'enterprise', label: 'Enterprise', href: U.enterprise },
    ],
    secondaryCTA: { id: 'docs', label: 'Documentation', href: U.docs },
    primaryCTA: { id: 'chat', label: 'Open Chat', href: U.chat },
    preFooter: {
      heading: 'Meet the complete Hanzo AI platform',
      actions: [
        { id: 'products', label: 'Explore products', href: U.allProducts },
        { id: 'chat', label: 'Open Chat', href: U.chat },
      ],
    },
  },
  {
    id: 'chat',
    host: 'hanzo.chat',
    productId: 'chat',
    brandName: 'Hanzo Chat',
    localNav: [
      { id: 'product', label: 'Product', href: `${U.chat}/product` },
      { id: 'models', label: 'Models', href: U.models },
      { id: 'agents', label: 'Agents', href: U.agents },
      { id: 'download', label: 'Download', href: U.downloads },
      { id: 'pricing', label: 'Pricing', href: U.pricing },
    ],
    secondaryCTA: { id: 'install', label: 'Install Hanzo', href: U.downloads },
    primaryCTA: { id: 'newchat', label: 'New chat', href: U.chat },
    preFooter: {
      heading: 'Take Hanzo everywhere you work',
      actions: [
        { id: 'download', label: 'Download Hanzo', href: U.downloads },
        { id: 'extension', label: 'Add browser extension', href: U.extension },
      ],
    },
  },
  {
    id: 'app',
    host: 'hanzo.app',
    productId: 'app',
    brandName: 'Hanzo App',
    localNav: [
      { id: 'product', label: 'Product', href: `${U.app}/product` },
      { id: 'templates', label: 'Templates', href: `${U.app}/templates` },
      { id: 'showcase', label: 'Showcase', href: U.showcase },
      { id: 'pricing', label: 'Pricing', href: U.pricing },
      { id: 'enterprise', label: 'Enterprise', href: U.enterprise },
    ],
    secondaryCTA: { id: 'download', label: 'Download', href: U.downloads },
    primaryCTA: { id: 'newproject', label: '+ New project', href: U.app },
    preFooter: {
      heading: 'Turn an idea into a live application',
      actions: [
        { id: 'newproject', label: 'New project', href: U.app },
        { id: 'templates', label: 'Browse templates', href: `${U.app}/templates` },
      ],
    },
  },
  {
    id: 'cloud',
    host: 'cloud.hanzo.ai',
    productId: 'cloud',
    brandName: 'Hanzo Cloud',
    localNav: [
      { id: 'products', label: 'Products', href: `${U.cloud}/products` },
      { id: 'solutions', label: 'Solutions', href: U.solutions },
      { id: 'developers', label: 'Developers', href: U.docs },
      { id: 'pricing', label: 'Pricing', href: U.pricing },
      { id: 'docs', label: 'Docs', href: U.docs },
    ],
    secondaryCTA: { id: 'apikey', label: 'Get API key', href: U.console },
    primaryCTA: { id: 'console', label: 'Open Console', href: U.console },
    preFooter: {
      heading: 'Build and operate on the AI cloud',
      actions: [
        { id: 'apikey', label: 'Get API key', href: U.console },
        { id: 'console', label: 'Open Console', href: U.console },
      ],
    },
  },
  {
    id: 'team',
    host: 'hanzo.team',
    productId: 'team',
    brandName: 'Hanzo Team',
    localNav: [
      { id: 'product', label: 'Product', href: `${U.team}/product` },
      { id: 'solutions', label: 'Solutions', href: U.solutions },
      { id: 'integrations', label: 'Integrations', href: `${U.team}/integrations` },
      { id: 'pricing', label: 'Pricing', href: U.pricing },
      { id: 'enterprise', label: 'Enterprise', href: U.enterprise },
    ],
    secondaryCTA: { id: 'download', label: 'Download', href: U.downloads },
    primaryCTA: { id: 'workspace', label: 'Open workspace', href: U.team },
    preFooter: {
      heading: 'Bring your people and AI coworkers together',
      actions: [
        { id: 'createorg', label: 'Create organization', href: U.team },
        { id: 'workspace', label: 'Open workspace', href: U.team },
      ],
    },
  },
  {
    id: 'bot',
    host: 'hanzo.bot',
    productId: 'bot',
    brandName: 'Hanzo Bot',
    localNav: [
      { id: 'product', label: 'Product', href: `${U.bot}/product` },
      { id: 'channels', label: 'Channels', href: `${U.bot}/channels` },
      { id: 'templates', label: 'Templates', href: `${U.bot}/templates` },
      { id: 'integrations', label: 'Integrations', href: `${U.bot}/integrations` },
      { id: 'pricing', label: 'Pricing', href: U.pricing },
    ],
    secondaryCTA: { id: 'docs', label: 'Documentation', href: U.docs },
    primaryCTA: { id: 'createbot', label: 'Create bot', href: U.bot },
    preFooter: {
      heading: 'Put an intelligent agent in every channel',
      actions: [
        { id: 'createbot', label: 'Create bot', href: U.bot },
        { id: 'channels', label: 'View channels', href: `${U.bot}/channels` },
      ],
    },
  },
  {
    id: 'studio',
    host: 'studio.hanzo.ai',
    productId: 'studio',
    brandName: 'Hanzo Studio',
    localNav: [
      { id: 'models', label: 'Models', href: U.models },
      { id: 'prompts', label: 'Prompts', href: `${U.studio}/prompts` },
      { id: 'agents', label: 'Agents', href: U.agents },
      { id: 'evaluations', label: 'Evaluations', href: `${U.studio}/evaluations` },
      { id: 'docs', label: 'Docs', href: U.docs },
    ],
    secondaryCTA: { id: 'apiref', label: 'API Reference', href: U.apiRef },
    primaryCTA: { id: 'studio', label: 'Open Studio', href: U.studio },
    preFooter: {
      heading: 'Take models and agents from idea to production',
      actions: [
        { id: 'studio', label: 'Open Studio', href: U.studio },
        { id: 'quickstart', label: 'Read quickstart', href: U.quickstarts },
      ],
    },
  },
]

/** The default surface (hanzo.ai) when no host matches. */
export const DEFAULT_SURFACE: HanzoSurface = HANZO_SURFACES[0]

/** Look up a surface by its id. */
export function getSurface(id?: string): HanzoSurface | undefined {
  return id ? HANZO_SURFACES.find((s) => s.id === id) : undefined
}

/**
 * Resolve the surface for a hostname (exact host, or the longest matching
 * host suffix at a dot boundary). Falls back to the hanzo.ai surface.
 */
export function findSurfaceByHost(host?: string): HanzoSurface {
  if (!host) return DEFAULT_SURFACE
  const h = host.toLowerCase().replace(/^www\./, '').replace(/:\d+$/, '')
  const exact = HANZO_SURFACES.find((s) => s.host === h)
  if (exact) return exact
  const suffix = HANZO_SURFACES.filter((s) => h === s.host || h.endsWith(`.${s.host}`)).sort(
    (a, b) => b.host.length - a.host.length,
  )[0]
  return suffix ?? DEFAULT_SURFACE
}

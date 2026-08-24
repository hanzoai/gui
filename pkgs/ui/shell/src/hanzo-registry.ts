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
 *   HANZO_PRODUCTS .... the flagship products (+ Dev) with tagline · boundary
 *   MEET_HANZO_GROUPS . the universal mega-menu (identical on every property)
 *   HANZO_SURFACES .... per-domain public-header config (brand · nav · CTAs · CTA)
 *   HANZO_FOOTER_* .... the unified 6-column footer + bottom legal bar
 *   PRODUCT_BOUNDARIES  the one-line "what each product is for"
 */

import type { GlyphName } from './glyph'

/** A plain navigable link. */
export interface HanzoLink {
  id: string
  label: string
  href: string
  /** Optional short hint (host / one-liner) shown in menus. */
  hint?: string
  /** External (new tab) — defaults true for cross-property links. */
  external?: boolean
  /**
   * The mark this row wears in a menu, drawn to the LEFT of the label. A NAME
   * from the shell's own set (`GlyphName`), never an element: the registry is
   * data, and a host that could pass its own element would give one menu a mark
   * the others cannot draw.
   */
  glyph?: GlyphName
}

/**
 * A local-nav entry: a link, or a link that HOLDS links.
 *
 * With `items` the label opens a card of them under itself; `href` stays the
 * page it names, so the entry is a real link before hydration and without
 * JavaScript. Without `items` it is exactly a `HanzoLink` and renders as one.
 */
export interface HanzoNav extends HanzoLink {
  /** The links this entry opens. Omit for a plain link. */
  items?: HanzoLink[]
  /**
   * Columns beside the primary list. With groups the menu opens as a WIDE
   * panel: `items` becomes the large left column — the destinations someone
   * arrives wanting — and each group is a column of supporting links.
   *
   * Without groups the menu stays the compact card, so an entry that is a
   * short list does not grow a layout it has no content for.
   */
  groups?: HanzoNavGroup[]
}

/** A titled column of links inside a wide nav panel. */
export interface HanzoNavGroup {
  id: string
  title: string
  items: HanzoLink[]
}

/** A first-party Hanzo product. */
export interface HanzoProduct extends HanzoLink {
  /**
   * The PAGE that explains this product, when it is not the same thing as the
   * host that runs it.
   *
   * `href` is where the product LIVES — hanzo.chat, hanzo.app, studio.hanzo.ai.
   * That is the right destination for someone who has an account and wants to
   * open it, and the wrong one for someone who has just arrived and wants to
   * know what it is: measured anonymously, studio.hanzo.ai and
   * console.hanzo.ai answer with a bare "Login or Signup" that never names the
   * product, and hanzo.chat's whole page is 260 characters that never say what
   * it does.
   *
   * hanzo.ai publishes a real page for every one of them and nothing linked to
   * any of it. So the public menu reads THIS, and the signed-in launcher reads
   * `href` — two audiences, one list, no second copy of the taxonomy.
   */
  page?: string
  /** One-line tagline ("Ask anything", "Build and ship apps", …). */
  tagline: string
  /** The product boundary — what this product is FOR (kept consistent everywhere). */
  boundary: string
  /** Flagship products get the prominent top group of the mega-menu. */
  flagship?: boolean
  /**
   * How finished this product is. Absent means released — the common case, so
   * shipping a product is deleting a field.
   *
   * The same word the platform already uses of an operation (HIP-0139 §8), and
   * deliberately NOT the plan tier beside it in `entitlements.ts`. Those are two
   * axes: a tier says what someone PAID for, a stage says whether the thing is
   * FINISHED. Paying more does not make an alpha ready, and a free reader still
   * sees every released product.
   */
  stage?: Stage
}

/**
 * A product that is not yet released, named by how far along it is.
 *
 * Absent is the third value and the default: released. Two words rather than
 * three because "generally available" is the state of every product that does
 * not say otherwise, and a field nobody has to write is a field nobody can
 * write wrong.
 */
export type Stage = 'beta' | 'alpha'

/** Monotonic: a reader cleared for a stage is cleared for everything below it. */
const STAGE_RANK: Record<string, number> = { beta: 1, alpha: 2 }

/**
 * Does a reader cleared to `stage` see this product?
 *
 * Used as a filter — `HANZO_FLAGSHIP.filter(sees(stage))`. Without a clearance
 * only released products pass, so a surface that knows nothing about stages
 * shows nothing unfinished. That default is the point: an unreleased product
 * reaching a public menu should take a deliberate act, never an omission.
 *
 * ONE question, not two. It briefly split into "may they see it" and "may they
 * open it", on the reasoning that beta is advertised while alpha is secret. That
 * is a fair rule for a product someone chose to announce, and it is not this
 * one: what a stranger is offered here is the finished estate, and Team, Bot and
 * Studio are all held back until they are ready. With both halves agreeing on
 * every stage the second function computed the same answer under another name,
 * so it is gone rather than kept as a synonym.
 *
 * If a beta ever should be advertised, that is the product saying so — give it
 * its own field and let it opt in. Do not reach it by loosening what `beta`
 * means for everything else.
 */
export function sees(stage?: Stage): (p: HanzoProduct) => boolean {
  const cleared = stage ? STAGE_RANK[stage] : 0
  return (p) => (p.stage ? STAGE_RANK[p.stage] : 0) <= cleared
}

export interface MeetHanzoGroup {
  id: string
  title: string
  items: HanzoLink[]
}

/**
 * A category of first-party product primitives — the unit of the RICH Products
 * mega-menu (the ten-category cloud taxonomy the flagship hanzo.ai renders).
 *
 * A surface opts into the rich menu by passing a `ProductCategory[]` to
 * `HanzoHeader`'s `productsTaxonomy` prop. `HANZO_PRODUCT_CATEGORIES` below is
 * the shared default; a surface that owns the taxonomy locally (hanzo.ai's
 * `cloudCategories`) passes its own so the menu, its `/products/<slug>` landing
 * pages, and its route table never drift.
 */
export interface ProductCategory {
  /** Stable category id — also the current-category highlight key. */
  id: string
  /** Category label shown as the column header ("AI", "Compute", …). */
  label: string
  /** Category landing page — the mega-menu column header links here. */
  href: string
  /** One-line category positioning, shown under the header. */
  tagline?: string
  /** The category's primitives (≈6). Each leaf's `hint` is its short descriptor. */
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
  /** Local (in-product) marketing nav. An entry with `items` opens a menu. */
  localNav: HanzoNav[]
  /**
   * Secondary (ghost) header action, when the surface has one.
   *
   * Optional for the reason `primaryCTA` is: a surface that has moved this link
   * into a menu has no second action, and the only honest value is none.
   * Required, it made a surface pass a link it did not want and then hide the
   * control in CSS — which reads as styling rather than as absence, and leaves
   * the link in the palette and the mobile sheet where no rule reaches it.
   */
  secondaryCTA?: HanzoLink
  /**
   * Primary (filled) header action, when the surface has one.
   *
   * Optional because a signed-in product often does not: its header carries an
   * account menu and its create action lives in the page, so the only honest
   * value is none. Requiring one made a surface pass a link it did not want and
   * then hide the button in CSS, which reads as a styling choice rather than as
   * "this surface has no primary action" — and a selector matching an href is a
   * hide that breaks the day the href changes.
   */
  primaryCTA?: HanzoLink
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
  world: 'https://world.hanzo.ai',
  studio: 'https://studio.hanzo.ai',
  bot: 'https://hanzo.bot',
  // hanzo.bot is the marketing site; the product it sells runs at app.hanzo.bot.
  // Two origins because the product owns a whole one: ~25 top-level routes, its
  // own /v1 API and its own /assets bundle. It signs people in itself (PKCE
  // against hanzo.id), so a CTA only has to name it.
  botApp: 'https://app.hanzo.bot',
  cloud: 'https://cloud.hanzo.ai',
  dev: 'https://hanzo.ai/dev',
  base: 'https://hanzo.ai/base',

  // Platform
  models: 'https://hanzo.ai/models',
  enso: 'https://hanzo.ai/enso',
  agents: 'https://hanzo.ai/agents',
  mcp: 'https://hanzo.ai/mcp',
  console: 'https://console.hanzo.ai',
  keys: 'https://console.hanzo.ai/keys',
  gateway: 'https://console.hanzo.ai/gateway',
  platform: 'https://platform.hanzo.ai',
  api: 'https://hanzo.ai/api',

  // Install
  desktop: 'https://hanzo.ai/desktop',
  extension: 'https://hanzo.ai/extension',
  cli: 'https://hanzo.ai/cli',
  sdks: 'https://hanzo.ai/sdks',
  downloads: 'https://hanzo.ai/download',

  // Developers / resources
  docs: 'https://docs.hanzo.ai',
  apiRef: 'https://docs.hanzo.ai/docs/openapi/',
  cliRef: 'https://docs.hanzo.ai/docs/cli',
  quickstarts: 'https://docs.hanzo.ai/docs/quickstart',
  learn: 'https://hanzo.ai/learn',
  // Community = the hub for everything built on Hanzo: templates + apps shipped on
  // hanzo.app + the hanzo-apps GitHub org. Lives on hanzo.app (the builder), which
  // owns the feed + its moderation. (Replaces the old hanzo.ai/showcase, which was
  // just the hero chat re-skinned.)
  community: 'https://hanzo.app/community',
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
  /**
   * Hanzo IAM — the ONE identity provider every surface signs in against.
   * The shell never mints a session itself: it renders the control and the
   * host's `@hanzo/iam` client runs the authorization-code + PKCE round trip.
   */
  id: 'https://hanzo.id',
  signup: 'https://hanzo.id/signup',
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
  base: 'Store and serve application data',
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
  {
    id: 'chat',
    glyph: 'chat',
    label: 'Hanzo Chat',
    href: U.chat,
    page: `${U.ai}/chat`,
    tagline: 'Ask anything',
    boundary: PRODUCT_BOUNDARIES.chat,
    flagship: true,
  },
  {
    id: 'app',
    glyph: 'blocks',
    label: 'Hanzo App',
    href: U.app,
    page: `${U.ai}/app`,
    tagline: 'Build and ship apps',
    boundary: PRODUCT_BOUNDARIES.app,
    flagship: true,
  },
  {
    id: 'base',
    glyph: 'base',
    label: 'Hanzo Base',
    href: U.base,
    page: `${U.ai}/base`,
    tagline: 'Data, auth and files',
    boundary: PRODUCT_BOUNDARIES.base,
    flagship: true,
  },
  {
    id: 'cloud',
    glyph: 'cloud',
    label: 'Hanzo Cloud',
    href: U.cloud,
    page: `${U.ai}/cloud`,
    tagline: 'Run the platform',
    boundary: PRODUCT_BOUNDARIES.cloud,
    flagship: true,
  },
  {
    id: 'dev',
    glyph: 'code',
    label: 'Hanzo Dev',
    href: U.dev,
    tagline: 'From the editor and terminal',
    boundary: PRODUCT_BOUNDARIES.dev,
    // Flagship like the rest. It was the one product held out of the rail, so
    // the menu that answers "what is Hanzo" omitted the coding tool — while
    // Platform listed it in small type two columns over, as if it were a
    // feature of something else.
    flagship: true,
  },
  {
    id: 'team',
    glyph: 'users',
    label: 'Hanzo Team',
    href: U.team,
    page: `${U.ai}/team`,
    tagline: 'People and AI together',
    boundary: PRODUCT_BOUNDARIES.team,
    flagship: true,
    stage: 'beta',
  },
  {
    id: 'bot',
    glyph: 'bot',
    label: 'Hanzo Bot',
    href: U.bot,
    page: `${U.ai}/bot`,
    tagline: 'Publish AI anywhere',
    boundary: PRODUCT_BOUNDARIES.bot,
    flagship: true,
    stage: 'beta',
  },
  {
    id: 'studio',
    glyph: 'studio',
    label: 'Hanzo Studio',
    href: U.studio,
    page: `${U.ai}/studio`,
    // What the page it opens actually sells. It read "Models, prompts and
    // agents", which is a different product from the one hanzo.ai/studio
    // describes — "the visual AI engine for generative media … images, video,
    // audio, and 3D". A menu row and its destination disagreeing about the
    // product is worse than either sentence alone.
    tagline: 'Visual pipelines for generative media',
    boundary: PRODUCT_BOUNDARIES.studio,
    flagship: true,
    stage: 'alpha',
  },
]

/**
 * The flagship products (mega-menu top group + footer PRODUCTS column).
 *
 * Every flagship, at whatever stage — this is a fact about the products, not
 * about who is looking. A surface that shows it to a reader passes it through
 * `sees(stage)` first; the components in this package already do, defaulting to
 * released-only.
 */
export const HANZO_FLAGSHIP: HanzoProduct[] = HANZO_PRODUCTS.filter((p) => p.flagship)

/**
 * The flagships as a PUBLIC menu links them — each pointing at the page that
 * explains it rather than the host that runs it.
 *
 * Derived once, because it was applied once and there were three consumers: the
 * Try menu took it, and the Meet menu and the footer kept sending anonymous
 * readers to the app hosts. That is the shape this file exists to prevent, and
 * it reappeared the moment the rule lived at a call site instead of here.
 *
 * `HANZO_FLAGSHIP` itself is untouched, so the launcher and anything else that
 * genuinely wants the running product still has it.
 *
 * PUBLIC is meant literally: what a STRANGER may be shown, which is the released
 * estate and nothing else. A product still at beta or alpha is held back until
 * it is ready, so this list is shorter than the taxonomy above it by design.
 *
 * A caller holding a reader's clearance wants `HANZO_FLAGSHIP` through
 * `sees(stage)`; a caller reaching for the value named "public" is by definition
 * rendering to a stranger.
 */
export const HANZO_FLAGSHIP_PUBLIC: HanzoProduct[] = HANZO_FLAGSHIP.filter(sees()).map((p) => ({
  ...p,
  href: p.page ?? p.href,
}))

/* ── Universal "Try Hanzo" menu — the products, identical on every property ── */

/**
 * What the primary action opens.
 *
 * "Try Hanzo" used to be one link to the console, which answered a question
 * nobody asked: a visitor arrives wanting to build an app, or to keep data
 * somewhere, or to chat, or to code from a terminal — and the console is only
 * one of those. So the action names the products and lets the visitor pick.
 *
 * It is NOT a second Meet Hanzo. Meet Hanzo answers "what IS Hanzo" and carries
 * the whole ecosystem, taglines and all; this answers "start what?", and holds
 * only things you can OPEN right now. The two never diverge because neither
 * holds a list: both project `HANZO_PRODUCTS`, so a product added once appears
 * in both, spelled once.
 *
 * OPEN is the flagships, in the order the question is usually asked. INSTALL is
 * what you put on your own machine — the same rows as Meet Hanzo's Install
 * group, by construction rather than by copy.
 */
export const TRY_HANZO_GROUPS: MeetHanzoGroup[] = [
  {
    id: 'open',
    title: 'Open',
    items: HANZO_FLAGSHIP_PUBLIC.map((p) => ({
      id: p.id,
      label: p.label,
      href: p.href,
      hint: p.tagline,
      glyph: p.glyph,
    })),
  },
  {
    id: 'install',
    title: 'Install',
    items: [
      { id: 'desktop', label: 'Desktop app', href: U.desktop, glyph: 'monitor' },
      { id: 'extension', label: 'Browser extension', href: U.extension, glyph: 'puzzle' },
      { id: 'cli', label: 'Hanzo CLI', href: U.cli, glyph: 'terminal' },
      { id: 'sdks', label: 'SDKs', href: U.sdks, glyph: 'package' },
      { id: 'downloads', label: 'All downloads', href: U.downloads, glyph: 'download' },
    ],
  },
]

/* ── Universal "Meet Hanzo" mega-menu — identical on every property ─────────── */

export const MEET_HANZO_GROUPS: MeetHanzoGroup[] = [
  {
    id: 'products',
    title: 'Flagship products',
    items: HANZO_FLAGSHIP_PUBLIC,
  },
  {
    id: 'platform',
    title: 'Platform',
    items: [
      { id: 'models', label: 'Models', href: U.models, glyph: 'layers' },
      { id: 'enso', label: 'Enso', href: U.enso, glyph: 'circle' },
      { id: 'agents', label: 'Managed agents', href: U.agents, glyph: 'cpu' },
      { id: 'mcp', label: 'MCP tools', href: U.mcp, glyph: 'plug' },
      { id: 'dev', label: 'Hanzo Dev', href: U.dev, glyph: 'code' },
      {
        id: 'console',
        label: 'Developer console',
        href: `${U.ai}/console`,
        glyph: 'terminal',
      },
      { id: 'api', label: 'API platform', href: U.api, glyph: 'gateway' },
      { id: 'cloud', label: 'All cloud products', href: U.cloud, glyph: 'cloud' },
    ],
  },
  {
    id: 'install',
    title: 'Install',
    items: [
      { id: 'desktop', label: 'Desktop app', href: U.desktop, glyph: 'monitor' },
      { id: 'extension', label: 'Browser extension', href: U.extension, glyph: 'puzzle' },
      { id: 'cli', label: 'Hanzo CLI', href: U.cli, glyph: 'terminal' },
      { id: 'sdks', label: 'SDKs', href: U.sdks, glyph: 'package' },
      { id: 'downloads', label: 'All downloads', href: U.downloads, glyph: 'download' },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    items: [
      { id: 'docs', label: 'Documentation', href: U.docs, glyph: 'book' },
      { id: 'quickstarts', label: 'Quickstarts', href: U.quickstarts, glyph: 'rocket' },
      { id: 'learn', label: 'Learn', href: U.learn, glyph: 'cap' },
      { id: 'community', label: 'Community', href: U.community, glyph: 'users' },
      { id: 'status', label: 'Status', href: U.status, glyph: 'pulse' },
      { id: 'support', label: 'Support', href: U.support, glyph: 'ring' },
    ],
  },
]

/* ── Rich Products taxonomy — the ten-category cloud menu (flagship level) ───── */

/**
 * Category slug — the ONE slugify shared by the rich-menu column headers and the
 * `/products/<slug>` landing routes ("AI" → "ai", "Web3" → "web3"). Matches the
 * flagship's `categorySlug`, so a header always links to a page that exists.
 */
export const productCategorySlug = (label: string): string =>
  label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// The Web3 category is a Lux Network surface — white-label separation is
// absolute: a Lux leaf hands off to lux.cloud, never carrying the Hanzo mark.
const LUX_CLOUD = 'https://lux.cloud'
const LUX_SERVICES = 'https://lux.cloud/services'

/** Build a `/products/<slug>` category landing href on hanzo.ai. */
const cat = (label: string): string => `${U.ai}/products/${productCategorySlug(label)}`

/**
 * HANZO_PRODUCT_CATEGORIES — the canonical ten-category cloud taxonomy rendered
 * by <ProductsMegaMenu>. Two rows of five: AI · Compute · Data · Network ·
 * Security / Dev · Platform · Observe · Web3 · Apps. Positioned "Open AI Cloud —
 * GCP-compatible. Open source. On-chain." Every leaf's `hint` is its short
 * menu descriptor. This is the shared DEFAULT; hanzo.ai passes its own live
 * `cloudCategories` (the route source of truth) to `productsTaxonomy`.
 */
export const HANZO_PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'ai',
    label: 'AI',
    href: cat('AI'),
    tagline: 'Models, agents, and inference — open weights, one API.',
    items: [
      {
        id: 'models',
        label: 'Models',
        href: `${U.ai}/models`,
        hint: 'Open-weight model garden',
      },
      {
        id: 'agents',
        label: 'Agents',
        href: `${U.ai}/agents`,
        hint: 'Build & run agents',
      },
      {
        id: 'inference',
        label: 'Inference',
        href: `${U.ai}/engine`,
        hint: 'Serverless model serving',
      },
      {
        id: 'fine-tuning',
        label: 'Fine-tuning',
        href: `${U.ai}/cloud/fine-tuning`,
        hint: 'Tune models on your data',
      },
      {
        id: 'embeddings',
        label: 'Embeddings',
        href: `${U.ai}/cloud/embeddings`,
        hint: 'Vectorize text & images',
      },
      {
        id: 'evals',
        label: 'Evals',
        href: `${U.ai}/cloud/evals`,
        hint: 'Score model quality',
      },
    ],
  },
  {
    id: 'compute',
    label: 'Compute',
    href: cat('Compute'),
    tagline: 'GPUs, containers, and functions that scale to zero.',
    items: [
      {
        id: 'gpus',
        label: 'GPUs',
        href: `${U.ai}/cloud/gpus`,
        hint: 'On-demand GPU compute',
      },
      {
        id: 'machines',
        label: 'Machines',
        href: `${U.ai}/machines`,
        hint: 'Virtual machines',
      },
      {
        id: 'containers',
        label: 'Containers',
        href: `${U.ai}/cloud/containers`,
        hint: 'Containers, scale to zero',
      },
      {
        id: 'functions',
        label: 'Functions',
        href: `${U.ai}/functions`,
        hint: 'Event-driven functions',
      },
      { id: 'edge', label: 'Edge', href: `${U.ai}/edge`, hint: 'Compute at the edge' },
      {
        id: 'jobs',
        label: 'Jobs',
        href: `${U.ai}/cloud/jobs`,
        hint: 'Batch & scheduled jobs',
      },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    href: cat('Data'),
    tagline: 'Every persistence primitive, from vectors to objects.',
    items: [
      { id: 'vector', label: 'Vector', href: `${U.ai}/vector`, hint: 'Vector search' },
      { id: 'sql', label: 'SQL', href: `${U.ai}/sql`, hint: 'Managed SQL databases' },
      { id: 'kv', label: 'KV', href: `${U.ai}/kv`, hint: 'In-memory key-value store' },
      {
        id: 'storage',
        label: 'Object Storage',
        href: `${U.ai}/storage`,
        hint: 'S3-compatible object store',
      },
      {
        id: 'datastore',
        label: 'Datastore',
        href: `${U.ai}/datastore`,
        hint: 'Wide-column datastore',
      },
      { id: 'docdb', label: 'DocDB', href: `${U.ai}/docdb`, hint: 'Document database' },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    href: cat('Network'),
    tagline: 'Connect, route, and protect every service.',
    items: [
      { id: 'gateway', label: 'Gateway', href: `${U.ai}/gateway`, hint: 'API gateway' },
      { id: 'vpc', label: 'VPC', href: `${U.ai}/network`, hint: 'Private networks' },
      { id: 'dns', label: 'DNS', href: `${U.ai}/dns`, hint: 'Managed DNS' },
      {
        id: 'cdn',
        label: 'CDN',
        href: `${U.ai}/cloud/cdn`,
        hint: 'Global content delivery',
      },
      {
        id: 'load-balancer',
        label: 'Load Balancer',
        href: `${U.ai}/ingress`,
        hint: 'Traffic load balancing',
      },
      {
        id: 'service-mesh',
        label: 'Service Mesh',
        href: `${U.ai}/cloud/service-mesh`,
        hint: 'Service-to-service mesh',
      },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    href: cat('Security'),
    tagline: 'Identity, keys, and audit for the whole cloud.',
    items: [
      { id: 'iam', label: 'IAM', href: `${U.ai}/iam`, hint: 'Identity & access' },
      {
        id: 'authz',
        label: 'Authz',
        href: `${U.ai}/authz`,
        hint: 'Fine-grained authorization',
      },
      { id: 'kms', label: 'KMS', href: `${U.ai}/kms`, hint: 'Key management' },
      { id: 'hsm', label: 'HSM', href: `${U.ai}/hsm`, hint: 'Hardware key security' },
      {
        id: 'secrets',
        label: 'Secrets',
        href: `${U.ai}/cloud/secrets`,
        hint: 'Secret storage & sync',
      },
      { id: 'audit', label: 'Audit', href: `${U.ai}/cloud/audit`, hint: 'Audit logging' },
    ],
  },
  {
    id: 'dev',
    label: 'Dev',
    href: cat('Dev'),
    tagline: 'Build against the cloud from anywhere.',
    items: [
      { id: 'cli', label: 'CLI', href: `${U.ai}/cli`, hint: 'Command-line control' },
      { id: 'sdks', label: 'SDKs', href: `${U.ai}/cloud/sdks`, hint: 'Client libraries' },
      {
        id: 'api',
        label: 'API',
        href: `${U.ai}/cloud/api`,
        hint: 'Programmatic cloud API',
      },
      {
        id: 'playground',
        label: 'Playground',
        href: `${U.ai}/playground`,
        hint: 'Prototype in the browser',
      },
      { id: 'ide', label: 'IDE', href: `${U.ai}/code`, hint: 'In-browser IDE' },
      {
        id: 'desktop',
        label: 'Desktop',
        href: `${U.ai}/desktop`,
        hint: 'Managed dev workstations',
      },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    href: cat('Platform'),
    tagline: 'Source to production as declared state.',
    items: [
      {
        id: 'projects',
        label: 'Projects',
        href: `${U.ai}/platform`,
        hint: 'Organize resources',
      },
      {
        id: 'environments',
        label: 'Environments',
        href: `${U.ai}/cloud/environments`,
        hint: 'Deploy targets',
      },
      {
        id: 'builds',
        label: 'Builds',
        href: `${U.ai}/cloud/builds`,
        hint: 'Build from source',
      },
      {
        id: 'registry',
        label: 'Registry',
        href: `${U.ai}/registry`,
        hint: 'Container & artifact registry',
      },
      {
        id: 'releases',
        label: 'Releases',
        href: `${U.ai}/cloud/releases`,
        hint: 'Promote & roll out',
      },
      {
        id: 'pipelines',
        label: 'Pipelines',
        href: `${U.ai}/cloud/pipelines`,
        hint: 'CI/CD pipelines',
      },
    ],
  },
  {
    id: 'observe',
    label: 'Observe',
    href: cat('Observe'),
    tagline: 'Logs, metrics, traces, and cost in one pane.',
    items: [
      {
        id: 'logs',
        label: 'Logs',
        href: `${U.ai}/cloud/logs`,
        hint: 'Centralized logging',
      },
      {
        id: 'metrics',
        label: 'Metrics',
        href: `${U.ai}/metrics`,
        hint: 'Metrics & monitoring',
      },
      {
        id: 'traces',
        label: 'Traces',
        href: `${U.ai}/telemetry`,
        hint: 'Distributed tracing',
      },
      {
        id: 'dashboards',
        label: 'Dashboards',
        href: `${U.ai}/dashboards`,
        hint: 'Live dashboards',
      },
      {
        id: 'alerts',
        label: 'Alerts',
        href: `${U.ai}/sentry`,
        hint: 'Alerting & incidents',
      },
      {
        id: 'cost',
        label: 'Cost',
        href: `${U.ai}/cloud/cost`,
        hint: 'Cost & billing insights',
      },
    ],
  },
  {
    // Web3 = Lux Network settlement layer. Every leaf hands off to lux.cloud
    // under the Lux brand — never the Hanzo mark on a Lux surface.
    id: 'web3',
    label: 'Web3',
    href: cat('Web3'),
    tagline: 'The settlement layer under every resource — powered by Lux Network.',
    items: [
      {
        id: 'settlement',
        label: 'Settlement',
        href: LUX_CLOUD,
        hint: 'On-chain settlement',
        external: true,
      },
      {
        id: 'chains',
        label: 'Chains',
        href: LUX_SERVICES,
        hint: 'Launch L1 / L2 rollups',
        external: true,
      },
      {
        id: 'wallets',
        label: 'Wallets',
        href: LUX_SERVICES,
        hint: 'MPC custody & keys',
        external: true,
      },
      {
        id: 'tokens',
        label: 'Tokens',
        href: LUX_SERVICES,
        hint: 'Tokenization & assets',
        external: true,
      },
      {
        id: 'indexer',
        label: 'Indexer',
        href: LUX_SERVICES,
        hint: 'Explorer & chain data',
        external: true,
      },
      {
        id: 'attestations',
        label: 'Attestations',
        href: LUX_SERVICES,
        hint: 'Verifiable provenance',
        external: true,
      },
    ],
  },
  {
    id: 'apps',
    label: 'Apps',
    href: cat('Apps'),
    tagline: 'Production apps built on the primitives.',
    items: [
      { id: 'chat', label: 'Chat', href: `${U.ai}/chat`, hint: 'Conversational AI app' },
      { id: 'bot', label: 'Bot', href: `${U.ai}/bot`, hint: 'Multi-agent platform' },
      {
        id: 'search',
        label: 'Search',
        href: `${U.ai}/search`,
        hint: 'AI-powered search',
      },
      { id: 'crawl', label: 'Crawl', href: `${U.ai}/crawl`, hint: 'Web crawler' },
      { id: 'studio', label: 'Studio', href: `${U.ai}/studio`, hint: 'Creative studio' },
      { id: 'console', label: 'Console', href: `${U.ai}/console`, hint: 'Cloud console' },
    ],
  },
]

/* ── Unified footer — same everywhere; the current product is highlighted ───── */

export const HANZO_FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'products',
    title: 'Products',
    items: [
      // Just the projection. Hanzo Dev used to be named again here, from before
      // it was a flagship; once it became one the footer listed it twice, on
      // every property. A product is spelled once, in HANZO_PRODUCTS.
      ...HANZO_FLAGSHIP_PUBLIC.map((p) => ({ id: p.id, label: p.label, href: p.href })),
      { id: 'allProducts', label: 'All products', href: U.allProducts },
    ],
  },
  {
    id: 'platform',
    title: 'AI Platform',
    items: [
      { id: 'models', label: 'Models', href: U.models },
      { id: 'enso', label: 'Enso', href: U.enso },
      { id: 'agents', label: 'Managed agents', href: U.agents },
      { id: 'mcp', label: 'MCP tools', href: U.mcp },
      { id: 'api', label: 'API platform', href: U.api },
      { id: 'console', label: 'Developer console', href: U.console },
      { id: 'cloud', label: 'All cloud products', href: U.cloud },
    ],
  },
  {
    id: 'install',
    title: 'Install',
    items: [
      { id: 'desktop', label: 'Desktop app', href: U.desktop },
      { id: 'extension', label: 'Browser extension', href: U.extension },
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
      { id: 'contact', label: 'Contact', href: U.contact },
    ],
  },
]

export const HANZO_FOOTER_BOTTOM = {
  copyright: '© 2026 Hanzo AI, Inc.',
  links: [
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
    // The company, not the word. "Hanzo" alone is the family name every product
    // below shares — Hanzo Chat, Hanzo App, Hanzo Cloud — so on the storefront
    // it named the family rather than the firm.
    brandName: 'Hanzo AI',
    localNav: [
      { id: 'models', label: 'Models', href: U.models },
      { id: 'agents', label: 'Agents', href: U.agents },
      { id: 'solutions', label: 'Solutions', href: U.solutions },
      { id: 'developers', label: 'Developers', href: U.docs },
      { id: 'pricing', label: 'Pricing', href: U.pricing },
      { id: 'enterprise', label: 'Enterprise', href: U.enterprise },
    ],
    secondaryCTA: { id: 'docs', label: 'Documentation', href: U.docs },
    // "Try Hanzo", not "Open Chat" — the storefront's primary action names the
    // INVITATION, and chat is only one of the products behind it (`tryMenu` opens
    // the rest). This is the label the audited hanzo.ai bar carries.
    primaryCTA: { id: 'try', label: 'Try Hanzo', href: U.chat },
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
    primaryCTA: { id: 'newchat', label: 'New chat', href: `${U.chat}/c/new` },
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
    // `/product` was a 404 — the page is `/features`, and the nav had been
    // pointing at a route that does not exist. Pricing is hanzo.app's OWN page:
    // a reader asking what the builder costs wants the builder's plans, not the
    // cloud's, and both pages exist. "Business" rather than "Enterprise" for the
    // same destination — the word names who it is for instead of naming a
    // procurement tier.
    localNav: [
      { id: 'features', label: 'Features', href: `${U.app}/features` },
      { id: 'templates', label: 'Templates', href: `${U.app}/templates` },
      { id: 'pricing', label: 'Pricing', href: `${U.app}/pricing` },
      { id: 'business', label: 'Business', href: U.enterprise },
    ],
    secondaryCTA: { id: 'download', label: 'Download', href: U.downloads },
    primaryCTA: { id: 'newproject', label: '+ New project', href: `${U.app}/new` },
    preFooter: {
      heading: 'Turn an idea into a live application',
      actions: [
        { id: 'newproject', label: 'New project', href: `${U.app}/new` },
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
    secondaryCTA: { id: 'apikey', label: 'Get API key', href: U.keys },
    primaryCTA: { id: 'console', label: 'Open Console', href: U.console },
    preFooter: {
      heading: 'Build and operate on the AI cloud',
      actions: [
        { id: 'apikey', label: 'Get API key', href: U.keys },
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
        { id: 'createorg', label: 'Create organization', href: U.signup },
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
      // These point at hanzo.bot's real pages. /product, /channels and
      // /templates never existed there, so the header shipped three 404s;
      // the site calls the same things platform, integrations and skills.
      { id: 'platform', label: 'Platform', href: `${U.bot}/platform` },
      { id: 'skills', label: 'Skills', href: `${U.bot}/skills` },
      { id: 'integrations', label: 'Integrations', href: `${U.bot}/integrations` },
      { id: 'showcase', label: 'Showcase', href: `${U.bot}/showcase` },
      { id: 'pricing', label: 'Pricing', href: U.pricing },
    ],
    secondaryCTA: { id: 'docs', label: 'Documentation', href: U.docs },
    // "Create bot" sends people to the product, which is what the label promises.
    // It used to name U.bot — the marketing home the button is already on — so
    // the one action in the header did nothing but scroll to the top.
    primaryCTA: { id: 'createbot', label: 'Create bot', href: `${U.botApp}/?signup=1` },
    preFooter: {
      heading: 'Put an intelligent agent in every channel',
      actions: [
        { id: 'createbot', label: 'Create bot', href: `${U.botApp}/?signup=1` },
        { id: 'integrations', label: 'View integrations', href: `${U.bot}/integrations` },
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
  {
    id: 'world',
    host: 'world.hanzo.ai',
    productId: 'world',
    brandName: 'Hanzo World',
    localNav: [
      { id: 'globe', label: 'Globe', href: U.world },
      { id: 'news', label: 'News', href: `${U.world}/news` },
      { id: 'reports', label: 'Reports', href: `${U.world}/reports` },
      { id: 'widgets', label: 'Widgets', href: `${U.world}/widgets` },
      { id: 'docs', label: 'Docs', href: U.docs },
    ],
    secondaryCTA: { id: 'studio', label: 'Open Studio', href: U.studio },
    primaryCTA: { id: 'world', label: 'Open World', href: U.world },
    preFooter: {
      heading: 'Build your world — realtime intelligence, reports, and widgets',
      actions: [
        { id: 'world', label: 'Open World', href: U.world },
        { id: 'quickstart', label: 'Read quickstart', href: U.quickstarts },
      ],
    },
  },
  {
    id: 'docs',
    host: 'docs.hanzo.ai',
    productId: 'docs',
    brandName: 'Hanzo Docs',
    // The four things a reader came to read. Every href is a page that exists.
    localNav: [
      { id: 'api', label: 'API', href: U.apiRef },
      { id: 'cli', label: 'CLI', href: U.cliRef },
      { id: 'mcp', label: 'MCP', href: `${U.docs}/docs/mcp` },
      { id: 'sdks', label: 'SDKs', href: `${U.docs}/docs/sdks` },
    ],
    secondaryCTA: { id: 'quickstart', label: 'Quickstart', href: U.quickstarts },
    // The label changes, the pill does not. Docs asks for the key because that
    // is what a reader is here to get; it is still the one white pill.
    primaryCTA: { id: 'apikey', label: 'Get API key', href: U.keys },
    preFooter: {
      heading: 'Build with Hanzo — keys, quickstarts, and the full API',
      actions: [
        { id: 'apikey', label: 'Get API key', href: U.keys },
        { id: 'quickstart', label: 'Read quickstart', href: U.quickstarts },
      ],
    },
  },
  {
    id: 'console',
    host: 'console.hanzo.ai',
    productId: 'console',
    brandName: 'Hanzo Console',
    localNav: [
      { id: 'docs', label: 'Docs', href: U.docs },
      { id: 'api', label: 'API', href: U.apiRef },
      { id: 'status', label: 'Status', href: U.status },
    ],
    secondaryCTA: { id: 'docs', label: 'Documentation', href: U.docs },
    // No primary action: this surface is signed in, so the account menu is the
    // right-hand control and the work lives in the page.
    preFooter: {
      heading: 'Ship on Hanzo Cloud',
      actions: [
        { id: 'apikey', label: 'Get API key', href: U.keys },
        { id: 'docs', label: 'Read the docs', href: U.docs },
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
  const h = host
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/:\d+$/, '')
  const exact = HANZO_SURFACES.find((s) => s.host === h)
  if (exact) return exact
  const suffix = HANZO_SURFACES.filter(
    (s) => h === s.host || h.endsWith(`.${s.host}`)
  ).sort((a, b) => b.host.length - a.host.length)[0]
  return suffix ?? DEFAULT_SURFACE
}

/* ── Plan tiers + app entitlements — the ONE plan→apps map ──────────────────── */
/**
 * The canonical subscription ladder + which apps each tier unlocks. This mirrors
 * the REAL commerce catalog (`@hanzo/plans`, served at `GET /v1/billing/plans`;
 * a tier resolves via `GET /v1/billing/tier`). Commerce enforces MODEL access +
 * agent count + credit balance per tier; it has no per-APP entitlement object —
 * so THIS is the client-side source of truth the launcher reads to grey-out and
 * upsell apps above the signed-in user's tier.
 *
 * Two orthogonal values, composed by the resolver (no duplication):
 *   HANZO_PLANS ....... the tiers — price · limits · monotonic `rank`.
 *   APP_ENTITLEMENTS .. each app id → the MINIMUM tier that unlocks it.
 * The set of apps a tier includes is DERIVED (`entitlementFor`), never restated.
 */

/** Plan family — the axis a tier lives on (personal ladder vs. team vs. sales). */
export type HanzoPlanKind = 'personal' | 'team' | 'enterprise'

/**
 * Canonical plan-tier slugs — mirror the commerce `@hanzo/plans` catalog. The
 * gating key everywhere (`entitlementFor`, `isEntitled`, the launcher's
 * `userPlan` prop, the IAM `tier` JWT claim after coarse-mapping).
 */
export type HanzoPlanTier =
  | 'free'
  | 'go'
  | 'dev'
  | 'pro'
  | 'plus'
  | 'max'
  | 'team'
  | 'team-max'
  | 'enterprise'
  | 'custom'

/** Sentinel for "no ceiling" limits (unlimited members / usage). */
export const UNLIMITED = Number.MAX_SAFE_INTEGER

/** Quotas / included usage carried by a tier (subset of the commerce `limits`). */
export interface HanzoPlanLimits {
  /** Requests per minute (rate limit; per seat on team plans). */
  requestsPerMinute: number
  /** Tokens per minute (rate limit; per seat on team plans). */
  tokensPerMinute: number
  /** Included usage credit, USD/month (0 = none). */
  includedCreditUsd: number
  /** Included cloud credits, USD/month (per seat on team plans). */
  includedCloudCredits: number
  /** Minimum seats the plan is sold in (personal = 1). */
  minSeats: number
  /** Maximum members the plan admits (`UNLIMITED` for enterprise/custom). */
  maxMembers: number
}

/** One rung of the subscription ladder. */
export interface HanzoPlanTierDef {
  /** Stable tier slug — the gating key. */
  slug: HanzoPlanTier
  /** Display name ("Free", "Pro", …). */
  name: string
  /** One-line positioning shown on upsell surfaces. */
  tagline: string
  /** Plan family. */
  kind: HanzoPlanKind
  /**
   * Monotonic access rank — a tier unlocks every app whose required tier ranks
   * at or below it. Higher = more access. This is the ONLY ordering the
   * resolver reads; price is not an ordering.
   */
  rank: number
  /** Monthly price in cents (per seat when `perSeat`). 0 = free; null = contact sales. */
  priceMonthly: number | null
  /** Annual price in cents (per seat), when offered. */
  priceAnnual?: number | null
  /** Priced per seat (team plans). */
  perSeat?: boolean
  /**
   * No longer sold, and kept anyway — for whoever still holds one.
   *
   * A rung is what `normalizeTier` matches a subscription's slug against, so
   * deleting a retired tier does not remove it from the world; it removes our
   * ability to recognise the people still paying for it, and they fall through
   * to free. Retired tiers rank and gate exactly as they always did, and are
   * simply not offered.
   */
  retired?: boolean
  /** No self-serve checkout — routes to sales. */
  contactSales?: boolean
  /** Quotas / included usage. */
  limits: HanzoPlanLimits
}

/**
 * HANZO_PLANS — the canonical tier ladder. Order = display order = ascending
 * `rank`. Prices in cents; limits from the live commerce tiers. Personal ladder
 * (free→pro→plus→max) then team ladder (team→team-max) then sales (enterprise→
 * custom); `rank` makes it one monotonic chain for gating.
 */
export const HANZO_PLANS: HanzoPlanTierDef[] = [
  {
    slug: 'free',
    name: 'Free',
    tagline: 'The on-ramp — build with AI at no cost',
    kind: 'personal',
    rank: 0,
    priceMonthly: 0,
    limits: {
      requestsPerMinute: 60,
      tokensPerMinute: 100_000,
      includedCreditUsd: 5,
      includedCloudCredits: 0,
      minSeats: 1,
      maxMembers: 1,
    },
  },
  {
    slug: 'go',
    name: 'Go',
    tagline: 'Host your agents everywhere, and the desktop app',
    kind: 'personal',
    rank: 1,
    priceMonthly: 900,
    priceAnnual: 825,
    limits: {
      requestsPerMinute: 60,
      tokensPerMinute: 100_000,
      includedCreditUsd: 5,
      includedCloudCredits: 0,
      minSeats: 1,
      maxMembers: 1,
    },
  },
  {
    slug: 'dev',
    name: 'Dev',
    tagline: 'For everyday building',
    kind: 'personal',
    rank: 2,
    priceMonthly: 1_900,
    limits: {
      requestsPerMinute: 500,
      tokensPerMinute: 1_000_000,
      includedCreditUsd: 20,
      includedCloudCredits: 5,
      minSeats: 1,
      maxMembers: 1,
    },
  },
  {
    slug: 'pro',
    name: 'Pro',
    tagline: 'For individuals shipping with AI every day',
    kind: 'personal',
    rank: 3,
    priceMonthly: 4_900,
    limits: {
      requestsPerMinute: 500,
      tokensPerMinute: 1_000_000,
      includedCreditUsd: 20,
      includedCloudCredits: 5,
      minSeats: 1,
      maxMembers: 1,
    },
  },
  {
    slug: 'plus',
    name: 'Plus',
    tagline: 'More throughput and the max-tier models',
    kind: 'personal',
    // RETIRED — no longer sold, and kept for exactly one reason: whoever still
    // holds one. Deleting the rung would make normalizeTier fall through to
    // free, which is the downgrade this whole ladder exists to prevent.
    retired: true,
    rank: 4,
    priceMonthly: 10_000,
    limits: {
      requestsPerMinute: 2_500,
      tokensPerMinute: 5_000_000,
      includedCreditUsd: 100,
      includedCloudCredits: 25,
      minSeats: 1,
      maxMembers: 1,
    },
  },
  {
    slug: 'max',
    name: 'Max',
    tagline: 'Unlimited premium models and fine-tuning',
    kind: 'personal',
    rank: 5,
    priceMonthly: 9_900,
    limits: {
      requestsPerMinute: 5_000,
      tokensPerMinute: 10_000_000,
      includedCreditUsd: 200,
      includedCloudCredits: 100,
      minSeats: 1,
      maxMembers: 1,
    },
  },
  {
    slug: 'team',
    name: 'Team',
    tagline: 'People and AI coworkers together, with SSO',
    kind: 'team',
    rank: 6,
    priceMonthly: 2_500,
    perSeat: true,
    limits: {
      requestsPerMinute: 500,
      tokensPerMinute: 1_000_000,
      includedCreditUsd: 0,
      includedCloudCredits: 100,
      minSeats: 2,
      maxMembers: 100,
    },
  },
  {
    slug: 'team-max',
    name: 'Team Max',
    tagline: 'Team, with unlimited premium models per seat',
    kind: 'team',
    rank: 7,
    priceMonthly: 22_500,
    perSeat: true,
    limits: {
      requestsPerMinute: 5_000,
      tokensPerMinute: 10_000_000,
      includedCreditUsd: 0,
      includedCloudCredits: 100,
      minSeats: 2,
      maxMembers: 100,
    },
  },
  {
    slug: 'enterprise',
    name: 'Enterprise',
    tagline: 'Unlimited members, SLA, on-prem, SOC 2 Type II controls',
    kind: 'enterprise',
    rank: 8,
    priceMonthly: 999_900,
    contactSales: true,
    limits: {
      requestsPerMinute: 5_000,
      tokensPerMinute: 10_000_000,
      includedCreditUsd: 1_000,
      includedCloudCredits: 100,
      minSeats: 2,
      maxMembers: UNLIMITED,
    },
  },
  {
    slug: 'custom',
    name: 'Custom',
    tagline: 'Dedicated, air-gapped, custom SLA',
    kind: 'enterprise',
    rank: 9,
    priceMonthly: null,
    contactSales: true,
    limits: {
      requestsPerMinute: UNLIMITED,
      tokensPerMinute: UNLIMITED,
      includedCreditUsd: 0,
      includedCloudCredits: 0,
      minSeats: 2,
      maxMembers: UNLIMITED,
    },
  },
]

/** Tier-slug list in ladder order. */
export const HANZO_PLAN_TIERS: HanzoPlanTier[] = HANZO_PLANS.map((p) => p.slug)

/** The tier assumed when none is known (signed-out / no claim). */
export const DEFAULT_PLAN_TIER: HanzoPlanTier = 'free'

/** Look up a tier definition by slug. */
export const getPlanTier = (slug?: string): HanzoPlanTierDef | undefined =>
  slug ? HANZO_PLANS.find((p) => p.slug === slug) : undefined

/**
 * APP_ENTITLEMENTS — each launcher app id → the MINIMUM tier that unlocks it.
 * This is the single source for app gating; the per-tier included-app SET is
 * derived from it (`entitlementFor`), never restated on the plan.
 *
 * Keys are the `HANZO_APPS` ids (hanzo-apps.tsx). An app absent from this map is
 * treated as `free` (ungated) by the resolver, so adding an app never silently
 * locks it. Positioning: the free tier is the full individual-developer surface;
 * `pro` adds the creator/deploy apps; `team` adds collaboration + org admin.
 */
export const APP_ENTITLEMENTS: Record<string, HanzoPlanTier> = {
  // Products
  chat: 'free',
  app: 'free',
  search: 'free',
  dev: 'free',
  cloud: 'free',
  studio: 'pro',
  bot: 'pro',
  world: 'pro', // bundled via world-pro on pro/plus/max, world-team on team
  team: 'team',

  // Platform
  console: 'free',
  gateway: 'free',
  platform: 'pro',

  // Install (clients are always free)
  desktop: 'free',
  extension: 'free',
  vscode: 'free',
  cli: 'free',

  // Account
  account: 'free',
  billing: 'free',
  admin: 'team', // org/member administration requires a team plan
}

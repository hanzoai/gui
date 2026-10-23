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
 *
 * Copy is authored English, marked with `phrase()` where it is written and drawn
 * through @hanzo/i18n's `t()` where it renders. A product's NAME standing alone
 * (Hanzo Chat, Enso, SDKs, IAM) is not marked: it reads the same in every language.
 */

import { phrase } from '@hanzo/i18n'
import type { GlyphName } from './glyph.tsx'

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
   * deliberately NOT a plan. Those are two axes: a plan says what someone PAID
   * for, a stage says whether the thing is FINISHED. Paying more does not make an alpha ready, and a free reader still
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
  // against IAM), so a CTA only has to name it.
  botApp: 'https://app.hanzo.bot',
  cloud: 'https://cloud.hanzo.ai',
  dev: 'https://hanzo.ai/dev',
  base: 'https://hanzo.ai/base',
  // The workbench on the web — the same one the desktop shell wraps. Its own
  // origin, because it is an application and not a page on the marketing site.
  ide: 'https://ide.hanzo.ai',

  // Platform
  models: 'https://hanzo.ai/models',
  enso: 'https://hanzo.ai/enso',
  agents: 'https://hanzo.ai/agents',
  mcp: 'https://hanzo.ai/mcp',
  console: 'https://platform.hanzo.ai',
  // The console's API keys page. /keys answers "No such page" there.
  keys: 'https://platform.hanzo.ai/api-keys',
  // The page that explains the gateway; the console's gateway is the product itself.
  gateway: 'https://hanzo.ai/gateway',
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
  foundation: 'https://zoo.ngo',

  // Account
  /**
   * Sign-in and account live on the site that mounts the shell, so these are
   * site-relative. IAM is reached only through its /v1/iam API, by the host's
   * client. A host whose account page lives elsewhere passes `accountHref`.
   */
  login: '/login',
  account: '/account',
  billing: 'https://billing.hanzo.ai',
  admin: 'https://admin.hanzo.ai',

  // Legal. `legal` is the index of every document — the AUP, the DPA and the
  // subprocessor register are there and nowhere else in the chrome.
  privacy: 'https://hanzo.ai/privacy',
  terms: 'https://hanzo.ai/terms',
  cookies: 'https://hanzo.ai/cookies',
  legal: 'https://hanzo.ai/legal',
} as const

/* ── Product boundaries — the one-line "what each product is for" ───────────── */

export const PRODUCT_BOUNDARIES: Record<string, string> = {
  chat: phrase('Use AI'),
  base: phrase('Store and serve application data'),
  app: phrase('Build applications'),
  team: phrase('Organize collaborative work'),
  studio: phrase('Create and evaluate intelligence'),
  bot: phrase('Distribute agents into channels'),
  cloud: phrase('Operate infrastructure'),
  dev: phrase('Build software from the editor and terminal'),
  ide: phrase('Open a workspace in the browser'),
  cli: phrase('Drive every product from a shell'),
  platform: phrase('Deploy, observe, and operate what you build'),
  ai: phrase('Explain and connect the ecosystem'),
}

/* ── Flagship products (+ Dev) ─────────────────────────────────────────────── */

export const HANZO_PRODUCTS: HanzoProduct[] = [
  {
    id: 'chat',
    glyph: 'chat',
    label: 'Hanzo Chat',
    href: U.chat,
    page: `${U.ai}/chat`,
    tagline: phrase('Ask anything'),
    boundary: PRODUCT_BOUNDARIES.chat,
    // FLAGSHIP, like every product beside it. Its absence here was an omission
    // rather than a decision: the note above names Team, Bot and Studio as the
    // ones held back until they are ready, and Chat is neither unfinished nor
    // unannounced — it carries a `page` on the marketing site and is the door
    // most readers open the palette to find.
    //
    // What the omission cost is easy to miss, because nothing errors: the doors
    // come from HANZO_FLAGSHIP, so Chat was simply not among them. Every Hanzo
    // surface's "Try Hanzo" menu and every command palette offered App, Cloud
    // and Dev and said nothing about the product the estate leads with.
  },
  {
    id: 'app',
    glyph: 'blocks',
    label: 'Hanzo App',
    href: U.app,
    page: `${U.ai}/app`,
    tagline: phrase('Build and ship apps'),
    boundary: PRODUCT_BOUNDARIES.app,
    flagship: true,
  },
  {
    id: 'base',
    glyph: 'base',
    label: 'Hanzo Base',
    href: U.base,
    page: `${U.ai}/base`,
    tagline: phrase('Data, auth and files'),
    boundary: PRODUCT_BOUNDARIES.base,
    // Released, so it is in the estate. `stage` is what holds a product back —
    // Studio carries `stage: 'alpha'` and every surface passes the list through
    // `sees(stage)` before drawing it — and dropping the flag instead takes a
    // finished product out of the mega-menu and the footer for everybody.
  },
  {
    id: 'dev',
    glyph: 'code',
    label: 'Hanzo Dev',
    href: U.dev,
    tagline: phrase('From the editor and terminal'),
    boundary: PRODUCT_BOUNDARIES.dev,
    // Flagship like the rest. It was the one product held out of the rail, so
    // the menu that answers "what is Hanzo" omitted the coding tool — while
    // Platform listed it in small type two columns over, as if it were a
    // feature of something else.
    flagship: true,
  },
  {
    id: 'ide',
    glyph: 'code',
    label: 'Hanzo IDE',
    href: U.ide,
    page: `${U.ai}/ide`,
    tagline: phrase('The workbench, on the web'),
    boundary: PRODUCT_BOUNDARIES.ide,
    flagship: true,
  },
  {
    id: 'cli',
    glyph: 'terminal',
    label: 'Hanzo CLI',
    href: U.cli,
    page: U.cli,
    tagline: phrase('Hanzo from a terminal'),
    boundary: PRODUCT_BOUNDARIES.cli,
    flagship: true,
  },
  {
    id: 'platform',
    glyph: 'cloud',
    label: 'Hanzo Platform',
    // The one door to the console. Cloud and Team are what the platform DOES,
    // not products beside it, so neither is a flagship and neither carries a
    // sign-in of its own.
    href: U.platform,
    page: `${U.ai}/platform`,
    tagline: phrase('Deploy, observe, and operate'),
    boundary: PRODUCT_BOUNDARIES.platform,
    flagship: true,
  },
  {
    id: 'bot',
    glyph: 'bot',
    label: 'Hanzo Bot',
    href: U.bot,
    page: `${U.ai}/bot`,
    tagline: phrase('Publish AI anywhere'),
    boundary: PRODUCT_BOUNDARIES.bot,
    flagship: true,
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
    tagline: phrase('Visual pipelines for generative media'),
    boundary: PRODUCT_BOUNDARIES.studio,
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
/**
 * The order a reader meets the doors in, stated here because this is where the
 * menu's order is decided — HANZO_PRODUCTS is a table of what exists and other
 * readers of it must not be reordered to move one menu.
 *
 * It leads with the App, which is the one surface that carries the others, and
 * an id absent from this list sorts to the end rather than disappearing, so
 * adding a product is never silently a decision about where it ranks.
 */
const FLAGSHIP_ORDER = [
  'app',
  'bot',
  'cli',
  'cloud',
  'dev',
  'ide',
  'platform',
  'team',
] as const

const rank = (id: string): number => {
  const i = FLAGSHIP_ORDER.indexOf(id as (typeof FLAGSHIP_ORDER)[number])
  return i === -1 ? FLAGSHIP_ORDER.length : i
}

export const HANZO_FLAGSHIP: HanzoProduct[] = HANZO_PRODUCTS.filter(
  (p) => p.flagship
).sort((a, b) => rank(a.id) - rank(b.id))

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
export const HANZO_FLAGSHIP_PUBLIC: HanzoProduct[] = HANZO_FLAGSHIP.filter(sees()).map(
  (p) => ({
    ...p,
    href: p.page ?? p.href,
  })
)

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
    title: phrase('Open'),
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
    title: phrase('Install'),
    items: [
      { id: 'desktop', label: phrase('Desktop app'), href: U.desktop, glyph: 'monitor' },
      {
        id: 'extension',
        label: phrase('Browser extension'),
        href: U.extension,
        glyph: 'puzzle',
      },
      { id: 'cli', label: 'Hanzo CLI', href: U.cli, glyph: 'terminal' },
      { id: 'sdks', label: 'SDKs', href: U.sdks, glyph: 'package' },
      {
        id: 'downloads',
        label: phrase('All downloads'),
        href: U.downloads,
        glyph: 'download',
      },
    ],
  },
]

/* ── Universal "Meet Hanzo" mega-menu — identical on every property ─────────── */

export const MEET_HANZO_GROUPS: MeetHanzoGroup[] = [
  {
    id: 'products',
    title: phrase('Flagship products'),
    items: HANZO_FLAGSHIP_PUBLIC,
  },
  {
    id: 'platform',
    title: phrase('Platform'),
    items: [
      { id: 'enso', label: 'Enso', href: U.enso, glyph: 'circle' },
      { id: 'models', label: phrase('Models'), href: U.models, glyph: 'layers' },
      { id: 'agents', label: phrase('Managed agents'), href: U.agents, glyph: 'cpu' },
      { id: 'mcp', label: phrase('MCP tools'), href: U.mcp, glyph: 'plug' },
      { id: 'api', label: phrase('API platform'), href: U.api, glyph: 'gateway' },
      { id: 'gateway', label: phrase('Gateway'), href: U.gateway, glyph: 'gateway' },
      { id: 'keys', label: phrase('API keys'), href: U.keys, glyph: 'plug' },
      { id: 'base', label: 'Base', href: U.base, glyph: 'layers' },
    ],
  },
  {
    id: 'install',
    title: phrase('Install'),
    items: [
      { id: 'desktop', label: phrase('Desktop app'), href: U.desktop, glyph: 'monitor' },
      {
        id: 'extension',
        label: phrase('Browser extension'),
        href: U.extension,
        glyph: 'puzzle',
      },
      { id: 'sdks', label: 'SDKs', href: U.sdks, glyph: 'package' },
      {
        id: 'downloads',
        label: phrase('All downloads'),
        href: U.downloads,
        glyph: 'download',
      },
    ],
  },
  {
    id: 'resources',
    title: phrase('Resources'),
    items: [
      { id: 'docs', label: phrase('Documentation'), href: U.docs, glyph: 'book' },
      {
        id: 'quickstarts',
        label: phrase('Quickstarts'),
        href: U.quickstarts,
        glyph: 'rocket',
      },
      { id: 'learn', label: phrase('Learn'), href: U.learn, glyph: 'cap' },
      { id: 'status', label: phrase('Status'), href: U.status, glyph: 'pulse' },
      { id: 'support', label: phrase('Support'), href: U.support, glyph: 'ring' },
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
    tagline: phrase('Models, agents, and inference — open weights, one API.'),
    items: [
      {
        id: 'models',
        label: phrase('Models'),
        href: `${U.ai}/models`,
        hint: phrase('Open-weight model garden'),
      },
      {
        id: 'agents',
        label: phrase('Agents'),
        href: `${U.ai}/agents`,
        hint: phrase('Build & run agents'),
      },
      {
        id: 'inference',
        label: phrase('Inference'),
        href: `${U.ai}/engine`,
        hint: phrase('Serverless model serving'),
      },
      {
        id: 'fine-tuning',
        label: phrase('Fine-tuning'),
        href: `${U.ai}/cloud/fine-tuning`,
        hint: phrase('Tune models on your data'),
      },
      {
        id: 'embeddings',
        label: phrase('Embeddings'),
        href: `${U.ai}/cloud/embeddings`,
        hint: phrase('Vectorize text & images'),
      },
      {
        id: 'evals',
        label: phrase('Evals'),
        href: `${U.ai}/cloud/evals`,
        hint: phrase('Score model quality'),
      },
    ],
  },
  {
    id: 'compute',
    label: phrase('Compute'),
    href: cat('Compute'),
    tagline: phrase('GPUs, containers, and functions that scale to zero.'),
    items: [
      {
        id: 'gpus',
        label: 'GPUs',
        href: `${U.ai}/cloud/gpus`,
        hint: phrase('On-demand GPU compute'),
      },
      {
        id: 'machines',
        label: phrase('Machines'),
        href: `${U.ai}/machines`,
        hint: phrase('Virtual machines'),
      },
      {
        id: 'containers',
        label: phrase('Containers'),
        href: `${U.ai}/cloud/containers`,
        hint: phrase('Containers, scale to zero'),
      },
      {
        id: 'functions',
        label: phrase('Functions'),
        href: `${U.ai}/functions`,
        hint: phrase('Event-driven functions'),
      },
      {
        id: 'edge',
        label: phrase('Edge'),
        href: `${U.ai}/edge`,
        hint: phrase('Compute at the edge'),
      },
      {
        id: 'jobs',
        label: phrase('Jobs'),
        href: `${U.ai}/cloud/jobs`,
        hint: phrase('Batch & scheduled jobs'),
      },
    ],
  },
  {
    id: 'data',
    label: phrase('Data'),
    href: cat('Data'),
    tagline: phrase('Every persistence primitive, from vectors to objects.'),
    items: [
      {
        id: 'vector',
        label: phrase('Vector'),
        href: `${U.ai}/vector`,
        hint: phrase('Vector search'),
      },
      {
        id: 'sql',
        label: 'SQL',
        href: `${U.ai}/sql`,
        hint: phrase('Managed SQL databases'),
      },
      {
        id: 'kv',
        label: 'KV',
        href: `${U.ai}/kv`,
        hint: phrase('In-memory key-value store'),
      },
      {
        id: 'storage',
        label: phrase('Object Storage'),
        href: `${U.ai}/storage`,
        hint: phrase('S3-compatible object store'),
      },
      {
        id: 'datastore',
        label: phrase('Datastore'),
        href: `${U.ai}/datastore`,
        hint: phrase('Wide-column datastore'),
      },
      {
        id: 'docdb',
        label: 'DocDB',
        href: `${U.ai}/docdb`,
        hint: phrase('Document database'),
      },
    ],
  },
  {
    id: 'network',
    label: phrase('Network'),
    href: cat('Network'),
    tagline: phrase('Connect, route, and protect every service.'),
    items: [
      {
        id: 'gateway',
        label: phrase('Gateway'),
        href: `${U.ai}/gateway`,
        hint: phrase('API gateway'),
      },
      {
        id: 'vpc',
        label: 'VPC',
        href: `${U.ai}/network`,
        hint: phrase('Private networks'),
      },
      { id: 'dns', label: 'DNS', href: `${U.ai}/dns`, hint: phrase('Managed DNS') },
      {
        id: 'cdn',
        label: 'CDN',
        href: `${U.ai}/cloud/cdn`,
        hint: phrase('Global content delivery'),
      },
      {
        id: 'load-balancer',
        label: phrase('Load Balancer'),
        href: `${U.ai}/ingress`,
        hint: phrase('Traffic load balancing'),
      },
      {
        id: 'service-mesh',
        label: phrase('Service Mesh'),
        href: `${U.ai}/cloud/service-mesh`,
        hint: phrase('Service-to-service mesh'),
      },
    ],
  },
  {
    id: 'security',
    label: phrase('Security'),
    href: cat('Security'),
    tagline: phrase('Identity, keys, and audit for the whole cloud.'),
    items: [
      { id: 'iam', label: 'IAM', href: `${U.ai}/iam`, hint: phrase('Identity & access') },
      {
        id: 'authz',
        label: 'Authz',
        href: `${U.ai}/authz`,
        hint: phrase('Fine-grained authorization'),
      },
      { id: 'kms', label: 'KMS', href: `${U.ai}/kms`, hint: phrase('Key management') },
      {
        id: 'hsm',
        label: 'HSM',
        href: `${U.ai}/hsm`,
        hint: phrase('Hardware key security'),
      },
      {
        id: 'secrets',
        label: phrase('Secrets'),
        href: `${U.ai}/cloud/secrets`,
        hint: phrase('Secret storage & sync'),
      },
      {
        id: 'audit',
        label: phrase('Audit'),
        href: `${U.ai}/cloud/audit`,
        hint: phrase('Audit logging'),
      },
    ],
  },
  {
    id: 'dev',
    label: 'Dev',
    href: cat('Dev'),
    tagline: phrase('Build against the cloud from anywhere.'),
    items: [
      {
        id: 'cli',
        label: 'CLI',
        href: `${U.ai}/cli`,
        hint: phrase('Command-line control'),
      },
      {
        id: 'sdks',
        label: 'SDKs',
        href: `${U.ai}/cloud/sdks`,
        hint: phrase('Client libraries'),
      },
      {
        id: 'api',
        label: 'API',
        href: `${U.ai}/cloud/api`,
        hint: phrase('Programmatic cloud API'),
      },
      {
        id: 'playground',
        label: phrase('Playground'),
        href: `${U.ai}/playground`,
        hint: phrase('Prototype in the browser'),
      },
      { id: 'ide', label: 'IDE', href: `${U.ai}/code`, hint: phrase('In-browser IDE') },
      {
        id: 'desktop',
        label: phrase('Desktop'),
        href: `${U.ai}/desktop`,
        hint: phrase('Managed dev workstations'),
      },
    ],
  },
  {
    id: 'platform',
    label: phrase('Platform'),
    href: cat('Platform'),
    tagline: phrase('Source to production as declared state.'),
    items: [
      {
        id: 'projects',
        label: phrase('Projects'),
        href: `${U.ai}/platform`,
        hint: phrase('Organize resources'),
      },
      {
        id: 'environments',
        label: phrase('Environments'),
        href: `${U.ai}/cloud/environments`,
        hint: phrase('Deploy targets'),
      },
      {
        id: 'builds',
        label: phrase('Builds'),
        href: `${U.ai}/cloud/builds`,
        hint: phrase('Build from source'),
      },
      {
        id: 'registry',
        label: phrase('Registry'),
        href: `${U.ai}/registry`,
        hint: phrase('Container & artifact registry'),
      },
      {
        id: 'releases',
        label: phrase('Releases'),
        href: `${U.ai}/cloud/releases`,
        hint: phrase('Promote & roll out'),
      },
      {
        id: 'pipelines',
        label: phrase('Pipelines'),
        href: `${U.ai}/cloud/pipelines`,
        hint: phrase('CI/CD pipelines'),
      },
    ],
  },
  {
    id: 'observe',
    label: phrase('Observe'),
    href: cat('Observe'),
    tagline: phrase('Logs, metrics, traces, and cost in one pane.'),
    items: [
      {
        id: 'logs',
        label: phrase('Logs'),
        href: `${U.ai}/cloud/logs`,
        hint: phrase('Centralized logging'),
      },
      {
        id: 'metrics',
        label: phrase('Metrics'),
        href: `${U.ai}/metrics`,
        hint: phrase('Metrics & monitoring'),
      },
      {
        id: 'traces',
        label: phrase('Traces'),
        href: `${U.ai}/telemetry`,
        hint: phrase('Distributed tracing'),
      },
      {
        id: 'dashboards',
        label: phrase('Dashboards'),
        href: `${U.ai}/dashboards`,
        hint: phrase('Live dashboards'),
      },
      {
        id: 'alerts',
        label: phrase('Alerts'),
        href: `${U.ai}/sentry`,
        hint: phrase('Alerting & incidents'),
      },
      {
        id: 'cost',
        label: phrase('Cost'),
        href: `${U.ai}/cloud/cost`,
        hint: phrase('Cost & billing insights'),
      },
    ],
  },
  {
    // Web3 = Lux Network settlement layer. Every leaf hands off to lux.cloud
    // under the Lux brand — never the Hanzo mark on a Lux surface.
    id: 'web3',
    label: 'Web3',
    href: cat('Web3'),
    tagline: phrase(
      'The settlement layer under every resource — powered by Lux Network.'
    ),
    items: [
      {
        id: 'settlement',
        label: phrase('Settlement'),
        href: LUX_CLOUD,
        hint: phrase('On-chain settlement'),
        external: true,
      },
      {
        id: 'chains',
        label: phrase('Chains'),
        href: LUX_SERVICES,
        hint: phrase('Launch L1 / L2 rollups'),
        external: true,
      },
      {
        id: 'wallets',
        label: phrase('Wallets'),
        href: LUX_SERVICES,
        hint: phrase('MPC custody & keys'),
        external: true,
      },
      {
        id: 'tokens',
        label: phrase('Tokens'),
        href: LUX_SERVICES,
        hint: phrase('Tokenization & assets'),
        external: true,
      },
      {
        id: 'indexer',
        label: phrase('Indexer'),
        href: LUX_SERVICES,
        hint: phrase('Explorer & chain data'),
        external: true,
      },
      {
        id: 'attestations',
        label: phrase('Attestations'),
        href: LUX_SERVICES,
        hint: phrase('Verifiable provenance'),
        external: true,
      },
    ],
  },
  {
    id: 'apps',
    label: phrase('Apps'),
    href: cat('Apps'),
    tagline: phrase('Production apps built on the primitives.'),
    items: [
      {
        id: 'chat',
        label: 'Chat',
        href: `${U.ai}/chat`,
        hint: phrase('Conversational AI app'),
      },
      {
        id: 'bot',
        label: 'Bot',
        href: `${U.ai}/bot`,
        hint: phrase('Multi-agent platform'),
      },
      {
        id: 'search',
        label: phrase('Search'),
        href: `${U.ai}/search`,
        hint: phrase('AI-powered search'),
      },
      {
        id: 'crawl',
        label: phrase('Crawl'),
        href: `${U.ai}/crawl`,
        hint: phrase('Web crawler'),
      },
      {
        id: 'studio',
        label: 'Studio',
        href: `${U.ai}/studio`,
        hint: phrase('Creative studio'),
      },
      {
        id: 'console',
        label: 'Console',
        href: `${U.ai}/console`,
        hint: phrase('Cloud console'),
      },
    ],
  },
]

/* ── Unified footer — same everywhere; the current product is highlighted ───── */

export const HANZO_FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'products',
    title: phrase('Products'),
    items: [
      // Just the projection. Hanzo Dev used to be named again here, from before
      // it was a flagship; once it became one the footer listed it twice, on
      // every property. A product is spelled once, in HANZO_PRODUCTS.
      ...HANZO_FLAGSHIP_PUBLIC.map((p) => ({ id: p.id, label: p.label, href: p.href })),
      { id: 'allProducts', label: phrase('All products'), href: U.allProducts },
    ],
  },
  {
    id: 'platform',
    title: phrase('AI platform'),
    items: [
      { id: 'enso', label: 'Enso', href: U.enso },
      { id: 'models', label: phrase('Models'), href: U.models },
      { id: 'agents', label: phrase('Managed agents'), href: U.agents },
      { id: 'mcp', label: phrase('MCP tools'), href: U.mcp },
      { id: 'api', label: phrase('API platform'), href: U.api },
      { id: 'gateway', label: phrase('Gateway'), href: U.gateway },
      { id: 'base', label: 'Base', href: U.base },
    ],
  },
  {
    id: 'install',
    title: phrase('Install'),
    items: [
      { id: 'desktop', label: phrase('Desktop app'), href: U.desktop },
      { id: 'extension', label: phrase('Browser extension'), href: U.extension },
      { id: 'sdks', label: 'SDKs', href: U.sdks },
      { id: 'downloads', label: phrase('All downloads'), href: U.downloads },
    ],
  },
  {
    id: 'developers',
    title: phrase('Developers'),
    items: [
      { id: 'docs', label: phrase('Documentation'), href: U.docs },
      { id: 'apiRef', label: phrase('API reference'), href: U.apiRef },
      { id: 'cliRef', label: phrase('CLI reference'), href: U.cliRef },
      { id: 'github', label: 'GitHub', href: U.github },
      { id: 'status', label: phrase('Status'), href: U.status },
    ],
  },
  {
    id: 'resources',
    title: phrase('Resources'),
    items: [
      { id: 'quickstarts', label: phrase('Quickstarts'), href: U.quickstarts },
      { id: 'learn', label: phrase('Learn'), href: U.learn },
      { id: 'research', label: phrase('Research'), href: U.research },
      { id: 'support', label: phrase('Support'), href: U.support },
    ],
  },
  {
    id: 'company',
    title: phrase('Company'),
    items: [
      { id: 'about', label: phrase('About Hanzo'), href: U.about },
      { id: 'customers', label: phrase('Customers'), href: U.customers },
      { id: 'blog', label: phrase('Blog'), href: U.blog },
      { id: 'careers', label: phrase('Careers'), href: U.careers },
      { id: 'enterprise', label: phrase('Enterprise'), href: U.enterprise },
      { id: 'contact', label: phrase('Contact'), href: U.contact },
      { id: 'foundation', label: phrase('Foundation'), href: U.foundation },
    ],
  },
]

export const HANZO_FOOTER_BOTTOM = {
  copyright: '© 2026 Hanzo AI, Inc.',
  links: [
    { id: 'security', label: phrase('Security'), href: U.security },
    { id: 'privacy', label: phrase('Privacy'), href: U.privacy },
    { id: 'terms', label: phrase('Terms'), href: U.terms },
    { id: 'cookies', label: phrase('Cookies'), href: U.cookies },
    { id: 'legal', label: phrase('Legal'), href: U.legal },
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
      { id: 'models', label: phrase('Models'), href: U.models },
      { id: 'agents', label: phrase('Agents'), href: U.agents },
      { id: 'solutions', label: phrase('Solutions'), href: U.solutions },
      { id: 'developers', label: phrase('Developers'), href: U.docs },
      { id: 'pricing', label: phrase('Pricing'), href: U.pricing },
      { id: 'enterprise', label: phrase('Enterprise'), href: U.enterprise },
    ],
    secondaryCTA: { id: 'docs', label: phrase('Documentation'), href: U.docs },
    // "Try Hanzo", not "Open Chat" — the storefront's primary action names the
    // INVITATION, and chat is only one of the products behind it (`tryMenu` opens
    // the rest). This is the label the audited hanzo.ai bar carries.
    primaryCTA: { id: 'try', label: phrase('Try Hanzo'), href: U.chat },
    preFooter: {
      heading: phrase('Meet the complete Hanzo AI platform'),
      actions: [
        { id: 'products', label: phrase('Explore products'), href: U.allProducts },
        { id: 'chat', label: phrase('Open Chat'), href: U.chat },
      ],
    },
  },
  {
    id: 'chat',
    host: 'hanzo.chat',
    productId: 'chat',
    brandName: 'Hanzo Chat',
    localNav: [
      { id: 'product', label: phrase('Product'), href: `${U.chat}/product` },
      { id: 'models', label: phrase('Models'), href: U.models },
      { id: 'agents', label: phrase('Agents'), href: U.agents },
      { id: 'download', label: phrase('Download'), href: U.downloads },
      { id: 'pricing', label: phrase('Pricing'), href: U.pricing },
    ],
    secondaryCTA: { id: 'install', label: phrase('Install Hanzo'), href: U.downloads },
    primaryCTA: { id: 'newchat', label: phrase('New chat'), href: `${U.chat}/c/new` },
    preFooter: {
      heading: phrase('Take Hanzo everywhere you work'),
      actions: [
        { id: 'download', label: phrase('Download Hanzo'), href: U.downloads },
        { id: 'extension', label: phrase('Add browser extension'), href: U.extension },
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
      { id: 'features', label: phrase('Features'), href: `${U.app}/features` },
      { id: 'templates', label: phrase('Templates'), href: `${U.app}/templates` },
      { id: 'pricing', label: phrase('Pricing'), href: `${U.app}/pricing` },
      { id: 'business', label: phrase('Business'), href: U.enterprise },
    ],
    secondaryCTA: { id: 'download', label: phrase('Download'), href: U.downloads },
    primaryCTA: {
      id: 'newproject',
      label: phrase('+ New project'),
      href: `${U.app}/new`,
    },
    preFooter: {
      heading: phrase('Turn an idea into a live application'),
      actions: [
        { id: 'newproject', label: phrase('New project'), href: `${U.app}/new` },
        {
          id: 'templates',
          label: phrase('Browse templates'),
          href: `${U.app}/templates`,
        },
      ],
    },
  },
  {
    id: 'cloud',
    host: 'cloud.hanzo.ai',
    productId: 'cloud',
    brandName: 'Hanzo Cloud',
    localNav: [
      { id: 'products', label: phrase('Products'), href: `${U.cloud}/products` },
      { id: 'solutions', label: phrase('Solutions'), href: U.solutions },
      { id: 'developers', label: phrase('Developers'), href: U.docs },
      { id: 'pricing', label: phrase('Pricing'), href: U.pricing },
      { id: 'docs', label: phrase('Docs'), href: U.docs },
    ],
    secondaryCTA: { id: 'apikey', label: phrase('Get API key'), href: U.keys },
    primaryCTA: { id: 'console', label: phrase('Open Console'), href: U.console },
    preFooter: {
      heading: phrase('Build and operate on the AI cloud'),
      actions: [
        { id: 'apikey', label: phrase('Get API key'), href: U.keys },
        { id: 'console', label: phrase('Open Console'), href: U.console },
      ],
    },
  },
  {
    id: 'team',
    host: 'hanzo.team',
    productId: 'team',
    brandName: 'Hanzo Team',
    localNav: [
      { id: 'product', label: phrase('Product'), href: `${U.team}/product` },
      { id: 'solutions', label: phrase('Solutions'), href: U.solutions },
      {
        id: 'integrations',
        label: phrase('Integrations'),
        href: `${U.team}/integrations`,
      },
      { id: 'pricing', label: phrase('Pricing'), href: U.pricing },
      { id: 'enterprise', label: phrase('Enterprise'), href: U.enterprise },
    ],
    secondaryCTA: { id: 'download', label: phrase('Download'), href: U.downloads },
    primaryCTA: { id: 'workspace', label: phrase('Open workspace'), href: U.team },
    preFooter: {
      heading: phrase('Bring your people and AI coworkers together'),
      actions: [
        { id: 'createorg', label: phrase('Create organization'), href: U.login },
        { id: 'workspace', label: phrase('Open workspace'), href: U.team },
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
      { id: 'platform', label: phrase('Platform'), href: `${U.bot}/platform` },
      { id: 'skills', label: phrase('Skills'), href: `${U.bot}/skills` },
      {
        id: 'integrations',
        label: phrase('Integrations'),
        href: `${U.bot}/integrations`,
      },
      { id: 'showcase', label: phrase('Showcase'), href: `${U.bot}/showcase` },
      { id: 'pricing', label: phrase('Pricing'), href: U.pricing },
    ],
    secondaryCTA: { id: 'docs', label: phrase('Documentation'), href: U.docs },
    // "Create bot" sends people to the product, which is what the label promises.
    // It used to name U.bot — the marketing home the button is already on — so
    // the one action in the header did nothing but scroll to the top.
    primaryCTA: {
      id: 'createbot',
      label: phrase('Create bot'),
      href: `${U.botApp}/?signup=1`,
    },
    preFooter: {
      heading: phrase('Put an intelligent agent in every channel'),
      actions: [
        { id: 'createbot', label: phrase('Create bot'), href: `${U.botApp}/?signup=1` },
        {
          id: 'integrations',
          label: phrase('View integrations'),
          href: `${U.bot}/integrations`,
        },
      ],
    },
  },
  {
    id: 'studio',
    host: 'studio.hanzo.ai',
    productId: 'studio',
    brandName: 'Hanzo Studio',
    localNav: [
      { id: 'models', label: phrase('Models'), href: U.models },
      { id: 'prompts', label: phrase('Prompts'), href: `${U.studio}/prompts` },
      { id: 'agents', label: phrase('Agents'), href: U.agents },
      {
        id: 'evaluations',
        label: phrase('Evaluations'),
        href: `${U.studio}/evaluations`,
      },
      { id: 'docs', label: phrase('Docs'), href: U.docs },
    ],
    secondaryCTA: { id: 'apiref', label: phrase('API Reference'), href: U.apiRef },
    primaryCTA: { id: 'studio', label: phrase('Open Studio'), href: U.studio },
    preFooter: {
      heading: phrase('Take models and agents from idea to production'),
      actions: [
        { id: 'studio', label: phrase('Open Studio'), href: U.studio },
        { id: 'quickstart', label: phrase('Read quickstart'), href: U.quickstarts },
      ],
    },
  },
  {
    id: 'world',
    host: 'world.hanzo.ai',
    productId: 'world',
    brandName: 'Hanzo World',
    localNav: [
      { id: 'globe', label: phrase('Globe'), href: U.world },
      { id: 'news', label: phrase('News'), href: `${U.world}/news` },
      { id: 'reports', label: phrase('Reports'), href: `${U.world}/reports` },
      { id: 'widgets', label: phrase('Widgets'), href: `${U.world}/widgets` },
      { id: 'docs', label: phrase('Docs'), href: U.docs },
    ],
    secondaryCTA: { id: 'studio', label: phrase('Open Studio'), href: U.studio },
    primaryCTA: { id: 'world', label: phrase('Open World'), href: U.world },
    preFooter: {
      heading: phrase('Build your world — realtime intelligence, reports, and widgets'),
      actions: [
        { id: 'world', label: phrase('Open World'), href: U.world },
        { id: 'quickstart', label: phrase('Read quickstart'), href: U.quickstarts },
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
    secondaryCTA: { id: 'quickstart', label: phrase('Quickstart'), href: U.quickstarts },
    // The label changes, the pill does not. Docs asks for the key because that
    // is what a reader is here to get; it is still the one white pill.
    primaryCTA: { id: 'apikey', label: phrase('Get API key'), href: U.keys },
    preFooter: {
      heading: phrase('Build with Hanzo — keys, quickstarts, and the full API'),
      actions: [
        { id: 'apikey', label: phrase('Get API key'), href: U.keys },
        { id: 'quickstart', label: phrase('Read quickstart'), href: U.quickstarts },
      ],
    },
  },
  {
    id: 'console',
    host: 'platform.hanzo.ai',
    productId: 'console',
    brandName: 'Hanzo Console',
    localNav: [
      { id: 'docs', label: phrase('Docs'), href: U.docs },
      { id: 'api', label: 'API', href: U.apiRef },
      { id: 'status', label: phrase('Status'), href: U.status },
    ],
    secondaryCTA: { id: 'docs', label: phrase('Documentation'), href: U.docs },
    // No primary action: this surface is signed in, so the account menu is the
    // right-hand control and the work lives in the page.
    preFooter: {
      heading: phrase('Ship on Hanzo Cloud'),
      actions: [
        { id: 'apikey', label: phrase('Get API key'), href: U.keys },
        { id: 'docs', label: phrase('Read the docs'), href: U.docs },
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

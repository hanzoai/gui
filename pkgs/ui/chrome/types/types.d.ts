/**
 * Shared content types for the Hanzo site chrome. The chrome is data-driven:
 * every label / href / column comes from the host app as props (no config baked
 * into the library), so one component set skins hanzo.ai, hanzo.chat, lux, zoo, …
 */
export interface NavLink {
    label: string;
    href: string;
    /** Optional one-line description (rendered under the label in mega-menus). */
    desc?: string;
}
export interface NavColumn {
    title: string;
    links: NavLink[];
}
export interface NavItem {
    label: string;
    /** Simple external/relative link (no mega-menu) — e.g. Foundation → zoo.ngo. */
    href?: string;
    /** Big "Explore <section>" links, rendered large in the left column (openai-style). */
    explore?: NavLink[];
    /** Secondary mega-menu columns. */
    columns?: NavColumn[];
}
//# sourceMappingURL=types.d.ts.map
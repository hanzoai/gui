/**
 * tokens — the monochrome zinc-on-black design tokens for the Hanzo public
 * chrome, ported 1:1 from the canonical hanzo.ai landing (which expresses them
 * as Tailwind `neutral` classes). This is the SINGLE SOURCE OF TRUTH for the
 * chrome palette.
 *
 * Why a local palette instead of `$background` / `$color` theme tokens? The
 * chrome is the ONE unified header/footer every Hanzo surface adopts, so it must
 * render identically regardless of the host app's active Gui theme (light, dark,
 * brand-tinted, …). It commits to the marketing look — dark, monochrome — and
 * references these values as literals inside `styled()`, which the Gui
 * compiler still flattens to atomic CSS.
 */
/** Raw neutral scale (Tailwind `neutral-*`) + the two poles. */
export declare const palette: {
    readonly black: "#000000";
    readonly n950: "#0a0a0a";
    readonly n900: "#171717";
    readonly n800: "#262626";
    readonly n700: "#404040";
    readonly n600: "#525252";
    readonly n500: "#737373";
    readonly n400: "#a3a3a3";
    readonly n300: "#d4d4d4";
    readonly n200: "#e5e5e5";
    readonly n100: "#f5f5f5";
    readonly white: "#ffffff";
};
/** Semantic aliases (the meaning, not the place) — what components actually reference. */
export declare const c: {
    /** Page/base surface. */
    readonly bg: "#000000";
    /** Translucent bar over content (header `bg-black/70`). */
    readonly barBg: "rgba(0,0,0,0.7)";
    /** Raised surface (dropdown/panel, `bg-neutral-950/95`). */
    readonly surface: "rgba(10,10,10,0.95)";
    /** Composer field (`bg-neutral-900/70`). */
    readonly field: "rgba(23,23,23,0.7)";
    /** Hover wash (`hover:bg-neutral-900`). */
    readonly hover: "#171717";
    /** Faint fill (pill `bg-neutral-900/50`). */
    readonly fill: "rgba(23,23,23,0.5)";
    /** Hairline (`border-neutral-800`) + its translucent header variant. */
    readonly line: "#262626";
    readonly lineBar: "rgba(38,38,38,0.8)";
    /** Footer/section hairline (`border-neutral-900`). */
    readonly lineSoft: "#171717";
    /** Field border + its hover/focus stops. */
    readonly fieldLine: "#404040";
    readonly fieldLineHover: "#737373";
    /** Primary text. */
    readonly fg: "#ffffff";
    /** High-contrast body (`text-neutral-100`). */
    readonly fgStrong: "#f5f5f5";
    /** Menu/mobile body (`text-neutral-200`). */
    readonly fgBody: "#e5e5e5";
    /** Default nav text (`text-neutral-300`). */
    readonly fgMuted: "#d4d4d4";
    /** Footer links (`text-neutral-400`). */
    readonly fgLink: "#a3a3a3";
    /** Icon default (`text-neutral-400`). */
    readonly icon: "#a3a3a3";
    /** Labels / descriptions / dim icons (`text-neutral-500`). */
    readonly fgDim: "#737373";
    /** Faintest label (`text-neutral-600`). */
    readonly fgFaint: "#525252";
    /** Inverted CTA. */
    readonly ctaBg: "#ffffff";
    readonly ctaFg: "#000000";
};
/**
 * Geist-first family. The host loads the Geist @font-face (e.g. next/font); the
 * chrome only names the family so it matches the canonical site, falling back to
 * the system stack anywhere Geist is absent.
 */
export declare const FONT = "Geist, \"Geist Sans\", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif";
/** The ambient radial-gradient glow behind the hero (matches the site's 640px, blur-120, 16% white). */
export declare const HERO_GLOW = "radial-gradient(circle, #ffffff 0%, transparent 70%)";
/** Desktop breakpoint (Tailwind `lg`) — the header flips to the mega-menu at/above this. */
export declare const LG = 1024;
/** Small breakpoint (Tailwind `sm`) — search + login controls appear at/above this. */
export declare const SM = 640;
//# sourceMappingURL=tokens.d.ts.map
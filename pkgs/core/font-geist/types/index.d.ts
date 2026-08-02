import type { FillInFont, GenericFont } from "@hanzogui/core";
export type { GenericFont, FillInFont } from "@hanzogui/core";
/**
* Geist is the Hanzo typeface: Geist for the UI, Geist Mono for anything
* monospaced. This module is the single place either one is described — the
* family stacks the tokens bind to, the @font-face rules that fetch the bytes,
* and the version those bytes are. An app that states a family of its own is a
* second source of truth and will drift from the rest of the fleet.
*/
/**
* The Geist release the hosted files are cut from.
*
* The path a version is served under is immutable, so publishing a new version
* never invalidates a cached copy of an old one — bump this and the new files
* appear beside the old, they do not replace them.
*/
export declare const GEIST_VERSION = "1.7.2";
/** The origin the fleet's fonts are served from. */
export declare const GEIST_CDN_ORIGIN = "https://cdn.hanzo.ai";
/**
* The two family names, exactly as the `@font-face` rules below register them.
*
* Everything else here is derived from these, so a stack, a rule and a native
* face can never name the typeface differently. Spelling the name a second time
* anywhere is how a font silently stops resolving.
*/
export declare const GEIST_SANS_FAMILY: string;
export declare const GEIST_MONO_FAMILY: string;
/**
* The UI face.
*
* Everything after Geist is a system face, and the list ends in `sans-serif`:
* a font that fails to load must never leave the browser on its default, which
* is a serif.
*/
export declare const geistSans: string;
/** The monospace face, ending in `monospace` for the same reason. */
export declare const geistMono: string;
/** The family names as the platform resolves them: a stack on web, a registered face on native. */
export declare const geistSansFamily: string;
export declare const geistMonoFamily: string;
/**
* Where the font bytes come from.
*
* `cdn` is the default and is what every hosted property should use: one copy,
* one version, one cache, shared across the fleet. `self-hosted` serves the
* same files from the app's own origin for installs that cannot reach us —
* an air-gapped deployment behind a bank's perimeter. The families and the
* token names do not change between the two, only the URL, so moving between
* them is configuration rather than a rewrite.
*/
export type GeistSource = {
	mode?: "cdn" | "self-hosted";
	/** Origin (cdn) or base path (self-hosted) the versioned directory hangs off. */
	base?: string;
	version?: string;
};
/** The directory the two woff2 files live in, for a given source. */
export declare function geistBaseURL({ mode, base, version }?: GeistSource): string;
/** The two files a first paint needs, in the order it needs them. */
export declare function geistPreloadHrefs(source?: GeistSource): [sans: string, mono: string];
/**
* The @font-face rules, as text.
*
* Returned rather than injected: a caller that must not write a <style> element
* — a console under a strict `style-src` — puts this through the CSSOM, and a
* caller that renders HTML can serve it as a stylesheet. Both get the same
* bytes from the same place.
*
* One variable file per family covers weight 100..900, so the whole typeface is
* two requests instead of eighteen. `font-display: swap` means text paints in a
* fallback immediately and never goes invisible waiting on the network.
*/
export declare function geistFontFace(source?: GeistSource): string;
/**
* The custom properties the fleet's stylesheets read, bound to the two stacks.
*
* An app that hard-codes a family in its own CSS is a second source of truth;
* it reads these instead and inherits whatever the kit resolves.
*/
export declare function geistProperties(): string;
/**
* The whole typeface as one stylesheet: the rules that fetch the bytes and the
* properties that point at them. Ask for this, not for one half — either alone
* is a page that renders in a fallback while looking correctly configured.
*
* This package deliberately does NOT put it on a document. It cannot: it sits
* below `@hanzogui/web` in the dependency graph, so reaching the kit's style
* injection from here would be a cycle, and injecting imperatively instead
* would make a FOURTH way the kit writes CSS. An app installs this once at its
* entry — through the CSSOM under a strict `style-src`, as a `<style>`, or in
* the HTML it serves — and everything downstream reads the properties.
*/
export declare function geistStylesheet(source?: GeistSource): string;
declare const defaultSizes: {
	readonly 1: 11;
	readonly 2: 12;
	readonly 3: 13;
	readonly 4: 14;
	readonly true: 14;
	readonly 5: 16;
	readonly 6: 18;
	readonly 7: 20;
	readonly 8: 23;
	readonly 9: 30;
	readonly 10: 46;
	readonly 11: 55;
	readonly 12: 62;
	readonly 13: 72;
	readonly 14: 92;
	readonly 15: 114;
	readonly 16: 134;
};
type SizeOpts = {
	sizeLineHeight?: (fontSize: number) => number;
	sizeSize?: (size: number) => number;
};
export declare const createGeistSansFont: <A extends GenericFont>(font?: Partial<A>, { sizeLineHeight, sizeSize }?: SizeOpts) => FillInFont<A, keyof typeof defaultSizes>;
export declare const createGeistMonoFont: <A extends GenericFont>(font?: Partial<A>, { sizeLineHeight, sizeSize }?: SizeOpts) => FillInFont<A, keyof typeof defaultSizes>;

//# sourceMappingURL=index.d.ts.map
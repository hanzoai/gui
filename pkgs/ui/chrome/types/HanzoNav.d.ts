/**
 * HanzoNav — the openai.com-style public header: brand mark + collapsing
 * wordmark, hover-driven full-width mega-menu, "Log in" + primary-CTA dropdowns,
 * and a full-screen mobile drawer. Monochrome zinc-on-black, Geist.
 *
 * Presentational + host-agnostic: nav items, login links, the primary CTA and
 * its analytics callback are all injected as props. Built from Gui `styled()`
 * atoms (see ./styles) + @hanzogui/lucide-icons-2.
 */
import { type ReactNode } from 'react';
import type { NavItem, NavLink } from './types';
export interface HanzoNavLoginProps {
    /** Trigger label. Defaults to "Log in". */
    label?: string;
    links: NavLink[];
}
export interface HanzoNavPrimaryProps {
    /** CTA label, e.g. "Try Hanzo". */
    label: string;
    /** Where the CTA navigates (the ONE uniform primary action). */
    href: string;
    /** Optional dropdown of surfaces under the CTA. */
    links?: NavLink[];
}
export interface HanzoNavProps {
    /** Top-level nav items (mega-menus or simple links). */
    items: NavItem[];
    /** Brand mark rendered left of the wordmark — pass e.g. <HanzoLogo variant="white" size={22} />. */
    logo?: ReactNode;
    /** Wordmark next to the logo; collapses to just the mark on scroll. Defaults to "Hanzo AI". */
    brand?: string;
    /** Home link target for the logo/wordmark. Defaults to "/". */
    homeHref?: string;
    /** "Log in" dropdown (omit to hide). */
    login?: HanzoNavLoginProps;
    /** The single primary CTA ("Try Hanzo") + optional dropdown. */
    primary: HanzoNavPrimaryProps;
    /** Fired when the primary CTA is activated — wire analytics here (host-owned). */
    onPrimary?: () => void;
    /** Search-button behaviour. Defaults to focusing the #ask hero composer. */
    onSearch?: () => void;
}
export declare function HanzoNav({ items, logo, brand, homeHref, login, primary, onPrimary, onSearch, }: HanzoNavProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=HanzoNav.d.ts.map
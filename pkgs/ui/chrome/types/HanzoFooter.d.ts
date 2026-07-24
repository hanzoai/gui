/**
 * HanzoFooter — the minimal monochrome footer: brand + tagline, link columns,
 * copyright, and an optional GitHub mark. Data-driven via props.
 */
import { type ReactNode } from 'react';
import type { NavColumn } from './types';
export interface HanzoFooterProps {
    /** Footer link columns. */
    sections: NavColumn[];
    /** Brand mark rendered left of the wordmark — pass e.g. <HanzoLogo variant="white" size={22} />. */
    logo?: ReactNode;
    /** Wordmark. Defaults to "Hanzo". */
    brand?: string;
    /** One-line tagline under the brand. Defaults to "The open-source cloud for AI agents.". */
    tagline?: string;
    /** Home link target. Defaults to "/". */
    homeHref?: string;
    /** Legal entity in the copyright line. Defaults to "Hanzo AI, Inc.". */
    legalName?: string;
    /** GitHub link (renders the mark). Omit to hide. */
    githubHref?: string;
}
export declare function HanzoFooter({ sections, logo, brand, tagline, homeHref, legalName, githubHref, }: HanzoFooterProps): import("react").JSX.Element;
//# sourceMappingURL=HanzoFooter.d.ts.map
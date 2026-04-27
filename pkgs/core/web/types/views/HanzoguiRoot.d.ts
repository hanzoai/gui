import React from 'react';
import { ThemeName } from '../types';
/**
 * Applies default font class and CSS variable inheritance via display:contents.
 * Used by HanzoguiProvider at the root and by portals to re-establish font scope.
 * Pass trackMount to also handle the t_unmounted class for CSS animation gating.
 */
export declare function HanzoguiRoot({ children, theme, isRootRoot, passThrough, style, }: {
    children: React.ReactNode;
    theme: ThemeName;
    isRootRoot?: boolean;
    passThrough?: boolean;
    style?: React.CSSProperties;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=HanzoguiRoot.d.ts.map
"use strict";
// note order is important!
// earlier defined = less important
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaQueryDefaultActive = exports.media = exports.breakpoints = void 0;
exports.breakpoints = {
    // for container queries its really helpful to have small sizes
    100: 100,
    200: 200,
    xxxs: 260,
    xxs: 340,
    xs: 460,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
};
var mediaQueryForceNonOverlap = process.env.TAMAGUI_TARGET === 'native' ? 1 : 0.02;
exports.media = {
    // always true on native
    touchable: process.env.TAMAGUI_TARGET === 'native'
        ? { minWidth: 0 }
        : { pointer: 'coarse' },
    // always false on native (can't hover on touch)
    hoverable: process.env.TAMAGUI_TARGET === 'native'
        ? { maxWidth: 0 }
        : { hover: 'hover' },
    // Max-width queries (desktop-first, ordered large-to-small so smaller wins)
    'max-xxl': { maxWidth: exports.breakpoints.xxl - mediaQueryForceNonOverlap },
    'max-xl': { maxWidth: exports.breakpoints.xl - mediaQueryForceNonOverlap },
    'max-lg': { maxWidth: exports.breakpoints.lg - mediaQueryForceNonOverlap },
    'max-md': { maxWidth: exports.breakpoints.md - mediaQueryForceNonOverlap },
    'max-sm': { maxWidth: exports.breakpoints.sm - mediaQueryForceNonOverlap },
    'max-xs': { maxWidth: exports.breakpoints.xs - mediaQueryForceNonOverlap },
    'max-xxs': { maxWidth: exports.breakpoints.xxs - mediaQueryForceNonOverlap },
    'max-xxxs': { maxWidth: exports.breakpoints.xxxs - mediaQueryForceNonOverlap },
    // for container queries its really helpful to have small sizes
    'max-200': { maxWidth: exports.breakpoints['200'] - mediaQueryForceNonOverlap },
    'max-100': { maxWidth: exports.breakpoints['100'] - mediaQueryForceNonOverlap },
    // Min-width queries (mobile-first)
    // non-max wins over max though tbh it could go either way
    xxxs: { minWidth: exports.breakpoints.xxxs },
    xxs: { minWidth: exports.breakpoints.xxs },
    xs: { minWidth: exports.breakpoints.xs },
    sm: { minWidth: exports.breakpoints.sm },
    md: { minWidth: exports.breakpoints.md },
    lg: { minWidth: exports.breakpoints.lg },
    xl: { minWidth: exports.breakpoints.xl },
    xxl: { minWidth: exports.breakpoints.xxl },
    // Height-based queries LAST so they override width queries when both match
    // (later in object = higher CSS specificity)
    // max-height ordered large-to-small so smaller wins (like max-width)
    'max-height-lg': { maxHeight: exports.breakpoints.lg - mediaQueryForceNonOverlap },
    'max-height-md': { maxHeight: exports.breakpoints.md - mediaQueryForceNonOverlap },
    'max-height-sm': { maxHeight: exports.breakpoints.sm - mediaQueryForceNonOverlap },
    'max-height-xs': { maxHeight: exports.breakpoints.xs - mediaQueryForceNonOverlap },
    'max-height-xxs': { maxHeight: exports.breakpoints.xxs - mediaQueryForceNonOverlap },
    'max-height-xxxs': { maxHeight: exports.breakpoints.xxxs - mediaQueryForceNonOverlap },
    'max-height-200': { maxHeight: exports.breakpoints['200'] - mediaQueryForceNonOverlap },
    'max-height-100': { maxHeight: exports.breakpoints['100'] - mediaQueryForceNonOverlap },
    'height-sm': { minHeight: exports.breakpoints.sm },
    'height-md': { minHeight: exports.breakpoints.md },
    'height-lg': { minHeight: exports.breakpoints.lg },
};
exports.mediaQueryDefaultActive = {
    touchable: process.env.TAMAGUI_TARGET === 'native',
    hoverable: process.env.TAMAGUI_TARGET !== 'native',
    // Max queries
    'max-xxl': true,
    'max-xl': true,
    'max-lg': true,
    'max-md': true,
    'max-sm': true,
    'max-xs': true,
    'max-xxs': false,
    'max-xxxs': false,
    // Min queries
    xxxs: true,
    xxs: true,
    xs: true,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
    // Height queries (default: iPhone non-max ~844pt)
    'max-height-sm': false,
    'max-height-md': false,
    'max-height-lg': true,
    'height-sm': true,
    'height-md': true,
    'height-lg': false,
};

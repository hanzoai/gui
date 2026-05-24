"use strict";
// note order is important!
// earlier defined = less important
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaQueryDefaultActive = exports.media = exports.breakpoints = void 0;
exports.breakpoints = {
    '2xl': 1536,
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
    xs: 460,
    '2xs': 340,
};
exports.media = {
    maxXs: { maxWidth: exports.breakpoints.xs },
    max2xs: { maxWidth: exports.breakpoints['2xs'] },
    maxSm: { maxWidth: exports.breakpoints.sm },
    maxMd: { maxWidth: exports.breakpoints.md },
    maxLg: { maxWidth: exports.breakpoints.lg },
    maxXl: { maxWidth: exports.breakpoints.xl },
    max2Xl: { maxWidth: exports.breakpoints['2xl'] },
    // for site
    '2xl': { minWidth: exports.breakpoints['2xl'] },
    xl: { minWidth: exports.breakpoints.xl },
    lg: { minWidth: exports.breakpoints.lg },
    md: { minWidth: exports.breakpoints.md },
    sm: { minWidth: exports.breakpoints.sm },
    xs: { minWidth: exports.breakpoints.xs },
    '2xs': { minWidth: exports.breakpoints['2xs'] },
};
exports.mediaQueryDefaultActive = {
    '2xl': false,
    xl: false,
    lg: false,
    md: false,
    sm: false,
    xs: true,
    '2xs': true,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchMedia = void 0;
exports.setupMatchMedia = setupMatchMedia;
exports.matchMedia = (typeof window !== 'undefined' && window.matchMedia) || matchMediaFallback;
function matchMediaFallback(_) {
    return {
        match: function (a, b) { return false; },
        addListener: function () { },
        removeListener: function () { },
        matches: false,
    };
}
function setupMatchMedia(_) {
    // no-op web
}

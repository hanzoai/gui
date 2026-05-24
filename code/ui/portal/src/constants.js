"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portalListeners = exports.allPortalHosts = exports.needsPortalRepropagation = exports.isTeleportEnabled = void 0;
var constants_1 = require("@hanzogui/constants");
var native_1 = require("@hanzogui/native");
/**
 * Check if teleport is enabled (best portal option - preserves React context)
 */
var isTeleportEnabled = function () {
    var state = (0, native_1.getPortal)().state;
    return state.enabled && state.type === 'teleport';
};
exports.isTeleportEnabled = isTeleportEnabled;
/**
 * Check if we need to manually re-propagate React context through portals.
 * When teleport is enabled, context is automatically preserved.
 * Otherwise, on native platforms we need to manually forward context.
 */
var needsPortalRepropagation = function () {
    if (constants_1.isWeb)
        return false;
    if ((0, exports.isTeleportEnabled)())
        return false;
    // native without teleport needs repropagation
    return constants_1.isAndroid || constants_1.isIos;
};
exports.needsPortalRepropagation = needsPortalRepropagation;
// web-only portal host tracking
exports.allPortalHosts = new Map();
exports.portalListeners = {};

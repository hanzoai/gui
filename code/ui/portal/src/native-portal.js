"use strict";
// native portal setup - must be explicitly imported to avoid RN 0.81+ compatibility issues
// usage: import { setupNativePortal } from '@hanzogui/portal/native-portal'
// call setupNativePortal() early in your app to enable native portals
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNativePortal = void 0;
var IS_FABRIC = typeof global !== 'undefined' &&
    Boolean((_a = global._IS_FABRIC) !== null && _a !== void 0 ? _a : global.nativeFabricUIManager);
/**
 * Sets up native portal support for React Native.
 * Call this function early in your app (e.g., in index.js) to enable native portals.
 *
 * This is opt-in to avoid compatibility issues with RN 0.81+ where the
 * react-native shim imports can fail with "property is not writable" errors.
 */
var setupNativePortal = function () {
    var _a, _b, _c, _d;
    var g = globalThis;
    if (g.__hanzogui_portal_create)
        return;
    if (IS_FABRIC) {
        try {
            var mod = require('react-native/Libraries/Renderer/shims/ReactFabric');
            g.__hanzogui_portal_create = (_b = (_a = mod === null || mod === void 0 ? void 0 : mod.default) === null || _a === void 0 ? void 0 : _a.createPortal) !== null && _b !== void 0 ? _b : mod.createPortal;
        }
        catch (err) {
            console.info("Note: error importing fabric portal, native portals disabled", err);
        }
        return;
    }
    try {
        var mod = require('react-native/Libraries/Renderer/shims/ReactNative');
        g.__hanzogui_portal_create = (_d = (_c = mod === null || mod === void 0 ? void 0 : mod.default) === null || _c === void 0 ? void 0 : _c.createPortal) !== null && _d !== void 0 ? _d : mod.createPortal;
    }
    catch (err) {
        console.info("Note: error importing native portal, native portals disabled", err);
    }
};
exports.setupNativePortal = setupNativePortal;

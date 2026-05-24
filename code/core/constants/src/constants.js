"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentPlatform = exports.isTV = exports.isIos = exports.isAndroid = exports.isTouchable = exports.isWebTouchable = exports.isChrome = exports.useIsomorphicLayoutEffect = exports.isWindowDefined = exports.isClient = exports.isServer = exports.isBrowser = exports.isWeb = void 0;
var react_1 = require("react");
exports.isWeb = true;
// check document not window — RN polyfills global.window but not document,
// so this is the only reliable "is DOM environment" check.
exports.isBrowser = typeof document !== 'undefined';
exports.isServer = exports.isWeb && !exports.isBrowser;
exports.isClient = exports.isWeb && exports.isBrowser;
/** @deprecated use isBrowser instead */
exports.isWindowDefined = exports.isBrowser;
exports.useIsomorphicLayoutEffect = exports.isServer
    ? react_1.useEffect
    : react_1.useLayoutEffect;
exports.isChrome = typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '');
exports.isWebTouchable = exports.isClient && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
exports.isTouchable = !exports.isWeb || exports.isWebTouchable;
// set :boolean to avoid inferring type to false
// On web, isAndroid/isIos are always false in production.
// TEST_NATIVE_PLATFORM is only set by the test runner (vitest) to simulate native
// environments (e.g. androidtv, tvos) from a web/jsdom test context.
exports.isAndroid = process.env.TEST_NATIVE_PLATFORM === 'android' ||
    // Android TV has Platform.OS === 'android' per react-native-tvos
    process.env.TEST_NATIVE_PLATFORM === 'androidtv';
exports.isIos = process.env.TEST_NATIVE_PLATFORM === 'ios' ||
    // tvOS has Platform.OS === 'ios' per react-native-tvos
    process.env.TEST_NATIVE_PLATFORM === 'tvos';
exports.isTV = process.env.TEST_NATIVE_PLATFORM === 'androidtv' ||
    process.env.TEST_NATIVE_PLATFORM === 'tvos';
/**
 * Reflects Platform.OS. TV platforms are intentionally NOT separate values:
 * - Android TV has Platform.OS === 'android' (react-native-tvos behavior)
 * - tvOS has Platform.OS === 'ios' (react-native-tvos behavior)
 * Use `isTV` combined with `isAndroid`/`isIos` to detect specific TV platforms.
 */
exports.currentPlatform = 'web';
// In web source mode (Vite/webpack without pre-built dist), TAMAGUI_TARGET may not be set.
// Set it here so all process.env.TAMAGUI_TARGET runtime checks work correctly.
// In pre-built dist, the build tool inlines TAMAGUI_TARGET as a literal string,
// making this block dead code (if (!'web') → never executes).
if (!process.env.TAMAGUI_TARGET) {
    process.env.TAMAGUI_TARGET = 'web';
}

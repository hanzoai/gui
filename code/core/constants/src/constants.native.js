"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentPlatform = exports.isTV = exports.isIos = exports.isAndroid = exports.isTouchable = exports.isWebTouchable = exports.isChrome = exports.useIsomorphicLayoutEffect = exports.isWindowDefined = exports.isClient = exports.isServer = exports.isBrowser = exports.isWeb = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
exports.isWeb = false;
exports.isBrowser = false;
exports.isServer = false;
exports.isClient = true;
/** @deprecated use isBrowser instead */
exports.isWindowDefined = false;
exports.useIsomorphicLayoutEffect = react_1.useLayoutEffect;
exports.isChrome = false;
exports.isWebTouchable = false;
exports.isTouchable = true;
// optional chain required: babel extractor loads native.cjs in node where Platform is undefined
// On Android TV: Platform.OS === 'android' per react-native-tvos
exports.isAndroid = (react_native_1.Platform === null || react_native_1.Platform === void 0 ? void 0 : react_native_1.Platform.OS) === 'android' ||
    process.env.TEST_NATIVE_PLATFORM === 'android' ||
    process.env.TEST_NATIVE_PLATFORM === 'androidtv';
// On tvOS: Platform.OS === 'ios' per react-native-tvos
exports.isIos = (react_native_1.Platform === null || react_native_1.Platform === void 0 ? void 0 : react_native_1.Platform.OS) === 'ios' ||
    process.env.TEST_NATIVE_PLATFORM === 'ios' ||
    process.env.TEST_NATIVE_PLATFORM === 'tvos';
exports.isTV = (react_native_1.Platform === null || react_native_1.Platform === void 0 ? void 0 : react_native_1.Platform.isTV) ||
    process.env.TEST_NATIVE_PLATFORM === 'androidtv' ||
    process.env.TEST_NATIVE_PLATFORM === 'tvos';
var platforms = { ios: 'ios', android: 'android' };
/**
 * Reflects Platform.OS. TV platforms are intentionally NOT separate values:
 * - Android TV has Platform.OS === 'android' (react-native-tvos behavior)
 * - tvOS has Platform.OS === 'ios' (react-native-tvos behavior)
 * Use `isTV` combined with `isAndroid`/`isIos` to detect specific TV platforms.
 */
exports.currentPlatform = ((react_native_1.Platform === null || react_native_1.Platform === void 0 ? void 0 : react_native_1.Platform.OS) ? platforms[react_native_1.Platform.OS] : undefined) || 'native';
// In Metro source mode, TAMAGUI_TARGET may not be set by the build tool.
// Set it here so all process.env.TAMAGUI_TARGET runtime checks work correctly.
// In pre-built dist, the build tool inlines TAMAGUI_TARGET as a literal string,
// making this block dead code (if (!'native') → never executes).
if (!process.env.TAMAGUI_TARGET) {
    process.env.TAMAGUI_TARGET = 'native';
}

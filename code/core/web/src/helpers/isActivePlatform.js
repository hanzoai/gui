"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformSpecificityBump = getPlatformSpecificityBump;
exports.isActivePlatform = isActivePlatform;
var constants_1 = require("@hanzogui/constants");
/**
 * Returns the specificity bump for a platform media key so that more specific
 * platform selectors reliably override more general ones regardless of the order
 * props are declared.
 *
 * Cascade (low → high importance):
 *   $platform-native / $platform-web         → bump 0  (widest)
 *   $platform-android / $platform-ios        → bump 1  (OS-specific)
 *   $platform-tv                             → bump 2  (TV subset of Android/iOS)
 *   $platform-androidtv / $platform-tvos     → bump 3  (most specific)
 *
 * @param mediaKeyShort - Platform media key without the leading '$' (e.g. 'platform-tv', 'platform-androidtv')
 */
function getPlatformSpecificityBump(mediaKeyShort) {
    if (mediaKeyShort === 'platform-androidtv' || mediaKeyShort === 'platform-tvos')
        return 3;
    if (mediaKeyShort === 'platform-tv')
        return 2;
    if (mediaKeyShort === 'platform-android' || mediaKeyShort === 'platform-ios')
        return 1;
    return 0;
}
function isActivePlatform(key) {
    if (!key.startsWith('$platform')) {
        return true;
    }
    var platform = key.slice(10);
    return (
    // exact platform match (web, ios, android)
    platform === constants_1.currentPlatform ||
        // native matches all non-web platforms (iOS, Android, tvOS, Android TV)
        (platform === 'native' && constants_1.currentPlatform !== 'web') ||
        // TAMAGUI_TARGET fallback (web or native build target)
        platform === process.env.TAMAGUI_TARGET ||
        // tv matches both Android TV and tvOS
        (platform === 'tv' && constants_1.isTV) ||
        // androidtv matches Android TV specifically
        (platform === 'androidtv' && constants_1.isAndroid && constants_1.isTV) ||
        // tvos matches tvOS specifically
        (platform === 'tvos' && constants_1.isIos && constants_1.isTV));
}

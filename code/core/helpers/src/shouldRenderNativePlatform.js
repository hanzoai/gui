"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRenderNativePlatform = shouldRenderNativePlatform;
var constants_1 = require("@hanzogui/constants");
var ALL_PLATFORMS = ['web', 'android', 'ios'];
/**
 *
 * takes in what user has inputted the native-supporting component and returns the name of the native platform we should render
 *
 * @example ['android'] => 'android' (when current platform is android)
 * @example ['android'] => null      (when current platform is not android)
 * @example ['mobile']  => 'ios'     (when current platform is ios)
 *
 * @param supportedSpecificNativeValues the platforms your component/system supports
 * @param nativeProp the platforms your user is requesting you to use
 * @returns
 */
function shouldRenderNativePlatform(nativeProp) {
    if (!nativeProp) {
        return null;
    }
    var userRequestedPlatforms = resolvePlatformNames(nativeProp);
    for (var _i = 0, ALL_PLATFORMS_1 = ALL_PLATFORMS; _i < ALL_PLATFORMS_1.length; _i++) {
        var platform = ALL_PLATFORMS_1[_i];
        if (platform === constants_1.currentPlatform && userRequestedPlatforms.has(platform)) {
            return platform;
        }
    }
    return null;
}
function resolvePlatformNames(nativeProp) {
    var platforms = nativeProp === true // all native platforms
        ? ALL_PLATFORMS
        : nativeProp === false // no native platform
            ? []
            : Array.isArray(nativeProp)
                ? nativeProp
                : [nativeProp];
    var set = new Set(platforms);
    if (set.has('mobile')) {
        // mobile means android and ios so we'll just use the explicit platforms here
        set.add('android');
        set.add('ios');
        set.delete('mobile');
    }
    return set;
}

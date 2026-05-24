"use strict";
// this allows us to swap between core native and web in the same process:
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireHanzoguiCore = requireHanzoguiCore;
function requireHanzoguiCore(platform, ogRequire) {
    var _a, _b;
    if (ogRequire === void 0) { ogRequire = require; }
    if (!platform) {
        throw new Error("No platform given to requireHanzoguiCore");
    }
    // avoid tree shaking out themes
    var og1 = process.env.TAMAGUI_IS_SERVER;
    var og2 = process.env.TAMAGUI_KEEP_THEMES;
    (_a = process.env).TAMAGUI_IS_SERVER || (_a.TAMAGUI_IS_SERVER = '1');
    (_b = process.env).TAMAGUI_KEEP_THEMES || (_b.TAMAGUI_KEEP_THEMES = '1');
    var exported = ogRequire(platform === 'native' ? '@hanzogui/core/native' : '@hanzogui/core');
    // restore back
    process.env.TAMAGUI_IS_SERVER = og1;
    process.env.TAMAGUI_KEEP_THEMES = og2;
    return exported;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesRootSchemeMatchSystem = doesRootSchemeMatchSystem;
var react_native_1 = require("react-native");
var useThemeState_1 = require("./useThemeState");
function doesRootSchemeMatchSystem() {
    var _a;
    // only used on native for now
    return ((_a = (0, useThemeState_1.getRootThemeState)()) === null || _a === void 0 ? void 0 : _a.scheme) === react_native_1.Appearance.getColorScheme();
}

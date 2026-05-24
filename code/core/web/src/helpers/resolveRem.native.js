"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRem = resolveRem;
exports.isRemValue = isRemValue;
var react_native_1 = require("react-native");
var config_1 = require("../config");
var remRegex = /(-?[\d.]+)rem/g;
/**
 * Resolves rem values to pixel values on native platforms.
 * Uses PixelRatio.getFontScale() to account for user's font size preferences.
 *
 * @param value - A string value that may contain rem units (e.g., "1.5rem" or "calc(1rem + 2rem)")
 * @returns The numeric pixel value
 */
function resolveRem(value) {
    var _a, _b;
    var config = (0, config_1.getConfig)();
    var baseFontSize = (_b = (_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.remBaseFontSize) !== null && _b !== void 0 ? _b : 16;
    // Handle simple rem value like "1.5rem"
    if (value.endsWith('rem') && !value.includes(' ')) {
        var numericValue = Number.parseFloat(value);
        if (!Number.isNaN(numericValue)) {
            return react_native_1.PixelRatio.getFontScale() * baseFontSize * numericValue;
        }
    }
    // Handle multiple rem values in a string (e.g., in calc expressions)
    var result = 0;
    var match;
    while ((match = remRegex.exec(value)) !== null) {
        var numericValue = Number.parseFloat(match[1]);
        if (!Number.isNaN(numericValue)) {
            result += react_native_1.PixelRatio.getFontScale() * baseFontSize * numericValue;
        }
    }
    remRegex.lastIndex = 0; // Reset regex state
    return result;
}
/**
 * Checks if a value is a rem string
 */
function isRemValue(value) {
    return typeof value === 'string' && value.includes('rem');
}

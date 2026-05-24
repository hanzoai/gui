"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOppositeScheme = getOppositeScheme;
exports.isColorStyleKey = isColorStyleKey;
exports.getDynamicVal = getDynamicVal;
exports.extractValueFromDynamic = extractValueFromDynamic;
function getOppositeScheme(scheme) {
    return scheme === 'dark' ? 'light' : 'dark';
}
/**
 * Style properties that are color values and support DynamicColorIOS on iOS.
 * Non-color properties (like opacity, dimensions, etc.) must NOT be wrapped
 * with {dynamic: {...}} as React Native will throw:
 * "TypeError: expected dynamic type 'int/double/bool/string', but had type 'object'"
 *
 * See: https://reactnative.dev/docs/dynamiccolorios
 * See: https://github.com/hanzoai/gui/issues/3096
 * See: https://github.com/hanzoai/gui/issues/2980
 */
var colorStyleKeys = {
    backgroundColor: true,
    borderColor: true,
    borderTopColor: true,
    borderRightColor: true,
    borderBottomColor: true,
    borderLeftColor: true,
    borderBlockColor: true,
    borderBlockEndColor: true,
    borderBlockStartColor: true,
    color: true,
    shadowColor: true,
    textDecorationColor: true,
    textShadowColor: true,
    tintColor: true,
    outlineColor: true,
};
/**
 * Check if a style key is a color property that supports DynamicColorIOS.
 */
function isColorStyleKey(key) {
    return colorStyleKeys[key] === true;
}
function getDynamicVal(_a) {
    var _b;
    var scheme = _a.scheme, val = _a.val, oppositeVal = _a.oppositeVal;
    var oppositeScheme = getOppositeScheme(scheme);
    return {
        dynamic: (_b = {},
            _b[scheme] = val,
            _b[oppositeScheme] = oppositeVal,
            _b),
    };
}
function extractValueFromDynamic(val, scheme) {
    if (val === null || val === void 0 ? void 0 : val['dynamic']) {
        return val['dynamic'][scheme];
    }
    return val;
}

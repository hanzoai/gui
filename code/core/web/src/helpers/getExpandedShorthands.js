"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpandedShorthands = getExpandedShorthands;
exports.getExpandedShorthand = getExpandedShorthand;
var config_1 = require("../config");
/**
 * @deprecated use useProps instead
 */
function getExpandedShorthands(props) {
    var shorthands = (0, config_1.getConfig)().shorthands;
    if (!shorthands)
        return props;
    var res = {};
    for (var key in props) {
        // @ts-ignore
        res[shorthands[key] || key] = props[key];
    }
    return res;
}
function getExpandedShorthand(propKey, props) {
    var _a;
    var shorthands = (0, config_1.getConfig)().inverseShorthands;
    return (_a = props[propKey]) !== null && _a !== void 0 ? _a : props[shorthands[propKey]];
}

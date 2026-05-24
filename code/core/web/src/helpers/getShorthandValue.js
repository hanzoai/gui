"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShorthandValue = void 0;
var config_1 = require("../config");
var inverseShorthands = null;
var getShorthandValue = function (props, key) {
    var _a;
    inverseShorthands || (inverseShorthands = (0, config_1.getConfig)().inverseShorthands);
    return (_a = props[key]) !== null && _a !== void 0 ? _a : (inverseShorthands ? props[inverseShorthands[key]] : undefined);
};
exports.getShorthandValue = getShorthandValue;

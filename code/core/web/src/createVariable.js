"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCSSVariable = exports.didGetVariableValue = exports.setDidGetVariableValue = exports.createVariable = void 0;
exports.variableToString = variableToString;
exports.isVariable = isVariable;
exports.getVariable = getVariable;
exports.getVariableValue = getVariableValue;
exports.getVariableName = getVariableName;
exports.getVariableVariable = getVariableVariable;
exports.px = px;
var constants_1 = require("@hanzogui/constants");
var helpers_1 = require("@hanzogui/helpers");
var config_1 = require("./config");
/**
 * Should rename this to Token
 * Moving to objects for React Server Components support
 */
function constructCSSVariableName(name) {
    return "var(--".concat(process.env.TAMAGUI_CSS_VARIABLE_PREFIX || '').concat(name, ")");
}
var createVariable = function (props, skipHash) {
    if (skipHash === void 0) { skipHash = false; }
    if (!skipHash && isVariable(props))
        return props;
    var key = props.key, name = props.name, val = props.val;
    return {
        isVar: true,
        key: key,
        name: skipHash ? name : (0, helpers_1.simpleHash)(name, 40),
        val: val,
        variable: constants_1.isWeb
            ? skipHash
                ? constructCSSVariableName(name)
                : (0, exports.createCSSVariable)(name)
            : '',
    };
};
exports.createVariable = createVariable;
// could do weakmap cache
function variableToString(vrble, getValue) {
    if (getValue === void 0) { getValue = false; }
    if (isVariable(vrble)) {
        if (!getValue && constants_1.isWeb && vrble.variable) {
            return vrble.variable;
        }
        return "".concat(vrble.val);
    }
    return "".concat(vrble || '');
}
function isVariable(v) {
    return v && typeof v === 'object' && 'isVar' in v;
}
function getVariable(nameOrVariable, group) {
    var _a, _b;
    if (group === void 0) { group = 'size'; }
    // dynamic color-like
    if (nameOrVariable === null || nameOrVariable === void 0 ? void 0 : nameOrVariable.dynamic) {
        return nameOrVariable;
    }
    (0, exports.setDidGetVariableValue)(true);
    if (isVariable(nameOrVariable)) {
        return variableToString(nameOrVariable);
    }
    var tokens = (0, config_1.getConfig)().tokensParsed;
    return variableToString((_b = (_a = tokens[group]) === null || _a === void 0 ? void 0 : _a[nameOrVariable]) !== null && _b !== void 0 ? _b : nameOrVariable);
}
var accessed = false;
var setDidGetVariableValue = function (val) { return (accessed = val); };
exports.setDidGetVariableValue = setDidGetVariableValue;
var didGetVariableValue = function () { return accessed; };
exports.didGetVariableValue = didGetVariableValue;
function getVariableValue(v, group) {
    var _a;
    if (isVariable(v)) {
        (0, exports.setDidGetVariableValue)(true);
        return v.val;
    }
    if (group) {
        var tokens = (0, config_1.getConfig)().tokensParsed;
        var token = (_a = tokens[group]) === null || _a === void 0 ? void 0 : _a[v];
        if (token) {
            (0, exports.setDidGetVariableValue)(true);
            return token.val;
        }
    }
    return v;
}
function getVariableName(v) {
    if (isVariable(v))
        return v.name;
    return v;
}
function getVariableVariable(v) {
    if (isVariable(v))
        return v.variable;
    return v;
}
// bugfix { space: { 0.5: 10 } } was generating var(--space-0.5) (invalid CSS):
var createCSSVariable = function (nameProp, includeVar) {
    if (includeVar === void 0) { includeVar = true; }
    if (process.env.NODE_ENV === 'development') {
        if (!nameProp || typeof nameProp !== 'string') {
            throw new Error("createCSSVariable expected string, got: ".concat(nameProp));
        }
    }
    var name = (0, helpers_1.simpleHash)(nameProp, 60);
    return includeVar ? constructCSSVariableName(name) : name;
};
exports.createCSSVariable = createCSSVariable;
/**
 * Helper function to mark a token value as needing px units.
 * Usage: px(100) creates a token that will become "100px" on web, 100 on native.
 *
 * @param value - The numeric value
 * @returns A special object that indicates this value needs px units
 */
function px(value) {
    return {
        val: value,
        needsPx: true,
    };
}

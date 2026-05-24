"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateMutatedVariable = exports.mutatedAutoVariables = exports.getOrCreateVariable = exports.autoVariables = exports.tokensValueToVariable = exports.variableToCSS = exports.registerCSSVariable = void 0;
var createVariable_1 = require("../createVariable");
var registerCSSVariable = function (v) {
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
        exports.tokensValueToVariable.set((0, createVariable_1.getVariableValue)(v), v);
    }
};
exports.registerCSSVariable = registerCSSVariable;
var variableToCSS = function (v, unitless) {
    if (unitless === void 0) { unitless = false; }
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
        return "--".concat(process.env.TAMAGUI_CSS_VARIABLE_PREFIX || '').concat((0, createVariable_1.createCSSVariable)(v.name, false), ":").concat(!unitless && typeof v.val === 'number' ? "".concat(v.val, "px") : v.val);
    }
    return '';
};
exports.variableToCSS = variableToCSS;
exports.tokensValueToVariable = new Map();
// auto-generated vars for theme values not in tokens
var autoVarId = 0;
exports.autoVariables = [];
var getOrCreateVariable = function (val) {
    if (exports.tokensValueToVariable.has(val)) {
        return exports.tokensValueToVariable.get(val);
    }
    var name = "t".concat(autoVarId++);
    var variable = "var(--".concat(name, ")");
    var v = { val: val, name: name, variable: variable };
    exports.tokensValueToVariable.set(val, v);
    exports.autoVariables.push(v);
    return v;
};
exports.getOrCreateVariable = getOrCreateVariable;
// For mutated themes (runtime theme changes like in /theme builder)
// Uses same 't' prefix but starts at 10000 to avoid conflicts with SSR-generated vars
var mutatedVarId = 10000;
exports.mutatedAutoVariables = [];
var mutatedTokensValueToVariable = new Map();
var getOrCreateMutatedVariable = function (val) {
    if (mutatedTokensValueToVariable.has(val)) {
        return mutatedTokensValueToVariable.get(val);
    }
    var name = "t".concat(mutatedVarId++);
    var variable = "var(--".concat(name, ")");
    var v = { val: val, name: name, variable: variable };
    mutatedTokensValueToVariable.set(val, v);
    exports.mutatedAutoVariables.push(v);
    return v;
};
exports.getOrCreateMutatedVariable = getOrCreateMutatedVariable;

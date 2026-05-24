"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVariables = void 0;
var constants_1 = require("@hanzogui/constants");
var helpers_1 = require("@hanzogui/helpers");
var createVariable_1 = require("./createVariable");
var cache = new WeakMap();
// recursive...
var createVariables = function (tokens, parentPath, isFont) {
    if (parentPath === void 0) { parentPath = ''; }
    if (isFont === void 0) { isFont = false; }
    if (cache.has(tokens))
        return tokens;
    var res = {};
    var i = 0;
    for (var keyIn in tokens) {
        i++;
        var val = tokens[keyIn];
        var isPrefixed = keyIn[0] === '$';
        var keyWithPrefix = isPrefixed ? keyIn : "$".concat(keyIn);
        var key = isPrefixed ? keyWithPrefix.slice(1) : keyIn;
        if ((0, createVariable_1.isVariable)(val)) {
            res[key] = val;
            continue;
        }
        var niceKey = (0, helpers_1.simpleHash)(key, 1000);
        var name_1 = parentPath && parentPath !== 't-color' ? "".concat(parentPath, "-").concat(niceKey) : "c-".concat(niceKey);
        // Handle px() helper objects
        if (val && typeof val === 'object' && 'needsPx' in val && 'val' in val) {
            var finalValue_1 = (0, createVariable_1.createVariable)({
                val: val.val,
                name: name_1,
                key: keyWithPrefix,
            });
            // Only set needsPx flag on web platform, avoid on native
            if (constants_1.isWeb) {
                finalValue_1.needsPx = val.needsPx;
            }
            res[key] = finalValue_1;
            continue;
        }
        if (val && typeof val === 'object') {
            // recurse
            res[key] = (0, exports.createVariables)(tokens[key], name_1, false /* note: don't pass isFont down, we want to avoid it past the first level */);
            continue;
        }
        var finalValue = (0, createVariable_1.isVariable)(val)
            ? val
            : (0, createVariable_1.createVariable)({ val: val, name: name_1, key: keyWithPrefix });
        res[key] = finalValue;
    }
    cache.set(res, true);
    return res;
};
exports.createVariables = createVariables;

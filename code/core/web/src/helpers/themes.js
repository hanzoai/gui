"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureThemeVariable = ensureThemeVariable;
var createVariable_1 = require("../createVariable");
// mutates, freeze after
// shared by createHanzogui so extracted here
function ensureThemeVariable(theme, key) {
    var val = theme[key];
    if (!(0, createVariable_1.isVariable)(val)) {
        theme[key] = (0, createVariable_1.createVariable)({
            key: key,
            name: key,
            val: val,
        });
    }
    else {
        if (val.name !== key) {
            // rename to theme name
            theme[key] = (0, createVariable_1.createVariable)({
                key: val.name,
                name: key,
                val: val.val,
            });
        }
    }
}

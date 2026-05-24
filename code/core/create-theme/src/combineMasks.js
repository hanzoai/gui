"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineMasks = void 0;
var applyMask_1 = require("./applyMask");
var themeInfo_1 = require("./themeInfo");
var combineMasks = function () {
    var masks = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        masks[_i] = arguments[_i];
    }
    var mask = {
        name: 'combine-mask',
        mask: function (template, opts) {
            var current = (0, themeInfo_1.getThemeInfo)(template, opts.parentName);
            var theme;
            for (var _i = 0, masks_1 = masks; _i < masks_1.length; _i++) {
                var mask_1 = masks_1[_i];
                if (!current) {
                    throw new Error("Nothing returned from mask: ".concat(current, ", for template: ").concat(template, " and mask: ").concat(mask_1.toString(), ", given opts ").concat(JSON.stringify(opts, null, 2)));
                }
                var next = (0, applyMask_1.applyMaskStateless)(current, mask_1, opts);
                current = next;
                theme = next.theme;
            }
            return theme;
        },
    };
    return mask;
};
exports.combineMasks = combineMasks;

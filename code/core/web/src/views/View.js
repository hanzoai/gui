"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
var helpers_1 = require("@hanzogui/helpers");
var createComponent_1 = require("../createComponent");
exports.View = (0, createComponent_1.createComponent)({
    acceptsClassName: true,
    validStyles: helpers_1.validStyles,
});

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.configWithoutAnimations = void 0;
var themes_1 = require("@hanzogui/themes");
var animations_1 = require("./animations");
var config_1 = require("./config");
var config_2 = require("./config");
Object.defineProperty(exports, "configWithoutAnimations", { enumerable: true, get: function () { return config_2.configWithoutAnimations; } });
__exportStar(require("./media"), exports);
__exportStar(require("./createGenericFont"), exports);
__exportStar(require("./animations"), exports);
exports.config = __assign(__assign({}, config_1.configWithoutAnimations), { 
    // fixes typescript exporting this using internal /types/ path
    themes: themes_1.themes, animations: animations_1.animations });

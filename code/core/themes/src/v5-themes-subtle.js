"use strict";
/**
 * Subtle v5 themes - pre-built desaturated color themes
 */
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
exports.themes = void 0;
__exportStar(require("./v5-themes"), exports);
var subtleChildrenThemes_1 = require("./subtleChildrenThemes");
var v5_themes_1 = require("./v5-themes");
exports.themes = (0, v5_themes_1.createV5Theme)({ childrenThemes: subtleChildrenThemes_1.subtleChildrenThemes });
// type checks - don't remove
exports.themes.dark.background0075;
exports.themes.dark_yellow.background0075;
exports.themes.dark.background;
exports.themes.dark.accent1;
// @ts-expect-error
exports.themes.dark.nonValid;

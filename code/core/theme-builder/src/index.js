"use strict";
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
exports.masks = exports.getThemeSuitePalettes = exports.PALETTE_BACKGROUND_OFFSET = exports.defaultComponentThemes = exports.defaultTemplates = exports.createV4ThemeBuilder = exports.createPalettes = exports.createV4Themes = exports.createThemes = exports.createStudioThemes = void 0;
__exportStar(require("./ThemeBuilder"), exports);
__exportStar(require("@hanzogui/create-theme"), exports);
var createStudioThemes_1 = require("./createStudioThemes");
Object.defineProperty(exports, "createStudioThemes", { enumerable: true, get: function () { return createStudioThemes_1.createStudioThemes; } });
var createThemes_1 = require("./createThemes");
Object.defineProperty(exports, "createThemes", { enumerable: true, get: function () { return createThemes_1.createThemes; } });
Object.defineProperty(exports, "createV4Themes", { enumerable: true, get: function () { return createThemes_1.createV4Themes; } });
Object.defineProperty(exports, "createPalettes", { enumerable: true, get: function () { return createThemes_1.createPalettes; } });
Object.defineProperty(exports, "createV4ThemeBuilder", { enumerable: true, get: function () { return createThemes_1.createV4ThemeBuilder; } });
var defaultTemplates_1 = require("./defaultTemplates");
Object.defineProperty(exports, "defaultTemplates", { enumerable: true, get: function () { return defaultTemplates_1.defaultTemplates; } });
/** @deprecated component themes are no longer recommended */
var defaultComponentThemes_1 = require("./defaultComponentThemes");
Object.defineProperty(exports, "defaultComponentThemes", { enumerable: true, get: function () { return defaultComponentThemes_1.defaultComponentThemes; } });
var getThemeSuitePalettes_1 = require("./getThemeSuitePalettes");
Object.defineProperty(exports, "PALETTE_BACKGROUND_OFFSET", { enumerable: true, get: function () { return getThemeSuitePalettes_1.PALETTE_BACKGROUND_OFFSET; } });
Object.defineProperty(exports, "getThemeSuitePalettes", { enumerable: true, get: function () { return getThemeSuitePalettes_1.getThemeSuitePalettes; } });
// copied from themes to avoid cyclic dep
var masks_1 = require("./masks");
Object.defineProperty(exports, "masks", { enumerable: true, get: function () { return masks_1.masks; } });

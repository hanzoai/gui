"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudioThemes = createStudioThemes;
var createThemes_1 = require("./createThemes");
var defaultComponentThemes_1 = require("./defaultComponentThemes");
var defaultTemplates_1 = require("./defaultTemplates");
var defaultTemplatesStronger_1 = require("./defaultTemplatesStronger");
var defaultTemplatesStrongest_1 = require("./defaultTemplatesStrongest");
// for studio
// allows more detailed configuration, used by studio
// eventually we should merge this down into simple and have it handle what we need
function createStudioThemes(props) {
    var palettes = (0, createThemes_1.createPalettes)(props.palettes);
    var templates = props.templateStrategy === 'stronger'
        ? defaultTemplatesStronger_1.defaultTemplatesStronger
        : props.templateStrategy === 'strongest'
            ? defaultTemplatesStrongest_1.defaultTemplatesStrongest
            : defaultTemplates_1.defaultTemplates;
    return (0, createThemes_1.createSimpleThemeBuilder)({
        palettes: palettes,
        templates: templates,
        componentThemes: defaultComponentThemes_1.defaultComponentThemes,
        accentTheme: !!props.palettes.accent,
    });
}

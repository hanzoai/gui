"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFont = void 0;
exports.insertFont = insertFont;
exports.parseFont = parseFont;
exports.registerFontVariables = registerFontVariables;
var config_1 = require("./config");
var constants_1 = require("./constants/constants");
var createFont_1 = require("./createFont");
var createVariables_1 = require("./createVariables");
var registerCSSVariable_1 = require("./helpers/registerCSSVariable");
/**
 * Runtime dynamic insert font
 */
function insertFont(name, fontIn) {
    var font = (0, createFont_1.createFont)(fontIn);
    var tokened = (0, createVariables_1.createVariables)(font, name);
    var parsed = parseFont(tokened);
    if (process.env.TAMAGUI_TARGET === 'web' && typeof document !== 'undefined') {
        var fontVars = registerFontVariables(parsed);
        var styleElement = document.querySelector("style[".concat(constants_1.FONT_DATA_ATTRIBUTE_NAME, "=\"").concat(name, "\"]")) ||
            document.createElement('style');
        styleElement.innerText = ":root .font_".concat(name, " {").concat(fontVars.join(';'), "}");
        styleElement.setAttribute(constants_1.FONT_DATA_ATTRIBUTE_NAME, name);
        document.head.appendChild(styleElement);
    }
    (0, config_1.setConfigFont)(name, tokened, parsed);
    return parsed;
}
exports.updateFont = insertFont;
function parseFont(definition) {
    var _a;
    var parsed = {};
    for (var attrKey in definition) {
        var attr = definition[attrKey];
        if (attrKey === 'family' || attrKey === 'face') {
            parsed[attrKey] = attr;
        }
        else {
            parsed[attrKey] = {};
            for (var key in attr) {
                var val = attr[key];
                // is a theme reference
                if (((_a = val.val) === null || _a === void 0 ? void 0 : _a[0]) === '$') {
                    val = val.val;
                }
                parsed[attrKey]["$".concat(key)] = val;
            }
        }
    }
    return parsed;
}
function registerFontVariables(parsedFont) {
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
        var response = [];
        for (var fkey in parsedFont) {
            if (fkey === 'face')
                continue;
            if (fkey === 'family') {
                var val = parsedFont[fkey];
                (0, registerCSSVariable_1.registerCSSVariable)(val);
                response.push((0, registerCSSVariable_1.variableToCSS)(val));
            }
            else {
                for (var fskey in parsedFont[fkey]) {
                    var fval = parsedFont[fkey][fskey];
                    if (typeof fval === 'string') {
                        // no need to add its a theme reference like "$borderColor"
                    }
                    else {
                        var val = parsedFont[fkey][fskey];
                        (0, registerCSSVariable_1.registerCSSVariable)(val);
                        response.push((0, registerCSSVariable_1.variableToCSS)(val));
                    }
                }
            }
        }
        return response;
    }
    return [];
}

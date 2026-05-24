"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontPropertyDeclarations = getFontPropertyDeclarations;
exports.createTokenCSS = createTokenCSS;
exports.createFontCSS = createFontCSS;
exports.buildCSSRuleSets = buildCSSRuleSets;
exports.createThemeCSS = createThemeCSS;
exports.getCSS = getCSS;
var constants_1 = require("@hanzogui/constants");
var createVariable_1 = require("../createVariable");
var registerCSSVariable_1 = require("./registerCSSVariable");
var getThemeCSSRules_1 = require("./getThemeCSSRules");
var insertStyleRule_1 = require("./insertStyleRule");
// helper to get font property CSS declarations
function getFontPropertyDeclarations(fontParsed, tokenKey) {
    if (tokenKey === void 0) { tokenKey = '$true'; }
    var props = ['font-family: var(--f-family)'];
    var getVarRef = function (obj) {
        var val = obj === null || obj === void 0 ? void 0 : obj[tokenKey];
        if ((0, createVariable_1.isVariable)(val)) {
            return (0, createVariable_1.getVariableVariable)(val);
        }
        return undefined;
    };
    var letterSpacing = getVarRef(fontParsed.letterSpacing);
    if (letterSpacing)
        props.push("letter-spacing: ".concat(letterSpacing));
    var lineHeight = getVarRef(fontParsed.lineHeight);
    if (lineHeight)
        props.push("line-height: ".concat(lineHeight));
    var fontStyle = getVarRef(fontParsed.style);
    if (fontStyle)
        props.push("font-style: ".concat(fontStyle));
    var fontWeight = getVarRef(fontParsed.weight);
    if (fontWeight)
        props.push("font-weight: ".concat(fontWeight));
    return props;
}
/**
 * Generates CSS for tokens - registers CSS variables and builds declaration strings
 */
function createTokenCSS(tokens, shouldTokenCategoryHaveUnits) {
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
        var declarations = [];
        var sortedTokenKeys = Object.keys(tokens).sort();
        for (var _i = 0, sortedTokenKeys_1 = sortedTokenKeys; _i < sortedTokenKeys_1.length; _i++) {
            var key = sortedTokenKeys_1[_i];
            var sortedSubKeys = Object.keys(tokens[key]).sort();
            for (var _a = 0, sortedSubKeys_1 = sortedSubKeys; _a < sortedSubKeys_1.length; _a++) {
                var skey = sortedSubKeys_1[_a];
                var variable = tokens[key][skey];
                if (constants_1.isWeb) {
                    (0, registerCSSVariable_1.registerCSSVariable)(variable);
                    var variableNeedsPx = variable.needsPx === true;
                    var categoryNeedsPx = shouldTokenCategoryHaveUnits(key);
                    var shouldBeUnitless = !(variableNeedsPx || categoryNeedsPx);
                    declarations.push((0, registerCSSVariable_1.variableToCSS)(variable, shouldBeUnitless));
                }
            }
        }
        return declarations;
    }
    return [];
}
/**
 * Generates CSS for fonts
 */
function createFontCSS(fontsParsed, registerFontVariables) {
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
        var fontDeclarations = {};
        if (!fontsParsed)
            return fontDeclarations;
        var sortedFontKeys = Object.keys(fontsParsed).sort();
        for (var _i = 0, sortedFontKeys_1 = sortedFontKeys; _i < sortedFontKeys_1.length; _i++) {
            var key = sortedFontKeys_1[_i];
            var fontParsed = fontsParsed[key];
            var _a = key.includes('_') ? key.split('_') : [key], name_1 = _a[0], language = _a[1];
            var fontVars = registerFontVariables(fontParsed);
            fontDeclarations[key] = {
                name: name_1.slice(1),
                declarations: fontVars,
                language: language,
                fontParsed: fontParsed,
            };
        }
        return fontDeclarations;
    }
    return {};
}
/**
 * Builds CSS rulesets from declarations
 */
function buildCSSRuleSets(declarations, fontDeclarations, defaultFontToken) {
    if (defaultFontToken === void 0) { defaultFontToken = '$true'; }
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
        var cssRuleSets = [];
        var sep_1 = ' ';
        function declarationsToRuleSet(decs, selector) {
            if (selector === void 0) { selector = ''; }
            return ":root".concat(selector, " {").concat(sep_1).concat(__spreadArray([], decs, true).join(";".concat(sep_1)), "\n}");
        }
        // non-font tokens
        if (declarations.length) {
            cssRuleSets.push(declarationsToRuleSet(declarations));
        }
        // fonts - each font_* sets CSS variables
        var fontSelectors = [];
        var sortedFontDeclarationKeys = Object.keys(fontDeclarations).sort();
        for (var _i = 0, sortedFontDeclarationKeys_1 = sortedFontDeclarationKeys; _i < sortedFontDeclarationKeys_1.length; _i++) {
            var key = sortedFontDeclarationKeys_1[_i];
            var _a = fontDeclarations[key], name_2 = _a.name, declarations_1 = _a.declarations, _b = _a.language, language = _b === void 0 ? 'default' : _b;
            var fontSelector = ".font_".concat(name_2);
            fontSelectors.push(fontSelector);
            var langSelector = ":root .t_lang-".concat(name_2, "-").concat(language, " ").concat(fontSelector);
            var selectors = language === 'default' ? " ".concat(fontSelector, ", ").concat(langSelector) : langSelector;
            var specificRuleSet = declarationsToRuleSet(declarations_1, selectors);
            cssRuleSets.push(specificRuleSet);
        }
        // shared rule: all font_* classes + is_View apply font properties
        // this resets fonts on Views like React Native does
        if (fontSelectors.length) {
            var firstFont = fontDeclarations[sortedFontDeclarationKeys[0]];
            if (firstFont === null || firstFont === void 0 ? void 0 : firstFont.fontParsed) {
                var fontProps = getFontPropertyDeclarations(firstFont.fontParsed, defaultFontToken);
                var sharedSelectors = __spreadArray(__spreadArray([], fontSelectors, true), ['.is_View'], false).join(', ');
                cssRuleSets.push("".concat(sharedSelectors, " {").concat(fontProps.join('; '), "}"));
            }
        }
        return cssRuleSets;
    }
    return [];
}
/**
 * Generates theme CSS rules
 */
function createThemeCSS(dedupedThemes, configIn) {
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
        var themeRuleSets = [];
        if (constants_1.isWeb) {
            for (var _i = 0, dedupedThemes_1 = dedupedThemes; _i < dedupedThemes_1.length; _i++) {
                var _a = dedupedThemes_1[_i], names = _a.names, theme = _a.theme;
                var nextRules = (0, getThemeCSSRules_1.getThemeCSSRules)({
                    config: configIn,
                    themeName: names[0],
                    names: names,
                    theme: theme,
                });
                themeRuleSets = __spreadArray(__spreadArray([], themeRuleSets, true), nextRules, true);
            }
        }
        return themeRuleSets;
    }
    return [];
}
/**
 * Gets all generated CSS - design system + runtime styles
 */
function getCSS(themeConfig, opts, lastIndex) {
    if (opts === void 0) { opts = {}; }
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS && process.env.TAMAGUI_TARGET === 'web') {
        var _a = opts.separator, separator = _a === void 0 ? '\n' : _a, sinceLastCall = opts.sinceLastCall, exclude = opts.exclude;
        if (sinceLastCall && lastIndex.value >= 0) {
            var rules = (0, insertStyleRule_1.getAllRules)();
            var newRules = rules.slice(lastIndex.value);
            lastIndex.value = rules.length;
            return newRules.join(separator);
        }
        lastIndex.value = 0;
        var runtimeStyles = (0, insertStyleRule_1.getAllRules)().join(separator);
        if (exclude === 'design-system') {
            return runtimeStyles;
        }
        var themeRules = exclude ? '' : themeConfig.getThemeRulesSets().join(separator);
        // auto-generated vars from theme values not in tokens
        var autoVarCSS = registerCSSVariable_1.autoVariables.length
            ? ":root{".concat(registerCSSVariable_1.autoVariables.map(function (v) { return "--".concat(v.name, ":").concat(v.val); }).join(';'), "}")
            : '';
        // notes:
        // @scope (.is_Text) to (.is_View) - inherit text styles in nested Text without View boundary
        // display: inline breaks css transform styles
        // !important or else random css easily overrides, the prop is absolute (local-first styling)
        var hideScrollBarsCSS = "._hsb-x::-webkit-scrollbar:horizontal { display: none !important; }\n._hsb-y::-webkit-scrollbar:vertical { display: none !important; }\n._hsb-x { scrollbar-width: none !important; }\n._hsb-y { scrollbar-width: none !important; }";
        var pointerEventsCSS = ":root ._pe-boxonly>* {pointer-events:none;}\n:root ._pe-boxnone>* {pointer-events:auto;}";
        var designSystem = "._ovs-contain {overscroll-behavior:contain;}\n.t_unmounted .is_View, .t_unmounted .is_Text { transition: none !important; }\n.is_View { display: flex; align-items: stretch; flex-direction: column; flex-basis: auto; box-sizing: border-box; min-height: 0; min-width: 0; flex-shrink: 0; }\n.is_Text { display: inline; box-sizing: border-box; word-wrap: break-word; white-space: pre-wrap; margin: 0; }\n@scope (.is_Text) to (.is_View) { .is_Text { white-space: inherit; word-wrap: inherit; } }\n._dsp_contents {display:contents;}\n._no_backdrop::backdrop {display: none;}\n.is_Input::selection, .is_TextArea::selection {background-color: var(--selectionColor);}\n.is_Input::placeholder, .is_TextArea::placeholder {color: var(--placeholderColor);}\n".concat(pointerEventsCSS, "\n").concat(hideScrollBarsCSS, "\n").concat(autoVarCSS, "\n").concat(themeConfig.cssRuleSets.join(separator));
        return "".concat(designSystem, "\n").concat(themeRules, "\n").concat(runtimeStyles);
    }
    return '';
}

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
exports.getAllRules = exports.getAllSelectors = void 0;
exports.scanAllSheets = scanAllSheets;
exports.stopAccumulatingRules = stopAccumulatingRules;
exports.updateRules = updateRules;
exports.setNonce = setNonce;
exports.insertStyleRules = insertStyleRules;
exports.shouldInsertStyleRules = shouldInsertStyleRules;
var helpers_1 = require("@hanzogui/helpers");
var createVariable_1 = require("../createVariable");
// only cache hanzogui styles
// TODO merge totalSelectorsInserted and allSelectors?
var scannedCache = new WeakMap();
var totalSelectorsInserted = new Map();
var allSelectors = {};
var allRules = {};
var getAllSelectors = function () { return allSelectors; };
exports.getAllSelectors = getAllSelectors;
var getAllRules = function () {
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
        // Sort by identifier to ensure deterministic CSS output order
        var sortedKeys = Object.keys(allRules).sort();
        return sortedKeys.map(function (key) { return allRules[key]; });
    }
    return [];
};
exports.getAllRules = getAllRules;
// once react 19 onyl supported we can remove most of this
// gets existing ones (client side)
// takes ~0.1ms for a fairly large page
// used now for three things:
//   1. debugging at dev time
//   2. avoid duplicate insert styles at runtime
//   3. used now for merging transforms atomically
// multiple sheets could have the same ids so we have to count
var lastScannedSheets = null;
function scanAllSheets(collectThemes, tokens) {
    if (collectThemes === void 0) { collectThemes = false; }
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
        if (process.env.NODE_ENV === 'test')
            return;
        if (process.env.TAMAGUI_TARGET !== 'web')
            return;
        var themes = void 0;
        var sheets = document.styleSheets || [];
        var prev = lastScannedSheets;
        var current = new Set(sheets);
        for (var _i = 0, current_1 = current; _i < current_1.length; _i++) {
            var sheet_1 = current_1[_i];
            if (sheet_1) {
                var out = updateSheetStyles(sheet_1, false, collectThemes, tokens);
                if (out) {
                    themes = out;
                }
            }
        }
        lastScannedSheets = current;
        if (prev) {
            for (var _a = 0, prev_1 = prev; _a < prev_1.length; _a++) {
                var sheet_2 = prev_1[_a];
                if (sheet_2 && !current.has(sheet_2)) {
                    updateSheetStyles(sheet_2, true);
                }
            }
        }
        return themes;
    }
}
function trackInsertedStyle(id) {
    var next = (totalSelectorsInserted.get(id) || 0) + 1;
    totalSelectorsInserted.set(id, next);
    return next;
}
var bailAfterEnv = process.env.TAMAGUI_BAIL_AFTER_SCANNING_X_CSS_RULES;
var bailAfter = bailAfterEnv ? +bailAfterEnv : 8000;
function updateSheetStyles(sheet, remove, collectThemes, tokens) {
    var _a, _b;
    if (remove === void 0) { remove = false; }
    if (collectThemes === void 0) { collectThemes = false; }
    // avoid errors on cross origin sheets
    // https://stackoverflow.com/questions/49993633/uncaught-domexception-failed-to-read-the-cssrules-property
    var rules;
    try {
        rules = sheet.cssRules;
        if (!rules) {
            return;
        }
    }
    catch (_c) {
        return;
    }
    var firstSelector = (_a = getHanzoguiSelector(rules[0], collectThemes)) === null || _a === void 0 ? void 0 : _a[0];
    var lastSelector = (_b = getHanzoguiSelector(rules[rules.length - 1], collectThemes)) === null || _b === void 0 ? void 0 : _b[0];
    var cacheKey = "".concat(rules.length).concat(firstSelector).concat(lastSelector);
    var lastScanned = scannedCache.get(sheet);
    if (!remove) {
        // avoid re-scanning
        if (lastScanned === cacheKey) {
            return;
        }
    }
    var len = rules.length;
    var fails = 0;
    var dedupedThemes;
    // because end-users can add their own css like .t_dark { --something: #000 }
    // and this actually entirely breaks scanning, we need to ensure we can handle multiple
    // themes, so track that here. also, css processing utils could cause this too
    var nameToTheme = {};
    for (var i = 0; i < len; i++) {
        var rule = rules[i];
        if (!(rule instanceof CSSStyleRule))
            continue;
        var response = getHanzoguiSelector(rule, collectThemes);
        if (response) {
            // reset to 0 on any success as eg every other theme scan we get empty
            fails = 0;
        }
        else {
            fails++;
            if (fails > bailAfter) {
                // conservatively bail out of non-hanzogui sheets
                return;
            }
            continue;
        }
        var identifier = response[0], cssRule = response[1], isTheme = response[2];
        if (isTheme) {
            var deduped = addThemesFromCSS(cssRule, tokens);
            if (deduped) {
                var _loop_1 = function (name_1) {
                    if (nameToTheme[name_1]) {
                        Object.apply(nameToTheme[name_1], deduped.theme);
                        deduped.names = deduped.names.filter(function (x) { return x !== name_1; });
                    }
                    else {
                        nameToTheme[name_1] = deduped.theme;
                    }
                };
                for (var _i = 0, _d = deduped.names; _i < _d.length; _i++) {
                    var name_1 = _d[_i];
                    _loop_1(name_1);
                }
                dedupedThemes || (dedupedThemes = []);
                dedupedThemes.push(deduped);
            }
            continue;
        }
    }
    scannedCache.set(sheet, cacheKey);
    return dedupedThemes;
}
var colorVarToVal;
var rootComputedStyle = null;
function addThemesFromCSS(cssStyleRule, tokens) {
    var selectors = cssStyleRule.selectorText.split(',');
    if (!selectors.length)
        return;
    if ((tokens === null || tokens === void 0 ? void 0 : tokens.color) && !colorVarToVal) {
        colorVarToVal = {};
        for (var key in tokens.color) {
            var token = tokens.color[key];
            if (token) {
                colorVarToVal[token.name] = token.val;
            }
        }
    }
    var rulesWithBraces = (cssStyleRule.cssText || '').slice(cssStyleRule.selectorText.length + 2, -1);
    var rules = rulesWithBraces.split(';');
    // get theme object parsed
    var values = {};
    // build values first
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var rule = rules_1[_i];
        var sepI = rule.indexOf(':');
        if (sepI === -1)
            continue;
        var varIndex = rule.indexOf('--');
        var key = rule.slice(varIndex === -1 ? 0 : varIndex + 2, sepI);
        if (process.env.TAMAGUI_CSS_VARIABLE_PREFIX) {
            key = key.replace(process.env.TAMAGUI_CSS_VARIABLE_PREFIX, '');
        }
        var val = rule.slice(sepI + 2);
        var value = void 0;
        if (val[0] === 'v' && val.startsWith('var(')) {
            // var()
            var varName = val.slice(6, -1);
            var tokenVal = colorVarToVal === null || colorVarToVal === void 0 ? void 0 : colorVarToVal[varName];
            // either hydrate it from tokens directly or from computed style on body if no token
            if (tokenVal) {
                value = tokenVal;
            }
            else {
                rootComputedStyle || (rootComputedStyle = getComputedStyle(document.body));
                value = rootComputedStyle.getPropertyValue('--' + varName);
            }
        }
        else {
            value = val;
        }
        values[key] = (0, createVariable_1.createVariable)({
            key: key,
            name: key,
            val: value,
        }, true);
    }
    var names = new Set();
    // loop selectors and build deduped
    for (var _a = 0, selectors_1 = selectors; _a < selectors_1.length; _a++) {
        var selector = selectors_1[_a];
        if (selector === ' .tm_xxt')
            continue;
        var lastThemeSelectorIndex = selector.lastIndexOf('.t_');
        var name_2 = selector.slice(lastThemeSelectorIndex).slice(3);
        var schemeChar = selector[lastThemeSelectorIndex - 5][0];
        var scheme = schemeChar === 'd' ? 'dark' : schemeChar === 'i' ? 'light' : '';
        var themeName = scheme && scheme !== name_2 ? "".concat(scheme, "_").concat(name_2) : name_2;
        if (!themeName || themeName === 'light_dark' || themeName === 'dark_light') {
            continue;
        }
        names.add(themeName);
    }
    return {
        names: __spreadArray([], names, true),
        theme: values,
    };
}
var hanzoguiSelectorRegex = /\.tm_xxt/;
function getHanzoguiSelector(rule, collectThemes) {
    if (collectThemes === void 0) { collectThemes = false; }
    if (rule instanceof CSSStyleRule) {
        var text = rule.selectorText;
        // only matches t_ starting selector chains
        if (text[0] === ':' && text[1] === 'r' && hanzoguiSelectorRegex.test(text)) {
            var id = getIdentifierFromHanzoguiSelector(
            // next.js minifies it so its in front
            text.replace(hanzoguiSelectorRegex, ''));
            return collectThemes ? [id, rule, true] : [id, rule];
        }
    }
    else if (rule instanceof CSSMediaRule) {
        // hanzogui only ever inserts 1 rule per media
        if (rule.cssRules.length > 1)
            return;
        return getHanzoguiSelector(rule.cssRules[0]);
    }
}
var getIdentifierFromHanzoguiSelector = function (selector) {
    var dotIndex = selector.indexOf(':');
    if (dotIndex > -1) {
        return selector.slice(7, dotIndex);
    }
    return selector.slice(7);
};
var sheet = null;
var trackAllRules = true;
function stopAccumulatingRules() {
    trackAllRules = false;
}
function updateRules(identifier, rules) {
    if (trackAllRules) {
        allRules[identifier] = rules.join(' ');
    }
    return true;
}
var nonce = '';
function setNonce(_) {
    nonce = _;
}
function insertStyleRules(rulesToInsert) {
    if (process.env.TAMAGUI_TARGET !== 'web')
        return;
    if (!sheet && document.head) {
        var styleTag = document.createElement('style');
        styleTag.id = '_hanzogui-styles';
        if (nonce) {
            styleTag.nonce = nonce;
        }
        sheet = document.head.appendChild(styleTag).sheet;
    }
    if (!sheet)
        return;
    for (var key in rulesToInsert) {
        var styleObject = rulesToInsert[key];
        var identifier = styleObject[helpers_1.StyleObjectIdentifier];
        if (!shouldInsertStyleRules(identifier)) {
            continue;
        }
        var rules = styleObject[helpers_1.StyleObjectRules];
        allSelectors[identifier] = rules.join('\n');
        trackInsertedStyle(identifier);
        updateRules(identifier, rules);
        try {
            for (var _i = 0, rules_2 = rules; _i < rules_2.length; _i++) {
                var rule = rules_2[_i];
                sheet.insertRule(rule, sheet.cssRules.length);
            }
        }
        catch (err) {
            if (process.env.NODE_ENV === 'production') {
                console.error("Error inserting style rule", rules);
            }
            // in dev throw to show error clearly
        }
    }
}
// The way browser or next.js work you end up with CSS being removed *after* the new CSS loads for the upcoming page
// this causes many bugs. We defaulted to "2" here for safety, meaning we sacrificed some performance
// setting TAMAGUI_INSERT_SELECTOR_TRIES=1 will be faster so long as you are concatting your CSS together
var maxToInsert = process.env.TAMAGUI_INSERT_SELECTOR_TRIES
    ? +process.env.TAMAGUI_INSERT_SELECTOR_TRIES
    : 1;
function shouldInsertStyleRules(identifier) {
    if (process.env.IS_STATIC === 'is_static') {
        return true;
    }
    var total = totalSelectorsInserted.get(identifier) || 0;
    if (process.env.NODE_ENV === 'development') {
        if (total > +(process.env.TAMAGUI_STYLE_INSERTION_WARNING_LIMIT || 10)) {
            console.warn("Warning: inserting many CSS rules, you may be animating something and generating many CSS insertions, which can degrade performance. Instead, try using the \"disableClassName\" property on elements that change styles often. To disable this warning set TAMAGUI_STYLE_INSERTION_WARNING_LIMIT from 50000 to something higher");
        }
    }
    // note we are being conservative allowing duplicates
    return total < maxToInsert;
}

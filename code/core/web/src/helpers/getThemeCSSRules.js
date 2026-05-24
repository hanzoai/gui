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
exports.getThemeCSSRules = getThemeCSSRules;
var helpers_1 = require("@hanzogui/helpers");
var config_1 = require("../config");
var constants_1 = require("../constants/constants");
var createVariable_1 = require("../createVariable");
var registerCSSVariable_1 = require("./registerCSSVariable");
var sortString_1 = require("./sortString");
var darkLight = ['dark', 'light'];
var lightDark = ['light', 'dark'];
function getThemeCSSRules(props) {
    var _a;
    if (process.env.TAMAGUI_DID_OUTPUT_CSS) {
        // empty - CSS already extracted at build time
    }
    else if (process.env.TAMAGUI_TARGET === 'native') {
        // no CSS on native
    }
    else if (!process.env.TAMAGUI_DOES_SSR_CSS ||
        process.env.TAMAGUI_DOES_SSR_CSS === 'mutates-themes' ||
        process.env.TAMAGUI_DOES_SSR_CSS === 'false') {
        var cssRuleSets = [];
        var config = props.config, themeName = props.themeName, theme = props.theme, names = props.names;
        // special case for SSR
        var hasDarkLight = (_a = props.hasDarkLight) !== null && _a !== void 0 ? _a : (config.themes && ('light' in config.themes || 'dark' in config.themes));
        var CNP_1 = ".".concat(constants_1.THEME_CLASSNAME_PREFIX);
        var vars = '';
        var variableCreator = props.useMutatedVariables
            ? registerCSSVariable_1.getOrCreateMutatedVariable
            : registerCSSVariable_1.getOrCreateVariable;
        for (var themeKey in theme) {
            var variable = theme[themeKey];
            var value = variableCreator(variable.val).variable;
            // Hash themeKey in case it has invalid chars too
            vars += "--".concat(process.env.TAMAGUI_CSS_VARIABLE_PREFIX || '').concat((0, helpers_1.simpleHash)(themeKey, 40), ":").concat(value, ";");
        }
        var isDarkBase = themeName === 'dark';
        var isLightBase = themeName === 'light';
        var baseSelectors = names.map(function (name) { return "".concat(CNP_1).concat(name); });
        var selectorsSet = new Set(isDarkBase || isLightBase ? baseSelectors : []);
        // since we dont specify dark/light in classnames we have to do an awkward specificity war
        // hardcoded to support 2 levels of nesting (e.g. light > dark or dark > light)
        if (hasDarkLight) {
            var maxDepth = 2;
            var _loop_1 = function (subName) {
                var isDark = isDarkBase || subName.startsWith('dark_');
                var isLight = !isDark && (isLightBase || subName.startsWith('light_'));
                if (!(isDark || isLight)) {
                    // neither light nor dark subtheme, just generate one selector with :root:root which
                    // will override all :root light/dark selectors generated below
                    selectorsSet.add("".concat(CNP_1).concat(subName));
                    return "continue";
                }
                var childSelector = "".concat(CNP_1).concat(subName.replace(/^(dark|light)_/, ''));
                var order = isDark ? darkLight : lightDark;
                var stronger = order[0], weaker = order[1];
                var numSelectors = Math.round(maxDepth * 1.5);
                for (var depth = 0; depth < numSelectors; depth++) {
                    var isOdd = depth % 2 === 1;
                    if (isOdd && depth < 3) {
                        continue;
                    }
                    var parents = new Array(depth + 1).fill(0).map(function (_, idx) {
                        return "".concat(CNP_1).concat(idx % 2 === 0 ? stronger : weaker);
                    });
                    var parentSelectors = parents.length > 1 ? parents.slice(1) : parents;
                    if (isOdd) {
                        var _first = parentSelectors[0], second = parentSelectors[1], rest = parentSelectors.slice(2);
                        parentSelectors = __spreadArray(__spreadArray([second], rest, true), [second], false);
                    }
                    var lastParentSelector = parentSelectors[parentSelectors.length - 1];
                    var nextChildSelector = childSelector === lastParentSelector ? '' : childSelector;
                    // for light/dark/light:
                    var parentSelectorString = parentSelectors.join(' ');
                    selectorsSet.add("".concat(parentSelectorString, " ").concat(nextChildSelector));
                }
            };
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var subName = names_1[_i];
                _loop_1(subName);
            }
        }
        var selectors = __spreadArray([], selectorsSet, true).sort(sortString_1.sortString);
        // only do our :root attach if it's not light/dark - not support sub themes on root saves a lot of effort/size
        var selectorsString = selectors
            .map(function (x) {
            var addTo = (0, config_1.getSetting)('addThemeClassName');
            var isOnRoot = isBaseTheme(x) && (addTo === 'html' || addTo === 'body');
            if (!isOnRoot)
                return ":root ".concat(x);
            return "".concat(addTo === 'body' ? 'body' : ':root').concat(x);
        })
            .join(', ') + ", .tm_xxt";
        var css = "".concat(selectorsString, " {").concat(vars, "}");
        cssRuleSets.push(css);
        if ((0, config_1.getSetting)('shouldAddPrefersColorThemes')) {
            var isDark_1 = themeName.startsWith('dark');
            var baseName = isDark_1 ? 'dark' : 'light';
            var lessSpecificSelectors = selectors
                .map(function (x) {
                if (x == darkSelector || x === lightSelector)
                    return ":root";
                if ((isDark_1 && x.startsWith(lightSelector)) ||
                    (!isDark_1 && x.startsWith(darkSelector))) {
                    return;
                }
                return x.replace(/^\.t_(dark|light) /, '').trim();
            })
                .filter(Boolean)
                .join(', ');
            // only emit body background/color for base themes, not every sub-theme
            var isBase = !themeName.includes('_');
            var bodyRulesString = '';
            if (isBase) {
                var bgString = theme.background
                    ? "background:".concat((0, createVariable_1.variableToString)(theme.background), ";")
                    : '';
                var fgString = theme.color ? "color:".concat((0, createVariable_1.variableToString)(theme.color)) : '';
                bodyRulesString = bgString || fgString ? "body{".concat(bgString).concat(fgString, "}\n    ") : '';
            }
            var themeRules = "".concat(lessSpecificSelectors, " {").concat(vars, "}");
            var prefersMediaSelectors = "@media(prefers-color-scheme:".concat(baseName, "){\n    ").concat(bodyRulesString).concat(themeRules, "\n  }");
            cssRuleSets.push(prefersMediaSelectors);
        }
        var selectionStyles = (0, config_1.getSetting)('selectionStyles');
        if (selectionStyles) {
            var rules = selectionStyles(theme);
            if (rules) {
                var selectionSelectors = baseSelectors.map(function (s) { return "".concat(s, " ::selection"); }).join(', ');
                var styles = Object.entries(rules)
                    .flatMap(function (_a) {
                    var k = _a[0], v = _a[1];
                    return v
                        ? "".concat(k === 'backgroundColor' ? 'background' : k, ":").concat((0, createVariable_1.variableToString)(v))
                        : [];
                })
                    .join(';');
                if (styles) {
                    var css_1 = "".concat(selectionSelectors, "{").concat(styles, "}");
                    cssRuleSets.push(css_1);
                }
            }
        }
        return cssRuleSets;
    }
    return [];
}
var darkSelector = '.t_dark';
var lightSelector = '.t_light';
var isBaseTheme = function (x) {
    return x === darkSelector ||
        x === lightSelector ||
        x.startsWith('.t_dark ') ||
        x.startsWith('.t_light ');
};

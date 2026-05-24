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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeBuilder = void 0;
exports.createThemeBuilder = createThemeBuilder;
var create_theme_1 = require("@hanzogui/create-theme");
var ThemeBuilder = /** @class */ (function () {
    function ThemeBuilder(state) {
        this.state = state;
        // for dev mode only really
        this._addedThemes = [];
    }
    ThemeBuilder.prototype.addPalettes = function (palettes) {
        this.state.palettes = __assign(__assign({}, this.state.palettes), palettes);
        return this;
    };
    ThemeBuilder.prototype.addTemplates = function (templates) {
        this.state.templates = __assign(__assign({}, this.state.templates), templates);
        return this;
    };
    ThemeBuilder.prototype.addMasks = function (masks) {
        this.state.masks = __assign(__assign({}, this.state.masks), (0, create_theme_1.objectFromEntries)((0, create_theme_1.objectEntries)(masks).map(function (_a) {
            var key = _a[0], val = _a[1];
            return [key, (0, create_theme_1.createMask)(val)];
        })));
        return this;
    };
    ThemeBuilder.prototype.addThemes = function (themes) {
        this._addedThemes.push({ type: 'themes', args: [themes] });
        this.state.themes = __assign(__assign({}, this.state.themes), themes);
        // type TemplateToTheme<X> = State['templates'] extends {}
        //   ? X extends { template: infer Y; nonInheritedValues: infer Z }
        //     ? Y extends keyof State['templates']
        //       ? { theme: Record<keyof State['templates'][Y] | keyof Z, string> }
        //       : X
        //     : X
        //   : X
        return this;
    };
    // these wont be typed to save some complexity and because they don't need to be typed!
    ThemeBuilder.prototype.addComponentThemes = function (childThemeDefinition, options) {
        void this.addChildThemes(childThemeDefinition, options);
        return this;
    };
    ThemeBuilder.prototype.addChildThemes = function (childThemeDefinition, options) {
        var currentThemes = this.state.themes;
        if (!currentThemes) {
            throw new Error("No themes defined yet, use addThemes first to set your base themes");
        }
        this._addedThemes.push({ type: 'childThemes', args: [childThemeDefinition, options] });
        var currentThemeNames = Object.keys(currentThemes);
        var incomingThemeNames = Object.keys(childThemeDefinition);
        var namesWithDefinitions = currentThemeNames.flatMap(function (prefix) {
            var avoidNestingWithin = options === null || options === void 0 ? void 0 : options.avoidNestingWithin;
            if (avoidNestingWithin) {
                if (avoidNestingWithin.some(function (avoidName) { return prefix.startsWith(avoidName) || prefix.endsWith(avoidName); })) {
                    return [];
                }
            }
            return incomingThemeNames
                .map(function (subName) {
                var fullName = "".concat(prefix, "_").concat(subName);
                var definition = childThemeDefinition[subName];
                if ('avoidNestingWithin' in definition) {
                    var avoidNest = definition.avoidNestingWithin;
                    if (avoidNest.some(function (name) {
                        // For base scheme names (light/dark), use exact match to avoid matching derivatives
                        if ((name === 'light' || name === 'dark') && prefix.includes('_')) {
                            return false;
                        }
                        return prefix.startsWith(name) || prefix.endsWith(name);
                    })) {
                        return null;
                    }
                }
                // Avoid double-nesting: don't add a child theme to a parent that already ends with that child
                // e.g., don't create light_blue_accent_accent from light_blue_accent + accent
                if (prefix.endsWith("_".concat(subName))) {
                    return null;
                }
                // Don't overwrite existing themes (e.g., a grandchild "accent" template
                // should not overwrite a dedicated "accent" child theme with its own palette)
                if (fullName in currentThemes) {
                    return null;
                }
                return [fullName, definition];
            })
                .filter(Boolean);
        });
        var childThemes = Object.fromEntries(namesWithDefinitions);
        var next = __assign(__assign({}, this.state.themes), childThemes);
        // @ts-ignore
        this.state.themes = next;
        return this;
    };
    ThemeBuilder.prototype.getTheme = function (fn) {
        this._getThemeFn = fn;
        return this;
    };
    ThemeBuilder.prototype.build = function () {
        var _a, _b, _c, _d, _e;
        if (!this.state.themes) {
            return {};
        }
        var out = {};
        var maskedThemes = [];
        var _loop_1 = function (themeName) {
            var nameParts = themeName.split('_');
            var parentName = nameParts.slice(0, nameParts.length - 1).join('_');
            var definitions = this_1.state.themes[themeName];
            var themeDefinition = Array.isArray(definitions)
                ? (function () {
                    var found = definitions.find(
                    // endWith match stronger than startsWith
                    function (d) {
                        return d.parent
                            ? parentName.endsWith(d.parent) || parentName.startsWith(d.parent)
                            : true;
                    });
                    if (!found) {
                        return null;
                    }
                    return found;
                })()
                : definitions;
            if (!themeDefinition) {
                return "continue";
            }
            if ('theme' in themeDefinition) {
                out[themeName] = themeDefinition.theme;
            }
            else if ('mask' in themeDefinition) {
                maskedThemes.push({ parentName: parentName, themeName: themeName, mask: themeDefinition });
            }
            else {
                var _h = themeDefinition.palette, paletteName = _h === void 0 ? '' : _h, templateName = themeDefinition.template, options = __rest(themeDefinition, ["palette", "template"]);
                var parentDefinition = this_1.state.themes[parentName];
                if (!this_1.state.palettes) {
                    throw new Error("No palettes defined for theme with palette expected: ".concat(themeName));
                }
                var palette = this_1.state.palettes[paletteName || ''];
                var attemptParentName = "".concat(parentName, "_").concat(paletteName);
                while (!palette && attemptParentName) {
                    if (attemptParentName in this_1.state.palettes) {
                        palette = this_1.state.palettes[attemptParentName];
                        paletteName = attemptParentName;
                    }
                    else {
                        attemptParentName = attemptParentName.split('_').slice(0, -1).join('_');
                    }
                }
                if (!palette) {
                    var msg = process.env.NODE_ENV !== 'production'
                        ? ": ".concat(themeName, ": ").concat(paletteName, "\n          Definition: ").concat(JSON.stringify(themeDefinition), "\n          Parent: ").concat(JSON.stringify(parentDefinition), "\n          Potential: (").concat(Object.keys(this_1.state.palettes).join(', '), ")")
                        : "";
                    throw new Error("No palette for theme".concat(msg));
                }
                var template = (_b = (_a = this_1.state.templates) === null || _a === void 0 ? void 0 : _a[templateName]) !== null && _b !== void 0 ? _b : 
                // fall back to finding the scheme specific on if it exists
                (_c = this_1.state.templates) === null || _c === void 0 ? void 0 : _c["".concat(nameParts[0], "_").concat(templateName)];
                if (!template) {
                    throw new Error("No template for theme ".concat(themeName, ": ").concat(templateName, " in templates:\n- ").concat(Object.keys(this_1.state.templates || {}).join('\n - ')));
                }
                var theme = (0, create_theme_1.createThemeWithPalettes)(this_1.state.palettes, paletteName, template, options, themeName, true);
                out[themeName] = this_1._getThemeFn
                    ? __assign(__assign({}, theme), this_1._getThemeFn({
                        theme: theme,
                        name: themeName,
                        level: nameParts.length,
                        parentName: parentName,
                        scheme: /^(light|dark)$/.test(nameParts[0])
                            ? nameParts[0]
                            : undefined,
                        parentNames: nameParts.slice(0, -1),
                        palette: palette,
                        template: template,
                    })) : theme;
            }
        };
        var this_1 = this;
        for (var themeName in this.state.themes) {
            _loop_1(themeName);
        }
        for (var _i = 0, maskedThemes_1 = maskedThemes; _i < maskedThemes_1.length; _i++) {
            var _f = maskedThemes_1[_i], mask = _f.mask, themeName = _f.themeName, parentName = _f.parentName;
            var parent_1 = out[parentName];
            if (!parent_1) {
                // `No parent theme found with name ${parentName} for theme ${themeName} to use as a mask target - Continuing...`
                continue;
            }
            var maskName = mask.mask, options = __rest(mask, ["mask"]);
            var maskFunction = (_d = this.state.masks) === null || _d === void 0 ? void 0 : _d[maskName];
            if (!maskFunction) {
                throw new Error("No mask ".concat(maskName));
            }
            var parentTheme = this.state.themes[parentName];
            if (parentTheme && 'childOptions' in parentTheme) {
                var _g = parentTheme.childOptions, mask_1 = _g.mask, childOpts = __rest(_g, ["mask"]);
                if (mask_1) {
                    maskFunction = (_e = this.state.masks) === null || _e === void 0 ? void 0 : _e[mask_1];
                }
                Object.assign(options, childOpts);
            }
            out[themeName] = (0, create_theme_1.applyMask)(parent_1, maskFunction, options, parentName, themeName);
        }
        return out;
    };
    return ThemeBuilder;
}());
exports.ThemeBuilder = ThemeBuilder;
function createThemeBuilder() {
    return new ThemeBuilder({});
}
// // test types
// let x = createThemeBuilder()
//   .addMasks({
//     test: {
//       name: 'mask',
//       mask: (() => {}) as any,
//     },
//   })
//   .addThemes({
//     light: {
//       template: '',
//       palette: '',
//     },
//     dark: {
//       mask: 'test',
//     },
//   })
//   .addChildThemes({
//     List: [
//       {
//         parent: '',
//         mask: 'test',
//       },
//     ],
//   })
// x
// x.state.themes
// x.state.masks
// let y = x.addChildThemes({
//   blue: {
//     mask: 'ok',
//   },
// })

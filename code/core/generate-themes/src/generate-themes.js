"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.generateThemes = generateThemes;
var node_path_1 = require("node:path");
var didRegisterOnce = false;
function generateThemes(inputFile) {
    return __awaiter(this, void 0, void 0, function () {
        var inputFilePath, og, requiredThemes, themes, generatedThemes;
        return __generator(this, function (_a) {
            inputFilePath = inputFile[0] === '.' ? (0, node_path_1.join)(process.cwd(), inputFile) : inputFile;
            if (!didRegisterOnce) {
                didRegisterOnce = true;
                // the unregsiter does basically nothing and keeps a process running
                require('esbuild-register/dist/node').register({
                    hookIgnoreNodeModules: false,
                });
            }
            else {
                purgeCache(inputFilePath);
            }
            og = process.env.TAMAGUI_KEEP_THEMES;
            process.env.TAMAGUI_KEEP_THEMES = '1';
            process.env.TAMAGUI_RUN_THEMEBUILDER = '1';
            try {
                requiredThemes = require(inputFilePath);
                themes = requiredThemes['default'] ||
                    requiredThemes['themes'] ||
                    requiredThemes[Object.keys(requiredThemes)[0]];
                generatedThemes = generatedThemesToTypescript(themes);
                return [2 /*return*/, {
                        generated: generatedThemes,
                    }];
            }
            catch (err) {
                console.warn(" \u26A0\uFE0F Error running theme builder:\n", (err === null || err === void 0 ? void 0 : err['stack']) || err);
            }
            finally {
                process.env.TAMAGUI_KEEP_THEMES = og;
            }
            return [2 /*return*/];
        });
    });
}
/**
 * value -> name of variable
 */
var dedupedTokens = new Map();
function generatedThemesToTypescript(themes) {
    var dedupedThemes = new Map();
    var dedupedThemeToNames = new Map();
    var i = 0;
    for (var name_1 in themes) {
        i++;
        var theme = themes[name_1];
        // go through all tokens in current theme and add the new values to dedupedTokens map
        var j = 0;
        for (var _i = 0, _a = Object.entries(theme); _i < _a.length; _i++) {
            var _b = _a[_i], key_1 = _b[0], value = _b[1];
            i++;
            var uniqueKey = "t".concat(i).concat(j);
            if (!dedupedTokens.has(value)) {
                dedupedTokens.set(value, uniqueKey);
            }
        }
        var key = JSON.stringify(theme);
        if (dedupedThemes.has(key)) {
            dedupedThemeToNames.set(key, __spreadArray(__spreadArray([], dedupedThemeToNames.get(key), true), [name_1], false));
        }
        else {
            dedupedThemes.set(key, theme);
            dedupedThemeToNames.set(key, [name_1]);
        }
    }
    if (!themes) {
        throw new Error("Didn't find any themes exported or returned");
    }
    var baseKeys = Object.entries(themes.light || themes[Object.keys(themes)[0]]);
    var baseTypeString = "export type Theme = {\n".concat(baseKeys
        .map(function (_a) {
        var k = _a[0];
        return "  ".concat(k, ": string;\n");
    })
        .join(''), "\n}");
    var out = "".concat(baseTypeString, "\n");
    // add in the helper function to generate a theme:
    out += "\nfunction t(a: [number, number][]) {\n  let res: Record<string,string> = {}\n  for (const [ki, vi] of a) {\n    res[ks[ki] as string] = colors[vi] as string\n  }\n  return res as Theme\n}\n";
    // add all token variables
    out += "export const colors = [\n";
    var index = 0;
    var valueToIndex = {};
    dedupedTokens.forEach(function (name, value) {
        valueToIndex[value] = index;
        index++;
        out += "  '".concat(value, "',\n");
    });
    out += ']\n\n';
    // add all keys array
    var keys = baseKeys.map(function (_a) {
        var k = _a[0];
        return k;
    });
    out += "const ks = [\n";
    out += keys.map(function (k) { return "'".concat(k, "'"); }).join(',\n');
    out += "]\n\n";
    // add all themes
    var nameI = 0;
    var themeTypes = "export type ThemeNames =";
    var exported = "export type Themes = Record<ThemeNames, Theme>\n\nexport const themes: Themes = {";
    dedupedThemes.forEach(function (theme) {
        nameI++;
        var key = JSON.stringify(theme);
        var names = dedupedThemeToNames.get(key);
        var name = "n".concat(nameI);
        var baseTheme = "const ".concat(name, " = ").concat(objectToJsString(theme, keys, valueToIndex));
        out += "\n".concat(baseTheme);
        names.forEach(function (n) {
            exported += "\n  ".concat(n, ": ").concat(name, ",");
            if (n.toLowerCase() === n) {
                themeTypes += "\n | '".concat(n, "'");
            }
        });
    });
    out += "\n\n".concat(themeTypes, "\n\n").concat(exported, "\n}\n");
    return out;
}
function objectToJsString(obj, keys, valueToIndex) {
    var arrItems = [];
    for (var key in obj) {
        var ki = keys.indexOf(key);
        var vi = valueToIndex[obj[key]];
        arrItems.push("[".concat(ki, ", ").concat(vi, "]"));
    }
    return "t([".concat(arrItems.join(','), "])");
}
/**
 * Removes a module from the cache
 */
function purgeCache(moduleName) {
    // Traverse the cache looking for the files
    // loaded by the specified module name
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });
    // @ts-ignore
    if (!module.constructor || !module.constructor._pathCache) {
        // bun doesn't have this
        return;
    }
    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
    // @ts-ignore
    Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
        if (cacheKey.indexOf(moduleName) > 0) {
            // @ts-ignore
            delete module.constructor._pathCache[cacheKey];
        }
    });
}
/**
 * Traverses the cache to search for all the cached
 * files of the specified module name
 */
function searchCache(moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);
    // Check if the module has been resolved and found within
    // the cache
    // @ts-ignore
    if (mod && (mod = require.cache[mod]) !== undefined) {
        // Recursively go over the results
        ;
        (function traverse(mod, depth) {
            if (depth === void 0) { depth = 0; }
            // avoid recursing too much
            if (depth > 10)
                return;
            // Go over each of the module's children and
            // traverse them
            // @ts-ignore
            mod.children.forEach(function (child) {
                traverse(child, depth + 1);
            });
            // Call the specified callback providing the
            // found cached module
            callback(mod);
        })(mod);
    }
}

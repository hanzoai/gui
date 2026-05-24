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
exports.generatePrompt = generatePrompt;
var node_path_1 = require("node:path");
var FS = require("fs-extra");
function generatePrompt(options) {
    return __awaiter(this, void 0, void 0, function () {
        var paths, output, loadHanzogui, configPath, config, markdown, outputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paths = options.paths, output = options.output;
                    loadHanzogui = require('@hanzogui/static/loadHanzogui').loadHanzogui;
                    process.env.TAMAGUI_KEEP_THEMES = '1';
                    return [4 /*yield*/, loadHanzogui(__assign(__assign({}, options.hanzoguiOptions), { platform: 'web' }))
                        // Read the generated config
                    ];
                case 1:
                    _a.sent();
                    configPath = (0, node_path_1.join)(paths.dotDir, 'hanzogui.config.json');
                    if (!FS.existsSync(configPath)) {
                        throw new Error("Config file not found at ".concat(configPath, ". Please run 'hanzogui generate' first."));
                    }
                    return [4 /*yield*/, FS.readJSON(configPath)
                        // Generate markdown
                    ];
                case 2:
                    config = _a.sent();
                    markdown = generateMarkdown(config);
                    outputPath = output || (0, node_path_1.join)(process.cwd(), 'hanzogui-prompt.md');
                    return [4 /*yield*/, FS.writeFile(outputPath, markdown, 'utf-8')];
                case 3:
                    _a.sent();
                    console.info("\n  \u2713 Generated prompt file at ".concat(outputPath, "\n"));
                    return [2 /*return*/];
            }
        });
    });
}
function generateMarkdown(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var sections = [];
    // Header
    sections.push('# Hanzogui Configuration\n\n');
    sections.push('This document provides an overview of the Hanzogui configuration for this project.\n\n');
    // Get shorthands for use throughout the document
    var shorthands = ((_a = config.hanzoguiConfig) === null || _a === void 0 ? void 0 : _a.shorthands) || {};
    var reverseShorthands = {};
    for (var _i = 0, _k = Object.entries(shorthands); _i < _k.length; _i++) {
        var _l = _k[_i], short = _l[0], full = _l[1];
        reverseShorthands[full] = short;
    }
    // Helper function to get the correct property name based on settings
    var getPropName = function (fullProp) {
        var _a;
        var settings = ((_a = config.hanzoguiConfig) === null || _a === void 0 ? void 0 : _a.settings) || {};
        if (settings.onlyAllowShorthands && reverseShorthands[fullProp]) {
            return reverseShorthands[fullProp];
        }
        return fullProp;
    };
    // Settings (moved to top)
    var settings = ((_b = config.hanzoguiConfig) === null || _b === void 0 ? void 0 : _b.settings) || {};
    if (Object.keys(settings).length > 0) {
        sections.push('## Configuration Settings\n\n');
        sections.push('**IMPORTANT:** These settings affect how you write Hanzogui code in this project.\n\n');
        if (settings.defaultFont) {
            sections.push("### Default Font: `".concat(settings.defaultFont, "`\n\n"));
            sections.push("All text components will use the \"".concat(settings.defaultFont, "\" font family by default.\n\n"));
        }
        if (settings.onlyAllowShorthands !== undefined) {
            sections.push("### Only Allow Shorthands: `".concat(settings.onlyAllowShorthands, "`\n\n"));
            if (settings.onlyAllowShorthands) {
                sections.push('**You MUST use shorthand properties in this project.**\n\n');
                sections.push('Full property names are not allowed. For example:\n');
                sections.push('- ✅ `<View w="$10" />` (correct)\n');
                sections.push('- ❌ `<View width="$10" />` (will error)\n\n');
                sections.push('See the Shorthand Properties section below for all available shorthands.\n\n');
            }
            else {
                sections.push('You can use either shorthand or full property names.\n\n');
            }
        }
        if (settings.themeClassNameOnRoot !== undefined) {
            sections.push("### Theme Class Name on Root: `".concat(settings.themeClassNameOnRoot, "`\n\n"));
            if (settings.themeClassNameOnRoot) {
                sections.push('Theme classes are applied to the root HTML element.\n\n');
            }
        }
        // Check for platform-specific settings
        var platform = settings.platform || ((_c = settings.defaultProps) === null || _c === void 0 ? void 0 : _c.platform);
        if (platform) {
            sections.push("### Platform Mode: `".concat(platform, "`\n\n"));
            if (platform === 'web') {
                sections.push('This project is configured for **web only**.\n\n');
            }
            else if (platform === 'native') {
                sections.push('This project is configured for **React Native only**.\n\n');
            }
        }
        // Check for web-specific optimizations
        if (settings.webContainerType) {
            sections.push("### Web Container Type: `".concat(settings.webContainerType, "`\n\n"));
            sections.push('Enables web-specific container query optimizations.\n\n');
        }
        // Check for strictness settings (common patterns)
        var configString = JSON.stringify(config.hanzoguiConfig);
        if (configString.includes('semi-strict-web')) {
            sections.push('### Mode: `semi-strict-web`\n\n');
            sections.push('This configuration uses semi-strict-web mode, which:\n');
            sections.push('- Optimizes for web performance\n');
            sections.push('- May have limited React Native API support\n');
            sections.push('- Focuses on web-first development\n\n');
        }
    }
    // Store components section for later (will be output at the end)
    var componentsSection = [];
    var allComponents = [];
    for (var _m = 0, _o = config.components; _m < _o.length; _m++) {
        var componentModule = _o[_m];
        var componentNames = Object.keys(componentModule.nameToInfo);
        allComponents.push.apply(allComponents, componentNames);
    }
    // Group components by prefix (e.g., Dialog, DialogClose -> Dialog.Close)
    // Strategy: Find potential base components and check if others follow the pattern
    var componentGroups = new Map();
    var processed = new Set();
    // Sort components to process shorter names first (potential base components)
    var sortedComponents = __spreadArray([], allComponents, true).sort(function (a, b) { return a.length - b.length; });
    var _loop_1 = function (name_1) {
        if (processed.has(name_1))
            return "continue";
        // Check if other components start with this name followed by an uppercase letter
        var children = allComponents.filter(function (other) { var _a; return other !== name_1 && other.startsWith(name_1) && ((_a = other[name_1.length]) === null || _a === void 0 ? void 0 : _a.match(/[A-Z]/)); });
        if (children.length > 0) {
            // This is a base component with children
            componentGroups.set(name_1, new Set(children));
            processed.add(name_1);
            children.forEach(function (child) { return processed.add(child); });
        }
    };
    for (var _p = 0, sortedComponents_1 = sortedComponents; _p < sortedComponents_1.length; _p++) {
        var name_1 = sortedComponents_1[_p];
        _loop_1(name_1);
    }
    // Collect standalone components (not part of any group)
    var standaloneComponents = allComponents.filter(function (name) { return !processed.has(name); });
    componentsSection.push('## Components\n\n');
    componentsSection.push('The following components are available:\n\n');
    // Combine and sort all base components (both standalone and those with children)
    var allBaseComponents = __spreadArray(__spreadArray([], standaloneComponents, true), Array.from(componentGroups.keys()), true).sort();
    // Output components
    for (var _q = 0, allBaseComponents_1 = allBaseComponents; _q < allBaseComponents_1.length; _q++) {
        var name_2 = allBaseComponents_1[_q];
        componentsSection.push("- ".concat(name_2, "\n"));
        // If this component has children, output them
        if (componentGroups.has(name_2)) {
            var children = Array.from(componentGroups.get(name_2)).sort();
            for (var _r = 0, children_1 = children; _r < children_1.length; _r++) {
                var child = children_1[_r];
                var suffix = child.slice(name_2.length);
                componentsSection.push("  - ".concat(name_2, ".").concat(suffix, "\n"));
            }
        }
    }
    componentsSection.push('\n');
    // Shorthands
    sections.push('## Shorthand Properties\n\n');
    sections.push('These shorthand properties are available for styling:\n\n');
    var shorthandEntries = Object.entries(shorthands).sort(function (_a, _b) {
        var a = _a[0];
        var b = _b[0];
        return a.localeCompare(b);
    });
    sections.push(shorthandEntries.map(function (_a) {
        var short = _a[0], full = _a[1];
        return "- `".concat(short, "` \u2192 `").concat(full, "`");
    }).join('\n'));
    sections.push('\n\n');
    // Themes
    sections.push('## Themes\n\n');
    var themes = ((_d = config.hanzoguiConfig) === null || _d === void 0 ? void 0 : _d.themes) || {};
    var themeNames = Object.keys(themes).sort();
    var hierarchy = {
        level1: new Set(),
        level2: new Set(),
        level3: new Set(),
        components: new Set(),
    };
    for (var _s = 0, themeNames_1 = themeNames; _s < themeNames_1.length; _s++) {
        var themeName = themeNames_1[_s];
        var parts = themeName.split('_');
        // Level 1: light/dark
        if (parts[0] === 'light' || parts[0] === 'dark') {
            hierarchy.level1.add(parts[0]);
            // Level 2: color names (blue, red, green, etc.)
            if (parts.length > 1 &&
                parts[1] &&
                !parts[1].startsWith('alt') &&
                parts[1] !== 'active') {
                // Check if it's not a component by looking if it starts with uppercase
                if (parts[1][0] === parts[1][0].toLowerCase()) {
                    hierarchy.level2.add(parts[1]);
                }
            }
            // Level 3: variants (alt1, alt2, etc.)
            for (var _t = 0, parts_1 = parts; _t < parts_1.length; _t++) {
                var part = parts_1[_t];
                if (part.startsWith('alt') || part === 'active') {
                    hierarchy.level3.add(part);
                }
            }
            // Components: parts that start with uppercase
            for (var _u = 0, parts_2 = parts; _u < parts_2.length; _u++) {
                var part = parts_2[_u];
                if (part[0] &&
                    part[0] === part[0].toUpperCase() &&
                    part[0] !== part[0].toLowerCase()) {
                    hierarchy.components.add(part);
                }
            }
        }
        else {
            // Base theme without light/dark prefix
            if (parts.length === 1) {
                hierarchy.level1.add(themeName);
            }
        }
    }
    sections.push('Themes are organized hierarchically and can be combined:\n\n');
    if (hierarchy.level1.size > 0) {
        sections.push('**Level 1 (Base):**\n\n');
        sections.push(Array.from(hierarchy.level1)
            .sort()
            .map(function (name) { return "- ".concat(name); })
            .join('\n'));
        sections.push('\n\n');
    }
    if (hierarchy.level2.size > 0) {
        sections.push('**Level 2 (Color Schemes):**\n\n');
        sections.push(Array.from(hierarchy.level2)
            .sort()
            .map(function (name) { return "- ".concat(name); })
            .join('\n'));
        sections.push('\n\n');
    }
    if (hierarchy.level3.size > 0) {
        sections.push('**Level 3 (Variants):**\n\n');
        sections.push(Array.from(hierarchy.level3)
            .sort()
            .map(function (name) { return "- ".concat(name); })
            .join('\n'));
        sections.push('\n\n');
    }
    if (hierarchy.components.size > 0) {
        sections.push('**Component Themes:**\n\n');
        sections.push(Array.from(hierarchy.components)
            .sort()
            .map(function (name) { return "- ".concat(name); })
            .join('\n'));
        sections.push('\n\n');
    }
    // Add usage documentation
    sections.push('### Theme Usage\n\n');
    sections.push('Themes are combined hierarchically. For example, `light_blue_alt1_Button` combines:\n');
    sections.push('- Base: `light`\n');
    sections.push('- Color: `blue`\n');
    sections.push('- Variant: `alt1`\n');
    sections.push('- Component: `Button`\n\n');
    sections.push('**Basic usage:**\n\n');
    sections.push('```tsx\n');
    sections.push('// Apply a theme to components\n');
    sections.push('export default () => (\n');
    sections.push('  <Theme name="dark">\n');
    sections.push("    <Button>I'm a dark button</Button>\n");
    sections.push('  </Theme>\n');
    sections.push(')\n\n');
    sections.push('// Themes nest and combine automatically\n');
    sections.push('export default () => (\n');
    sections.push('  <Theme name="dark">\n');
    sections.push('    <Theme name="blue">\n');
    sections.push('      <Button>Uses dark_blue theme</Button>\n');
    sections.push('    </Theme>\n');
    sections.push('  </Theme>\n');
    sections.push(')\n');
    sections.push('```\n\n');
    sections.push('**Accessing theme values:**\n\n');
    sections.push('Components can access theme values using `$` token syntax:\n\n');
    sections.push('```tsx\n');
    sections.push("<View ".concat(getPropName('backgroundColor'), "=\"$background\" ").concat(getPropName('color'), "=\"$color\" />\n"));
    sections.push('```\n\n');
    sections.push('**Special props:**\n\n');
    sections.push('- `inverse`: Automatically swaps light ↔ dark themes\n');
    sections.push('- `reset`: Reverts to grandparent theme\n\n');
    // Tokens
    sections.push('## Tokens\n\n');
    sections.push('Tokens are design system values that can be referenced using the `$` prefix.\n\n');
    var tokens = ((_e = config.hanzoguiConfig) === null || _e === void 0 ? void 0 : _e.tokens) || {};
    // Space tokens
    if (tokens.space) {
        sections.push('### Space Tokens\n\n');
        var spaceTokens = Object.entries(tokens.space).sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            // Sort numerically where possible
            var numA = parseFloat(a);
            var numB = parseFloat(b);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return a.localeCompare(b);
        });
        sections.push(spaceTokens
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "- `".concat(key, "`: ").concat(formatTokenValue(value));
        })
            .join('\n'));
        sections.push('\n\n');
    }
    // Size tokens
    if (tokens.size) {
        sections.push('### Size Tokens\n\n');
        var sizeTokens = Object.entries(tokens.size).sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            var numA = parseFloat(a);
            var numB = parseFloat(b);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return a.localeCompare(b);
        });
        sections.push(sizeTokens
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "- `".concat(key, "`: ").concat(formatTokenValue(value));
        })
            .join('\n'));
        sections.push('\n\n');
    }
    // Radius tokens
    if (tokens.radius) {
        sections.push('### Radius Tokens\n\n');
        var radiusTokens = Object.entries(tokens.radius).sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            var numA = parseFloat(a);
            var numB = parseFloat(b);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return a.localeCompare(b);
        });
        sections.push(radiusTokens
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "- `".concat(key, "`: ").concat(formatTokenValue(value));
        })
            .join('\n'));
        sections.push('\n\n');
    }
    // zIndex tokens
    if (tokens.zIndex) {
        sections.push('### Z-Index Tokens\n\n');
        var zIndexTokens = Object.entries(tokens.zIndex).sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            var numA = parseFloat(a);
            var numB = parseFloat(b);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return a.localeCompare(b);
        });
        sections.push(zIndexTokens
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "- `".concat(key, "`: ").concat(formatTokenValue(value));
        })
            .join('\n'));
        sections.push('\n\n');
    }
    // Color tokens
    if (tokens.color) {
        sections.push('### Color Tokens\n\n');
        var colorTokens = Object.entries(tokens.color).sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            return a.localeCompare(b);
        });
        sections.push(colorTokens
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "- `".concat(key, "`: ").concat(formatTokenValue(value));
        })
            .join('\n'));
        sections.push('\n\n');
    }
    // Token usage examples
    sections.push('### Token Usage\n\n');
    sections.push('Tokens can be used in component props with the `$` prefix:\n\n');
    sections.push('```tsx\n');
    sections.push('// Space tokens - for margin, padding, gap\n');
    sections.push("<View ".concat(getPropName('padding'), "=\"$4\" ").concat(getPropName('gap'), "=\"$2\" ").concat(getPropName('margin'), "=\"$3\" />\n\n"));
    sections.push('// Size tokens - for width, height, dimensions\n');
    sections.push("<View ".concat(getPropName('width'), "=\"$10\" ").concat(getPropName('height'), "=\"$6\" />\n\n"));
    sections.push('// Color tokens - for colors and backgrounds\n');
    sections.push("<View ".concat(getPropName('backgroundColor'), "=\"$blue5\" ").concat(getPropName('color'), "=\"$gray12\" />\n\n"));
    sections.push('// Radius tokens - for border-radius\n');
    sections.push("<View ".concat(getPropName('borderRadius'), "=\"$4\" />\n"));
    sections.push('```\n\n');
    // Media queries
    if ((_f = config.hanzoguiConfig) === null || _f === void 0 ? void 0 : _f.media) {
        sections.push('## Media Queries\n\n');
        sections.push('Available responsive breakpoints:\n\n');
        var media = config.hanzoguiConfig.media;
        var mediaEntries = Object.entries(media).sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            return a.localeCompare(b);
        });
        for (var _v = 0, mediaEntries_1 = mediaEntries; _v < mediaEntries_1.length; _v++) {
            var _w = mediaEntries_1[_v], name_3 = _w[0], query = _w[1];
            sections.push("- **".concat(name_3, "**: ").concat(JSON.stringify(query), "\n"));
        }
        sections.push('\n');
        sections.push('### Media Query Usage\n\n');
        sections.push('Media queries can be used as style props or with the `useMedia` hook:\n\n');
        sections.push('```tsx\n');
        sections.push('// As style props (prefix with $)\n');
        // Get first media query name as example
        var firstMediaName = (_g = mediaEntries[0]) === null || _g === void 0 ? void 0 : _g[0];
        if (firstMediaName) {
            sections.push("<View ".concat(getPropName('width'), "=\"100%\" $").concat(firstMediaName, "={{ ").concat(getPropName('width'), ": \"50%\" }} />\n\n"));
        }
        sections.push('// Using the useMedia hook\n');
        sections.push('const media = useMedia()\n');
        if (firstMediaName) {
            sections.push("if (media.".concat(firstMediaName, ") {\n"));
            sections.push('  // Render for this breakpoint\n');
            sections.push('}\n');
        }
        sections.push('```\n\n');
    }
    // Fonts
    if ((_h = config.hanzoguiConfig) === null || _h === void 0 ? void 0 : _h.fonts) {
        sections.push('## Fonts\n\n');
        sections.push('Available font families:\n\n');
        var fonts = config.hanzoguiConfig.fonts;
        var fontNames = Object.keys(fonts).sort();
        sections.push(fontNames.map(function (name) { return "- ".concat(name); }).join('\n'));
        sections.push('\n\n');
    }
    // Animations
    if ((_j = config.hanzoguiConfig) === null || _j === void 0 ? void 0 : _j.animations) {
        sections.push('## Animations\n\n');
        sections.push('Available animation presets:\n\n');
        var animations = config.hanzoguiConfig.animations;
        if (animations.animations) {
            var animationNames = Object.keys(animations.animations).sort();
            sections.push(animationNames.map(function (name) { return "- ".concat(name); }).join('\n'));
            sections.push('\n\n');
        }
    }
    // Add components section at the end
    sections.push.apply(sections, componentsSection);
    return sections.join('');
}
function formatTokenValue(value) {
    // If it's an object with a 'val' property (token object), extract the value
    if (typeof value === 'object' && value !== null && 'val' in value) {
        return String(value.val);
    }
    // Otherwise, stringify it
    return String(value);
}

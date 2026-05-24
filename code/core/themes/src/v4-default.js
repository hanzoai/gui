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
Object.defineProperty(exports, "__esModule", { value: true });
exports.themes = void 0;
var Colors = require("@hanzogui/colors/legacy");
var theme_builder_1 = require("@hanzogui/theme-builder");
/**
 * This is the default config v4 definitions.
 *   - uses shorthands v4
 *   - uses tokens v4 which are mostly the same as v3
 */
// Themes:
var darkPalette = [
    '#050505',
    '#151515',
    '#191919',
    '#232323',
    '#282828',
    '#323232',
    '#424242',
    '#494949',
    '#545454',
    '#626262',
    '#a5a5a5',
    '#fff',
];
var lightPalette = [
    '#fff',
    '#f2f2f2',
    'hsl(0, 0%, 93%)',
    'hsl(0, 0%, 91%)',
    'hsl(0, 0%, 88%)',
    'hsl(0, 0%, 85%)',
    'hsl(0, 0%, 82%)',
    'hsl(0, 0%, 76%)',
    'hsl(0, 0%, 56%)',
    'hsl(0, 0%, 50%)',
    'hsl(0, 0%, 42%)',
    'hsl(0, 0%, 9%)',
];
var lightShadows = {
    shadow1: 'rgba(0,0,0,0.04)',
    shadow2: 'rgba(0,0,0,0.08)',
    shadow3: 'rgba(0,0,0,0.16)',
    shadow4: 'rgba(0,0,0,0.24)',
    shadow5: 'rgba(0,0,0,0.32)',
    shadow6: 'rgba(0,0,0,0.4)',
};
var darkShadows = {
    shadow1: 'rgba(0,0,0,0.2)',
    shadow2: 'rgba(0,0,0,0.3)',
    shadow3: 'rgba(0,0,0,0.4)',
    shadow4: 'rgba(0,0,0,0.5)',
    shadow5: 'rgba(0,0,0,0.6)',
    shadow6: 'rgba(0,0,0,0.7)',
};
var blackColors = {
    black1: darkPalette[0],
    black2: darkPalette[1],
    black3: darkPalette[2],
    black4: darkPalette[3],
    black5: darkPalette[4],
    black6: darkPalette[5],
    black7: darkPalette[6],
    black8: darkPalette[7],
    black9: darkPalette[8],
    black10: darkPalette[9],
    black11: darkPalette[10],
    black12: darkPalette[11],
};
var whiteColors = {
    white1: lightPalette[0],
    white2: lightPalette[1],
    white3: lightPalette[2],
    white4: lightPalette[3],
    white5: lightPalette[4],
    white6: lightPalette[5],
    white7: lightPalette[6],
    white8: lightPalette[7],
    white9: lightPalette[8],
    white10: lightPalette[9],
    white11: lightPalette[10],
    white12: lightPalette[11],
};
var generatedThemes = (0, theme_builder_1.createThemes)({
    componentThemes: theme_builder_1.defaultComponentThemes,
    base: {
        palette: {
            dark: darkPalette,
            light: lightPalette,
        },
        // for values we don't want being inherited onto sub-themes
        extra: {
            light: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, Colors.blue), Colors.red), Colors.yellow), Colors.green), lightShadows), blackColors), whiteColors), { shadowColor: lightShadows.shadow1 }),
            dark: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, Colors.blueDark), Colors.redDark), Colors.yellowDark), Colors.greenDark), darkShadows), blackColors), whiteColors), { shadowColor: darkShadows.shadow1 }),
        },
    },
    // inverse accent theme
    accent: {
        palette: {
            dark: lightPalette,
            light: darkPalette,
        },
    },
    childrenThemes: {
        black: {
            palette: {
                dark: Object.values(blackColors),
                light: Object.values(blackColors),
            },
        },
        white: {
            palette: {
                dark: Object.values(whiteColors),
                light: Object.values(whiteColors),
            },
        },
        blue: {
            palette: {
                dark: Object.values(Colors.blueDark),
                light: Object.values(Colors.blue),
            },
        },
        red: {
            palette: {
                dark: Object.values(Colors.redDark),
                light: Object.values(Colors.red),
            },
        },
        yellow: {
            palette: {
                dark: Object.values(Colors.yellowDark),
                light: Object.values(Colors.yellow),
            },
        },
        green: {
            palette: {
                dark: Object.values(Colors.greenDark),
                light: Object.values(Colors.green),
            },
        },
    },
    grandChildrenThemes: {
        accent: {
            template: 'inverse',
        },
    },
});
exports.themes = generatedThemes;
/**
 * This is an optional production optimization: themes JS can get to 20Kb or more.
 * Hanzogui has ~1Kb of logic to hydrate themes from CSS, so you can remove the JS.
 * So long as you server render your Hanzogui CSS, this will save you bundle size:
 */
// export const themes: HanzoguiThemes =
//   process.env.TAMAGUI_ENVIRONMENT === 'client' && process.env.NODE_ENV === 'production'
//     ? {}
//     : (generatedThemes as any)

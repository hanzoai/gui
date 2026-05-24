"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var constants_1 = require("@hanzogui/constants");
var react_1 = require("react");
var config_1 = require("../config");
var constants_2 = require("../constants/constants");
var Theme_1 = require("./Theme");
var ThemeProvider = function (props) {
    'use no memo';
    var addThemeClassName = (0, config_1.getSetting)('addThemeClassName');
    // ensure theme is attached to root body node as well to work with modals by default
    if (process.env.TAMAGUI_TARGET === 'web') {
        (0, constants_1.useIsomorphicLayoutEffect)(function () {
            if (addThemeClassName === false)
                return;
            var cn = "".concat(constants_2.THEME_CLASSNAME_PREFIX).concat(props.defaultTheme);
            var target = (0, config_1.getSetting)('addThemeClassName') === 'html'
                ? document.documentElement
                : document.body;
            target.classList.add(cn);
            return function () {
                target.classList.remove(cn);
            };
        }, [props.defaultTheme, addThemeClassName]);
    }
    // we completely disable the className here if its set to any value, 'root', 'body', or false
    // because in all cases we are putting the classname elsewhere
    // if its undefined, then the default behavior applies and we use the className here
    var forceClassName = addThemeClassName === undefined;
    return ((0, jsx_runtime_1.jsx)(Theme_1.Theme, { className: props.className, name: props.defaultTheme, forceClassName: forceClassName, 
        // @ts-expect-error
        _isRoot: react_1.useId, children: props.children }));
};
exports.ThemeProvider = ThemeProvider;

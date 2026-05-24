"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanzoguiProvider = HanzoguiProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var constants_1 = require("@hanzogui/constants");
var use_did_finish_ssr_1 = require("@hanzogui/use-did-finish-ssr");
var react_1 = require("react");
var config_1 = require("../config");
var ComponentContext_1 = require("../contexts/ComponentContext");
var insertStyleRule_1 = require("../helpers/insertStyleRule");
var useMedia_1 = require("../hooks/useMedia");
var resolveAnimationDriver_1 = require("../helpers/resolveAnimationDriver");
var HanzoguiRoot_1 = require("./HanzoguiRoot");
var ThemeProvider_1 = require("./ThemeProvider");
// cache first theme key per config to avoid Object.keys allocation on every render
var _cachedFirstKey;
var _cachedConfig;
function firstThemeKey(config) {
    if (config !== _cachedConfig) {
        _cachedConfig = config;
        _cachedFirstKey = (config === null || config === void 0 ? void 0 : config.themes) ? Object.keys(config.themes)[0] : undefined;
    }
    return _cachedFirstKey;
}
function HanzoguiProvider(_a) {
    var children = _a.children, disableInjectCSS = _a.disableInjectCSS, config = _a.config, className = _a.className, defaultThemeProp = _a.defaultTheme, reset = _a.reset, insets = _a.insets;
    // fall back to first theme when defaultTheme is null/undefined
    // (e.g. useColorScheme() returns null on first render in RN 0.83+)
    var defaultTheme = defaultThemeProp || firstThemeKey(config) || 'light';
    (0, constants_1.useIsomorphicLayoutEffect)(function () {
        (0, insertStyleRule_1.stopAccumulatingRules)();
        (0, useMedia_1.updateMediaListeners)();
    }, []);
    var memoizedInsets = react_1.default.useMemo(function () { return insets; }, [insets === null || insets === void 0 ? void 0 : insets.top, insets === null || insets === void 0 ? void 0 : insets.right, insets === null || insets === void 0 ? void 0 : insets.bottom, insets === null || insets === void 0 ? void 0 : insets.left]);
    // Get the default animation driver from config
    // config.animations is already normalized to the default driver in createHanzogui
    // resolveAnimationDriver handles edge cases where raw multi-driver object leaks through
    var defaultAnimationDriver = react_1.default.useMemo(function () { return (0, resolveAnimationDriver_1.resolveAnimationDriver)(config === null || config === void 0 ? void 0 : config.animations); }, [config === null || config === void 0 ? void 0 : config.animations]);
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = defaultAnimationDriver === null || defaultAnimationDriver === void 0 ? void 0 : defaultAnimationDriver.onMount) === null || _a === void 0 ? void 0 : _a.call(defaultAnimationDriver);
    }, []);
    var contents = ((0, jsx_runtime_1.jsx)(ComponentContext_1.ComponentContext.Provider, { animationDriver: defaultAnimationDriver, insets: memoizedInsets, children: (0, jsx_runtime_1.jsx)(ThemeProvider_1.ThemeProvider, { defaultTheme: defaultTheme, reset: reset, className: className, children: (0, jsx_runtime_1.jsx)(HanzoguiRoot_1.HanzoguiRoot, { theme: defaultTheme, isRootRoot: true, children: children }) }) }));
    if ((0, config_1.getSetting)('disableSSR')) {
        // never changes so conditional render fine, no re-parenting risk
        contents = (0, jsx_runtime_1.jsx)(use_did_finish_ssr_1.ClientOnly, { enabled: true, children: contents });
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [contents, process.env.TAMAGUI_TARGET !== 'native' && config && !disableInjectCSS && ((0, jsx_runtime_1.jsx)("style", { 
                // react 19 feature to hoist style tags to header:
                // https://react.dev/reference/react-dom/components/style
                // @ts-ignore
                precedence: "default", href: "hanzogui-css", children: config.getCSS() }, "hanzogui-css"))] }));
}

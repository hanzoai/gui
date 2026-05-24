"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeDebug = ThemeDebug;
var jsx_runtime_1 = require("react/jsx-runtime");
var use_did_finish_ssr_1 = require("@hanzogui/use-did-finish-ssr");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var useThemeState_1 = require("../hooks/useThemeState");
var node;
function ThemeDebug(_a) {
    var themeState = _a.themeState, themeProps = _a.themeProps, children = _a.children;
    if (process.env.NODE_ENV === 'development') {
        var isHydrated = (0, use_did_finish_ssr_1.useDidFinishSSR)();
        if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
            if (!node) {
                node = document.createElement('div');
                node.style.height = '200px';
                node.style.overflowY = 'scroll';
                node.style.position = 'fixed';
                node.style.zIndex = 10000000;
                node.style.bottom = '30px';
                node.style.left = '30px';
                node.style.right = '30px';
                node.style.display = 'flex';
                node.style.border = '1px solid #888';
                node.style.flexDirection = 'row';
                node.style.background = 'var(--background)';
            }
        }
        (0, react_1.useEffect)(function () {
            document.body.appendChild(node);
        }, []);
        if (themeProps['disable-child-theme'] || !isHydrated) {
            return children;
        }
        var parentState = themeState.parentId ? (0, useThemeState_1.getThemeState)(themeState.parentId) : null;
        // hsla(0, 0%, 9%, 1)
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)("code", { style: {
                        whiteSpace: 'pre',
                        maxWidth: 250,
                        overflow: 'auto',
                        padding: 5,
                    }, children: ["<Theme ", themeState.id, " />\u00A0", JSON.stringify({
                            name: themeState.name,
                            color1: themeState.theme.color1.val,
                            parentId: themeState.parentId,
                            // inverses: themeState.inverses,
                            isNew: themeState.isNew,
                            themeProps: {
                                name: themeProps.name,
                                componentName: themeProps.componentName,
                                reset: themeProps.reset,
                            },
                            parentState: {
                                name: parentState === null || parentState === void 0 ? void 0 : parentState.name,
                                isNew: parentState === null || parentState === void 0 ? void 0 : parentState.isNew,
                            },
                        }, null, 2)] }), node), (0, jsx_runtime_1.jsx)("div", { style: { color: 'red' }, children: themeState.id }), children] }));
    }
    return children;
}
ThemeDebug['displayName'] = 'ThemeDebug';

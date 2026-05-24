"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyleTags = getStyleTags;
var jsx_runtime_1 = require("react/jsx-runtime");
var helpers_1 = require("@hanzogui/helpers");
// turns out this is pretty slow, creating a bunch of extra tags...
function getStyleTags(styles) {
    if (process.env.TAMAGUI_TARGET !== 'native') {
        if (styles.length) {
            return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: styles.map(function (styleObject) {
                    var identifier = styleObject[helpers_1.StyleObjectIdentifier];
                    return ((0, jsx_runtime_1.jsx)("style", { 
                        // @ts-ignore
                        href: "t_".concat(identifier), 
                        // @ts-ignore
                        precedence: "default", 
                        // we remove after first render in favor of inserting to a global stylesheet (faster)
                        suppressHydrationWarning: true, children: styleObject[helpers_1.StyleObjectRules].join('\n') }, identifier));
                }) }));
        }
    }
}

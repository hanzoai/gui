"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocaleDirection = getLocaleDirection;
exports.LocaleProvider = LocaleProvider;
exports.useLocaleContext = useLocaleContext;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react"); /**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
var isLocaleRTL_1 = require("./isLocaleRTL");
var defaultLocale = {
    direction: 'ltr',
    locale: 'en-US',
};
var LocaleContext = react_1.default.createContext(defaultLocale);
function getLocaleDirection(locale) {
    return (0, isLocaleRTL_1.isLocaleRTL)(locale) ? 'rtl' : 'ltr';
}
function LocaleProvider(props) {
    var direction = props.direction, locale = props.locale, children = props.children;
    var needsContext = direction || locale;
    return needsContext ? ((0, jsx_runtime_1.jsx)(LocaleContext.Provider, { value: {
            direction: locale ? getLocaleDirection(locale) : direction,
            locale: locale,
        }, children: children })) : (children);
}
function useLocaleContext() {
    return react_1.default.useContext(LocaleContext);
}

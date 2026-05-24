"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */
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
exports.VirtualizedListContext = void 0;
exports.VirtualizedListContextResetter = VirtualizedListContextResetter;
exports.VirtualizedListContextProvider = VirtualizedListContextProvider;
exports.VirtualizedListCellContextProvider = VirtualizedListCellContextProvider;
var VirtualizedList_1 = require("../VirtualizedList");
var React = require("react");
var react_1 = require("react");
var __DEV__ = process.env.NODE_ENV !== 'production';
var defaultContext = {
    cellKey: null,
    getScrollMetrics: function () { return ({
        contentLength: 0,
        dOffset: 0,
        dt: 0,
        offset: 0,
        timestamp: 0,
        velocity: 0,
        visibleLength: 0,
        zoomScale: 1,
    }); },
    horizontal: false,
    getOutermostParentListRef: function () { return null; },
    registerAsNestedChild: function (params) { },
    unregisterAsNestedChild: function (params) { },
};
exports.VirtualizedListContext = React.createContext(null);
if (__DEV__) {
    exports.VirtualizedListContext.displayName = 'VirtualizedListContext';
}
/**
 * Resets the context. Intended for use by portal-like components (e.g. Modal).
 */
function VirtualizedListContextResetter(_a) {
    var children = _a.children;
    return (<exports.VirtualizedListContext.Provider value={null}>
      {children}
    </exports.VirtualizedListContext.Provider>);
}
/**
 * Sets the context with memoization. Intended to be used by `VirtualizedList`.
 */
function VirtualizedListContextProvider(_a) {
    var children = _a.children, value = _a.value;
    // Avoid setting a newly created context object if the values are identical.
    var context = (0, react_1.useMemo)(function () { return ({
        cellKey: null,
        getScrollMetrics: value.getScrollMetrics,
        horizontal: value.horizontal,
        getOutermostParentListRef: value.getOutermostParentListRef,
        registerAsNestedChild: value.registerAsNestedChild,
        unregisterAsNestedChild: value.unregisterAsNestedChild,
    }); }, [
        value.getScrollMetrics,
        value.horizontal,
        value.getOutermostParentListRef,
        value.registerAsNestedChild,
        value.unregisterAsNestedChild,
    ]);
    return (<exports.VirtualizedListContext.Provider value={context}>
      {children}
    </exports.VirtualizedListContext.Provider>);
}
/**
 * Sets the `cellKey`. Intended to be used by `VirtualizedList` for each cell.
 */
function VirtualizedListCellContextProvider(_a) {
    var cellKey = _a.cellKey, children = _a.children;
    // Avoid setting a newly created context object if the values are identical.
    var currContext = (0, react_1.useContext)(exports.VirtualizedListContext);
    var context = (0, react_1.useMemo)(function () { return (currContext == null ? null : __assign(__assign({}, currContext), { cellKey: cellKey })); }, [currContext, cellKey]);
    return (<exports.VirtualizedListContext.Provider value={context}>
      {children}
    </exports.VirtualizedListContext.Provider>);
}

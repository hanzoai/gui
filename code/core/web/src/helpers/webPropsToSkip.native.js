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
exports.webPropsToSkip = void 0;
var helpers_1 = require("@hanzogui/helpers");
// pointerEvents is in webOnlyStylePropsView for web CSS, but it's a valid
// React Native View prop, so we exclude it from the skip list on native.
// It's handled specially in getSplitStyles.tsx
var _ = helpers_1.webOnlyStylePropsView.pointerEvents, webOnlyStylePropsViewWithoutPointerEvents = __rest(helpers_1.webOnlyStylePropsView
/**
 * Web-only props and event handlers that should be skipped on native
 */
, ["pointerEvents"]);
/**
 * Web-only props and event handlers that should be skipped on native
 */
exports.webPropsToSkip = __assign(__assign(__assign({}, webOnlyStylePropsViewWithoutPointerEvents), helpers_1.webOnlyStylePropsText), { 
    // Web-only event handlers
    onClick: 1, onDoubleClick: 1, onContextMenu: 1, onMouseEnter: 1, onMouseLeave: 1, onMouseMove: 1, onMouseOver: 1, onMouseOut: 1, onMouseDown: 1, onMouseUp: 1, onWheel: 1, onKeyDown: 1, onKeyUp: 1, onKeyPress: 1, onPointerDown: 1, onPointerMove: 1, onPointerUp: 1, onPointerCancel: 1, onPointerEnter: 1, onPointerLeave: 1, onDrag: 1, onDragStart: 1, onDragEnd: 1, onDragEnter: 1, onDragLeave: 1, onDragOver: 1, onDrop: 1, onChange: 1, onInput: 1, onBeforeInput: 1, onScroll: 1, onCopy: 1, onCut: 1, onPaste: 1, 
    // Other web-only props
    htmlFor: 1, dangerouslySetInnerHTML: 1 });

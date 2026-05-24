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
exports.Text = void 0;
var helpers_1 = require("@hanzogui/helpers");
var createComponent_1 = require("../createComponent");
var ellipsisStyle = process.env.TAMAGUI_TARGET === 'web'
    ? {
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }
    : {
        numberOfLines: 1,
        lineBreakMode: 'clip',
    };
exports.Text = (0, createComponent_1.createComponent)({
    componentName: 'Text',
    acceptsClassName: true,
    isText: true,
    defaultProps: process.env.TAMAGUI_TARGET === 'web'
        ? undefined
        : {
            suppressHighlighting: true,
        },
    inlineWhenUnflattened: new Set(['fontFamily']),
    variants: __assign(__assign({}, (process.env.TAMAGUI_TARGET === 'web' && {
        numberOfLines: {
            1: ellipsisStyle,
            ':number': function (numberOfLines) {
                return numberOfLines >= 1
                    ? {
                        maxWidth: '100%',
                        WebkitLineClamp: numberOfLines,
                        WebkitBoxOrient: 'vertical',
                        display: '-webkit-box',
                        overflow: 'hidden',
                    }
                    : null;
            },
        },
    })), { ellipsis: {
            true: ellipsisStyle,
        } }),
    validStyles: __assign(__assign({}, helpers_1.validStyles), helpers_1.stylePropsTextOnly),
});

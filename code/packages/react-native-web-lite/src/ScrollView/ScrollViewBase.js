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
exports.ScrollViewBase = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var React = require("react");
var index_1 = require("../View/index");
function normalizeScrollEvent(e) {
    return {
        nativeEvent: {
            contentOffset: {
                get x() {
                    return e.target.scrollLeft;
                },
                get y() {
                    return e.target.scrollTop;
                },
            },
            contentSize: {
                get height() {
                    return e.target.scrollHeight;
                },
                get width() {
                    return e.target.scrollWidth;
                },
            },
            layoutMeasurement: {
                get height() {
                    return e.target.offsetHeight;
                },
                get width() {
                    return e.target.offsetWidth;
                },
            },
        },
        timeStamp: Date.now(),
    };
}
function shouldEmitScrollEvent(lastTick, eventThrottle) {
    var timeSinceLastTick = Date.now() - lastTick;
    return eventThrottle > 0 && timeSinceLastTick >= eventThrottle;
}
/**
 * Encapsulates the Web-specific scroll throttling and disabling logic
 */
var ScrollViewBase = React.forwardRef(function (props, forwardedRef) {
    var onScroll = props.onScroll, onTouchMove = props.onTouchMove, onWheel = props.onWheel, _a = props.scrollEnabled, scrollEnabled = _a === void 0 ? true : _a, _b = props.scrollEventThrottle, scrollEventThrottle = _b === void 0 ? 0 : _b, showsHorizontalScrollIndicator = props.showsHorizontalScrollIndicator, showsVerticalScrollIndicator = props.showsVerticalScrollIndicator, style = props.style, 
    // strip RN-only props that shouldn't reach the DOM
    onMomentumScrollBegin = props.onMomentumScrollBegin, onMomentumScrollEnd = props.onMomentumScrollEnd, onScrollBeginDrag = props.onScrollBeginDrag, onScrollEndDrag = props.onScrollEndDrag, rest = __rest(props, ["onScroll", "onTouchMove", "onWheel", "scrollEnabled", "scrollEventThrottle", "showsHorizontalScrollIndicator", "showsVerticalScrollIndicator", "style", "onMomentumScrollBegin", "onMomentumScrollEnd", "onScrollBeginDrag", "onScrollEndDrag"]);
    var scrollState = React.useRef({ isScrolling: false, scrollLastTick: 0 });
    var scrollTimeout = React.useRef(null);
    var scrollRef = React.useRef(null);
    function createPreventableScrollHandler(handler) {
        return function (e) {
            if (scrollEnabled) {
                if (handler) {
                    handler(e);
                }
            }
        };
    }
    function handleScroll(e) {
        e.stopPropagation();
        if (e.target === scrollRef.current) {
            e.persist();
            // A scroll happened, so the scroll resets the scrollend timeout.
            if (scrollTimeout.current != null) {
                clearTimeout(scrollTimeout.current);
            }
            // @ts-ignore
            scrollTimeout.current = setTimeout(function () {
                handleScrollEnd(e);
            }, 100);
            if (scrollState.current.isScrolling) {
                // Scroll last tick may have changed, check if we need to notify
                if (shouldEmitScrollEvent(scrollState.current.scrollLastTick, scrollEventThrottle)) {
                    handleScrollTick(e);
                }
            }
            else {
                // Weren't scrolling, so we must have just started
                handleScrollStart(e);
            }
        }
    }
    function handleScrollStart(e) {
        scrollState.current.isScrolling = true;
        handleScrollTick(e);
    }
    function handleScrollTick(e) {
        scrollState.current.scrollLastTick = Date.now();
        if (onScroll) {
            onScroll(normalizeScrollEvent(e));
        }
    }
    function handleScrollEnd(e) {
        scrollState.current.isScrolling = false;
        if (onScroll) {
            onScroll(normalizeScrollEvent(e));
        }
    }
    var hideHorizontalScrollbar = showsHorizontalScrollIndicator === false;
    var hideVerticalScrollbar = showsVerticalScrollIndicator === false;
    return ((0, jsx_runtime_1.jsx)(index_1.View, __assign({}, rest, { className: '_dsp_contents' +
            (hideHorizontalScrollbar ? ' _hsb-x' : '') +
            (hideVerticalScrollbar ? ' _hsb-y' : ''), onScroll: handleScroll, onTouchMove: createPreventableScrollHandler(onTouchMove), onWheel: createPreventableScrollHandler(onWheel), ref: (0, react_native_web_internals_1.useMergeRefs)(scrollRef, forwardedRef), style: [
            style,
            // @ts-ignore
            !scrollEnabled && styles.scrollDisabled,
        ] })));
});
exports.ScrollViewBase = ScrollViewBase;
// Chrome doesn't support e.preventDefault in this case; touch-action must be
// used to disable scrolling.
// https://developers.google.com/web/updates/2017/01/scrolling-intervention
var styles = {
    scrollDisabled: {
        overflowX: 'hidden',
        overflowY: 'hidden',
        touchAction: 'none',
    },
};
exports.default = ScrollViewBase;

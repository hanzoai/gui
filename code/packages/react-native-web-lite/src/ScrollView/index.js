"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ScrollView = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var react_1 = require("react");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../Dimensions/index");
var index_2 = require("../View/index");
var ScrollViewBase_1 = require("./ScrollViewBase");
var emptyObject = {};
var IS_ANIMATING_TOUCH_START_THRESHOLD_MS = 16;
var ScrollView = /** @class */ (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keyboardWillOpenTo = null;
        _this.additionalScrollOffset = 0;
        _this.preventNegativeScrollOffset = false;
        _this.isTouching = false;
        _this.lastMomentumScrollBeginTime = 0;
        _this.lastMomentumScrollEndTime = 0;
        // Reset to false every time becomes responder. This is used to:
        // - Determine if the scroll view has been scrolled and therefore should
        // refuse to give up its responder lock.
        // - Determine if releasing should dismiss the keyboard when we are in
        // tap-to-dismiss mode (!this.props.keyboardShouldPersistTaps).
        _this.observedScrollSinceBecomingResponder = false;
        _this.becameResponderWhileAnimating = false;
        _this.flashScrollIndicators = function () {
            _this.scrollResponderFlashScrollIndicators();
        };
        /**
         * Scrolls to a given x, y offset, either immediately or with a smooth animation.
         * Syntax:
         *
         * scrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})
         *
         * Note: The weird argument signature is due to the fact that, for historical reasons,
         * the function also accepts separate arguments as as alternative to the options object.
         * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
         */
        _this.scrollTo = function (y, x, animated) {
            var _a;
            if (typeof y === 'number') {
                console.warn('`scrollTo(y, x, animated)` is deprecated. Use `scrollTo({x: 5, y: 5, animated: true})` instead.');
            }
            else {
                ;
                (_a = y || emptyObject, x = _a.x, y = _a.y, animated = _a.animated);
            }
            _this.scrollResponderScrollTo({
                x: x || 0,
                y: y || 0,
                animated: animated !== false,
            });
        };
        /**
         * If this is a vertical ScrollView scrolls to the bottom.
         * If this is a horizontal ScrollView scrolls to the right.
         *
         * Use `scrollToEnd({ animated: true })` for smooth animated scrolling,
         * `scrollToEnd({ animated: false })` for immediate scrolling.
         * If no options are passed, `animated` defaults to true.
         */
        _this.scrollToEnd = function (options) {
            // Default to true
            var animated = (options && options.animated) !== false;
            var horizontal = _this.props.horizontal;
            var scrollResponderNode = _this.getScrollableNode();
            var x = horizontal ? scrollResponderNode.scrollWidth : 0;
            var y = horizontal ? 0 : scrollResponderNode.scrollHeight;
            _this.scrollResponderScrollTo({ x: x, y: y, animated: animated });
        };
        /**
         * A helper function to scroll to a specific point in the scrollview.
         * This is currently used to help focus on child textviews, but can also
         * be used to quickly scroll to any element we want to focus. Syntax:
         *
         * scrollResponderScrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})
         *
         * Note: The weird argument signature is due to the fact that, for historical reasons,
         * the function also accepts separate arguments as as alternative to the options object.
         * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
         */
        _this.scrollResponderScrollTo = function (x, y, animated) {
            var _a;
            if (typeof x === 'number') {
                console.warn('`scrollResponderScrollTo(x, y, animated)` is deprecated. Use `scrollResponderScrollTo({x: 5, y: 5, animated: true})` instead.');
            }
            else {
                ;
                (_a = x || emptyObject, x = _a.x, y = _a.y, animated = _a.animated);
            }
            var node = _this.getScrollableNode();
            var left = x || 0;
            var top = y || 0;
            if (node != null) {
                if (typeof node.scroll === 'function') {
                    node.scroll({ top: top, left: left, behavior: !animated ? 'auto' : 'smooth' });
                }
                else {
                    node.scrollLeft = left;
                    node.scrollTop = top;
                }
            }
        };
        /**
         * A helper function to zoom to a specific rect in the scrollview. The argument has the shape
         * {x: number; y: number; width: number; height: number; animated: boolean = true}
         *
         * @platform ios
         */
        _this.scrollResponderZoomTo = function (rect, animated // deprecated, put this inside the rect argument instead
        ) {
            if (react_native_web_internals_1.Platform.OS !== 'ios') {
                (0, react_native_web_internals_1.invariant)('zoomToRect is not implemented');
            }
        };
        /**
         * This method should be used as the callback to onFocus in a TextInputs'
         * parent view. Note that any module using this mixin needs to return
         * the parent view's ref in getScrollViewRef() in order to use this method.
         * @param {any} nodeHandle The TextInput node handle
         * @param {number} additionalOffset The scroll view's top "contentInset".
         *        Default is 0.
         * @param {bool} preventNegativeScrolling Whether to allow pulling the content
         *        down to make it meet the keyboard's top. Default is false.
         */
        _this.scrollResponderScrollNativeHandleToKeyboard = function (nodeHandle, additionalOffset, preventNegativeScrollOffset) {
            _this.additionalScrollOffset = additionalOffset || 0;
            _this.preventNegativeScrollOffset = !!preventNegativeScrollOffset;
            react_native_web_internals_1.UIManager.measureLayout(nodeHandle, _this.getInnerViewNode(), _this.scrollResponderTextInputFocusError, _this.scrollResponderInputMeasureAndScrollToKeyboard);
        };
        /**
         * The calculations performed here assume the scroll view takes up the entire
         * screen - even if has some content inset. We then measure the offsets of the
         * keyboard, and compensate both for the scroll view's "contentInset".
         *
         * @param {number} left Position of input w.r.t. table view.
         * @param {number} top Position of input w.r.t. table view.
         * @param {number} width Width of the text input.
         * @param {number} height Height of the text input.
         */
        _this.scrollResponderInputMeasureAndScrollToKeyboard = function (left, top, width, height) {
            var keyboardScreenY = index_1.Dimensions.get('window').height;
            if (_this.keyboardWillOpenTo) {
                keyboardScreenY = _this.keyboardWillOpenTo.endCoordinates.screenY;
            }
            var scrollOffsetY = top - keyboardScreenY + height + _this.additionalScrollOffset;
            // By default, this can scroll with negative offset, pulling the content
            // down so that the target component's bottom meets the keyboard's top.
            // If requested otherwise, cap the offset at 0 minimum to avoid content
            // shifting down.
            if (_this.preventNegativeScrollOffset) {
                scrollOffsetY = Math.max(0, scrollOffsetY);
            }
            _this.scrollResponderScrollTo({ x: 0, y: scrollOffsetY, animated: true });
            _this.additionalScrollOffset = 0;
            _this.preventNegativeScrollOffset = false;
        };
        /**
         * Warning, this may be called several times for a single keyboard opening.
         * It's best to store the information in this method and then take any action
         * at a later point (either in `keyboardDidShow` or other).
         *
         * Here's the order that events occur in:
         * - focus
         * - willShow {startCoordinates, endCoordinates} several times
         * - didShow several times
         * - blur
         * - willHide {startCoordinates, endCoordinates} several times
         * - didHide several times
         *
         * The `ScrollResponder` providesModule callbacks for each of these events.
         * Even though any user could have easily listened to keyboard events
         * themselves, using these `props` callbacks ensures that ordering of events
         * is consistent - and not dependent on the order that the keyboard events are
         * subscribed to. This matters when telling the scroll view to scroll to where
         * the keyboard is headed - the scroll responder better have been notified of
         * the keyboard destination before being instructed to scroll to where the
         * keyboard will be. Stick to the `ScrollResponder` callbacks, and everything
         * will work.
         *
         * WARNING: These callbacks will fire even if a keyboard is displayed in a
         * different navigation pane. Filter out the events to determine if they are
         * relevant to you. (For example, only if you receive these callbacks after
         * you had explicitly focused a node etc).
         */
        _this.scrollResponderKeyboardWillShow = function (e) {
            _this.keyboardWillOpenTo = e;
            _this.props.onKeyboardWillShow && _this.props.onKeyboardWillShow(e);
        };
        _this.scrollResponderKeyboardWillHide = function (e) {
            _this.keyboardWillOpenTo = null;
            _this.props.onKeyboardWillHide && _this.props.onKeyboardWillHide(e);
        };
        _this.scrollResponderKeyboardDidShow = function (e) {
            // TODO(7693961): The event for DidShow is not available on iOS yet.
            // Use the one from WillShow and do not assign.
            if (e) {
                _this.keyboardWillOpenTo = e;
            }
            _this.props.onKeyboardDidShow && _this.props.onKeyboardDidShow(e);
        };
        _this.scrollResponderKeyboardDidHide = function (e) {
            _this.keyboardWillOpenTo = null;
            _this.props.onKeyboardDidHide && _this.props.onKeyboardDidHide(e);
        };
        return _this;
    }
    /**
     * Returns a reference to the underlying scroll responder, which supports
     * operations like `scrollTo`. All ScrollView-like components should
     * implement this method so that they can be composed while providing access
     * to the underlying scroll responder's methods.
     */
    ScrollView.prototype.getScrollResponder = function () {
        return this;
    };
    ScrollView.prototype.getScrollableNode = function () {
        return this._scrollNodeRef;
    };
    ScrollView.prototype.getInnerViewRef = function () {
        return this._innerViewRef;
    };
    ScrollView.prototype.getInnerViewNode = function () {
        return this._innerViewRef;
    };
    ScrollView.prototype.getNativeScrollRef = function () {
        return this._scrollNodeRef;
    };
    ScrollView.prototype.render = function () {
        var _a = this.props, contentContainerStyle = _a.contentContainerStyle, horizontal = _a.horizontal, onContentSizeChange = _a.onContentSizeChange, refreshControl = _a.refreshControl, stickyHeaderIndices = _a.stickyHeaderIndices, pagingEnabled = _a.pagingEnabled, 
        /* eslint-disable */
        forwardedRef = _a.forwardedRef, keyboardDismissMode = _a.keyboardDismissMode, onScroll = _a.onScroll, centerContent = _a.centerContent, 
        // strip RN-only props that shouldn't reach the DOM
        contentOffset = _a.contentOffset, contentInset = _a.contentInset, contentInsetAdjustmentBehavior = _a.contentInsetAdjustmentBehavior, decelerationRate = _a.decelerationRate, directionalLockEnabled = _a.directionalLockEnabled, disableIntervalMomentum = _a.disableIntervalMomentum, disableScrollViewPanResponder = _a.disableScrollViewPanResponder, endFillColor = _a.endFillColor, fadingEdgeLength = _a.fadingEdgeLength, indicatorStyle = _a.indicatorStyle, invertStickyHeaders = _a.invertStickyHeaders, keyboardShouldPersistTaps = _a.keyboardShouldPersistTaps, maintainVisibleContentPosition = _a.maintainVisibleContentPosition, maximumZoomScale = _a.maximumZoomScale, minimumZoomScale = _a.minimumZoomScale, nestedScrollEnabled = _a.nestedScrollEnabled, onScrollToTop = _a.onScrollToTop, overScrollMode = _a.overScrollMode, pinchGestureEnabled = _a.pinchGestureEnabled, removeClippedSubviews = _a.removeClippedSubviews, scrollIndicatorInsets = _a.scrollIndicatorInsets, scrollPerfTag = _a.scrollPerfTag, scrollToOverflowEnabled = _a.scrollToOverflowEnabled, snapToAlignment = _a.snapToAlignment, snapToEnd = _a.snapToEnd, snapToInterval = _a.snapToInterval, snapToOffsets = _a.snapToOffsets, snapToStart = _a.snapToStart, StickyHeaderComponent = _a.StickyHeaderComponent, ScrollComponent = _a.ScrollComponent, 
        /* eslint-enable */
        other = __rest(_a, ["contentContainerStyle", "horizontal", "onContentSizeChange", "refreshControl", "stickyHeaderIndices", "pagingEnabled", "forwardedRef", "keyboardDismissMode", "onScroll", "centerContent", "contentOffset", "contentInset", "contentInsetAdjustmentBehavior", "decelerationRate", "directionalLockEnabled", "disableIntervalMomentum", "disableScrollViewPanResponder", "endFillColor", "fadingEdgeLength", "indicatorStyle", "invertStickyHeaders", "keyboardShouldPersistTaps", "maintainVisibleContentPosition", "maximumZoomScale", "minimumZoomScale", "nestedScrollEnabled", "onScrollToTop", "overScrollMode", "pinchGestureEnabled", "removeClippedSubviews", "scrollIndicatorInsets", "scrollPerfTag", "scrollToOverflowEnabled", "snapToAlignment", "snapToEnd", "snapToInterval", "snapToOffsets", "snapToStart", "StickyHeaderComponent", "ScrollComponent"]);
        if (process.env.NODE_ENV !== 'production' && this.props.style) {
            var style_1 = react_native_web_internals_1.StyleSheet.flatten(this.props.style);
            var childLayoutProps = ['alignItems', 'justifyContent'].filter(function (prop) { return style_1 && style_1[prop] !== undefined; });
            (0, react_native_web_internals_1.invariant)(childLayoutProps.length === 0, "ScrollView child layout (".concat(JSON.stringify(childLayoutProps), ") ") +
                'must be applied through the contentContainerStyle prop.');
        }
        var contentSizeChangeProps = {};
        if (onContentSizeChange) {
            contentSizeChangeProps = {
                onLayout: this._handleContentOnLayout.bind(this),
            };
        }
        var hasStickyHeaderIndices = !horizontal && Array.isArray(stickyHeaderIndices);
        var children = hasStickyHeaderIndices || pagingEnabled
            ? react_1.default.Children.map(this.props.children, function (child, i) {
                var isSticky = hasStickyHeaderIndices && stickyHeaderIndices.indexOf(i) > -1;
                if (child != null && (isSticky || pagingEnabled)) {
                    return ((0, jsx_runtime_1.jsx)(index_2.View, { style: react_native_web_internals_1.StyleSheet.compose(isSticky && styles.stickyHeader, pagingEnabled && styles.pagingEnabledChild), children: child }));
                }
                else {
                    return child;
                }
            })
            : this.props.children;
        var contentContainer = ((0, jsx_runtime_1.jsx)(index_2.View, __assign({}, contentSizeChangeProps, { 
            // @ts-ignore
            collapsable: false, ref: this._setInnerViewRef.bind(this), style: [
                horizontal && styles.contentContainerHorizontal,
                centerContent && styles.contentContainerCenterContent,
                contentContainerStyle,
            ], children: children })));
        var baseStyle = horizontal ? styles.baseHorizontal : styles.baseVertical;
        var pagingEnabledStyle = horizontal
            ? styles.pagingEnabledHorizontal
            : styles.pagingEnabledVertical;
        var props = __assign(__assign({}, other), { style: [baseStyle, pagingEnabled && pagingEnabledStyle, this.props.style], onTouchStart: this.scrollResponderHandleTouchStart.bind(this), onTouchMove: this.scrollResponderHandleTouchMove.bind(this), onTouchEnd: this.scrollResponderHandleTouchEnd.bind(this), onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag.bind(this), onScrollEndDrag: this.scrollResponderHandleScrollEndDrag.bind(this), onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin.bind(this), onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd.bind(this), onStartShouldSetResponder: this.scrollResponderHandleStartShouldSetResponder.bind(this), onStartShouldSetResponderCapture: this.scrollResponderHandleStartShouldSetResponderCapture.bind(this), onScrollShouldSetResponder: this.scrollResponderHandleScrollShouldSetResponder.bind(this), onScroll: this._handleScroll.bind(this), onResponderGrant: this.scrollResponderHandleResponderGrant.bind(this), onResponderTerminationRequest: this.scrollResponderHandleTerminationRequest.bind(this), onResponderRelease: this.scrollResponderHandleResponderRelease.bind(this), onResponderReject: this.scrollResponderHandleResponderReject.bind(this), onResponderTerminate: this.scrollResponderHandleTerminate.bind(this) });
        var ScrollViewClass = ScrollViewBase_1.ScrollViewBase;
        (0, react_native_web_internals_1.invariant)(ScrollViewClass !== undefined, 'ScrollViewClass must not be undefined');
        var scrollView = ((0, jsx_runtime_1.jsx)(ScrollViewClass, __assign({}, props, { ref: this._setScrollNodeRef.bind(this), children: contentContainer })));
        if (refreshControl) {
            return react_1.default.cloneElement(refreshControl, { style: props.style }, scrollView);
        }
        return scrollView;
    };
    ScrollView.prototype._handleContentOnLayout = function (e) {
        var _a, _b;
        var _c = e.nativeEvent.layout, width = _c.width, height = _c.height;
        (_b = (_a = this.props).onContentSizeChange) === null || _b === void 0 ? void 0 : _b.call(_a, width, height);
    };
    ScrollView.prototype._handleScroll = function (e) {
        if (process.env.NODE_ENV !== 'production') {
            if (this.props.onScroll && this.props.scrollEventThrottle == null) {
                console.info('You specified `onScroll` on a <ScrollView> but not ' +
                    '`scrollEventThrottle`. You will only receive one event. ' +
                    'Using `16` you get all the events but be aware that it may ' +
                    "cause frame drops, use a bigger number if you don't need as " +
                    'much precision.');
            }
        }
        if (this.props.keyboardDismissMode === 'on-drag') {
            (0, react_native_web_internals_1.dismissKeyboard)();
        }
        this.scrollResponderHandleScroll(e);
    };
    ScrollView.prototype._setInnerViewRef = function (node) {
        this._innerViewRef = node;
    };
    ScrollView.prototype._setScrollNodeRef = function (node) {
        this._scrollNodeRef = node;
        // ScrollView needs to add more methods to the hostNode in addition to those
        // added by `usePlatformMethods`. This is temporarily until an API like
        // `ScrollView.scrollTo(hostNode, { x, y })` is added to React Native.
        if (node != null) {
            node.getScrollResponder = this.getScrollResponder;
            node.getInnerViewNode = this.getInnerViewNode;
            node.getInnerViewRef = this.getInnerViewRef;
            node.getNativeScrollRef = this.getNativeScrollRef;
            node.getScrollableNode = this.getScrollableNode;
            node.scrollTo = this.scrollTo;
            node.scrollToEnd = this.scrollToEnd;
            node.flashScrollIndicators = this.flashScrollIndicators;
            node.scrollResponderZoomTo = this.scrollResponderZoomTo;
            node.scrollResponderScrollNativeHandleToKeyboard =
                this.scrollResponderScrollNativeHandleToKeyboard;
        }
        var ref = (0, react_native_web_internals_1.mergeRefs)(this.props.forwardedRef);
        ref(node);
    };
    /**
     * Invoke this from an `onScroll` event.
     */
    ScrollView.prototype.scrollResponderHandleScrollShouldSetResponder = function () {
        return this.isTouching;
    };
    /**
     * Merely touch starting is not sufficient for a scroll view to become the
     * responder. Being the "responder" means that the very next touch move/end
     * event will result in an action/movement.
     *
     * Invoke this from an `onStartShouldSetResponder` event.
     *
     * `onStartShouldSetResponder` is used when the next move/end will trigger
     * some UI movement/action, but when you want to yield priority to views
     * nested inside of the view.
     *
     * There may be some cases where scroll views actually should return `true`
     * from `onStartShouldSetResponder`: Any time we are detecting a standard tap
     * that gives priority to nested views.
     *
     * - If a single tap on the scroll view triggers an action such as
     *   recentering a map style view yet wants to give priority to interaction
     *   views inside (such as dropped pins or labels), then we would return true
     *   from this method when there is a single touch.
     *
     * - Similar to the previous case, if a two finger "tap" should trigger a
     *   zoom, we would check the `touches` count, and if `>= 2`, we would return
     *   true.
     *
     */
    ScrollView.prototype.scrollResponderHandleStartShouldSetResponder = function () {
        return false;
    };
    /**
     * There are times when the scroll view wants to become the responder
     * (meaning respond to the next immediate `touchStart/touchEnd`), in a way
     * that *doesn't* give priority to nested views (hence the capture phase):
     *
     * - Currently animating.
     * - Tapping anywhere that is not the focused input, while the keyboard is
     *   up (which should dismiss the keyboard).
     *
     * Invoke this from an `onStartShouldSetResponderCapture` event.
     */
    ScrollView.prototype.scrollResponderHandleStartShouldSetResponderCapture = function (e) {
        // First see if we want to eat taps while the keyboard is up
        // var currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
        // if (!this.props.keyboardShouldPersistTaps &&
        //   currentlyFocusedTextInput != null &&
        //   e.target !== currentlyFocusedTextInput) {
        //   return true;
        // }
        return this.scrollResponderIsAnimating();
    };
    /**
     * Invoke this from an `onResponderReject` event.
     *
     * Some other element is not yielding its role as responder. Normally, we'd
     * just disable the `UIScrollView`, but a touch has already began on it, the
     * `UIScrollView` will not accept being disabled after that. The easiest
     * solution for now is to accept the limitation of disallowing this
     * altogether. To improve this, find a way to disable the `UIScrollView` after
     * a touch has already started.
     */
    ScrollView.prototype.scrollResponderHandleResponderReject = function () {
        (0, react_native_web_internals_1.warning)(false, "ScrollView doesn't take rejection well - scrolls anyway");
    };
    /**
     * We will allow the scroll view to give up its lock iff it acquired the lock
     * during an animation. This is a very useful default that happens to satisfy
     * many common user experiences.
     *
     * - Stop a scroll on the left edge, then turn that into an outer view's
     *   backswipe.
     * - Stop a scroll mid-bounce at the top, continue pulling to have the outer
     *   view dismiss.
     * - However, without catching the scroll view mid-bounce (while it is
     *   motionless), if you drag far enough for the scroll view to become
     *   responder (and therefore drag the scroll view a bit), any backswipe
     *   navigation of a swipe gesture higher in the view hierarchy, should be
     *   rejected.
     */
    ScrollView.prototype.scrollResponderHandleTerminationRequest = function () {
        return !this.observedScrollSinceBecomingResponder;
    };
    /**
     * Invoke this from an `onTouchEnd` event.
     *
     * @param {SyntheticEvent} e Event.
     */
    ScrollView.prototype.scrollResponderHandleTouchEnd = function (e) {
        var nativeEvent = e.nativeEvent;
        this.isTouching = nativeEvent.touches.length !== 0;
        this.props.onTouchEnd && this.props.onTouchEnd(e);
    };
    /**
     * Invoke this from an `onResponderRelease` event.
     */
    ScrollView.prototype.scrollResponderHandleResponderRelease = function (e) {
        this.props.onResponderRelease && this.props.onResponderRelease(e);
        // By default scroll views will unfocus a textField
        // if another touch occurs outside of it
        var currentlyFocusedTextInput = react_native_web_internals_1.TextInputState.currentlyFocusedField();
        if (!this.props.keyboardShouldPersistTaps &&
            currentlyFocusedTextInput != null &&
            e.target !== currentlyFocusedTextInput &&
            !this.observedScrollSinceBecomingResponder &&
            !this.becameResponderWhileAnimating) {
            this.props.onScrollResponderKeyboardDismissed &&
                this.props.onScrollResponderKeyboardDismissed(e);
            react_native_web_internals_1.TextInputState.blurTextInput(currentlyFocusedTextInput);
        }
    };
    ScrollView.prototype.scrollResponderHandleScroll = function (e) {
        this.observedScrollSinceBecomingResponder = true;
        this.props.onScroll && this.props.onScroll(e);
    };
    /**
     * Invoke this from an `onResponderGrant` event.
     */
    ScrollView.prototype.scrollResponderHandleResponderGrant = function (e) {
        this.observedScrollSinceBecomingResponder = false;
        this.props.onResponderGrant && this.props.onResponderGrant(e);
        this.becameResponderWhileAnimating = this.scrollResponderIsAnimating();
    };
    /**
     * Unfortunately, `onScrollBeginDrag` also fires when *stopping* the scroll
     * animation, and there's not an easy way to distinguish a drag vs. stopping
     * momentum.
     *
     * Invoke this from an `onScrollBeginDrag` event.
     */
    ScrollView.prototype.scrollResponderHandleScrollBeginDrag = function (e) {
        this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e);
    };
    /**
     * Invoke this from an `onScrollEndDrag` event.
     */
    ScrollView.prototype.scrollResponderHandleScrollEndDrag = function (e) {
        this.props.onScrollEndDrag && this.props.onScrollEndDrag(e);
    };
    /**
     * Invoke this from an `onMomentumScrollBegin` event.
     */
    ScrollView.prototype.scrollResponderHandleMomentumScrollBegin = function (e) {
        this.lastMomentumScrollBeginTime = Date.now();
        this.props.onMomentumScrollBegin && this.props.onMomentumScrollBegin(e);
    };
    /**
     * Invoke this from an `onMomentumScrollEnd` event.
     */
    ScrollView.prototype.scrollResponderHandleMomentumScrollEnd = function (e) {
        this.lastMomentumScrollEndTime = Date.now();
        this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e);
    };
    /**
     * Invoke this from an `onTouchStart` event.
     *
     * Since we know that the `SimpleEventPlugin` occurs later in the plugin
     * order, after `ResponderEventPlugin`, we can detect that we were *not*
     * permitted to be the responder (presumably because a contained view became
     * responder). The `onResponderReject` won't fire in that case - it only
     * fires when a *current* responder rejects our request.
     *
     * @param {SyntheticEvent} e Touch Start event.
     */
    ScrollView.prototype.scrollResponderHandleTouchStart = function (e) {
        this.isTouching = true;
        this.props.onTouchStart && this.props.onTouchStart(e);
    };
    /**
     * Invoke this from an `onTouchMove` event.
     *
     * Since we know that the `SimpleEventPlugin` occurs later in the plugin
     * order, after `ResponderEventPlugin`, we can detect that we were *not*
     * permitted to be the responder (presumably because a contained view became
     * responder). The `onResponderReject` won't fire in that case - it only
     * fires when a *current* responder rejects our request.
     *
     * @param {SyntheticEvent} e Touch Start event.
     */
    ScrollView.prototype.scrollResponderHandleTouchMove = function (e) {
        this.props.onTouchMove && this.props.onTouchMove(e);
    };
    ScrollView.prototype.scrollResponderHandleTerminate = function (e) {
        this.props.onResponderTerminate && this.props.onResponderTerminate(e);
    };
    /**
     * A helper function for this class that lets us quickly determine if the
     * view is currently animating. This is particularly useful to know when
     * a touch has just started or ended.
     */
    ScrollView.prototype.scrollResponderIsAnimating = function () {
        var now = Date.now();
        var timeSinceLastMomentumScrollEnd = now - this.lastMomentumScrollEndTime;
        var isAnimating = timeSinceLastMomentumScrollEnd < IS_ANIMATING_TOUCH_START_THRESHOLD_MS ||
            this.lastMomentumScrollEndTime < this.lastMomentumScrollBeginTime;
        return isAnimating;
    };
    /**
     * Displays the scroll indicators momentarily.
     */
    ScrollView.prototype.scrollResponderFlashScrollIndicators = function () { };
    ScrollView.prototype.scrollResponderTextInputFocusError = function (e) {
        console.error('Error measuring text field: ', e);
    };
    return ScrollView;
}(react_1.default.Component));
var commonStyle = {
    flexGrow: 1,
    flexShrink: 1,
    // Enable hardware compositing in modern browsers.
    // Creates a new layer with its own backing surface that can significantly
    // improve scroll performance.
    transform: [{ translateZ: 0 }],
    // iOS native scrolling
    WebkitOverflowScrolling: 'touch',
};
var styles = {
    baseVertical: __assign(__assign({}, commonStyle), { flexDirection: 'column', overflowX: 'hidden', overflowY: 'auto' }),
    baseHorizontal: __assign(__assign({}, commonStyle), { flexDirection: 'row', overflowX: 'auto', overflowY: 'hidden' }),
    contentContainerHorizontal: {
        flexDirection: 'row',
    },
    contentContainerCenterContent: {
        justifyContent: 'center',
        flexGrow: 1,
    },
    stickyHeader: {
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    pagingEnabledHorizontal: {
        scrollSnapType: 'x mandatory',
    },
    pagingEnabledVertical: {
        scrollSnapType: 'y mandatory',
    },
    pagingEnabledChild: {
        scrollSnapAlign: 'start',
    },
};
var ForwardedScrollView = react_1.default.forwardRef(function (props, forwardedRef) {
    return (0, jsx_runtime_1.jsx)(ScrollView, __assign({}, props, { forwardedRef: forwardedRef }));
});
exports.ScrollView = ForwardedScrollView;
ForwardedScrollView.displayName = 'ScrollView';
exports.default = ForwardedScrollView;

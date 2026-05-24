"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
exports.VirtualizedList = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var ScrollView_1 = require("../../../ScrollView");
var RefreshControl_1 = require("../../../RefreshControl");
var Batchinator_1 = require("../Batchinator");
var ChildListCollection_1 = require("./ChildListCollection");
var FillRateHelper_1 = require("../FillRateHelper");
var StateSafePureComponent_1 = require("./StateSafePureComponent");
var ViewabilityHelper_1 = require("../ViewabilityHelper");
var VirtualizedListCellRenderer_1 = require("./VirtualizedListCellRenderer");
var VirtualizedListContext_1 = require("./VirtualizedListContext");
var __DEV__ = process.env.NODE_ENV !== 'production';
var ON_EDGE_REACHED_EPSILON = 0.001;
var _usedIndexForKey = false;
var _keylessItemComponentName = '';
var defaultViewabilityConfig = {
    viewabilityHelper: null,
    onViewableItemsChanged: null,
};
var defaultRenderMask = {
    renderMask: null,
    cellsAroundViewport: { first: 0, last: 0 },
};
// Default Props Helper Functions
function horizontalOrDefault(horizontal) {
    return horizontal !== null && horizontal !== void 0 ? horizontal : false;
}
function initialNumToRenderOrDefault(initialNumToRender) {
    return initialNumToRender !== null && initialNumToRender !== void 0 ? initialNumToRender : 10;
}
function maxToRenderPerBatchOrDefault(maxToRenderPerBatch) {
    return maxToRenderPerBatch !== null && maxToRenderPerBatch !== void 0 ? maxToRenderPerBatch : 10;
}
function onStartReachedThresholdOrDefault(onStartReachedThreshold) {
    return onStartReachedThreshold !== null && onStartReachedThreshold !== void 0 ? onStartReachedThreshold : 2;
}
function onEndReachedThresholdOrDefault(onEndReachedThreshold) {
    return onEndReachedThreshold !== null && onEndReachedThreshold !== void 0 ? onEndReachedThreshold : 2;
}
function getScrollingThreshold(threshold, visibleLength) {
    return (threshold * visibleLength) / 2;
}
function scrollEventThrottleOrDefault(scrollEventThrottle) {
    return scrollEventThrottle !== null && scrollEventThrottle !== void 0 ? scrollEventThrottle : 50;
}
function windowSizeOrDefault(windowSize) {
    return windowSize !== null && windowSize !== void 0 ? windowSize : 21;
}
function findLastWhere(arr, predicate) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
            return arr[i];
        }
    }
    return null;
}
var VirtualizedList = /** @class */ (function (_super) {
    __extends(VirtualizedList, _super);
    function VirtualizedList(props) {
        var _a;
        var _this = _super.call(this, props) || this;
        _this._captureRef = function (ref) {
            _this._scrollRef = ref;
        };
        _this._onContentSizeChange = function (width, height) {
            // Handle content size changes
        };
        _this._onLayout = function (event) {
            // Handle layout changes
        };
        _this._onScroll = function (event) {
            // Handle scroll events
        };
        _this._nestedChildLists = new ChildListCollection_1.ChildListCollection();
        _this._viewabilityTuples = [];
        _this._scrollMetrics = {
            contentLength: 0,
            dOffset: 0,
            dt: 10,
            offset: 0,
            timestamp: 0,
            velocity: 0,
            visibleLength: 0,
        };
        _this._highestMeasuredFrameIndex = 0;
        _this._headerLength = 0;
        _this._footerLength = 0;
        _this._averageCellLength = 0;
        _this._hasWarned = {};
        _this._fillRateHelper = new FillRateHelper_1.FillRateHelper(_this._getFrameMetrics);
        _this._updateCellsToRenderBatcher = new Batchinator_1.Batchinator(_this._updateCellsToRender, (_a = _this.props.updateCellsBatchingPeriod) !== null && _a !== void 0 ? _a : 50);
        if (_this.props.viewabilityConfig && _this.props.onViewableItemsChanged) {
            _this._viewabilityTuples.push({
                viewabilityHelper: new ViewabilityHelper_1.ViewabilityHelper(_this.props.viewabilityConfig),
                onViewableItemsChanged: _this.props.onViewableItemsChanged,
            });
        }
        return _this;
    }
    VirtualizedList.prototype.scrollToEnd = function (params) {
        var animated = params ? params.animated : true;
        var veryLast = this.props.getItemCount(this.props.data) - 1;
        if (veryLast < 0) {
            return;
        }
        var frame = this.__getFrameMetricsApprox(veryLast, this.props);
        var offset = Math.max(0, frame.offset + frame.length + this._footerLength - this._scrollMetrics.visibleLength);
        if (this._scrollRef == null) {
            return;
        }
        if (this._scrollRef.scrollTo == null) {
            console.warn('No scrollTo method provided. This may be because you have two nested ' +
                'VirtualizedLists with the same orientation, or because you are ' +
                'using a custom component that does not implement scrollTo.');
            return;
        }
        this._scrollRef.scrollTo(horizontalOrDefault(this.props.horizontal)
            ? { x: offset, animated: animated }
            : { y: offset, animated: animated });
    };
    VirtualizedList.prototype.scrollToIndex = function (params) {
        var _a = this.props, data = _a.data, horizontal = _a.horizontal, getItemCount = _a.getItemCount, getItemLayout = _a.getItemLayout, onScrollToIndexFailed = _a.onScrollToIndexFailed;
        var animated = params.animated, index = params.index, viewOffset = params.viewOffset, viewPosition = params.viewPosition;
        (0, react_native_web_internals_1.invariant)(index >= 0, "scrollToIndex out of range: requested index ".concat(index, " but minimum is 0"));
        (0, react_native_web_internals_1.invariant)(getItemCount(data) >= 1, "scrollToIndex out of range: item length ".concat(getItemCount(data), " but minimum is 1"));
        (0, react_native_web_internals_1.invariant)(index < getItemCount(data), "scrollToIndex out of range: requested index ".concat(index, " is out of 0 to ").concat(getItemCount(data) - 1));
        if (!getItemLayout && index > this._highestMeasuredFrameIndex) {
            (0, react_native_web_internals_1.invariant)(!!onScrollToIndexFailed, 'scrollToIndex should be used in conjunction with getItemLayout or onScrollToIndexFailed, ' +
                'otherwise there is no way to know the location of offscreen indices or handle failures.');
            onScrollToIndexFailed({
                averageItemLength: this._averageCellLength,
                highestMeasuredFrameIndex: this._highestMeasuredFrameIndex,
                index: index,
            });
            return;
        }
        var frame = this.__getFrameMetricsApprox(Math.floor(index), this.props);
        var offset = Math.max(0, this._getOffsetApprox(index, this.props) -
            (viewPosition || 0) * (this._scrollMetrics.visibleLength - frame.length)) - (viewOffset || 0);
        if (this._scrollRef == null) {
            return;
        }
        this._scrollRef.scrollTo(horizontalOrDefault(horizontal) ? { x: offset, animated: animated } : { y: offset, animated: animated });
    };
    VirtualizedList.prototype.scrollToItem = function (params) {
        var _a = this.props, data = _a.data, getItem = _a.getItem, getItemCount = _a.getItemCount, horizontal = _a.horizontal, onScrollToIndexFailed = _a.onScrollToIndexFailed;
        var animated = params.animated, item = params.item, viewPosition = params.viewPosition, viewOffset = params.viewOffset;
        var index = this.props.data.indexOf(item);
        if (index !== -1) {
            this.scrollToIndex({
                animated: animated,
                index: index,
                viewOffset: viewOffset,
                viewPosition: viewPosition,
            });
        }
        else {
            var itemCount = getItemCount(data);
            for (var i = 0; i < itemCount; i++) {
                if (getItem(data, i) === item) {
                    this.scrollToIndex({
                        animated: animated,
                        index: i,
                        viewOffset: viewOffset,
                        viewPosition: viewPosition,
                    });
                    break;
                }
            }
        }
    };
    VirtualizedList.prototype.scrollToOffset = function (params) {
        var animated = params.animated, offset = params.offset;
        if (this._scrollRef == null) {
            return;
        }
        this._scrollRef.scrollTo(horizontalOrDefault(this.props.horizontal)
            ? { x: offset, animated: animated }
            : { y: offset, animated: animated });
    };
    VirtualizedList.prototype.recordInteraction = function () {
        this._nestedChildLists.forEach(function (childList) {
            childList.recordInteraction();
        });
        this._viewabilityTuples.forEach(function (viewabilityTuple) {
            viewabilityTuple.viewabilityHelper.recordInteraction();
        });
    };
    VirtualizedList.prototype.flashScrollIndicators = function () {
        if (this._scrollRef && this._scrollRef.flashScrollIndicators) {
            this._scrollRef.flashScrollIndicators();
        }
    };
    VirtualizedList.prototype.getScrollResponder = function () {
        if (this._scrollRef && this._scrollRef.getScrollResponder) {
            return this._scrollRef.getScrollResponder();
        }
    };
    VirtualizedList.prototype.getScrollableNode = function () {
        if (this._scrollRef && this._scrollRef.getScrollableNode) {
            return this._scrollRef.getScrollableNode();
        }
    };
    VirtualizedList.prototype.getScrollRef = function () {
        return this._scrollRef;
    };
    VirtualizedList.prototype.setNativeProps = function (props) {
        if (this._scrollRef) {
            this._scrollRef.setNativeProps(props);
        }
    };
    VirtualizedList.prototype.render = function () {
        var _a = this.props, ListEmptyComponent = _a.ListEmptyComponent, ListFooterComponent = _a.ListFooterComponent, ListHeaderComponent = _a.ListHeaderComponent, data = _a.data, debug = _a.debug, disableVirtualization = _a.disableVirtualization, getItem = _a.getItem, getItemCount = _a.getItemCount, getItemLayout = _a.getItemLayout, horizontal = _a.horizontal, keyExtractor = _a.keyExtractor, numColumns = _a.numColumns, onEndReached = _a.onEndReached, onEndReachedThreshold = _a.onEndReachedThreshold, onLayout = _a.onLayout, onRefresh = _a.onRefresh, onScroll = _a.onScroll, onScrollBeginDrag = _a.onScrollBeginDrag, onScrollEndDrag = _a.onScrollEndDrag, onMomentumScrollBegin = _a.onMomentumScrollBegin, onMomentumScrollEnd = _a.onMomentumScrollEnd, onStartReached = _a.onStartReached, onStartReachedThreshold = _a.onStartReachedThreshold, onViewableItemsChanged = _a.onViewableItemsChanged, refreshing = _a.refreshing, removeClippedSubviews = _a.removeClippedSubviews, renderItem = _a.renderItem, viewabilityConfig = _a.viewabilityConfig, viewabilityConfigCallbackPairs = _a.viewabilityConfigCallbackPairs, restProps = __rest(_a, ["ListEmptyComponent", "ListFooterComponent", "ListHeaderComponent", "data", "debug", "disableVirtualization", "getItem", "getItemCount", "getItemLayout", "horizontal", "keyExtractor", "numColumns", "onEndReached", "onEndReachedThreshold", "onLayout", "onRefresh", "onScroll", "onScrollBeginDrag", "onScrollEndDrag", "onMomentumScrollBegin", "onMomentumScrollEnd", "onStartReached", "onStartReachedThreshold", "onViewableItemsChanged", "refreshing", "removeClippedSubviews", "renderItem", "viewabilityConfig", "viewabilityConfigCallbackPairs"]);
        var itemCount = getItemCount(data);
        if (itemCount === 0) {
            return ListEmptyComponent ? <ListEmptyComponent /> : null;
        }
        return (<ScrollView_1.ScrollView {...restProps} ref={this._captureRef} onContentSizeChange={this._onContentSizeChange} onLayout={this._onLayout} onScroll={this._onScroll} refreshControl={onRefresh && <RefreshControl_1.RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} scrollEventThrottle={scrollEventThrottleOrDefault(this.props.scrollEventThrottle)} removeClippedSubviews={removeClippedSubviews}>
        {this._renderChildren()}
      </ScrollView_1.ScrollView>);
    };
    VirtualizedList.prototype._renderChildren = function () {
        var _a = this.props, data = _a.data, getItem = _a.getItem, getItemCount = _a.getItemCount, renderItem = _a.renderItem;
        var items = [];
        for (var i = 0; i < getItemCount(data); i++) {
            var item = getItem(data, i);
            items.push(<VirtualizedListCellRenderer_1.CellRenderer key={this.props.keyExtractor ? this.props.keyExtractor(item, i) : i} cellKey={String(i)} index={i} item={item} renderItem={renderItem}/>);
        }
        return items;
    };
    VirtualizedList.prototype.__getFrameMetricsApprox = function (index, props) {
        var frame = {
            length: this._averageCellLength,
            offset: this._averageCellLength * index,
        };
        return frame;
    };
    VirtualizedList.prototype._getOffsetApprox = function (index, props) {
        return this.__getFrameMetricsApprox(index, props).offset;
    };
    VirtualizedList.contextType = VirtualizedListContext_1.VirtualizedListContext;
    return VirtualizedList;
}(StateSafePureComponent_1.StateSafePureComponent));
exports.VirtualizedList = VirtualizedList;
exports.default = VirtualizedList;

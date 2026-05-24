"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
exports.ViewabilityHelper = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
/**
 * A Utility class for calculating viewable items based on current metrics like scroll position and
 * layout.
 */
var ViewabilityHelper = /** @class */ (function () {
    function ViewabilityHelper(config) {
        if (config === void 0) { config = { viewAreaCoveragePercentThreshold: 0 }; }
        this._hasInteracted = false;
        this._timers = new Set();
        this._viewableIndices = [];
        this._viewableItems = new Map();
        this._config = config;
    }
    /**
     * Cleanup, e.g. on unmount. Clears any pending timers.
     */
    ViewabilityHelper.prototype.dispose = function () {
        this._timers.forEach(clearTimeout);
    };
    /**
     * Determines which items are viewable based on the current metrics and config.
     */
    ViewabilityHelper.prototype.computeViewableItems = function (props, scrollOffset, viewportHeight, getFrameMetrics, renderRange) {
        var itemCount = props.getItemCount(props.data);
        var _a = this._config, itemVisiblePercentThreshold = _a.itemVisiblePercentThreshold, viewAreaCoveragePercentThreshold = _a.viewAreaCoveragePercentThreshold;
        var viewAreaMode = viewAreaCoveragePercentThreshold != null;
        var viewablePercentThreshold = viewAreaMode
            ? viewAreaCoveragePercentThreshold
            : itemVisiblePercentThreshold;
        (0, react_native_web_internals_1.invariant)(viewablePercentThreshold != null &&
            (itemVisiblePercentThreshold != null) !==
                (viewAreaCoveragePercentThreshold != null), 'Must set exactly one of itemVisiblePercentThreshold or viewAreaCoveragePercentThreshold');
        var viewableIndices = [];
        if (itemCount === 0) {
            return viewableIndices;
        }
        var firstVisible = -1;
        var _b = renderRange || { first: 0, last: itemCount - 1 }, first = _b.first, last = _b.last;
        if (last >= itemCount) {
            console.warn('Invalid render range computing viewability ' +
                JSON.stringify({ renderRange: renderRange, itemCount: itemCount }));
            return [];
        }
        for (var idx = first; idx <= last; idx++) {
            var metrics = getFrameMetrics(idx, props);
            if (!metrics) {
                continue;
            }
            var top_1 = metrics.offset - scrollOffset;
            var bottom = top_1 + metrics.length;
            if (top_1 < viewportHeight && bottom > 0) {
                firstVisible = idx;
                if (_isViewable(viewAreaMode, viewablePercentThreshold, top_1, bottom, viewportHeight, metrics.length)) {
                    viewableIndices.push(idx);
                }
            }
            else if (firstVisible >= 0) {
                break;
            }
        }
        return viewableIndices;
    };
    /**
     * Figures out which items are viewable and how that has changed from before and calls
     * `onViewableItemsChanged` as appropriate.
     */
    ViewabilityHelper.prototype.onUpdate = function (props, scrollOffset, viewportHeight, getFrameMetrics, createViewToken, onViewableItemsChanged, renderRange) {
        var _this = this;
        var itemCount = props.getItemCount(props.data);
        if ((this._config.waitForInteraction && !this._hasInteracted) ||
            itemCount === 0 ||
            !getFrameMetrics(0, props)) {
            return;
        }
        var viewableIndices = [];
        if (itemCount) {
            viewableIndices = this.computeViewableItems(props, scrollOffset, viewportHeight, getFrameMetrics, renderRange);
        }
        if (this._viewableIndices.length === viewableIndices.length &&
            this._viewableIndices.every(function (v, ii) { return v === viewableIndices[ii]; })) {
            return;
        }
        this._viewableIndices = viewableIndices;
        if (this._config.minimumViewTime) {
            var handle_1 = setTimeout(function () {
                _this._timers.delete(handle_1);
                _this._onUpdateSync(props, viewableIndices, onViewableItemsChanged, createViewToken);
            }, this._config.minimumViewTime);
            this._timers.add(handle_1);
        }
        else {
            this._onUpdateSync(props, viewableIndices, onViewableItemsChanged, createViewToken);
        }
    };
    ViewabilityHelper.prototype.resetViewableIndices = function () {
        this._viewableIndices = [];
    };
    ViewabilityHelper.prototype.recordInteraction = function () {
        this._hasInteracted = true;
    };
    ViewabilityHelper.prototype._onUpdateSync = function (props, viewableIndicesToCheck, onViewableItemsChanged, createViewToken) {
        var _this = this;
        viewableIndicesToCheck = viewableIndicesToCheck.filter(function (ii) {
            return _this._viewableIndices.includes(ii);
        });
        var prevItems = this._viewableItems;
        var nextItems = new Map(viewableIndicesToCheck.map(function (ii) {
            var viewable = createViewToken(ii, true, props);
            return [viewable.key, viewable];
        }));
        var changed = [];
        for (var _i = 0, nextItems_1 = nextItems; _i < nextItems_1.length; _i++) {
            var _a = nextItems_1[_i], key = _a[0], viewable = _a[1];
            if (!prevItems.has(key)) {
                changed.push(viewable);
            }
        }
        for (var _b = 0, prevItems_1 = prevItems; _b < prevItems_1.length; _b++) {
            var _c = prevItems_1[_b], key = _c[0], viewable = _c[1];
            if (!nextItems.has(key)) {
                changed.push(__assign(__assign({}, viewable), { isViewable: false }));
            }
        }
        if (changed.length > 0) {
            this._viewableItems = nextItems;
            onViewableItemsChanged({
                viewableItems: Array.from(nextItems.values()),
                changed: changed,
            });
        }
    };
    return ViewabilityHelper;
}());
exports.ViewabilityHelper = ViewabilityHelper;
function _isViewable(viewAreaMode, viewablePercentThreshold, top, bottom, viewportHeight, itemLength) {
    if (_isEntirelyVisible(top, bottom, viewportHeight)) {
        return true;
    }
    else {
        var pixels = _getPixelsVisible(top, bottom, viewportHeight);
        var percent = 100 * (viewAreaMode ? pixels / viewportHeight : pixels / itemLength);
        return percent >= viewablePercentThreshold;
    }
}
function _getPixelsVisible(top, bottom, viewportHeight) {
    var visibleHeight = Math.min(bottom, viewportHeight) - Math.max(top, 0);
    return Math.max(0, visibleHeight);
}
function _isEntirelyVisible(top, bottom, viewportHeight) {
    return top >= 0 && bottom <= viewportHeight && bottom > top;
}
exports.default = ViewabilityHelper;

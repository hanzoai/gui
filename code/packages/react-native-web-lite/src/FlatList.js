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
exports.FlatList = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var memoize_one_1 = require("memoize-one");
var react_1 = require("react");
var deepDiffer_1 = require("./vendor/react-native/deepDiffer");
var VirtualizedList_1 = require("./vendor/react-native/VirtualizedList");
var VirtualizeUtils_1 = require("./vendor/react-native/VirtualizeUtils");
var View_1 = require("./View");
function removeClippedSubviewsOrDefault(removeClippedSubviews) {
    return removeClippedSubviews !== null && removeClippedSubviews !== void 0 ? removeClippedSubviews : react_native_web_internals_1.Platform.OS === 'android';
}
function numColumnsOrDefault(numColumns) {
    return numColumns !== null && numColumns !== void 0 ? numColumns : 1;
}
function isArrayLike(data) {
    return typeof Object(data).length === 'number';
}
/**
 * A performant interface for rendering simple, flat lists, supporting the most handy features.
 */
var FlatList = /** @class */ (function (_super) {
    __extends(FlatList, _super);
    function FlatList(props) {
        var _this = _super.call(this, props) || this;
        _this._listRef = null;
        _this._virtualizedListPairs = [];
        _this._captureRef = function (ref) {
            _this._listRef = ref;
        };
        _this._getItem = function (data, index) {
            var numColumns = numColumnsOrDefault(_this.props.numColumns);
            if (numColumns > 1) {
                var ret = [];
                for (var kk = 0; kk < numColumns; kk++) {
                    var itemIndex = index * numColumns + kk;
                    if (itemIndex < data.length) {
                        var item = data[itemIndex];
                        ret.push(item);
                    }
                }
                return ret;
            }
            else {
                return data[index];
            }
        };
        _this._getItemCount = function (data) {
            if (data != null && isArrayLike(data)) {
                var numColumns = numColumnsOrDefault(_this.props.numColumns);
                return numColumns > 1 ? Math.ceil(data.length / numColumns) : data.length;
            }
            else {
                return 0;
            }
        };
        _this._keyExtractor = function (items, index) {
            var _a;
            var numColumns = numColumnsOrDefault(_this.props.numColumns);
            var keyExtractor = (_a = _this.props.keyExtractor) !== null && _a !== void 0 ? _a : VirtualizeUtils_1.keyExtractor;
            if (numColumns > 1) {
                (0, react_native_web_internals_1.invariant)(Array.isArray(items), 'FlatList: Expected each item to be an array with multiple columns.');
                return items
                    .map(function (item, kk) { return keyExtractor(item, index * numColumns + kk); })
                    .join(':');
            }
            return keyExtractor(items, index);
        };
        _this._renderer = function (ListItemComponent, renderItem, columnWrapperStyle, numColumns, extraData) {
            var cols = numColumnsOrDefault(numColumns);
            var render = function (props) {
                if (ListItemComponent) {
                    return (0, jsx_runtime_1.jsx)(ListItemComponent, __assign({}, props));
                }
                else if (renderItem) {
                    return renderItem(props);
                }
                else {
                    return null;
                }
            };
            var renderProp = function (info) {
                if (cols > 1) {
                    var item = info.item, index_1 = info.index;
                    (0, react_native_web_internals_1.invariant)(Array.isArray(item), 'Expected array of items with numColumns > 1');
                    return ((0, jsx_runtime_1.jsx)(View_1.View, { style: [styles.row, columnWrapperStyle], children: item.map(function (it, kk) {
                            var element = render({
                                item: it,
                                index: index_1 * cols + kk,
                                separators: info.separators,
                            });
                            return element != null ? ((0, jsx_runtime_1.jsx)(react_1.default.Fragment, { children: element }, kk)) : null;
                        }) }));
                }
                else {
                    return render(info);
                }
            };
            return ListItemComponent
                ? { ListItemComponent: renderProp }
                : { renderItem: renderProp };
        };
        _this._memoizedRenderer = (0, memoize_one_1.default)(_this._renderer);
        _this.props = props;
        _this._checkProps(_this.props);
        if (_this.props.viewabilityConfigCallbackPairs) {
            _this._virtualizedListPairs = _this.props.viewabilityConfigCallbackPairs.map(function (pair) { return ({
                viewabilityConfig: pair.viewabilityConfig,
                onViewableItemsChanged: _this._createOnViewableItemsChanged(pair.onViewableItemsChanged),
            }); });
        }
        else if (_this.props.onViewableItemsChanged) {
            _this._virtualizedListPairs.push({
                viewabilityConfig: _this.props.viewabilityConfig,
                onViewableItemsChanged: _this._createOnViewableItemsChanged(_this.props.onViewableItemsChanged),
            });
        }
        return _this;
    }
    FlatList.prototype.componentDidUpdate = function (prevProps) {
        (0, react_native_web_internals_1.invariant)(prevProps.numColumns === this.props.numColumns, 'Changing numColumns on the fly is not supported. Change the key prop on FlatList when ' +
            'changing the number of columns to force a fresh render of the component.');
        (0, react_native_web_internals_1.invariant)(prevProps.onViewableItemsChanged === this.props.onViewableItemsChanged, 'Changing onViewableItemsChanged on the fly is not supported');
        (0, react_native_web_internals_1.invariant)(!(0, deepDiffer_1.deepDiffer)(prevProps.viewabilityConfig, this.props.viewabilityConfig), 'Changing viewabilityConfig on the fly is not supported');
        (0, react_native_web_internals_1.invariant)(prevProps.viewabilityConfigCallbackPairs ===
            this.props.viewabilityConfigCallbackPairs, 'Changing viewabilityConfigCallbackPairs on the fly is not supported');
        this._checkProps(this.props);
    };
    FlatList.prototype._checkProps = function (props) {
        var getItem = props.getItem, getItemCount = props.getItemCount, horizontal = props.horizontal, columnWrapperStyle = props.columnWrapperStyle, onViewableItemsChanged = props.onViewableItemsChanged, viewabilityConfigCallbackPairs = props.viewabilityConfigCallbackPairs;
        var numColumns = numColumnsOrDefault(this.props.numColumns);
        (0, react_native_web_internals_1.invariant)(!getItem && !getItemCount, 'FlatList does not support custom data formats.');
        if (numColumns > 1) {
            (0, react_native_web_internals_1.invariant)(!horizontal, 'numColumns does not support horizontal.');
        }
        else {
            (0, react_native_web_internals_1.invariant)(!columnWrapperStyle, 'columnWrapperStyle not supported for single column lists');
        }
        (0, react_native_web_internals_1.invariant)(!(onViewableItemsChanged && viewabilityConfigCallbackPairs), 'FlatList does not support setting both onViewableItemsChanged and viewabilityConfigCallbackPairs.');
    };
    FlatList.prototype._pushMultiColumnViewable = function (arr, v) {
        var _a;
        var numColumns = numColumnsOrDefault(this.props.numColumns);
        var keyExtractor = (_a = this.props.keyExtractor) !== null && _a !== void 0 ? _a : VirtualizeUtils_1.keyExtractor;
        v.item.forEach(function (item, ii) {
            (0, react_native_web_internals_1.invariant)(v.index != null, 'Missing index!');
            var index = v.index * numColumns + ii;
            arr.push(__assign(__assign({}, v), { item: item, key: keyExtractor(item, index), index: index }));
        });
    };
    FlatList.prototype._createOnViewableItemsChanged = function (onViewableItemsChanged) {
        var _this = this;
        return function (info) {
            var numColumns = numColumnsOrDefault(_this.props.numColumns);
            if (onViewableItemsChanged) {
                if (numColumns > 1) {
                    var changed_1 = [];
                    var viewableItems_1 = [];
                    info.viewableItems.forEach(function (v) {
                        return _this._pushMultiColumnViewable(viewableItems_1, v);
                    });
                    info.changed.forEach(function (v) { return _this._pushMultiColumnViewable(changed_1, v); });
                    onViewableItemsChanged({ viewableItems: viewableItems_1, changed: changed_1 });
                }
                else {
                    onViewableItemsChanged(info);
                }
            }
        };
    };
    FlatList.prototype.render = function () {
        var _a = this.props, numColumns = _a.numColumns, columnWrapperStyle = _a.columnWrapperStyle, _removeClippedSubviews = _a.removeClippedSubviews, _b = _a.strictMode, strictMode = _b === void 0 ? false : _b, restProps = __rest(_a, ["numColumns", "columnWrapperStyle", "removeClippedSubviews", "strictMode"]);
        var renderer = strictMode ? this._memoizedRenderer : this._renderer;
        return ((0, jsx_runtime_1.jsx)(VirtualizedList_1.VirtualizedList, __assign({}, restProps, { getItem: this._getItem, getItemCount: this._getItemCount, keyExtractor: this._keyExtractor, ref: this._captureRef, viewabilityConfigCallbackPairs: this._virtualizedListPairs, removeClippedSubviews: removeClippedSubviewsOrDefault(_removeClippedSubviews) }, renderer(this.props.ListItemComponent, this.props.renderItem, columnWrapperStyle, numColumns, this.props.extraData))));
    };
    return FlatList;
}(react_1.default.PureComponent));
exports.FlatList = FlatList;
var styles = {
    row: { flexDirection: 'row' },
};
exports.default = FlatList;

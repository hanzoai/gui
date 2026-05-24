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
var View_1 = require("../../../View");
var deepDiffer_1 = require("../deepDiffer");
var Platform_1 = require("../../../exports/Platform");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var React = require("react");
var VirtualizedList_1 = require("../VirtualizedList");
var VirtualizeUtils_1 = require("../VirtualizeUtils");
var memoize_one_1 = require("memoize-one");
// Props interface removed - Flow types converted
/**
 * Takes an item from `data` and renders it into the list. Example usage:
 *
 *     <FlatList
 *       ItemSeparatorComponent={Platform.OS !== 'android' && ({highlighted}) => (
 *
 *       )}
 *       data={[{title: 'Title Text', key: 'item1'}]}
 *       renderItem={({item, separators}) => (
 *         <TouchableHighlight
 *           onPress={() => this._onPress(item)}
 *           onShowUnderlay={separators.highlight}
 *           onHideUnderlay={separators.unhighlight}>
 *
 *             <Text>{item.title}</Text>
 *           </View>
 *         </TouchableHighlight>
 *       )}
 *     />
 *
 * Provides additional metadata like `index` if you need it, as well as a more generic
 * `separators.updateProps` function which let's you set whatever props you want to change the
 * rendering of either the leading separator or trailing separator in case the more common
 * `highlight` and `unhighlight` (which set the `highlighted: boolean` prop) are insufficient for
 * your use-case.
 */
// Props interface removed - Flow types converted
/**
 * Default Props Helper Functions
 * Use the following helper functions for default values
 */
// removeClippedSubviewsOrDefault(this.props.removeClippedSubviews)
function removeClippedSubviewsOrDefault(removeClippedSubviews) {
    return removeClippedSubviews !== null && removeClippedSubviews !== void 0 ? removeClippedSubviews : Platform_1.Platform.OS === 'android';
}
// numColumnsOrDefault(this.props.numColumns)
function numColumnsOrDefault(numColumns) {
    return numColumns !== null && numColumns !== void 0 ? numColumns : 1;
}
function isArrayLike(data) {
    return typeof Object(data).length === 'number';
}
// Complex type definitions removed - Flow types converted
/**
 * A performant interface for rendering simple, flat lists, supporting the most handy features:
 *
 *  - Fully cross-platform.
 *  - Optional horizontal mode.
 *  - Configurable viewability callbacks.
 *  - Header support.
 *  - Footer support.
 *  - Separator support.
 *  - Pull to Refresh.
 *  - Scroll loading.
 *  - ScrollToIndex support.
 *
 * If you need section support, use [`<SectionList>`](docs/sectionlist.html).
 *
 * Minimal Example:
 *
 *     <FlatList
 *       data={[{key: 'a'}, {key: 'b'}]}
 *       renderItem={({item}) => <Text>{item.key}</Text>}
 *     />
 *
 * More complex, multi-select example demonstrating `PureComponent` usage for perf optimization and avoiding bugs.
 *
 * - By binding the `onPressItem` handler, the props will remain `===` and `PureComponent` will
 *   prevent wasteful re-renders unless the actual `id`, `selected`, or `title` props change, even
 *   if the components rendered in `MyListItem` did not have such optimizations.
 * - By passing `extraData={this.state}` to `FlatList` we make sure `FlatList` itself will re-render
 *   when the `state.selected` changes. Without setting this prop, `FlatList` would not know it
 *   needs to re-render any items because it is also a `PureComponent` and the prop comparison will
 *   not show any changes.
 * - `keyExtractor` tells the list to use the `id`s for the react keys instead of the default `key` property.
 *
 *
 *     class MyListItem extends React.PureComponent {
 *       _onPress = () => {
 *         this.props.onPressItem(this.props.id);
 *       };
 *
 *       render() {
 *         const textColor = this.props.selected ? "red" : "black";
 *         return (
 *           <TouchableOpacity onPress={this._onPress}>
 *             <View>
 *
 *                 {this.props.title}
 *               </Text>
 *             </View>
 *           </TouchableOpacity>
 *         );
 *       }
 *     }
 *
 *     class MultiSelectList extends React.PureComponent {
 *       state = {selected: new Map()};
 *
 *       _keyExtractor = (item, index) => item.id;
 *
 *       _onPressItem = (id) => {
 *         // updater functions are preferred for transactional updates
 *         this.setState((state) => {
 *           // copy the map rather than modifying state.
 *           const selected = new Map(state.selected);
 *           selected.set(id, !selected.get(id)); // toggle
 *           return {selected};
 *         });
 *       };
 *
 *       _renderItem = ({item}) => (
 *         <MyListItem
 *           id={item.id}
 *           onPressItem={this._onPressItem}
 *           selected={!!this.state.selected.get(item.id)}
 *           title={item.title}
 *         />
 *       );
 *
 *       render() {
 *         return (
 *           <FlatList
 *             data={this.props.data}
 *             extraData={this.state}
 *             keyExtractor={this._keyExtractor}
 *             renderItem={this._renderItem}
 *           />
 *         );
 *       }
 *     }
 *
 * This is a convenience wrapper around [`<VirtualizedList>`](docs/virtualizedlist.html),
 * and thus inherits its props (as well as those of `ScrollView`) that aren't explicitly listed
 * here, along with the following caveats:
 *
 * - Internal state is not preserved when content scrolls out of the render window. Make sure all
 *   your data is captured in the item data or external stores like Flux, Redux, or Relay.
 * - This is a `PureComponent` which means that it will not re-render if `props` remain shallow-
 *   equal. Make sure that everything your `renderItem` function depends on is passed as a prop
 *   (e.g. `extraData`) that is not `===` after updates, otherwise your UI may not update on
 *   changes. This includes the `data` prop and parent component state.
 * - In order to constrain memory and enable smooth scrolling, content is rendered asynchronously
 *   offscreen. This means it's possible to scroll faster than the fill rate ands momentarily see
 *   blank content. This is a tradeoff that can be adjusted to suit the needs of each application,
 *   and we are working on improving it behind the scenes.
 * - By default, the list looks for a `key` prop on each item and uses that for the React key.
 *   Alternatively, you can provide a custom `keyExtractor` prop.
 *
 * Also inherits [ScrollView Props](docs/scrollview.html#props), unless it is nested in another FlatList of same orientation.
 */
var FlatList = /** @class */ (function (_super) {
    __extends(FlatList, _super);
    function FlatList(props) {
        var _this = _super.call(this, props) || this;
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
            // Legacy behavior of FlatList was to forward "undefined" length if invalid
            // data like a non-arraylike object is passed. VirtualizedList would then
            // coerce this, and the math would work out to no-op. For compatibility, if
            // invalid data is passed, we tell VirtualizedList there are zero items
            // available to prevent it from trying to read from the invalid data
            // (without propagating invalidly typed data).
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
                (0, react_native_web_internals_1.invariant)(Array.isArray(items), 'FlatList: Encountered internal consistency error, expected each item to consist of an ' +
                    'array with 1-%s columns; instead, received a single item.', numColumns);
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
                    return <ListItemComponent {...props}/>;
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
                    return (<View_1.View style={[styles.row, columnWrapperStyle]}>
            {item.map(function (it, kk) {
                            var element = render({
                                item: it,
                                index: index_1 * cols + kk,
                                separators: info.separators,
                            });
                            return element != null ? (<React.Fragment key={kk}>{element}</React.Fragment>) : null;
                        })}
          </View_1.View>);
                }
                else {
                    return render(info);
                }
            };
            return ListItemComponent
                ? { ListItemComponent: renderProp }
                : { renderItem: renderProp };
        };
        // $FlowFixMe[missing-local-annot]
        _this._memoizedRenderer = (0, memoize_one_1.default)(_this._renderer);
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
    /**
     * Scrolls to the end of the content. May be janky without `getItemLayout` prop.
     */
    FlatList.prototype.scrollToEnd = function (params) {
        if (this._listRef) {
            this._listRef.scrollToEnd(params);
        }
    };
    /**
     * Scrolls to the item at the specified index such that it is positioned in the viewable area
     * such that `viewPosition` 0 places it at the top, 1 at the bottom, and 0.5 centered in the
     * middle. `viewOffset` is a fixed number of pixels to offset the final target position.
     *
     * Note: cannot scroll to locations outside the render window without specifying the
     * `getItemLayout` prop.
     */
    FlatList.prototype.scrollToIndex = function (params) {
        if (this._listRef) {
            this._listRef.scrollToIndex(params);
        }
    };
    /**
     * Requires linear scan through data - use `scrollToIndex` instead if possible.
     *
     * Note: cannot scroll to locations outside the render window without specifying the
     * `getItemLayout` prop.
     */
    FlatList.prototype.scrollToItem = function (params) {
        if (this._listRef) {
            this._listRef.scrollToItem(params);
        }
    };
    /**
     * Scroll to a specific content pixel offset in the list.
     *
     * Check out [scrollToOffset](docs/virtualizedlist.html#scrolltooffset) of VirtualizedList
     */
    FlatList.prototype.scrollToOffset = function (params) {
        if (this._listRef) {
            this._listRef.scrollToOffset(params);
        }
    };
    /**
     * Tells the list an interaction has occurred, which should trigger viewability calculations, e.g.
     * if `waitForInteractions` is true and the user has not scrolled. This is typically called by
     * taps on items or by navigation actions.
     */
    FlatList.prototype.recordInteraction = function () {
        if (this._listRef) {
            this._listRef.recordInteraction();
        }
    };
    /**
     * Displays the scroll indicators momentarily.
     *
     * @platform ios
     */
    FlatList.prototype.flashScrollIndicators = function () {
        if (this._listRef) {
            this._listRef.flashScrollIndicators();
        }
    };
    /**
     * Provides a handle to the underlying scroll responder.
     */
    FlatList.prototype.getScrollResponder = function () {
        if (this._listRef) {
            return this._listRef.getScrollResponder();
        }
    };
    /**
     * Provides a reference to the underlying host component
     */
    FlatList.prototype.getNativeScrollRef = function () {
        if (this._listRef) {
            return this._listRef.getScrollRef();
        }
    };
    FlatList.prototype.getScrollableNode = function () {
        if (this._listRef) {
            return this._listRef.getScrollableNode();
        }
    };
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
        (0, react_native_web_internals_1.invariant)(!(onViewableItemsChanged && viewabilityConfigCallbackPairs), 'FlatList does not support setting both onViewableItemsChanged and ' +
            'viewabilityConfigCallbackPairs.');
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
        return (<VirtualizedList_1.VirtualizedList {...restProps} getItem={this._getItem} getItemCount={this._getItemCount} keyExtractor={this._keyExtractor} ref={this._captureRef} viewabilityConfigCallbackPairs={this._virtualizedListPairs} removeClippedSubviews={removeClippedSubviewsOrDefault(_removeClippedSubviews)} {...renderer(this.props.ListItemComponent, this.props.renderItem, columnWrapperStyle, numColumns, this.props.extraData)}/>);
    };
    return FlatList;
}(React.PureComponent));
exports.FlatList = FlatList;
var styles = react_native_web_internals_1.StyleSheet.create({
    row: { flexDirection: 'row' },
});
exports.default = FlatList;

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
exports.VirtualizedSectionList = void 0;
var VirtualizedList_1 = require("../VirtualizedList");
var React = require("react");
var defaultProps = {
    data: [],
    key: null,
    renderItem: null,
    ItemSeparatorComponent: null,
    keyExtractor: null,
};
var VirtualizedSectionList = /** @class */ (function (_super) {
    __extends(VirtualizedSectionList, _super);
    function VirtualizedSectionList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._keyExtractor = function (item, index) {
            var keyExtractor = _this.props.keyExtractor || _this._defaultKeyExtractor;
            return keyExtractor(item, index);
        };
        _this._defaultKeyExtractor = function (item, index) {
            return item.key != null ? item.key : String(index);
        };
        _this._captureRef = function (ref) {
            _this._listRef = ref;
        };
        _this._renderItem = function (itemCount) {
            return function (_a) {
                var item = _a.item, index = _a.index;
                if (index === 0 || index === itemCount - 1) {
                    return null;
                }
                var renderItem = _this.props.renderItem || _this._defaultRenderItem;
                return renderItem({ item: item, index: index, section: item });
            };
        };
        _this._defaultRenderItem = function (_a) {
            var item = _a.item;
            return null;
        };
        _this._onViewableItemsChanged = function (info) {
            if (_this.props.onViewableItemsChanged) {
                _this.props.onViewableItemsChanged(info);
            }
        };
        return _this;
    }
    VirtualizedSectionList.prototype.scrollToLocation = function (params) {
        var index = params.itemIndex;
        for (var i = 0; i < params.sectionIndex; i++) {
            index += this.props.getItemCount(this.props.sections[i].data) + 2;
        }
        var viewOffset = params.viewOffset || 0;
        if (this._listRef == null) {
            return;
        }
        if (params.itemIndex > 0 && this.props.stickySectionHeadersEnabled) {
            var frame = this._listRef.__getFrameMetricsApprox(index - params.itemIndex, this._listRef.props);
            viewOffset += frame.length;
        }
        var toIndexParams = __assign(__assign({}, params), { viewOffset: viewOffset, index: index });
        this._listRef.scrollToIndex(toIndexParams);
    };
    VirtualizedSectionList.prototype.getListRef = function () {
        return this._listRef;
    };
    VirtualizedSectionList.prototype.render = function () {
        var _this = this;
        var _a = this.props, ItemSeparatorComponent = _a.ItemSeparatorComponent, SectionSeparatorComponent = _a.SectionSeparatorComponent, _renderItem = _a.renderItem, renderSectionFooter = _a.renderSectionFooter, renderSectionHeader = _a.renderSectionHeader, _sections = _a.sections, stickySectionHeadersEnabled = _a.stickySectionHeadersEnabled, passThroughProps = __rest(_a, ["ItemSeparatorComponent", "SectionSeparatorComponent", "renderItem", "renderSectionFooter", "renderSectionHeader", "sections", "stickySectionHeadersEnabled"]);
        var listHeaderOffset = this.props.ListHeaderComponent ? 1 : 0;
        var stickyHeaderIndices = this.props.stickySectionHeadersEnabled ? [] : undefined;
        var itemCount = 0;
        for (var _i = 0, _b = this.props.sections; _i < _b.length; _i++) {
            var section = _b[_i];
            if (stickyHeaderIndices != null) {
                stickyHeaderIndices.push(itemCount + listHeaderOffset);
            }
            itemCount += 2;
            itemCount += this.props.getItemCount(section.data);
        }
        var renderItem = this._renderItem(itemCount);
        return (<VirtualizedList_1.VirtualizedList {...passThroughProps} keyExtractor={this._keyExtractor} stickyHeaderIndices={stickyHeaderIndices} renderItem={renderItem} data={this.props.sections} getItem={function (sections, index) { return _this._getItem(_this.props, sections, index); }} getItemCount={function () { return itemCount; }} onViewableItemsChanged={this.props.onViewableItemsChanged ? this._onViewableItemsChanged : undefined} ref={this._captureRef}/>);
    };
    VirtualizedSectionList.prototype._getItem = function (props, sections, index) {
        if (!sections) {
            return null;
        }
        var itemIdx = index - 1;
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var sectionData = section.data;
            var itemCount = props.getItemCount(sectionData);
            if (itemIdx === -1 || itemIdx === itemCount) {
                return section;
            }
            else if (itemIdx < itemCount) {
                return props.getItem(sectionData, itemIdx);
            }
            else {
                itemIdx -= itemCount + 2;
            }
        }
        return null;
    };
    return VirtualizedSectionList;
}(React.PureComponent));
exports.VirtualizedSectionList = VirtualizedSectionList;
VirtualizedSectionList.defaultProps = defaultProps;
exports.default = VirtualizedSectionList;

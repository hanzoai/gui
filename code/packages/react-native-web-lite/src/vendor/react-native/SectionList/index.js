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
exports.SectionList = void 0;
var VirtualizedSectionList_1 = require("../VirtualizedSectionList");
var React = require("react");
var SectionList = /** @class */ (function (_super) {
    __extends(SectionList, _super);
    function SectionList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._captureRef = function (ref) {
            _this._wrapperListRef = ref;
        };
        _this._getItem = function (sections, index) {
            if (!sections) {
                return null;
            }
            var section = sections[index];
            return section && section.data ? section.data[0] : null;
        };
        _this._getItemCount = function (sections) {
            return sections ? sections.length : 0;
        };
        _this._keyExtractor = function (item, index) {
            var keyExtractor = _this.props.keyExtractor || _this._defaultKeyExtractor;
            return keyExtractor(item, index);
        };
        _this._defaultKeyExtractor = function (item, index) {
            return item.key != null ? item.key : String(index);
        };
        _this._renderItem = function (_a) {
            var item = _a.item, index = _a.index, section = _a.section;
            var renderItem = _this.props.renderItem || _this._defaultRenderItem;
            return renderItem({ item: item, index: index, section: section });
        };
        _this._defaultRenderItem = function (_a) {
            var item = _a.item;
            return null;
        };
        return _this;
    }
    SectionList.prototype.scrollToLocation = function (params) {
        if (this._wrapperListRef != null) {
            this._wrapperListRef.scrollToLocation(params);
        }
    };
    SectionList.prototype.recordInteraction = function () {
        var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();
        listRef && listRef.recordInteraction();
    };
    SectionList.prototype.flashScrollIndicators = function () {
        var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();
        listRef && listRef.flashScrollIndicators();
    };
    SectionList.prototype.getScrollResponder = function () {
        var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();
        if (listRef) {
            return listRef.getScrollResponder();
        }
    };
    SectionList.prototype.getScrollableNode = function () {
        var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();
        if (listRef) {
            return listRef.getScrollableNode();
        }
    };
    SectionList.prototype.setNativeProps = function (props) {
        var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();
        if (listRef) {
            listRef.setNativeProps(props);
        }
    };
    SectionList.prototype.render = function () {
        var _a = this.props, sections = _a.sections, passThroughProps = __rest(_a, ["sections"]);
        return (<VirtualizedSectionList_1.VirtualizedSectionList {...passThroughProps} sections={sections} ref={this._captureRef} getItem={this._getItem} getItemCount={this._getItemCount} keyExtractor={this._keyExtractor} renderItem={this._renderItem}/>);
    };
    return SectionList;
}(React.PureComponent));
exports.SectionList = SectionList;
exports.default = SectionList;

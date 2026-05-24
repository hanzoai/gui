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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellRenderer = void 0;
var View_1 = require("../../../View");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var VirtualizedListContext_1 = require("./VirtualizedListContext");
var React = require("react");
var CellRenderer = /** @class */ (function (_super) {
    __extends(CellRenderer, _super);
    function CellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            separatorProps: {
                highlighted: false,
                leadingItem: _this.props.item,
            },
        };
        // TODO: consider factoring separator stuff out of VirtualizedList into FlatList since it's not
        // reused by SectionList and we can keep VirtualizedList simpler.
        // $FlowFixMe[missing-local-annot]
        _this._separators = {
            highlight: function () {
                var _a, _b;
                var _c = _this.props, cellKey = _c.cellKey, prevCellKey = _c.prevCellKey;
                (_b = (_a = _this.props).onUpdateSeparators) === null || _b === void 0 ? void 0 : _b.call(_a, [cellKey, prevCellKey], {
                    highlighted: true,
                });
            },
            unhighlight: function () {
                var _a, _b;
                var _c = _this.props, cellKey = _c.cellKey, prevCellKey = _c.prevCellKey;
                (_b = (_a = _this.props).onUpdateSeparators) === null || _b === void 0 ? void 0 : _b.call(_a, [cellKey, prevCellKey], {
                    highlighted: false,
                });
            },
            updateProps: function (select, newProps) {
                var _a, _b;
                var _c = _this.props, cellKey = _c.cellKey, prevCellKey = _c.prevCellKey;
                (_b = (_a = _this.props).onUpdateSeparators) === null || _b === void 0 ? void 0 : _b.call(_a, [select === 'leading' ? prevCellKey : cellKey], newProps);
            },
        };
        _this._onLayout = function (nativeEvent) {
            var _a, _b;
            (_b = (_a = _this.props).onCellLayout) === null || _b === void 0 ? void 0 : _b.call(_a, nativeEvent, _this.props.cellKey, _this.props.index);
        };
        return _this;
    }
    CellRenderer.getDerivedStateFromProps = function (props, prevState) {
        return {
            separatorProps: __assign(__assign({}, prevState.separatorProps), { leadingItem: props.item }),
        };
    };
    CellRenderer.prototype.updateSeparatorProps = function (newProps) {
        this.setState(function (state) { return ({
            separatorProps: __assign(__assign({}, state.separatorProps), newProps),
        }); });
    };
    CellRenderer.prototype.componentWillUnmount = function () {
        var _a, _b;
        (_b = (_a = this.props).onUnmount) === null || _b === void 0 ? void 0 : _b.call(_a, this.props.cellKey);
    };
    CellRenderer.prototype._renderElement = function (renderItem, ListItemComponent, item, index) {
        if (renderItem && ListItemComponent) {
            console.warn('VirtualizedList: Both ListItemComponent and renderItem props are present. ListItemComponent will take' +
                ' precedence over renderItem.');
        }
        if (ListItemComponent) {
            /* $FlowFixMe[not-a-component] (>=0.108.0 site=react_native_fb) This
             * comment suppresses an error found when Flow v0.108 was deployed. To
             * see the error, delete this comment and run Flow. */
            /* $FlowFixMe[incompatible-type-arg] (>=0.108.0 site=react_native_fb)
             * This comment suppresses an error found when Flow v0.108 was deployed.
             * To see the error, delete this comment and run Flow. */
            return React.createElement(ListItemComponent, {
                item: item,
                index: index,
                separators: this._separators,
            });
        }
        if (renderItem) {
            return renderItem({
                item: item,
                index: index,
                separators: this._separators,
            });
        }
        (0, react_native_web_internals_1.invariant)(false, 'VirtualizedList: Either ListItemComponent or renderItem props are required but none were found.');
    };
    CellRenderer.prototype.render = function () {
        var _a = this.props, CellRendererComponent = _a.CellRendererComponent, ItemSeparatorComponent = _a.ItemSeparatorComponent, ListItemComponent = _a.ListItemComponent, cellKey = _a.cellKey, horizontal = _a.horizontal, item = _a.item, index = _a.index, inversionStyle = _a.inversionStyle, onCellFocusCapture = _a.onCellFocusCapture, onCellLayout = _a.onCellLayout, renderItem = _a.renderItem;
        var element = this._renderElement(renderItem, ListItemComponent, item, index);
        // NOTE: that when this is a sticky header, `onLayout` will get automatically extracted and
        // called explicitly by `ScrollViewStickyHeader`.
        var itemSeparator = React.isValidElement(ItemSeparatorComponent)
            ? // $FlowFixMe[incompatible-type]
                ItemSeparatorComponent
            : // $FlowFixMe[incompatible-type]
                ItemSeparatorComponent && (<ItemSeparatorComponent {...this.state.separatorProps}/>);
        var cellStyle = inversionStyle
            ? horizontal
                ? [styles.rowReverse, inversionStyle]
                : [styles.columnReverse, inversionStyle]
            : horizontal
                ? [styles.row, inversionStyle]
                : inversionStyle;
        var result = !CellRendererComponent ? (<View_1.View style={cellStyle} onFocusCapture={onCellFocusCapture} {...(onCellLayout && { onLayout: this._onLayout })}>
        {element}
        {itemSeparator}
      </View_1.View>) : (<CellRendererComponent cellKey={cellKey} index={index} item={item} style={cellStyle} onFocusCapture={onCellFocusCapture} {...(onCellLayout && { onLayout: this._onLayout })}>
        {element}
        {itemSeparator}
      </CellRendererComponent>);
        return (<VirtualizedListContext_1.VirtualizedListCellContextProvider cellKey={this.props.cellKey}>
        {result}
      </VirtualizedListContext_1.VirtualizedListCellContextProvider>);
    };
    return CellRenderer;
}(React.Component));
exports.CellRenderer = CellRenderer;
var styles = react_native_web_internals_1.StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    rowReverse: {
        flexDirection: 'row-reverse',
    },
    columnReverse: {
        flexDirection: 'column-reverse',
    },
});
exports.default = CellRenderer;

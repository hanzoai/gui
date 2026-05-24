"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
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
exports.forwardPropsListView = exports.forwardPropsListText = exports.forwardedProps = exports.styleProps = exports.touchProps = exports.mouseProps = exports.keyboardProps = exports.focusProps = exports.clickProps = exports.accessibilityProps = exports.defaultProps = void 0;
exports.defaultProps = {
    children: true,
    dataSet: true,
    nativeID: true,
    ref: true,
    suppressHydrationWarning: true,
    testID: true,
    id: true,
};
exports.accessibilityProps = {
    accessibilityActiveDescendant: true,
    accessibilityAtomic: true,
    accessibilityAutoComplete: true,
    accessibilityBusy: true,
    accessibilityChecked: true,
    accessibilityColumnCount: true,
    accessibilityColumnIndex: true,
    accessibilityColumnSpan: true,
    accessibilityControls: true,
    accessibilityCurrent: true,
    accessibilityDescribedBy: true,
    accessibilityDetails: true,
    accessibilityDisabled: true,
    accessibilityErrorMessage: true,
    accessibilityExpanded: true,
    accessibilityFlowTo: true,
    accessibilityHasPopup: true,
    accessibilityHidden: true,
    accessibilityInvalid: true,
    accessibilityKeyShortcuts: true,
    accessibilityLabel: true,
    accessibilityLabelledBy: true,
    accessibilityLevel: true,
    accessibilityLiveRegion: true,
    accessibilityModal: true,
    accessibilityMultiline: true,
    accessibilityMultiSelectable: true,
    accessibilityOrientation: true,
    accessibilityOwns: true,
    accessibilityPlaceholder: true,
    accessibilityPosInSet: true,
    accessibilityPressed: true,
    accessibilityReadOnly: true,
    accessibilityRequired: true,
    accessibilityRole: true,
    accessibilityRoleDescription: true,
    accessibilityRowCount: true,
    accessibilityRowIndex: true,
    accessibilityRowSpan: true,
    accessibilitySelected: true,
    accessibilitySetSize: true,
    accessibilitySort: true,
    accessibilityValueMax: true,
    accessibilityValueMin: true,
    accessibilityValueNow: true,
    accessibilityValueText: true,
    dir: true,
    focusable: true,
};
exports.clickProps = {
    onClick: true,
    onClickCapture: true,
    onContextMenu: true,
};
exports.focusProps = {
    onBlur: true,
    onFocus: true,
};
exports.keyboardProps = {
    onKeyDown: true,
    onKeyDownCapture: true,
    onKeyUp: true,
    onKeyUpCapture: true,
};
exports.mouseProps = {
    onMouseDown: true,
    onMouseEnter: true,
    onMouseLeave: true,
    onMouseMove: true,
    onMouseOver: true,
    onMouseOut: true,
    onMouseUp: true,
};
exports.touchProps = {
    onTouchCancel: true,
    onTouchCancelCapture: true,
    onTouchEnd: true,
    onTouchEndCapture: true,
    onTouchMove: true,
    onTouchMoveCapture: true,
    onTouchStart: true,
    onTouchStartCapture: true,
};
exports.styleProps = {
    classList: true,
    className: true,
    style: true,
};
exports.forwardedProps = {
    defaultProps: exports.defaultProps,
    accessibilityProps: exports.accessibilityProps,
    clickProps: exports.clickProps,
    focusProps: exports.focusProps,
    keyboardProps: exports.keyboardProps,
    mouseProps: exports.mouseProps,
    touchProps: exports.touchProps,
    styleProps: exports.styleProps,
};
exports.forwardPropsListText = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, exports.defaultProps), exports.accessibilityProps), exports.clickProps), exports.focusProps), exports.keyboardProps), exports.mouseProps), exports.touchProps), exports.styleProps), { href: true, lang: true, pointerEvents: true });
exports.forwardPropsListView = __assign(__assign({}, exports.forwardPropsListText), { onScroll: true, onWheel: true });

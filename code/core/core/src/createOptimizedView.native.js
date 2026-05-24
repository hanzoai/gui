"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOptimizedView = createOptimizedView;
exports.getAccessibilityRoleFromRole = getAccessibilityRoleFromRole;
var react_1 = require("react"); // native only, taken from react-native
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
function createOptimizedView(children, viewProps, baseViews) {
    var _a, _b, _c;
    var TextAncestor = baseViews.TextAncestor;
    var accessibilityElementsHidden = viewProps.accessibilityElementsHidden, accessibilityLabel = viewProps.accessibilityLabel, accessibilityLabelledBy = viewProps.accessibilityLabelledBy, accessibilityLiveRegion = viewProps.accessibilityLiveRegion, accessibilityState = viewProps.accessibilityState, accessibilityValue = viewProps.accessibilityValue, ariaBusy = viewProps["aria-busy"], ariaChecked = viewProps["aria-checked"], ariaDisabled = viewProps["aria-disabled"], ariaExpanded = viewProps["aria-expanded"], ariaHidden = viewProps["aria-hidden"], ariaLabel = viewProps["aria-label"], ariaLabelledBy = viewProps["aria-labelledby"], ariaLive = viewProps["aria-live"], ariaSelected = viewProps["aria-selected"], ariaValueMax = viewProps["aria-valuemax"], ariaValueMin = viewProps["aria-valuemin"], ariaValueNow = viewProps["aria-valuenow"], ariaValueText = viewProps["aria-valuetext"], focusable = viewProps.focusable, id = viewProps.id, role = viewProps.role, tabIndex = viewProps.tabIndex;
    var _accessibilityLabelledBy = (_a = ariaLabelledBy === null || ariaLabelledBy === void 0 ? void 0 : ariaLabelledBy.split(/\s*,\s*/g)) !== null && _a !== void 0 ? _a : accessibilityLabelledBy;
    var _accessibilityState;
    if (accessibilityState != null ||
        ariaBusy != null ||
        ariaChecked != null ||
        ariaDisabled != null ||
        ariaExpanded != null ||
        ariaSelected != null) {
        _accessibilityState = {
            busy: ariaBusy !== null && ariaBusy !== void 0 ? ariaBusy : accessibilityState === null || accessibilityState === void 0 ? void 0 : accessibilityState.busy,
            checked: ariaChecked !== null && ariaChecked !== void 0 ? ariaChecked : accessibilityState === null || accessibilityState === void 0 ? void 0 : accessibilityState.checked,
            disabled: ariaDisabled !== null && ariaDisabled !== void 0 ? ariaDisabled : accessibilityState === null || accessibilityState === void 0 ? void 0 : accessibilityState.disabled,
            expanded: ariaExpanded !== null && ariaExpanded !== void 0 ? ariaExpanded : accessibilityState === null || accessibilityState === void 0 ? void 0 : accessibilityState.expanded,
            selected: ariaSelected !== null && ariaSelected !== void 0 ? ariaSelected : accessibilityState === null || accessibilityState === void 0 ? void 0 : accessibilityState.selected,
        };
    }
    var _accessibilityValue;
    if (accessibilityValue != null ||
        ariaValueMax != null ||
        ariaValueMin != null ||
        ariaValueNow != null ||
        ariaValueText != null) {
        _accessibilityValue = {
            max: ariaValueMax !== null && ariaValueMax !== void 0 ? ariaValueMax : accessibilityValue === null || accessibilityValue === void 0 ? void 0 : accessibilityValue.max,
            min: ariaValueMin !== null && ariaValueMin !== void 0 ? ariaValueMin : accessibilityValue === null || accessibilityValue === void 0 ? void 0 : accessibilityValue.min,
            now: ariaValueNow !== null && ariaValueNow !== void 0 ? ariaValueNow : accessibilityValue === null || accessibilityValue === void 0 ? void 0 : accessibilityValue.now,
            text: ariaValueText !== null && ariaValueText !== void 0 ? ariaValueText : accessibilityValue === null || accessibilityValue === void 0 ? void 0 : accessibilityValue.text,
        };
    }
    if ((_b = viewProps.style) === null || _b === void 0 ? void 0 : _b.pointerEvents) {
        viewProps.pointerEvents = (_c = viewProps.style) === null || _c === void 0 ? void 0 : _c.pointerEvents;
    }
    if (id) {
        viewProps.nativeID = id;
    }
    if (ariaHidden === true) {
        viewProps.importantForAccessibility = 'no-hide-descendants';
    }
    if (_accessibilityValue) {
        viewProps.accessibilityValue = _accessibilityValue;
    }
    if (role) {
        viewProps.accessibilityRole = getAccessibilityRoleFromRole(role);
    }
    if (ariaLive === 'off') {
        viewProps.accessibilityLiveRegion = 'none';
    }
    else {
        var alr = ariaLive !== null && ariaLive !== void 0 ? ariaLive : accessibilityLiveRegion;
        if (alr) {
            viewProps.accessibilityLiveRegion = alr;
        }
    }
    var al = ariaLabel !== null && ariaLabel !== void 0 ? ariaLabel : accessibilityLabel;
    if (al) {
        viewProps.accessibilityLabel = al;
    }
    var f = tabIndex !== undefined ? !tabIndex : focusable;
    if (f != null) {
        viewProps.focusable = f;
    }
    if (_accessibilityState != null) {
        viewProps.accessibilityState = _accessibilityState;
    }
    var ah = ariaHidden !== null && ariaHidden !== void 0 ? ariaHidden : accessibilityElementsHidden;
    if (ah != null) {
        viewProps.accessibilityElementsHidden = ah;
    }
    if (_accessibilityLabelledBy) {
        viewProps.accessibilityLabelledBy = _accessibilityLabelledBy;
    }
    // isInText is significantly faster than just providing it each time
    var isInText = react_1.default.useContext(TextAncestor);
    var finalElement = react_1.default.createElement('RCTView', viewProps, children);
    if (!isInText) {
        return finalElement;
    }
    return react_1.default.createElement(TextAncestor.Provider, { value: false }, finalElement);
}
function getAccessibilityRoleFromRole(role) {
    switch (role) {
        case 'alert':
            return 'alert';
        case 'alertdialog':
            return;
        case 'application':
            return;
        case 'article':
            return;
        case 'banner':
            return;
        case 'button':
            return 'button';
        case 'cell':
            return;
        case 'checkbox':
            return 'checkbox';
        case 'columnheader':
            return;
        case 'combobox':
            return 'combobox';
        case 'complementary':
            return;
        case 'contentinfo':
            return;
        case 'definition':
            return;
        case 'dialog':
            return;
        case 'directory':
            return;
        case 'document':
            return;
        case 'feed':
            return;
        case 'figure':
            return;
        case 'form':
            return;
        case 'grid':
            return 'grid';
        case 'group':
            return;
        case 'heading':
            return 'header';
        case 'img':
            return 'image';
        case 'link':
            return 'link';
        case 'list':
            return 'list';
        case 'listitem':
            return;
        case 'log':
            return;
        case 'main':
            return;
        case 'marquee':
            return;
        case 'math':
            return;
        case 'menu':
            return 'menu';
        case 'menubar':
            return 'menubar';
        case 'menuitem':
            return 'menuitem';
        case 'meter':
            return;
        case 'navigation':
            return;
        case 'none':
            return 'none';
        case 'note':
            return;
        case 'option':
            return;
        case 'presentation':
            return 'none';
        case 'progressbar':
            return 'progressbar';
        case 'radio':
            return 'radio';
        case 'radiogroup':
            return 'radiogroup';
        case 'region':
            return;
        case 'row':
            return;
        case 'rowgroup':
            return;
        case 'rowheader':
            return;
        case 'scrollbar':
            return 'scrollbar';
        case 'searchbox':
            return 'search';
        case 'separator':
            return;
        case 'slider':
            return 'adjustable';
        case 'spinbutton':
            return 'spinbutton';
        case 'status':
            return;
        case 'summary':
            return 'summary';
        case 'switch':
            return 'switch';
        case 'tab':
            return 'tab';
        case 'table':
            return;
        case 'tablist':
            return 'tablist';
        case 'tabpanel':
            return;
        case 'term':
            return;
        case 'timer':
            return 'timer';
        case 'toolbar':
            return 'toolbar';
        case 'tooltip':
            return;
        case 'tree':
            return;
        case 'treegrid':
            return;
        case 'treeitem':
            return;
    }
    return;
}

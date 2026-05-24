"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */
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
exports.createDOMProps = exports.stylesFromProps = void 0;
var web_1 = require("@hanzogui/web");
var index_1 = require("../AccessibilityUtil/index");
var emptyObject = {};
var hasOwnProperty = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
// react-native props that should be stripped before reaching the DOM
var reactNativeOnlyProps = {
    collapsable: true,
    contentContainerStyle: true,
    contentOffset: true,
    decelerationRate: true,
    maintainVisibleContentPosition: true,
    onLayout: true,
    onMomentumScrollBegin: true,
    onMomentumScrollEnd: true,
    onMoveShouldSetResponder: true,
    onMoveShouldSetResponderCapture: true,
    onResponderEnd: true,
    onResponderGrant: true,
    onResponderMove: true,
    onResponderReject: true,
    onResponderRelease: true,
    onResponderStart: true,
    onResponderTerminate: true,
    onResponderTerminationRequest: true,
    onScrollBeginDrag: true,
    onScrollEndDrag: true,
    onScrollShouldSetResponder: true,
    onScrollShouldSetResponderCapture: true,
    onSelectionChangeShouldSetResponder: true,
    onSelectionChangeShouldSetResponderCapture: true,
    onStartShouldSetResponder: true,
    onStartShouldSetResponderCapture: true,
    refreshControl: true,
    removeClippedSubviews: true,
    scrollEnabled: true,
    scrollEventThrottle: true,
    scrollIndicatorInsets: true,
    showsHorizontalScrollIndicator: true,
    showsVerticalScrollIndicator: true,
    snapToAlignment: true,
    snapToEnd: true,
    snapToInterval: true,
    snapToOffsets: true,
    snapToStart: true,
    stickyHeaderIndices: true,
    ScrollComponent: true,
};
var uppercasePattern = /[A-Z]/g;
function toHyphenLower(match) {
    return '-' + match.toLowerCase();
}
function hyphenateString(str) {
    return str.replace(uppercasePattern, toHyphenLower);
}
function processIDRefList(idRefList) {
    return isArray(idRefList) ? idRefList.join(' ') : idRefList;
}
function flattenStyle(style) {
    if (style === null || typeof style !== 'object') {
        return undefined;
    }
    if (!isArray(style)) {
        return style;
    }
    var result = {};
    for (var i = 0, styleLength = style.length; i < styleLength; ++i) {
        var computedStyle = flattenStyle(style[i]);
        if (computedStyle) {
            for (var key in computedStyle) {
                if (hasOwnProperty.call(computedStyle, key)) {
                    result[key] = computedStyle[key];
                }
            }
        }
    }
    return result;
}
var pointerEventsStyles;
exports.stylesFromProps = new WeakMap();
var createDOMProps = function (elementType, props, options) {
    if (!props) {
        props = emptyObject;
    }
    var accessibilityActiveDescendant = props.accessibilityActiveDescendant, accessibilityAtomic = props.accessibilityAtomic, accessibilityAutoComplete = props.accessibilityAutoComplete, accessibilityBusy = props.accessibilityBusy, accessibilityChecked = props.accessibilityChecked, accessibilityColumnCount = props.accessibilityColumnCount, accessibilityColumnIndex = props.accessibilityColumnIndex, accessibilityColumnSpan = props.accessibilityColumnSpan, accessibilityControls = props.accessibilityControls, accessibilityCurrent = props.accessibilityCurrent, accessibilityDescribedBy = props.accessibilityDescribedBy, accessibilityDetails = props.accessibilityDetails, accessibilityDisabled = props.accessibilityDisabled, accessibilityErrorMessage = props.accessibilityErrorMessage, accessibilityExpanded = props.accessibilityExpanded, accessibilityFlowTo = props.accessibilityFlowTo, accessibilityHasPopup = props.accessibilityHasPopup, accessibilityHidden = props.accessibilityHidden, accessibilityInvalid = props.accessibilityInvalid, accessibilityKeyShortcuts = props.accessibilityKeyShortcuts, accessibilityLabel = props.accessibilityLabel, accessibilityLabelledBy = props.accessibilityLabelledBy, accessibilityLevel = props.accessibilityLevel, accessibilityLiveRegion = props.accessibilityLiveRegion, accessibilityModal = props.accessibilityModal, accessibilityMultiline = props.accessibilityMultiline, accessibilityMultiSelectable = props.accessibilityMultiSelectable, accessibilityOrientation = props.accessibilityOrientation, accessibilityOwns = props.accessibilityOwns, accessibilityPlaceholder = props.accessibilityPlaceholder, accessibilityPosInSet = props.accessibilityPosInSet, accessibilityPressed = props.accessibilityPressed, accessibilityReadOnly = props.accessibilityReadOnly, accessibilityRequired = props.accessibilityRequired, 
    /* eslint-disable */
    accessibilityRole = props.accessibilityRole, 
    /* eslint-enable */
    accessibilityRoleDescription = props.accessibilityRoleDescription, accessibilityRowCount = props.accessibilityRowCount, accessibilityRowIndex = props.accessibilityRowIndex, accessibilityRowSpan = props.accessibilityRowSpan, accessibilitySelected = props.accessibilitySelected, accessibilitySetSize = props.accessibilitySetSize, accessibilitySort = props.accessibilitySort, accessibilityValueMax = props.accessibilityValueMax, accessibilityValueMin = props.accessibilityValueMin, accessibilityValueNow = props.accessibilityValueNow, accessibilityValueText = props.accessibilityValueText, dataSet = props.dataSet, focusable = props.focusable, nativeID = props.nativeID, pointerEvents = props.pointerEvents, style = props.style, testID = props.testID, id = props.id, 
    // Rest
    domProps = __rest(props
    // strip react-native-only props that shouldn't reach the DOM
    , ["accessibilityActiveDescendant", "accessibilityAtomic", "accessibilityAutoComplete", "accessibilityBusy", "accessibilityChecked", "accessibilityColumnCount", "accessibilityColumnIndex", "accessibilityColumnSpan", "accessibilityControls", "accessibilityCurrent", "accessibilityDescribedBy", "accessibilityDetails", "accessibilityDisabled", "accessibilityErrorMessage", "accessibilityExpanded", "accessibilityFlowTo", "accessibilityHasPopup", "accessibilityHidden", "accessibilityInvalid", "accessibilityKeyShortcuts", "accessibilityLabel", "accessibilityLabelledBy", "accessibilityLevel", "accessibilityLiveRegion", "accessibilityModal", "accessibilityMultiline", "accessibilityMultiSelectable", "accessibilityOrientation", "accessibilityOwns", "accessibilityPlaceholder", "accessibilityPosInSet", "accessibilityPressed", "accessibilityReadOnly", "accessibilityRequired", "accessibilityRole", "accessibilityRoleDescription", "accessibilityRowCount", "accessibilityRowIndex", "accessibilityRowSpan", "accessibilitySelected", "accessibilitySetSize", "accessibilitySort", "accessibilityValueMax", "accessibilityValueMin", "accessibilityValueNow", "accessibilityValueText", "dataSet", "focusable", "nativeID", "pointerEvents", "style", "testID", "id"]);
    // strip react-native-only props that shouldn't reach the DOM
    for (var key in domProps) {
        if (reactNativeOnlyProps[key]) {
            delete domProps[key];
        }
    }
    var disabled = accessibilityDisabled;
    var role = index_1.AccessibilityUtil.propsToAriaRole(props);
    // ACCESSIBILITY
    if (accessibilityActiveDescendant != null) {
        domProps['aria-activedescendant'] = accessibilityActiveDescendant;
    }
    if (accessibilityAtomic != null) {
        domProps['aria-atomic'] = accessibilityAtomic;
    }
    if (accessibilityAutoComplete != null) {
        domProps['aria-autocomplete'] = accessibilityAutoComplete;
    }
    if (accessibilityBusy != null) {
        domProps['aria-busy'] = accessibilityBusy;
    }
    if (accessibilityChecked != null) {
        domProps['aria-checked'] = accessibilityChecked;
    }
    if (accessibilityColumnCount != null) {
        domProps['aria-colcount'] = accessibilityColumnCount;
    }
    if (accessibilityColumnIndex != null) {
        domProps['aria-colindex'] = accessibilityColumnIndex;
    }
    if (accessibilityColumnSpan != null) {
        domProps['aria-colspan'] = accessibilityColumnSpan;
    }
    if (accessibilityControls != null) {
        domProps['aria-controls'] = processIDRefList(accessibilityControls);
    }
    if (accessibilityCurrent != null) {
        domProps['aria-current'] = accessibilityCurrent;
    }
    if (accessibilityDescribedBy != null) {
        domProps['aria-describedby'] = processIDRefList(accessibilityDescribedBy);
    }
    if (accessibilityDetails != null) {
        domProps['aria-details'] = accessibilityDetails;
    }
    if (disabled === true) {
        domProps['aria-disabled'] = true;
        // Enhance with native semantics
        if (elementType === 'button' ||
            elementType === 'form' ||
            elementType === 'input' ||
            elementType === 'select' ||
            elementType === 'textarea') {
            domProps.disabled = true;
        }
    }
    if (accessibilityErrorMessage != null) {
        domProps['aria-errormessage'] = accessibilityErrorMessage;
    }
    if (accessibilityExpanded != null) {
        domProps['aria-expanded'] = accessibilityExpanded;
    }
    if (accessibilityFlowTo != null) {
        domProps['aria-flowto'] = processIDRefList(accessibilityFlowTo);
    }
    if (accessibilityHasPopup != null) {
        domProps['aria-haspopup'] = accessibilityHasPopup;
    }
    if (accessibilityHidden === true) {
        domProps['aria-hidden'] = accessibilityHidden;
    }
    if (accessibilityInvalid != null) {
        domProps['aria-invalid'] = accessibilityInvalid;
    }
    if (accessibilityKeyShortcuts != null && Array.isArray(accessibilityKeyShortcuts)) {
        domProps['aria-keyshortcuts'] = accessibilityKeyShortcuts.join(' ');
    }
    if (accessibilityLabel != null) {
        domProps['aria-label'] = accessibilityLabel;
    }
    if (accessibilityLabelledBy != null) {
        domProps['aria-labelledby'] = processIDRefList(accessibilityLabelledBy);
    }
    if (accessibilityLevel != null) {
        domProps['aria-level'] = accessibilityLevel;
    }
    if (accessibilityLiveRegion != null) {
        domProps['aria-live'] =
            accessibilityLiveRegion === 'none' ? 'off' : accessibilityLiveRegion;
    }
    if (accessibilityModal != null) {
        domProps['aria-modal'] = accessibilityModal;
    }
    if (accessibilityMultiline != null) {
        domProps['aria-multiline'] = accessibilityMultiline;
    }
    if (accessibilityMultiSelectable != null) {
        domProps['aria-multiselectable'] = accessibilityMultiSelectable;
    }
    if (accessibilityOrientation != null) {
        domProps['aria-orientation'] = accessibilityOrientation;
    }
    if (accessibilityOwns != null) {
        domProps['aria-owns'] = processIDRefList(accessibilityOwns);
    }
    if (accessibilityPlaceholder != null) {
        domProps['aria-placeholder'] = accessibilityPlaceholder;
    }
    if (accessibilityPosInSet != null) {
        domProps['aria-posinset'] = accessibilityPosInSet;
    }
    if (accessibilityPressed != null) {
        domProps['aria-pressed'] = accessibilityPressed;
    }
    if (accessibilityReadOnly != null) {
        domProps['aria-readonly'] = accessibilityReadOnly;
        // Enhance with native semantics
        if (elementType === 'input' ||
            elementType === 'select' ||
            elementType === 'textarea') {
            domProps.readOnly = true;
        }
    }
    if (accessibilityRequired != null) {
        domProps['aria-required'] = accessibilityRequired;
        // Enhance with native semantics
        if (elementType === 'input' ||
            elementType === 'select' ||
            elementType === 'textarea') {
            domProps.required = true;
        }
    }
    if (role != null) {
        // 'presentation' synonym has wider browser support
        domProps['role'] = role === 'none' ? 'presentation' : role;
    }
    if (accessibilityRoleDescription != null) {
        domProps['aria-roledescription'] = accessibilityRoleDescription;
    }
    if (accessibilityRowCount != null) {
        domProps['aria-rowcount'] = accessibilityRowCount;
    }
    if (accessibilityRowIndex != null) {
        domProps['aria-rowindex'] = accessibilityRowIndex;
    }
    if (accessibilityRowSpan != null) {
        domProps['aria-rowspan'] = accessibilityRowSpan;
    }
    if (accessibilitySelected != null) {
        domProps['aria-selected'] = accessibilitySelected;
    }
    if (accessibilitySetSize != null) {
        domProps['aria-setsize'] = accessibilitySetSize;
    }
    if (accessibilitySort != null) {
        domProps['aria-sort'] = accessibilitySort;
    }
    if (accessibilityValueMax != null) {
        domProps['aria-valuemax'] = accessibilityValueMax;
    }
    if (accessibilityValueMin != null) {
        domProps['aria-valuemin'] = accessibilityValueMin;
    }
    if (accessibilityValueNow != null) {
        domProps['aria-valuenow'] = accessibilityValueNow;
    }
    if (accessibilityValueText != null) {
        domProps['aria-valuetext'] = accessibilityValueText;
    }
    // "dataSet" replaced with "data-*"
    var tmgCN = dataSet ? dataSet.className : undefined;
    var tmgID = dataSet ? dataSet.id : undefined;
    if (dataSet != null) {
        for (var dataProp in dataSet) {
            if (dataProp === 'className' || dataProp === 'id')
                continue;
            if (hasOwnProperty.call(dataSet, dataProp)) {
                var dataName = hyphenateString(dataProp);
                var dataValue = dataSet[dataProp];
                if (dataValue != null) {
                    domProps["data-".concat(dataName)] = dataValue;
                }
            }
        }
    }
    // FOCUS
    // "focusable" indicates that an element may be a keyboard tab-stop.
    if (focusable === false) {
        domProps.tabIndex = '-1';
    }
    if (
    // These native elements are keyboard focusable by default
    elementType === 'a' ||
        elementType === 'button' ||
        elementType === 'input' ||
        elementType === 'select' ||
        elementType === 'textarea') {
        if (focusable === false || accessibilityDisabled === true) {
            domProps.tabIndex = '-1';
        }
    }
    else if (
    // These roles are made keyboard focusable by default
    role === 'button' ||
        role === 'checkbox' ||
        role === 'link' ||
        role === 'radio' ||
        role === 'textbox' ||
        role === 'switch') {
        if (focusable !== false) {
            domProps.tabIndex = '0';
        }
    }
    else {
        // Everything else must explicitly set the prop
        if (focusable === true) {
            domProps.tabIndex = '0';
        }
    }
    // Resolve styles
    var flat = flattenStyle(style);
    var className = tmgCN || '';
    if (props.className) {
        className += " ".concat(props.className);
    }
    var stylesAtomic = flat ? (0, web_1.getCSSStylesAtomic)(flat) : [];
    exports.stylesFromProps.set(domProps, stylesAtomic);
    domProps.style = stylesAtomic.reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        if (key[0] === '_' || key.startsWith('is_') || key.startsWith('font_')) {
            className += " ".concat(key);
            return acc;
        }
        if (key === '$$css' || key === '') {
            return acc;
        }
        acc[key] = value;
        return acc;
    }, {});
    if (className) {
        domProps.className = className;
    }
    // OTHER
    // Native element ID
    var _id = tmgID || id || nativeID;
    if (_id) {
        domProps.id = _id;
    }
    // Automated test IDs
    if (testID != null) {
        domProps['data-testid'] = testID;
    }
    return domProps;
};
exports.createDOMProps = createDOMProps;

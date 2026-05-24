"use strict";
// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = flatten;
exports.StyleSheet = StyleSheet;
var staticStyleMap = new WeakMap();
function insertRules(compiledOrderedRules) { }
function compileAndInsertAtomic(style) { }
function compileAndInsertReset(style, key) { }
/* ----- API ----- */
var absoluteFillObject = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
};
var absoluteFill = absoluteFillObject;
/**
 * create
 */
function create(styles) {
    return styles;
}
/**
 * compose
 */
function compose(style1, style2) {
    return flatten(style1, style2);
}
/**
 * flatten
 */
function flatten() {
    var styles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        styles[_i] = arguments[_i];
    }
    return styles
        .flat()
        .flat()
        .flat()
        .flat()
        .reduce(function (acc, cur) {
        if (cur) {
            Object.assign(acc, cur);
        }
        return acc;
    }, {});
}
/**
 * getSheet
 */
function getSheet() {
    return {
        id: '',
        textContent: sheet.getTextContent(),
    };
}
function StyleSheet(styles, options) { }
StyleSheet.absoluteFill = absoluteFill;
StyleSheet.absoluteFillObject = absoluteFillObject;
StyleSheet.create = create;
StyleSheet.compose = compose;
StyleSheet.flatten = flatten;
StyleSheet.getSheet = getSheet;
// `hairlineWidth` is not implemented using screen density as browsers may
// round sub-pixel values down to `0`, causing the line not to be rendered.
StyleSheet.hairlineWidth = 1;

"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowDimensions = useWindowDimensions;
var react_1 = require("react");
var index_1 = require("../Dimensions/index");
function useWindowDimensions() {
    var _a = react_1.default.useState(function () { return index_1.Dimensions.get('window'); }), dims = _a[0], setDims = _a[1];
    react_1.default.useEffect(function () {
        function handleChange(_a) {
            var window = _a.window;
            if (window != null) {
                setDims(window);
            }
        }
        index_1.Dimensions.addEventListener('change', handleChange);
        // We might have missed an update between calling `get` in render and
        // `addEventListener` in this handler, so we set it here. If there was
        // no change, React will filter out this update as a no-op.
        setDims(index_1.Dimensions.get('window'));
        return function () {
            index_1.Dimensions.removeEventListener('change', handleChange);
        };
    }, []);
    return dims;
}

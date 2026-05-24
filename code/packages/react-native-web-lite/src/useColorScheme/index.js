"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useColorScheme = useColorScheme;
var React = require("react");
var index_1 = require("../Appearance/index");
function useColorScheme() {
    var _a = React.useState(index_1.Appearance.getColorScheme()), colorScheme = _a[0], setColorScheme = _a[1];
    React.useEffect(function () {
        function listener(appearance) {
            setColorScheme(appearance.colorScheme);
        }
        var remove = index_1.Appearance.addChangeListener(listener).remove;
        return remove;
    });
    return colorScheme;
}

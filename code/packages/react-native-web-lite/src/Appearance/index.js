"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appearance = void 0;
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
function getQuery() {
    return react_native_web_internals_1.canUseDOM && window.matchMedia != null
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
}
var query = getQuery();
var listenerMapping = new WeakMap();
exports.Appearance = {
    getColorScheme: function () {
        return query && query.matches ? 'dark' : 'light';
    },
    addChangeListener: function (listener) {
        var mappedListener = listenerMapping.get(listener);
        if (!mappedListener) {
            mappedListener = function (_a) {
                var matches = _a.matches;
                listener({ colorScheme: matches ? 'dark' : 'light' });
            };
            listenerMapping.set(listener, mappedListener);
        }
        if (query) {
            query.addListener(mappedListener);
        }
        function remove() {
            var mappedListener = listenerMapping.get(listener);
            if (query && mappedListener) {
                query.removeListener(mappedListener);
            }
            listenerMapping.delete(listener);
        }
        return { remove: remove };
    },
};

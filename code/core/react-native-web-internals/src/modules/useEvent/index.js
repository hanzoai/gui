"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvent = useEvent;
var index_1 = require("../createEventHandle/index");
var index_2 = require("../useLayoutEffect/index");
var index_3 = require("../useStable/index");
/**
 * This can be used with any event type include custom events.
 *
 * const click = useEvent('click', options);
 * useEffect(() => {
 *   click.setListener(target, onClick);
 *   return () => click.clear();
 * }).
 */
function useEvent(event, options) {
    var targetListeners = (0, index_3.useStable)(function () { return new Map(); });
    var addListener = (0, index_3.useStable)(function () {
        var addEventListener = (0, index_1.createEventHandle)(event, options);
        return function (target, callback) {
            var removeTargetListener = targetListeners.get(target);
            if (removeTargetListener != null) {
                removeTargetListener();
            }
            if (callback == null) {
                targetListeners.delete(target);
            }
            var removeEventListener = addEventListener(target, callback);
            targetListeners.set(target, removeEventListener);
            return removeEventListener;
        };
    });
    (0, index_2.useLayoutEffectImpl)(function () {
        return function () {
            targetListeners.forEach(function (removeListener) {
                removeListener();
            });
            targetListeners.clear();
        };
    }, [targetListeners]);
    return addListener;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePressEvents = usePressEvents;
var react_1 = require("react");
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
var PressResponder_1 = require("./PressResponder");
function usePressEvents(_, config) {
    var pressResponderRef = react_1.default.useRef(null);
    if (pressResponderRef.current == null) {
        pressResponderRef.current = new PressResponder_1.PressResponder(config);
    }
    var pressResponder = pressResponderRef.current; // Re-configure to use the current node and configuration.
    react_1.default.useEffect(function () {
        pressResponder.configure(config);
    }, [config, pressResponder]); // Reset the `pressResponder` when cleanup needs to occur. This is
    // a separate effect because we do not want to rest the responder when `config` changes.
    react_1.default.useEffect(function () {
        return function () {
            pressResponder.reset();
        };
    }, [pressResponder]);
    react_1.default.useDebugValue(config);
    return pressResponder.getEventHandlers();
}

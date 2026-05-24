"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStable = useStable;
var React = require("react");
var UNINITIALIZED = typeof Symbol === 'function' && typeof Symbol() === 'symbol'
    ? Symbol()
    : Object.freeze({});
function useStable(getInitialValue) {
    var ref = React.useRef(UNINITIALIZED);
    if (ref.current === UNINITIALIZED) {
        ref.current = getInitialValue();
    }
    // @ts-ignore  (#64650789) Trouble refining types where `Symbol` is concerned.
    return ref.current;
}

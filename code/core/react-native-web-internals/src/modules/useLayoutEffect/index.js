"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLayoutEffectImpl = void 0;
var react_1 = require("react"); /**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * useLayoutEffect throws an error on the server. On the few occasions where is
 * problematic, use this hook.
 *
 * @flow
 */
var canUseDOM_1 = require("../canUseDOM");
exports.useLayoutEffectImpl = canUseDOM_1.canUseDOM ? react_1.default.useLayoutEffect : react_1.default.useEffect;

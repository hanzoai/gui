"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.canUseDOM = void 0;
exports.canUseDOM = !!(typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement);

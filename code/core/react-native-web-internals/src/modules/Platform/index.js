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
exports.Platform = void 0;
exports.Platform = {
    OS: 'web',
    select: function (obj) { return ('web' in obj ? obj.web : obj.default); },
    isTesting: process.env.NODE_ENV === 'test',
};

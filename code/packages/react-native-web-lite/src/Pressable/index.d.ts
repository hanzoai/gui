/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */
import * as React from 'react';
export type StateCallbackType = {
    focused: boolean;
    hovered: boolean;
    pressed: boolean;
};
declare const PressableComponent: React.NamedExoticComponent<React.RefAttributes<unknown>>;
export { PressableComponent as Pressable };
export default PressableComponent;

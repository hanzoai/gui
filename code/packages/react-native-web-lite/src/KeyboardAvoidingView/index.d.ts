/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import * as React from 'react';
import type { LayoutEvent, LayoutValue } from '../types';
import type { ViewProps } from '../View/index';
type KeyboardAvoidingViewProps = ViewProps & {
    behavior?: 'height' | 'padding' | 'position';
    contentContainerStyle?: ViewProps['style'];
    keyboardVerticalOffset: number;
};
export declare class KeyboardAvoidingView extends React.Component<KeyboardAvoidingViewProps> {
    frame: LayoutValue | null;
    relativeKeyboardHeight(keyboardFrame: Record<string, any>): number;
    onKeyboardChange(event: object): void;
    onLayout: (event: LayoutEvent) => void;
    render(): React.ReactNode;
}
export default KeyboardAvoidingView;

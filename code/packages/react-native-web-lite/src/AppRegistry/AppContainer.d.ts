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
type Props = {
    WrapperComponent?: React.FunctionComponent<any> | null;
    children?: React.ReactNode;
    rootTag: any;
};
export declare const RootTagContext: React.Context<any>;
declare const AppContainer: React.ForwardRefExoticComponent<Props & React.RefAttributes<any>>;
export { AppContainer };

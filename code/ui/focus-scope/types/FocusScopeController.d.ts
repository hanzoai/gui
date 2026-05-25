import * as React from 'react';
import type { FocusScopeProps } from './types';
import type { ScopedProps } from './types';
declare const createFocusScopeControllerScope: import("@hanzogui/create-context").CreateScope;
type FocusScopeControllerContextValue = Omit<FocusScopeProps, 'children'>;
declare const FocusScopeControllerProvider: (props: FocusScopeControllerContextValue & {
    scope: {
        [scopeName: string]: React.Context<FocusScopeControllerContextValue>[];
    };
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element, useFocusScopeControllerContext: (consumerName: string, scope: {
    [scopeName: string]: React.Context<FocusScopeControllerContextValue>[];
}, options?: {
    warn?: boolean;
    fallback?: Partial<FocusScopeControllerContextValue>;
}) => FocusScopeControllerContextValue;
export interface FocusScopeControllerProps extends FocusScopeControllerContextValue {
    children?: React.ReactNode;
}
declare function FocusScopeController(props: ScopedProps<FocusScopeControllerProps>): import("react/jsx-runtime").JSX.Element;
declare const FocusScopeControllerComponent: typeof FocusScopeController;
export { createFocusScopeControllerScope, FocusScopeControllerComponent as FocusScopeController, FocusScopeControllerProvider, useFocusScopeControllerContext, };
//# sourceMappingURL=FocusScopeController.d.ts.map
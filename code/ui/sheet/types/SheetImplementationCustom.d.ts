import React from 'react';
import { View } from 'react-native';
import type { SnapPointsMode } from './types';
export declare const SheetImplementationCustom: React.ForwardRefExoticComponent<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((open: boolean) => void);
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: React.ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    disableRemoveScroll?: boolean;
    forceRemoveScrollEnabled?: boolean;
    transitionConfig?: import("@hanzogui/core").AnimatedNumberStrategy;
    preferAdaptParentOpenState?: boolean;
    unmountChildrenWhenHidden?: boolean;
    native?: "ios"[] | boolean;
    transition?: import("@hanzogui/core").TransitionProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: import("@hanzogui/portal").PortalProps;
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
} & {
    __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
} & React.RefAttributes<View>>;
//# sourceMappingURL=SheetImplementationCustom.d.ts.map
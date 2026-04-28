import type { FontSizeTokens, GetProps, SizeTokens, HanzoguiElement } from '@hanzogui/core';
import * as React from 'react';
import type { SelectProps, SelectScopedProps } from './types';
declare const SelectValueFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export type SelectValueExtraProps = SelectScopedProps<{
    placeholder?: React.ReactNode;
}>;
export type SelectValueProps = GetProps<typeof SelectValueFrame> & SelectValueExtraProps;
export declare const SelectIcon: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
declare const SelectIndicatorFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export type SelectIndicatorProps = GetProps<typeof SelectIndicatorFrame>;
export declare const SelectGroupFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
declare const SelectLabelFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
    size?: SizeTokens | FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export type SelectLabelProps = SelectScopedProps<GetProps<typeof SelectLabelFrame>>;
export declare const SelectSeparator: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    vertical?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export declare const Select: (<Value extends string = string>(props: SelectScopedProps<SelectProps<Value>>) => import("react/jsx-runtime").JSX.Element) & {
    Adapt: ((props: import("@hanzogui/adapt").AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
        Contents: {
            ({ scope, ...rest }: {
                scope?: string;
            }): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
    Content: ({ children, scope, ...focusScopeProps }: import("./types").SelectContentProps & import("@hanzogui/focus-scope").FocusScopeProps) => import("react/jsx-runtime").JSX.Element | null;
    Group: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        scope?: import("./types").SelectScopes;
    } & React.RefAttributes<HanzoguiElement>>;
    Icon: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Item: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").StackNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>, keyof import("./SelectItem").SelectItemExtraProps> & import("./SelectItem").SelectItemExtraProps, HanzoguiElement, import("@hanzogui/core").StackNonStyleProps & import("./SelectItem").SelectItemExtraProps, import("@hanzogui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    ItemIndicator: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        scope?: import("./types").SelectScopes;
    } & React.RefAttributes<HanzoguiElement>>;
    ItemText: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps & {
        scope?: import("./types").SelectScopes;
    }, import("@hanzogui/core").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Label: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
        size?: SizeTokens | FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>, "scope"> & {
        scope?: any;
    }, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps & {
        scope?: any;
    }, import("@hanzogui/core").TextStylePropsBase, {
        size?: SizeTokens | FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    ScrollDownButton: React.ForwardRefExoticComponent<import("./types").SelectScrollButtonProps & React.RefAttributes<HanzoguiElement>>;
    ScrollUpButton: React.ForwardRefExoticComponent<import("./types").SelectScrollButtonProps & React.RefAttributes<HanzoguiElement>>;
    Trigger: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").StackNonStyleProps, "disabled" | "size" | "unstyled" | keyof import("@hanzogui/core").StackStyleBase | "variant" | "active"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & import("@hanzogui/list-item").ListItemExtraProps & {
        scope?: import("./types").SelectScopes;
    } & React.RefAttributes<HanzoguiElement>>;
    Value: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }>, "scope" | "placeholder"> & {
        placeholder?: React.ReactNode;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps & {
        placeholder?: React.ReactNode;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@hanzogui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Viewport: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "size" | "unstyled" | "scope" | "disableScroll"> & {
        size?: SizeTokens;
        disableScroll?: boolean;
        unstyled?: boolean;
    } & {
        scope?: import("./types").SelectScopes;
    }, HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps & {
        size?: SizeTokens;
        disableScroll?: boolean;
        unstyled?: boolean;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@hanzogui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Indicator: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "style" | "disabled" | "onChange" | "className" | "id" | "tabIndex" | "role" | "rel" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "children" | "dangerouslySetInnerHTML" | "onCopy" | "onCut" | "onPaste" | "onFocus" | "onBlur" | "onBeforeInput" | "onInput" | "onKeyDown" | "onKeyUp" | "onClick" | "onContextMenu" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onPointerDown" | "onPointerDownCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerEnter" | "onPointerLeave" | "onScroll" | "onWheel" | "theme" | "debug" | `$${string}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "themeShallow" | "unstyled" | "render" | "group" | "untilMeasured" | "componentName" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onPointerEnterCapture" | "onPointerLeaveCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "importantForAccessibility" | "accessibilityLabelledBy" | "accessibilityLiveRegion" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "scope" | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>>> & Omit<import("@hanzogui/core").RNViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        scope?: import("./types").SelectScopes;
    }, HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<import("@hanzogui/core").RNViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        scope?: import("./types").SelectScopes;
    }, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    FocusScope: (props: import("@hanzogui/focus-scope/types/types").ScopedProps<import("@hanzogui/focus-scope").FocusScopeControllerProps>) => import("react/jsx-runtime").JSX.Element;
};
export {};
//# sourceMappingURL=Select.d.ts.map
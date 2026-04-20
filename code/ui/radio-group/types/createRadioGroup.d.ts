import type { GetProps } from '@hanzogui/core';
import React from 'react';
import { RadioGroupFrame, RadioGroupIndicatorFrame, RadioGroupItemFrame } from './RadioGroup';
type RadioIndicatorProps = GetProps<typeof RadioGroupIndicatorFrame> & {
    forceMount?: boolean;
    unstyled?: boolean;
};
export type RadioGroupItemProps = GetProps<typeof RadioGroupItemFrame> & {
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
};
export type RadioGroupProps = GetProps<typeof RadioGroupFrame> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
};
type RadioGroupComponent = (props: RadioGroupProps) => any;
type RadioGroupIndicatorComponent = (props: RadioIndicatorProps) => any;
type RadioGroupItemComponent = (props: RadioGroupItemProps) => any;
export declare function createRadioGroup<F extends RadioGroupComponent, D extends RadioGroupIndicatorComponent, I extends RadioGroupItemComponent>(createProps: {
    disableActiveTheme?: boolean;
    Frame?: F;
    Indicator?: D;
    Item?: I;
}): React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>, "native" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "name" | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "value" | "orientation" | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | "defaultValue" | "onValueChange" | "required" | "accentColor"> & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "orientation"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
} & React.RefAttributes<import("@hanzogui/core").HanzoguiElement>> & import("@hanzogui/core").StaticComponentObject<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>, "native" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "name" | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "value" | "orientation" | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | "defaultValue" | "onValueChange" | "required" | "accentColor"> & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "orientation"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "orientation"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@hanzogui/core").StaticConfigPublic> & Omit<import("@hanzogui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    }>, "native" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "name" | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "value" | "orientation" | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | "defaultValue" | "onValueChange" | "required" | "accentColor"> & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "orientation"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    }>> & {
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        required?: boolean;
        disabled?: boolean;
        name?: string;
        native?: boolean;
        accentColor?: string;
    }, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "orientation"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    }>> & {
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        required?: boolean;
        disabled?: boolean;
        name?: string;
        native?: boolean;
        accentColor?: string;
    }, import("@hanzogui/core").StackStyleBase, {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    }, import("@hanzogui/core").StaticConfigPublic];
} & {
    Item: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    }>, "theme" | "debug" | "style" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "render" | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "size" | "value" | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | "labelledBy"> & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "disabled" | "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "size"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    }>> & {
        value: string;
        id?: string;
        labelledBy?: string;
        disabled?: boolean;
    }, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "disabled" | "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "size"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    }>> & {
        value: string;
        id?: string;
        labelledBy?: string;
        disabled?: boolean;
    }, import("@hanzogui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Indicator: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "theme" | "debug" | "style" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "render" | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | "forceMount"> & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        forceMount?: boolean;
        unstyled?: boolean;
    }, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        forceMount?: boolean;
        unstyled?: boolean;
    }, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=createRadioGroup.d.ts.map
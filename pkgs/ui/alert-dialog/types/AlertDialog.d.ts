import type { HanzoguiElement } from '@hanzogui/core';
import type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogOverlayExtraProps, DialogOverlayProps, DialogPortalProps, DialogProps, DialogTitleProps, DialogTriggerProps } from '@hanzogui/dialog';
import * as React from 'react';
export type AlertDialogScopes = string;
type ScopedProps<P> = Omit<P, 'scope'> & {
    scope?: AlertDialogScopes;
};
type AlertDialogProps = ScopedProps<DialogProps> & {
    native?: boolean;
};
type AlertDialogTriggerProps = ScopedProps<DialogTriggerProps>;
declare const AlertDialogTrigger: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").StackNonStyleProps | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>>> & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
type AlertDialogPortalProps = ScopedProps<DialogPortalProps>;
declare const AlertDialogPortal: React.FC<AlertDialogPortalProps>;
type AlertDialogOverlayExtraProps = ScopedProps<{}> & DialogOverlayExtraProps;
type AlertDialogOverlayProps = AlertDialogOverlayExtraProps & DialogOverlayProps;
declare const AlertDialogOverlay: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | keyof import("@hanzogui/stacks").StackVariants | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | "forceMount"> & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@hanzogui/dialog").DialogScopes;
} & Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@hanzogui/dialog").DialogScopes;
} & Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants, import("@hanzogui/core").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
type AlertDialogContentProps = ScopedProps<Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'>>;
declare const AlertDialogContent: React.ForwardRefExoticComponent<Omit<Omit<DialogContentProps, "onPointerDownOutside" | "onInteractOutside">, "scope"> & {
    scope?: AlertDialogScopes;
} & React.RefAttributes<HanzoguiElement>>;
type AlertDialogTitleProps = ScopedProps<DialogTitleProps>;
declare const AlertDialogTitle: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@hanzogui/core").TextStylePropsBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/core").FontSizeTokens | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase>>>> & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
type AlertDialogDescriptionProps = ScopedProps<DialogDescriptionProps>;
declare const AlertDialogDescription: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@hanzogui/core").TextStylePropsBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/core").FontSizeTokens | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase>>>> & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
type AlertDialogActionProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogAction: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
type AlertDialogCancelProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogCancel: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
type AlertDialogDestructiveProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogDestructive: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
declare const AlertDialog: React.FC<AlertDialogProps> & {
    Trigger: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").StackNonStyleProps | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>>> & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
    Portal: React.FC<AlertDialogPortalProps>;
    Overlay: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        open?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | keyof import("@hanzogui/stacks").StackVariants | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | "forceMount"> & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@hanzogui/dialog").DialogScopes;
    } & Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@hanzogui/dialog").DialogScopes;
    } & Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants, import("@hanzogui/core").StackStyleBase, {
        open?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Content: React.ForwardRefExoticComponent<Omit<Omit<DialogContentProps, "onPointerDownOutside" | "onInteractOutside">, "scope"> & {
        scope?: AlertDialogScopes;
    } & React.RefAttributes<HanzoguiElement>>;
    Action: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
    Cancel: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
    Destructive: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/core").StackStyleBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> | keyof import("@hanzogui/core").RNHanzoguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
    Title: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@hanzogui/core").TextStylePropsBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase> & {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/core").FontSizeTokens | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase>>>> & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
    Description: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@hanzogui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@hanzogui/core").TextStylePropsBase | keyof import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase> & {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/core").FontSizeTokens | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase>>>> & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
};
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogDestructive, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
export type { AlertDialogActionProps, AlertDialogCancelProps, AlertDialogDestructiveProps, AlertDialogContentProps, AlertDialogDescriptionProps, AlertDialogOverlayProps, AlertDialogPortalProps, AlertDialogProps, AlertDialogTitleProps, AlertDialogTriggerProps, };
//# sourceMappingURL=AlertDialog.d.ts.map
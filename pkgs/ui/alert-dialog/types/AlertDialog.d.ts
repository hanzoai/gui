import type { GuiElement } from '@hanzogui/core';
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
declare const AlertDialogTrigger: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").StackNonStyleProps | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>>> & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
type AlertDialogPortalProps = ScopedProps<DialogPortalProps>;
declare const AlertDialogPortal: React.FC<AlertDialogPortalProps>;
type AlertDialogOverlayExtraProps = ScopedProps<{}> & DialogOverlayExtraProps;
type AlertDialogOverlayProps = AlertDialogOverlayExtraProps & DialogOverlayProps;
declare const AlertDialogOverlay: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/core").RNViewNonStyleProps | keyof import("@hanzogui/stacks").StackVariants | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | "forceMount"> & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@hanzogui/dialog").DialogScopes;
} & Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@hanzogui/dialog").DialogScopes;
} & Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants, import("@hanzogui/web").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
type AlertDialogContentProps = ScopedProps<Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'>>;
declare const AlertDialogContent: React.ForwardRefExoticComponent<Omit<Omit<DialogContentProps, "onPointerDownOutside" | "onInteractOutside">, "scope"> & {
    scope?: AlertDialogScopes;
} & React.RefAttributes<GuiElement>>;
type AlertDialogTitleProps = ScopedProps<DialogTitleProps>;
declare const AlertDialogTitle: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@hanzogui/web").TextStylePropsBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase>>>> & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
type AlertDialogDescriptionProps = ScopedProps<DialogDescriptionProps>;
declare const AlertDialogDescription: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@hanzogui/web").TextStylePropsBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase>>>> & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
type AlertDialogActionProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogAction: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | keyof import("@hanzogui/core").RNViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
type AlertDialogCancelProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogCancel: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | keyof import("@hanzogui/core").RNViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
type AlertDialogDestructiveProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogDestructive: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | keyof import("@hanzogui/core").RNViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
declare const AlertDialog: React.FC<AlertDialogProps> & {
    Trigger: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").StackNonStyleProps | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>>> & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
    Portal: React.FC<AlertDialogPortalProps>;
    Overlay: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        open?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/core").RNViewNonStyleProps | keyof import("@hanzogui/stacks").StackVariants | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | "forceMount"> & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@hanzogui/dialog").DialogScopes;
    } & Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@hanzogui/dialog").DialogScopes;
    } & Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants, import("@hanzogui/web").StackStyleBase, {
        open?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Content: React.ForwardRefExoticComponent<Omit<Omit<DialogContentProps, "onPointerDownOutside" | "onInteractOutside">, "scope"> & {
        scope?: AlertDialogScopes;
    } & React.RefAttributes<GuiElement>>;
    Action: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | keyof import("@hanzogui/core").RNViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
    Cancel: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | keyof import("@hanzogui/core").RNViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
    Destructive: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | keyof import("@hanzogui/core").RNViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
    Title: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@hanzogui/web").TextStylePropsBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase> & {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase>>>> & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
    Description: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@hanzogui/web").TextStylePropsBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase> & {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase>>>> & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
};
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogDestructive, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
export type { AlertDialogActionProps, AlertDialogCancelProps, AlertDialogDestructiveProps, AlertDialogContentProps, AlertDialogDescriptionProps, AlertDialogOverlayProps, AlertDialogPortalProps, AlertDialogProps, AlertDialogTitleProps, AlertDialogTriggerProps, };
//# sourceMappingURL=AlertDialog.d.ts.map
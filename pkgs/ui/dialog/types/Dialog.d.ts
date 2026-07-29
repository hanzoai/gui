import type { GetProps, GuiElement, ViewProps } from '@hanzogui/core';
import type { DismissableProps } from '@hanzogui/dismissable';
import type { FocusScopeProps } from '@hanzogui/focus-scope';
import type { YStackProps } from '@hanzogui/stacks';
import * as React from 'react';
export type DialogScopes = string;
type ScopedProps<P> = P & {
    scope?: DialogScopes;
};
type DialogProps = ScopedProps<{
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    /**
     * When true, children never un-mount, otherwise they mount on open.
     *
     * @default false
     */
    keepChildrenMounted?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
    /**
     * Used to disable the remove scroll functionality when open
     */
    disableRemoveScroll?: boolean;
    /**
     * Called when the dialog open/close animation completes.
     */
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
}>;
type NonNull<A> = Exclude<A, void | null>;
type DialogContextValue = {
    forceMount?: boolean;
    keepChildrenMounted?: boolean;
    disableRemoveScroll?: boolean;
    triggerRef: React.RefObject<GuiElement | null>;
    contentRef: React.RefObject<GuiElement | null>;
    contentId: string;
    titleId: string;
    descriptionId: string;
    onOpenToggle(): void;
    open: NonNull<DialogProps['open']>;
    onOpenChange: NonNull<DialogProps['onOpenChange']>;
    modal: NonNull<DialogProps['modal']>;
    dialogScope: DialogScopes;
    adaptScope: string;
    onAnimationComplete?: DialogProps['onAnimationComplete'];
};
export declare const DialogContext: import("@hanzogui/web").StyledContext<DialogContextValue>;
export declare const useDialogContext: (scope?: string) => DialogContextValue, DialogProvider: React.Provider<DialogContextValue> & React.ProviderExoticComponent<Partial<DialogContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
type DialogTriggerProps = ScopedProps<ViewProps>;
declare const DialogTrigger: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope"> & {
    scope?: DialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & {
    scope?: DialogScopes;
}, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
type DialogPortalProps = ScopedProps<YStackProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}>;
export declare const DialogPortalFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
declare const DialogPortal: React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
} & {
    scope?: DialogScopes;
} & React.RefAttributes<GuiElement>>;
/**
 * exported for internal use with extractable()
 */
export declare const DialogOverlayFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export type DialogOverlayExtraProps = ScopedProps<{
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}>;
type DialogOverlayProps = YStackProps & DialogOverlayExtraProps;
declare const DialogOverlay: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, "scope" | "forceMount"> & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
} & {
    scope?: DialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
} & {
    scope?: DialogScopes;
}, import("@hanzogui/web").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
declare const DialogContentFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    transparent?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
type DialogContentFrameProps = GetProps<typeof DialogContentFrame>;
type DialogContentExtraProps = ScopedProps<Omit<DialogContentTypeProps, 'context' | 'onPointerDownCapture'>>;
type DialogContentProps = DialogContentFrameProps & DialogContentExtraProps;
declare const DialogContent: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    transparent?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "theme" | "debug" | "style" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "scope" | "fullscreen" | "transparent" | "size" | "circular" | "elevate" | "bordered" | "chromeless" | "disableOutsidePointerEvents" | "branches" | "onEscapeKeyDown" | "onPointerDownOutside" | "onFocusOutside" | "onInteractOutside" | "forceUnmount" | "onBlurCapture" | "onFocusCapture" | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    transparent?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | "trapFocus" | "onOpenAutoFocus" | "onCloseAutoFocus"> & Omit<DialogContentTypeProps, "onPointerDownCapture" | "context"> & {
    scope?: DialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogContentTypeProps, "onPointerDownCapture" | "context"> & {
    scope?: DialogScopes;
}, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    transparent?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
type DialogContentTypeProps = DialogContentImplProps & {
    context: DialogContextValue;
};
type DialogContentImplExtraProps = Omit<DismissableProps, 'onDismiss'> & {
    /**
     * When `true`, focus cannot escape the `Content` via keyboard,
     * pointer, or a programmatic focus.
     * @defaultValue false
     */
    trapFocus?: FocusScopeProps['trapped'];
    /**
     * Event handler called when auto-focusing on open.
     * Can be prevented.
     */
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    /**
     * Event handler called when auto-focusing on close.
     * Can be prevented.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
    context: DialogContextValue;
};
type DialogContentImplProps = DialogContentFrameProps & DialogContentImplExtraProps;
declare const DialogTitleFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
type DialogTitleExtraProps = ScopedProps<{}>;
type DialogTitleProps = DialogTitleExtraProps & GetProps<typeof DialogTitleFrame>;
declare const DialogTitle: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}>, "scope"> & {
    scope?: DialogScopes;
}, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps & {
    scope?: DialogScopes;
}, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
declare const DialogDescriptionFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
type DialogDescriptionExtraProps = ScopedProps<{}>;
type DialogDescriptionProps = DialogDescriptionExtraProps & GetProps<typeof DialogDescriptionFrame>;
declare const DialogDescription: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}>, "scope"> & {
    scope?: DialogScopes;
}, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps & {
    scope?: DialogScopes;
}, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
declare const DialogCloseFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
export type DialogCloseExtraProps = ScopedProps<{
    displayWhenAdapted?: boolean;
}>;
type DialogCloseProps = GetProps<typeof DialogCloseFrame> & DialogCloseExtraProps;
declare const DialogClose: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | "displayWhenAdapted"> & {
    displayWhenAdapted?: boolean;
} & {
    scope?: DialogScopes;
}, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & {
    displayWhenAdapted?: boolean;
} & {
    scope?: DialogScopes;
}, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
declare const DialogWarningProvider: (props: {
    contentName: string;
    titleName: string;
    docsSlug: string;
} & {
    children: React.ReactNode;
}) => React.JSX.Element;
export type DialogHandle = {
    open: (val: boolean) => void;
};
declare const Dialog: React.ForwardRefExoticComponent<{
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    /**
     * When true, children never un-mount, otherwise they mount on open.
     *
     * @default false
     */
    keepChildrenMounted?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
    /**
     * Used to disable the remove scroll functionality when open
     */
    disableRemoveScroll?: boolean;
    /**
     * Called when the dialog open/close animation completes.
     */
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
} & {
    scope?: DialogScopes;
} & React.RefAttributes<{
    open: (val: boolean) => void;
}>> & {
    Trigger: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope"> & {
        scope?: DialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & {
        scope?: DialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
    Portal: React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants & {
        /**
         * Used to force mounting when more control is needed. Useful when
         * controlling animation with React animation libraries.
         */
        forceMount?: boolean;
    } & {
        scope?: DialogScopes;
    } & React.RefAttributes<GuiElement>>;
    Overlay: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        open?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "scope" | "forceMount"> & {
        /**
         * Used to force mounting when more control is needed. Useful when
         * controlling animation with React animation libraries.
         */
        forceMount?: boolean;
    } & {
        scope?: DialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & {
        /**
         * Used to force mounting when more control is needed. Useful when
         * controlling animation with React animation libraries.
         */
        forceMount?: boolean;
    } & {
        scope?: DialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {
        open?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Content: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        transparent?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "theme" | "debug" | "style" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "scope" | "fullscreen" | "transparent" | "size" | "circular" | "elevate" | "bordered" | "chromeless" | "disableOutsidePointerEvents" | "branches" | "onEscapeKeyDown" | "onPointerDownOutside" | "onFocusOutside" | "onInteractOutside" | "forceUnmount" | "onBlurCapture" | "onFocusCapture" | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        transparent?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> | "trapFocus" | "onOpenAutoFocus" | "onCloseAutoFocus"> & Omit<DialogContentTypeProps, "onPointerDownCapture" | "context"> & {
        scope?: DialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<DialogContentTypeProps, "onPointerDownCapture" | "context"> & {
        scope?: DialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        transparent?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Title: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }>, "scope"> & {
        scope?: DialogScopes;
    }, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps & {
        scope?: DialogScopes;
    }, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Description: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }>, "scope"> & {
        scope?: DialogScopes;
    }, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps & {
        scope?: DialogScopes;
    }, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Close: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, "scope" | "displayWhenAdapted"> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: DialogScopes;
    }, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: DialogScopes;
    }, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
    FocusScope: (props: import("@hanzogui/focus-scope").ScopedProps<import("@hanzogui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
    Adapt: ((props: import("@hanzogui/adapt").AdaptProps) => React.JSX.Element) & {
        Contents: {
            ({ scope, ...rest }: {
                scope?: string;
            }): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
};
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DialogWarningProvider, };
export type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogOverlayProps, DialogPortalProps, DialogProps, DialogTitleProps, DialogTriggerProps, };
//# sourceMappingURL=Dialog.d.ts.map
import type { GroupProps } from '@hanzogui/group';
import { type RovingFocusGroupProps } from '@hanzogui/roving-focus';
import type { GetProps, HanzoguiElement, ViewProps } from '@hanzogui/web';
import * as React from 'react';
import type { LayoutRectangle } from 'react-native';
import { DefaultTabsContentFrame, DefaultTabsFrame, DefaultTabsTabFrame } from './Tabs';
type TabsComponent = (props: {
    direction: 'horizontal' | 'vertical';
} & ViewProps) => any;
type TabComponent = (props: {
    active?: boolean;
} & ViewProps) => any;
type ContentComponent = (props: ViewProps) => any;
export declare function createTabs<C extends TabsComponent, T extends TabComponent, F extends ContentComponent>(createProps: {
    ContentFrame: F;
    TabFrame: T;
    TabsFrame: C;
}): React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, keyof TabsExtraProps<string>> & TabsExtraProps<string> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, keyof TabsExtraProps<string>> & TabsExtraProps<string>, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & TabsExtraProps<string>, import("@hanzogui/web").StackStyleBase, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        size?: import("@hanzogui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, keyof TabsExtraProps<string>> & TabsExtraProps<string>, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & TabsExtraProps<string>, import("@hanzogui/web").StackStyleBase, {
        size?: import("@hanzogui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    List: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "size" | "fullscreen"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }>> & import("@hanzogui/group").GroupExtraProps & {
        /**
         * Whether to loop over after reaching the end or start of the items
         * @default true
         */
        loop?: boolean;
    } & React.RefAttributes<HanzoguiElement>>;
    /**
     * @deprecated Use Tabs.Tab instead
     */
    Trigger: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }>, "theme" | "debug" | "style" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | keyof import("@hanzogui/web").StackStyleBase | "size" | "activeStyle" | "value" | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> | "onInteraction" | "activeTheme" | "__scopeTabs"> & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "disabled" | "unstyled" | keyof import("@hanzogui/web").StackStyleBase | "size" | "activeStyle"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply when tab is active */
        activeStyle?: TabsTriggerFrameProps;
        /** Theme to apply when tab is active (use null for no theme) */
        activeTheme?: string | null;
    } & {
        __scopeTabs?: string;
    }, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "disabled" | "unstyled" | keyof import("@hanzogui/web").StackStyleBase | "size" | "activeStyle"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply when tab is active */
        activeStyle?: TabsTriggerFrameProps;
        /** Theme to apply when tab is active (use null for no theme) */
        activeTheme?: string | null;
    } & {
        __scopeTabs?: string;
    }, import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }, {
        accept: {
            readonly activeStyle: "style";
        };
    }>;
    Tab: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }>, "theme" | "debug" | "style" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | keyof import("@hanzogui/web").StackStyleBase | "size" | "activeStyle" | "value" | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> | "onInteraction" | "activeTheme" | "__scopeTabs"> & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "disabled" | "unstyled" | keyof import("@hanzogui/web").StackStyleBase | "size" | "activeStyle"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply when tab is active */
        activeStyle?: TabsTriggerFrameProps;
        /** Theme to apply when tab is active (use null for no theme) */
        activeTheme?: string | null;
    } & {
        __scopeTabs?: string;
    }, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "disabled" | "unstyled" | keyof import("@hanzogui/web").StackStyleBase | "size" | "activeStyle"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply when tab is active */
        activeStyle?: TabsTriggerFrameProps;
        /** Theme to apply when tab is active (use null for no theme) */
        activeTheme?: string | null;
    } & {
        __scopeTabs?: string;
    }, import("@hanzogui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }, {
        accept: {
            readonly activeStyle: "style";
        };
    }>;
    Content: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, keyof TabsContentExtraProps> & TabsContentExtraProps, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & TabsContentExtraProps, import("@hanzogui/web").StackStyleBase, {
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
};
type TabsFrameProps = GetProps<typeof DefaultTabsFrame>;
type TabsExtraProps<Tab = string> = {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: Tab;
    /** A function called when a new tab is selected */
    onValueChange?: (value: Tab) => void;
    /**
     * The orientation the tabs are layed out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /**
     * The direction of navigation between toolbar items.
     */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether a tab is activated automatically or manually. Only supported in web.
     * @defaultValue automatic
     * */
    activationMode?: 'automatic' | 'manual';
};
type TabsProps<Tab = string> = TabsFrameProps & TabsExtraProps<Tab>;
type TabsListFrameProps = GroupProps;
type TabsListProps = TabsListFrameProps & {
    /**
     * Whether to loop over after reaching the end or start of the items
     * @default true
     */
    loop?: boolean;
};
type InteractionType = 'select' | 'focus' | 'hover';
type TabLayout = LayoutRectangle;
type TabsTriggerFrameProps = GetProps<typeof DefaultTabsTabFrame>;
/**
 * @deprecated use `TabTabsProps` instead
 */
type TabsTriggerProps = TabsTriggerFrameProps & {
    /** The value for the tabs state to be changed to after activation of the trigger */
    value: string;
    /** Used for making custom indicators when trigger interacted with */
    onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
    /** Custom styles to apply when tab is active */
    activeStyle?: TabsTriggerFrameProps;
    /** Theme to apply when tab is active (use null for no theme) */
    activeTheme?: string | null;
};
type TabsTabProps = TabsTriggerProps;
type TabsTriggerLayout = LayoutRectangle;
type TabsContentFrameProps = GetProps<typeof DefaultTabsContentFrame>;
type TabsContentExtraProps = {
    /** Will show the content when the value matches the state of Tabs root */
    value: string;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with Hanzogui animations.
     */
    forceMount?: boolean;
};
type TabsContentProps = TabsContentFrameProps & TabsContentExtraProps;
export type { TabLayout, TabsContentProps, TabsListProps, TabsProps, TabsTabProps, TabsTriggerLayout, TabsTriggerProps, };
//# sourceMappingURL=createTabs.d.ts.map
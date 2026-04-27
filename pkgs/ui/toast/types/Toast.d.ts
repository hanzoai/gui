import type { GetProps, NativePlatform, NativeValue, HanzoguiElement } from '@hanzogui/core';
import * as React from 'react';
import type { CustomData } from './ToastImperative';
import { useToast, useToastController, useToastState } from './ToastImperative';
import type { ToastExtraProps, ToastProps } from './ToastImpl';
import type { ScopedProps, ToastProviderProps } from './ToastProvider';
import { ToastProvider } from './ToastProvider';
import type { ToastViewportProps } from './ToastViewport';
import { ToastViewport } from './ToastViewport';
declare const ToastTitle: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/core").FontSizeTokens | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
type ToastTitleProps = GetProps<typeof ToastTitle>;
declare const ToastDescription: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/core").FontSizeTokens | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
type ToastDescriptionProps = GetProps<typeof ToastDescription>;
type ToastActionProps = ScopedProps<ToastCloseProps & {
    /**
     * A short description for an alternate way to carry out the action. For screen reader users
     * who will not be able to navigate to the button easily/quickly.
     * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
     * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
     */
    altText: string;
}>;
declare const ToastCloseFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
type ToastCloseFrameProps = GetProps<typeof ToastCloseFrame>;
type ToastCloseProps = ScopedProps<ToastCloseFrameProps & {}>;
declare const Toast: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof ToastExtraProps> & ToastExtraProps & React.RefAttributes<HanzoguiElement>> & import("@hanzogui/core").StaticComponentObject<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof ToastExtraProps> & ToastExtraProps, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & ToastExtraProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic> & Omit<import("@hanzogui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof ToastExtraProps> & ToastExtraProps, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & ToastExtraProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic];
} & {
    Title: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/core").FontSizeTokens | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Description: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/core").FontSizeTokens | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Action: React.ForwardRefExoticComponent<Omit<ToastActionProps, "scope"> & {
        scope?: import("./ToastProvider").ToastScopes;
    } & React.RefAttributes<HanzoguiElement>>;
    Close: React.ForwardRefExoticComponent<Omit<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>, "scope"> & {
        scope?: import("./ToastProvider").ToastScopes;
    } & React.RefAttributes<HanzoguiElement>>;
};
export { Toast, ToastProvider, ToastViewport, useToast, useToastController, useToastState, };
export type { CustomData, ToastActionProps, ToastCloseProps, ToastDescriptionProps, NativePlatform as ToastNativePlatform, NativeValue as ToastNativeValue, ToastProps, ToastProviderProps, ToastTitleProps, ToastViewportProps, };
//# sourceMappingURL=Toast.d.ts.map
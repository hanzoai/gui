import type { GetProps, NativePlatform, NativeValue, GuiElement } from '@hanzogui/core';
import * as React from 'react';
import type { CustomData } from './ToastImperative';
import { useToast, useToastController, useToastState } from './ToastImperative';
import type { ToastExtraProps, ToastProps } from './ToastImpl';
import type { ScopedProps, ToastProviderProps } from './ToastProvider';
import { ToastProvider } from './ToastProvider';
import type { ToastViewportProps } from './ToastViewport';
import { ToastViewport } from './ToastViewport';
declare const ToastTitle: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
type ToastTitleProps = GetProps<typeof ToastTitle>;
declare const ToastDescription: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
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
declare const ToastCloseFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
type ToastCloseFrameProps = GetProps<typeof ToastCloseFrame>;
type ToastCloseProps = ScopedProps<ToastCloseFrameProps & {}>;
declare const Toast: React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof ToastExtraProps> & ToastExtraProps & React.RefAttributes<GuiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof ToastExtraProps> & ToastExtraProps, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & ToastExtraProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof ToastExtraProps> & ToastExtraProps, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & ToastExtraProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    Title: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Description: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Action: React.ForwardRefExoticComponent<Omit<ToastActionProps, "scope"> & {
        scope?: import("./ToastProvider").ToastScopes;
    } & React.RefAttributes<GuiElement>>;
    Close: React.ForwardRefExoticComponent<Omit<Omit<import("@hanzogui/core").RNViewNonStyleProps, "elevation" | keyof import("@hanzogui/web").StackStyleBase | "fullscreen"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>, "scope"> & {
        scope?: import("./ToastProvider").ToastScopes;
    } & React.RefAttributes<GuiElement>>;
};
export { Toast, ToastProvider, ToastViewport, useToast, useToastController, useToastState, };
export type { CustomData, ToastActionProps, ToastCloseProps, ToastDescriptionProps, NativePlatform as ToastNativePlatform, NativeValue as ToastNativeValue, ToastProps, ToastProviderProps, ToastTitleProps, ToastViewportProps, };
//# sourceMappingURL=Toast.d.ts.map
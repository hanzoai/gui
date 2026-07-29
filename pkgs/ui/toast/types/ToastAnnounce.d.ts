import type { GetProps, GuiElement } from '@hanzogui/core';
import { VisuallyHidden } from '@hanzogui/visually-hidden';
import * as React from 'react';
import type { ScopedProps } from './ToastProvider';
declare const ToastAnnounceExcludeFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
type ToastAnnounceExcludeFrameProps = GetProps<typeof ToastAnnounceExcludeFrame>;
type ToastAnnounceExcludeExtraProps = {
    altText?: string;
};
type ToastAnnounceExcludeProps = ToastAnnounceExcludeFrameProps & ToastAnnounceExcludeExtraProps;
declare const ToastAnnounceExclude: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, keyof import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & ToastAnnounceExcludeExtraProps & React.RefAttributes<GuiElement>>;
interface ToastAnnounceProps extends Omit<GetProps<typeof VisuallyHidden>, 'children'>, ScopedProps<{
    children: string[];
}> {
}
declare const ToastAnnounce: React.FC<ToastAnnounceProps>;
export { ToastAnnounce, ToastAnnounceExclude, type ToastAnnounceExcludeProps, type ToastAnnounceProps, };
//# sourceMappingURL=ToastAnnounce.d.ts.map
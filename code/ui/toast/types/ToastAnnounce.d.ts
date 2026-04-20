import type { GetProps, HanzoguiElement } from '@hanzogui/core';
import { VisuallyHidden } from '@hanzogui/visually-hidden';
import * as React from 'react';
import type { ScopedProps } from './ToastProvider';
declare const ToastAnnounceExcludeFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
type ToastAnnounceExcludeFrameProps = GetProps<typeof ToastAnnounceExcludeFrame>;
type ToastAnnounceExcludeExtraProps = {
    altText?: string;
};
type ToastAnnounceExcludeProps = ToastAnnounceExcludeFrameProps & ToastAnnounceExcludeExtraProps;
declare const ToastAnnounceExclude: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, keyof import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {}>> & ToastAnnounceExcludeExtraProps & React.RefAttributes<HanzoguiElement>>;
interface ToastAnnounceProps extends Omit<GetProps<typeof VisuallyHidden>, 'children'>, ScopedProps<{
    children: string[];
}> {
}
declare const ToastAnnounce: React.FC<ToastAnnounceProps>;
export { ToastAnnounce, ToastAnnounceExclude, type ToastAnnounceExcludeProps, type ToastAnnounceProps, };
//# sourceMappingURL=ToastAnnounce.d.ts.map
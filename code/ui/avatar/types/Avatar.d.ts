import type { GetProps, SizeTokens, HanzoguiElement } from '@hanzogui/core';
import type { Scope } from '@hanzogui/create-context';
import type { ImageProps } from '@hanzogui/image';
import * as React from 'react';
declare const createAvatarScope: import("@hanzogui/create-context").CreateScope;
type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
type AvatarImageProps = Partial<ImageProps> & {
    onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
};
declare const AvatarImage: React.ForwardRefExoticComponent<Partial<ImageProps> & {
    onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
} & React.RefAttributes<HanzoguiElement>>;
export declare const AvatarFallbackFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
type AvatarFallbackExtraProps = {
    delayMs?: number;
};
type AvatarFallbackProps = GetProps<typeof AvatarFallbackFrame> & AvatarFallbackExtraProps;
declare const AvatarFallback: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, "delayMs" | "__scopeAvatar"> & AvatarFallbackExtraProps & {
    __scopeAvatar?: Scope;
}, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & AvatarFallbackExtraProps & {
    __scopeAvatar?: Scope;
}, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export declare const AvatarFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    size?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/core").StaticConfigPublic & {
    memo: true;
}>;
type AvatarProps = GetProps<typeof AvatarFrame>;
/**
 * @summary A component that displays an image or a fallback icon.
 * @see — Docs https://hanzogui.dev/ui/avatar
 *
 * @example
 * ```tsx
 * <Avatar circular size="$10">
 *  <Avatar.Image
 *    aria-label="Cam"
 *    src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
 *  />
 *  <Avatar.Fallback backgroundColor="$blue10" />
 * </Avatar>
 * ```
 */
declare const Avatar: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "size" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    size?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    size?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    size?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & React.RefAttributes<HanzoguiElement>> & {
    Image: React.ForwardRefExoticComponent<Partial<ImageProps> & {
        onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
    } & React.RefAttributes<HanzoguiElement>>;
    Fallback: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "delayMs" | "__scopeAvatar"> & AvatarFallbackExtraProps & {
        __scopeAvatar?: Scope;
    }, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & AvatarFallbackExtraProps & {
        __scopeAvatar?: Scope;
    }, import("@hanzogui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
};
export { createAvatarScope, Avatar, AvatarImage, AvatarFallback };
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
//# sourceMappingURL=Avatar.d.ts.map
import type { GetProps, SizeTokens, GuiElement } from '@hanzogui/core';
import type { SizableStackProps } from '@hanzogui/stacks';
import * as React from 'react';
import type { View } from 'react-native';
import type { SliderProps, SliderTrackProps } from './types';
export declare const SliderTrackFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
declare const SliderTrack: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "size" | "transparent" | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & React.RefAttributes<GuiElement>>;
export declare const SliderActiveFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
type SliderActiveProps = GetProps<typeof SliderActiveFrame>;
declare const SliderActive: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "size" | "fullscreen" | "orientation"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & React.RefAttributes<View>>;
export declare const SliderThumbFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export interface SliderThumbExtraProps {
    index?: number;
}
export interface SliderThumbProps extends SizableStackProps, SliderThumbExtraProps {
}
declare const SliderThumb: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "index"> & SliderThumbExtraProps, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & SliderThumbExtraProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
declare const Slider: React.ForwardRefExoticComponent<SliderProps & {
    __scopeSlider?: string;
} & React.RefAttributes<unknown>> & {
    Track: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "size" | "transparent" | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        size?: import("@hanzogui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        size?: import("@hanzogui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
        size?: import("@hanzogui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & React.RefAttributes<GuiElement>>;
    TrackActive: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "size" | "fullscreen" | "orientation"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: any;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: any;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: any;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    }>> & React.RefAttributes<View>>;
    Thumb: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "index"> & SliderThumbExtraProps, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & SliderThumbExtraProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
};
declare const Track: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "size" | "transparent" | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & React.RefAttributes<GuiElement>>;
declare const Range: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "size" | "fullscreen" | "orientation"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & React.RefAttributes<View>>;
declare const Thumb: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "index"> & SliderThumbExtraProps, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & SliderThumbExtraProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export { Range, Slider, SliderThumb, SliderTrack, SliderActive, Thumb, Track, };
export type { SliderProps, SliderActiveProps, SliderTrackProps };
//# sourceMappingURL=Slider.d.ts.map
import type { GetProps, SizeTokens, HanzoguiElement } from '@hanzogui/core';
import type { SizableStackProps } from '@hanzogui/stacks';
import * as React from 'react';
import type { View } from 'react-native';
import type { SliderProps, SliderTrackProps } from './types';
export declare const SliderTrackFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
declare const SliderTrack: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "size" | "transparent" | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    size?: import("@hanzogui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    size?: import("@hanzogui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
    size?: import("@hanzogui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & React.RefAttributes<HanzoguiElement>>;
export declare const SliderActiveFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
type SliderActiveProps = GetProps<typeof SliderActiveFrame>;
declare const SliderActive: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "size" | "fullscreen" | "orientation"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & React.RefAttributes<View>>;
export declare const SliderThumbFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export interface SliderThumbExtraProps {
    index?: number;
}
export interface SliderThumbProps extends SizableStackProps, SliderThumbExtraProps {
}
declare const SliderThumb: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "index"> & SliderThumbExtraProps, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & SliderThumbExtraProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
declare const Slider: React.ForwardRefExoticComponent<SliderProps & {
    __scopeSlider?: string;
} & React.RefAttributes<unknown>> & {
    Track: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "size" | "transparent" | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        size?: import("@hanzogui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        size?: import("@hanzogui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        size?: import("@hanzogui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & React.RefAttributes<HanzoguiElement>>;
    TrackActive: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "size" | "fullscreen" | "orientation"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: any;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: any;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: any;
        fullscreen?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    }>> & React.RefAttributes<View>>;
    Thumb: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "index"> & SliderThumbExtraProps, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & SliderThumbExtraProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        size?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
};
declare const Track: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "size" | "transparent" | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    size?: import("@hanzogui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    size?: import("@hanzogui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
    size?: import("@hanzogui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & React.RefAttributes<HanzoguiElement>>;
declare const Range: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@hanzogui/core").StackStyleBase | "size" | "fullscreen" | "orientation"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: any;
    fullscreen?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & React.RefAttributes<View>>;
declare const Thumb: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "index"> & SliderThumbExtraProps, HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & SliderThumbExtraProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    size?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export { Range, Slider, SliderThumb, SliderTrack, SliderActive, Thumb, Track, };
export type { SliderProps, SliderActiveProps, SliderTrackProps };
//# sourceMappingURL=Slider.d.ts.map
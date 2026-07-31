export declare const defaultPalettes: {
    dark_blue: string[];
    dark_gray: string[];
    dark_green: string[];
    dark_orange: string[];
    dark_pink: string[];
    dark_purple: string[];
    dark_red: string[];
    dark_yellow: string[];
    light_blue: string[];
    light_gray: string[];
    light_green: string[];
    light_orange: string[];
    light_pink: string[];
    light_purple: string[];
    light_red: string[];
    light_yellow: string[];
    light: any[];
    dark: any[];
};
export declare const defaultTemplates: Record<"light_base" | "light_surface1" | "light_surface2" | "light_surface3" | "dark_base" | "dark_surface1" | "dark_surface2" | "dark_surface3" | "light_alt1" | "light_alt2" | "dark_alt1" | "dark_alt2" | "light_inverseSurface1" | "light_inverseActive" | "light_surfaceActive" | "dark_inverseSurface1" | "dark_inverseActive" | "dark_surfaceActive", {
    accentBackground: number;
    accentColor: number;
    background0: number;
    background025: number;
    background05: number;
    background075: number;
    color1: number;
    color2: number;
    color3: number;
    color4: number;
    color5: number;
    color6: number;
    color7: number;
    color8: number;
    color9: number;
    color10: number;
    color11: number;
    color12: number;
    color0: number;
    color025: number;
    color05: number;
    color075: number;
    background: number;
    backgroundHover: number;
    backgroundPress: number;
    backgroundFocus: number;
    borderColor: number;
    borderColorHover: number;
    borderColorPress: number;
    borderColorFocus: number;
    color: number;
    colorHover: number;
    colorPress: number;
    colorFocus: number;
    colorTransparent: number;
    placeholderColor: number;
    outlineColor: number;
}>;
declare const nonInherited: {
    light: any;
    dark: any;
};
/**
 * These are optional themes that serve as defaults for components. They don't
 * change color1 through color12 just "generic" properties like color,
 * background, borderColor.
 *
 * They can be overridden with the theme prop, or left out entirely for
 * "un-themed" components.

 */
export declare const defaultComponentThemes: {
    readonly ListItem: {
        readonly template: "surface1";
    };
    readonly SelectTrigger: any;
    readonly Card: any;
    readonly Button: any;
    readonly Checkbox: any;
    readonly Switch: any;
    readonly SwitchThumb: any;
    readonly TooltipContent: any;
    readonly Progress: {
        readonly template: "surface1";
    };
    readonly RadioGroupItem: any;
    readonly TooltipArrow: {
        readonly template: "surface1";
    };
    readonly SliderTrackActive: {
        readonly template: "surface3";
    };
    readonly SliderTrack: {
        readonly template: "surface1";
    };
    readonly SliderThumb: any;
    readonly Tooltip: any;
    readonly ProgressIndicator: any;
    readonly SheetOverlay: {
        parent: string;
        theme: {
            background: string;
        };
    }[];
    readonly DialogOverlay: {
        parent: string;
        theme: {
            background: string;
        };
    }[];
    readonly ModalOverlay: {
        parent: string;
        theme: {
            background: string;
        };
    }[];
    readonly Input: any;
    readonly TextArea: any;
};
/**
 * These are useful for states (alt gets more subtle as it goes up) or emphasis
 * (surface gets more contrasted from the background as it goes up)
 */
export declare const defaultSubThemes: {
    readonly alt1: {
        readonly template: "alt1";
    };
    readonly alt2: {
        readonly template: "alt2";
    };
    readonly active: {
        readonly template: "surface3";
    };
    readonly surface1: {
        readonly template: "surface1";
    };
    readonly surface2: {
        readonly template: "surface2";
    };
    readonly surface3: {
        readonly template: "surface3";
    };
    readonly surface4: {
        readonly template: "surfaceActive";
    };
};
declare const themesIn: {
    readonly light: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    readonly dark: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    light_blue: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_gray: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_green: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_orange: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_pink: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_purple: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_red: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_yellow: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    dark_blue: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_gray: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_green: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_orange: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_pink: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_purple: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_red: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_yellow: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    light_surface1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_surface2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_surface3: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    dark_surface1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_surface2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_surface3: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    light_alt1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_alt2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    dark_alt1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_alt2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    light_blue_surface1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_gray_surface1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_green_surface1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_orange_surface1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_pink_surface1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_purple_surface1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_red_surface1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_yellow_surface1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_blue_surface2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_gray_surface2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_green_surface2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_orange_surface2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_pink_surface2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_purple_surface2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_red_surface2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_yellow_surface2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    dark_blue_surface1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_gray_surface1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_green_surface1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_orange_surface1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_pink_surface1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_purple_surface1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_red_surface1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_yellow_surface1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_blue_surface2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_gray_surface2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_green_surface2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_orange_surface2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_pink_surface2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_purple_surface2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_red_surface2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_yellow_surface2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    light_blue_alt1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_blue_alt2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_blue_active: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_green_alt1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_green_alt2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_green_active: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_orange_alt1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_orange_alt2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_orange_active: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_pink_alt1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_pink_alt2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_pink_active: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_purple_alt1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_purple_alt2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_purple_active: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_red_alt1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_red_alt2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_red_active: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_yellow_alt1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_yellow_alt2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_yellow_active: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    dark_blue_alt1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_blue_alt2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_blue_active: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_green_alt1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_green_alt2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_green_active: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_orange_alt1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_orange_alt2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_orange_active: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_pink_alt1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_pink_alt2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_pink_active: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_purple_alt1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_purple_alt2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_purple_active: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_red_alt1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_red_alt2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_red_active: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_yellow_alt1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_yellow_alt2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_yellow_active: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    light_active: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    dark_active: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    light_gray_alt1: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_gray_alt2: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_gray_active: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    dark_gray_alt1: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_gray_alt2: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_gray_active: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    light_blue_surface3: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_blue_surface4: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_gray_surface3: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_gray_surface4: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_green_surface3: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_green_surface4: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_orange_surface3: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_orange_surface4: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_pink_surface3: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_pink_surface4: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_purple_surface3: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_purple_surface4: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_red_surface3: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_red_surface4: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_yellow_surface3: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    light_yellow_surface4: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    dark_blue_surface3: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_blue_surface4: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_gray_surface3: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_gray_surface4: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_green_surface3: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_green_surface4: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_orange_surface3: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_orange_surface4: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_pink_surface3: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_pink_surface4: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_purple_surface3: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_purple_surface4: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_red_surface3: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_red_surface4: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_yellow_surface3: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    dark_yellow_surface4: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
    light_surface4: {
        readonly template: "base";
        readonly palette: "light";
        readonly nonInheritedValues: any;
    };
    dark_surface4: {
        readonly template: "base";
        readonly palette: "dark";
        readonly nonInheritedValues: any;
    };
};
type ThemeKeys = keyof typeof defaultTemplates.light_base | keyof typeof nonInherited.light;
export type Theme = Record<ThemeKeys, string>;
export type ThemesOut = Record<keyof typeof themesIn, Theme>;
export declare const themes: ThemesOut;
export declare const tokens: {
    color: {
        white0: import("@hanzogui/web").Variable<string>;
        white075: import("@hanzogui/web").Variable<string>;
        white05: import("@hanzogui/web").Variable<string>;
        white025: import("@hanzogui/web").Variable<string>;
        black0: import("@hanzogui/web").Variable<string>;
        black075: import("@hanzogui/web").Variable<string>;
        black05: import("@hanzogui/web").Variable<string>;
        black025: import("@hanzogui/web").Variable<string>;
        white1: import("@hanzogui/web").Variable<string>;
        white2: import("@hanzogui/web").Variable<string>;
        white3: import("@hanzogui/web").Variable<string>;
        white4: import("@hanzogui/web").Variable<string>;
        white5: import("@hanzogui/web").Variable<string>;
        white6: import("@hanzogui/web").Variable<string>;
        white7: import("@hanzogui/web").Variable<string>;
        white8: import("@hanzogui/web").Variable<string>;
        white9: import("@hanzogui/web").Variable<string>;
        white10: import("@hanzogui/web").Variable<string>;
        white11: import("@hanzogui/web").Variable<string>;
        white12: import("@hanzogui/web").Variable<string>;
        black1: import("@hanzogui/web").Variable<string>;
        black2: import("@hanzogui/web").Variable<string>;
        black3: import("@hanzogui/web").Variable<string>;
        black4: import("@hanzogui/web").Variable<string>;
        black5: import("@hanzogui/web").Variable<string>;
        black6: import("@hanzogui/web").Variable<string>;
        black7: import("@hanzogui/web").Variable<string>;
        black8: import("@hanzogui/web").Variable<string>;
        black9: import("@hanzogui/web").Variable<string>;
        black10: import("@hanzogui/web").Variable<string>;
        black11: import("@hanzogui/web").Variable<string>;
        black12: import("@hanzogui/web").Variable<string>;
    };
    space: {
        0: import("@hanzogui/web").Variable<number>;
        0.25: import("@hanzogui/web").Variable<number>;
        0.5: import("@hanzogui/web").Variable<number>;
        0.75: import("@hanzogui/web").Variable<number>;
        1: import("@hanzogui/web").Variable<number>;
        1.5: import("@hanzogui/web").Variable<number>;
        2: import("@hanzogui/web").Variable<number>;
        2.5: import("@hanzogui/web").Variable<number>;
        3: import("@hanzogui/web").Variable<number>;
        3.5: import("@hanzogui/web").Variable<number>;
        4: import("@hanzogui/web").Variable<number>;
        true: import("@hanzogui/web").Variable<number>;
        4.5: import("@hanzogui/web").Variable<number>;
        5: import("@hanzogui/web").Variable<number>;
        6: import("@hanzogui/web").Variable<number>;
        7: import("@hanzogui/web").Variable<number>;
        8: import("@hanzogui/web").Variable<number>;
        9: import("@hanzogui/web").Variable<number>;
        10: import("@hanzogui/web").Variable<number>;
        11: import("@hanzogui/web").Variable<number>;
        12: import("@hanzogui/web").Variable<number>;
        13: import("@hanzogui/web").Variable<number>;
        14: import("@hanzogui/web").Variable<number>;
        15: import("@hanzogui/web").Variable<number>;
        16: import("@hanzogui/web").Variable<number>;
        17: import("@hanzogui/web").Variable<number>;
        18: import("@hanzogui/web").Variable<number>;
        19: import("@hanzogui/web").Variable<number>;
        20: import("@hanzogui/web").Variable<number>;
        [-0.25]: import("@hanzogui/web").Variable<number>;
        [-0.5]: import("@hanzogui/web").Variable<number>;
        [-0.75]: import("@hanzogui/web").Variable<number>;
        [-1]: import("@hanzogui/web").Variable<number>;
        [-1.5]: import("@hanzogui/web").Variable<number>;
        [-2]: import("@hanzogui/web").Variable<number>;
        [-2.5]: import("@hanzogui/web").Variable<number>;
        [-3]: import("@hanzogui/web").Variable<number>;
        [-3.5]: import("@hanzogui/web").Variable<number>;
        [-4]: import("@hanzogui/web").Variable<number>;
        "-true": import("@hanzogui/web").Variable<number>;
        [-4.5]: import("@hanzogui/web").Variable<number>;
        [-5]: import("@hanzogui/web").Variable<number>;
        [-6]: import("@hanzogui/web").Variable<number>;
        [-7]: import("@hanzogui/web").Variable<number>;
        [-8]: import("@hanzogui/web").Variable<number>;
        [-9]: import("@hanzogui/web").Variable<number>;
        [-10]: import("@hanzogui/web").Variable<number>;
        [-11]: import("@hanzogui/web").Variable<number>;
        [-12]: import("@hanzogui/web").Variable<number>;
        [-13]: import("@hanzogui/web").Variable<number>;
        [-14]: import("@hanzogui/web").Variable<number>;
        [-15]: import("@hanzogui/web").Variable<number>;
        [-16]: import("@hanzogui/web").Variable<number>;
        [-17]: import("@hanzogui/web").Variable<number>;
        [-18]: import("@hanzogui/web").Variable<number>;
        [-19]: import("@hanzogui/web").Variable<number>;
        [-20]: import("@hanzogui/web").Variable<number>;
    };
    size: {
        $0: import("@hanzogui/web").Variable<number>;
        "$0.25": import("@hanzogui/web").Variable<number>;
        "$0.5": import("@hanzogui/web").Variable<number>;
        "$0.75": import("@hanzogui/web").Variable<number>;
        $1: import("@hanzogui/web").Variable<number>;
        "$1.5": import("@hanzogui/web").Variable<number>;
        $2: import("@hanzogui/web").Variable<number>;
        "$2.5": import("@hanzogui/web").Variable<number>;
        $3: import("@hanzogui/web").Variable<number>;
        "$3.5": import("@hanzogui/web").Variable<number>;
        $4: import("@hanzogui/web").Variable<number>;
        $true: import("@hanzogui/web").Variable<number>;
        "$4.5": import("@hanzogui/web").Variable<number>;
        $5: import("@hanzogui/web").Variable<number>;
        $6: import("@hanzogui/web").Variable<number>;
        $7: import("@hanzogui/web").Variable<number>;
        $8: import("@hanzogui/web").Variable<number>;
        $9: import("@hanzogui/web").Variable<number>;
        $10: import("@hanzogui/web").Variable<number>;
        $11: import("@hanzogui/web").Variable<number>;
        $12: import("@hanzogui/web").Variable<number>;
        $13: import("@hanzogui/web").Variable<number>;
        $14: import("@hanzogui/web").Variable<number>;
        $15: import("@hanzogui/web").Variable<number>;
        $16: import("@hanzogui/web").Variable<number>;
        $17: import("@hanzogui/web").Variable<number>;
        $18: import("@hanzogui/web").Variable<number>;
        $19: import("@hanzogui/web").Variable<number>;
        $20: import("@hanzogui/web").Variable<number>;
    };
    radius: {
        0: import("@hanzogui/web").Variable<number>;
        1: import("@hanzogui/web").Variable<number>;
        2: import("@hanzogui/web").Variable<number>;
        3: import("@hanzogui/web").Variable<number>;
        4: import("@hanzogui/web").Variable<number>;
        true: import("@hanzogui/web").Variable<number>;
        5: import("@hanzogui/web").Variable<number>;
        6: import("@hanzogui/web").Variable<number>;
        7: import("@hanzogui/web").Variable<number>;
        8: import("@hanzogui/web").Variable<number>;
        9: import("@hanzogui/web").Variable<number>;
        10: import("@hanzogui/web").Variable<number>;
        11: import("@hanzogui/web").Variable<number>;
        12: import("@hanzogui/web").Variable<number>;
    };
    zIndex: {
        0: import("@hanzogui/web").Variable<number>;
        1: import("@hanzogui/web").Variable<number>;
        2: import("@hanzogui/web").Variable<number>;
        3: import("@hanzogui/web").Variable<number>;
        4: import("@hanzogui/web").Variable<number>;
        5: import("@hanzogui/web").Variable<number>;
    };
} & Omit<{
    radius: {
        0: import("@hanzogui/web").Variable<number>;
        1: import("@hanzogui/web").Variable<number>;
        2: import("@hanzogui/web").Variable<number>;
        3: import("@hanzogui/web").Variable<number>;
        4: import("@hanzogui/web").Variable<number>;
        true: import("@hanzogui/web").Variable<number>;
        5: import("@hanzogui/web").Variable<number>;
        6: import("@hanzogui/web").Variable<number>;
        7: import("@hanzogui/web").Variable<number>;
        8: import("@hanzogui/web").Variable<number>;
        9: import("@hanzogui/web").Variable<number>;
        10: import("@hanzogui/web").Variable<number>;
        11: import("@hanzogui/web").Variable<number>;
        12: import("@hanzogui/web").Variable<number>;
    };
    zIndex: {
        0: import("@hanzogui/web").Variable<number>;
        1: import("@hanzogui/web").Variable<number>;
        2: import("@hanzogui/web").Variable<number>;
        3: import("@hanzogui/web").Variable<number>;
        4: import("@hanzogui/web").Variable<number>;
        5: import("@hanzogui/web").Variable<number>;
    };
    space: {
        0: import("@hanzogui/web").Variable<number>;
        0.25: import("@hanzogui/web").Variable<number>;
        0.5: import("@hanzogui/web").Variable<number>;
        0.75: import("@hanzogui/web").Variable<number>;
        1: import("@hanzogui/web").Variable<number>;
        1.5: import("@hanzogui/web").Variable<number>;
        2: import("@hanzogui/web").Variable<number>;
        2.5: import("@hanzogui/web").Variable<number>;
        3: import("@hanzogui/web").Variable<number>;
        3.5: import("@hanzogui/web").Variable<number>;
        4: import("@hanzogui/web").Variable<number>;
        true: import("@hanzogui/web").Variable<number>;
        4.5: import("@hanzogui/web").Variable<number>;
        5: import("@hanzogui/web").Variable<number>;
        6: import("@hanzogui/web").Variable<number>;
        7: import("@hanzogui/web").Variable<number>;
        8: import("@hanzogui/web").Variable<number>;
        9: import("@hanzogui/web").Variable<number>;
        10: import("@hanzogui/web").Variable<number>;
        11: import("@hanzogui/web").Variable<number>;
        12: import("@hanzogui/web").Variable<number>;
        13: import("@hanzogui/web").Variable<number>;
        14: import("@hanzogui/web").Variable<number>;
        15: import("@hanzogui/web").Variable<number>;
        16: import("@hanzogui/web").Variable<number>;
        17: import("@hanzogui/web").Variable<number>;
        18: import("@hanzogui/web").Variable<number>;
        19: import("@hanzogui/web").Variable<number>;
        20: import("@hanzogui/web").Variable<number>;
        [-0.25]: import("@hanzogui/web").Variable<number>;
        [-0.5]: import("@hanzogui/web").Variable<number>;
        [-0.75]: import("@hanzogui/web").Variable<number>;
        [-1]: import("@hanzogui/web").Variable<number>;
        [-1.5]: import("@hanzogui/web").Variable<number>;
        [-2]: import("@hanzogui/web").Variable<number>;
        [-2.5]: import("@hanzogui/web").Variable<number>;
        [-3]: import("@hanzogui/web").Variable<number>;
        [-3.5]: import("@hanzogui/web").Variable<number>;
        [-4]: import("@hanzogui/web").Variable<number>;
        "-true": import("@hanzogui/web").Variable<number>;
        [-4.5]: import("@hanzogui/web").Variable<number>;
        [-5]: import("@hanzogui/web").Variable<number>;
        [-6]: import("@hanzogui/web").Variable<number>;
        [-7]: import("@hanzogui/web").Variable<number>;
        [-8]: import("@hanzogui/web").Variable<number>;
        [-9]: import("@hanzogui/web").Variable<number>;
        [-10]: import("@hanzogui/web").Variable<number>;
        [-11]: import("@hanzogui/web").Variable<number>;
        [-12]: import("@hanzogui/web").Variable<number>;
        [-13]: import("@hanzogui/web").Variable<number>;
        [-14]: import("@hanzogui/web").Variable<number>;
        [-15]: import("@hanzogui/web").Variable<number>;
        [-16]: import("@hanzogui/web").Variable<number>;
        [-17]: import("@hanzogui/web").Variable<number>;
        [-18]: import("@hanzogui/web").Variable<number>;
        [-19]: import("@hanzogui/web").Variable<number>;
        [-20]: import("@hanzogui/web").Variable<number>;
    };
    size: {
        $0: import("@hanzogui/web").Variable<number>;
        "$0.25": import("@hanzogui/web").Variable<number>;
        "$0.5": import("@hanzogui/web").Variable<number>;
        "$0.75": import("@hanzogui/web").Variable<number>;
        $1: import("@hanzogui/web").Variable<number>;
        "$1.5": import("@hanzogui/web").Variable<number>;
        $2: import("@hanzogui/web").Variable<number>;
        "$2.5": import("@hanzogui/web").Variable<number>;
        $3: import("@hanzogui/web").Variable<number>;
        "$3.5": import("@hanzogui/web").Variable<number>;
        $4: import("@hanzogui/web").Variable<number>;
        $true: import("@hanzogui/web").Variable<number>;
        "$4.5": import("@hanzogui/web").Variable<number>;
        $5: import("@hanzogui/web").Variable<number>;
        $6: import("@hanzogui/web").Variable<number>;
        $7: import("@hanzogui/web").Variable<number>;
        $8: import("@hanzogui/web").Variable<number>;
        $9: import("@hanzogui/web").Variable<number>;
        $10: import("@hanzogui/web").Variable<number>;
        $11: import("@hanzogui/web").Variable<number>;
        $12: import("@hanzogui/web").Variable<number>;
        $13: import("@hanzogui/web").Variable<number>;
        $14: import("@hanzogui/web").Variable<number>;
        $15: import("@hanzogui/web").Variable<number>;
        $16: import("@hanzogui/web").Variable<number>;
        $17: import("@hanzogui/web").Variable<number>;
        $18: import("@hanzogui/web").Variable<number>;
        $19: import("@hanzogui/web").Variable<number>;
        $20: import("@hanzogui/web").Variable<number>;
    };
    color: {
        white0: import("@hanzogui/web").Variable<string>;
        white075: import("@hanzogui/web").Variable<string>;
        white05: import("@hanzogui/web").Variable<string>;
        white025: import("@hanzogui/web").Variable<string>;
        black0: import("@hanzogui/web").Variable<string>;
        black075: import("@hanzogui/web").Variable<string>;
        black05: import("@hanzogui/web").Variable<string>;
        black025: import("@hanzogui/web").Variable<string>;
        white1: import("@hanzogui/web").Variable<string>;
        white2: import("@hanzogui/web").Variable<string>;
        white3: import("@hanzogui/web").Variable<string>;
        white4: import("@hanzogui/web").Variable<string>;
        white5: import("@hanzogui/web").Variable<string>;
        white6: import("@hanzogui/web").Variable<string>;
        white7: import("@hanzogui/web").Variable<string>;
        white8: import("@hanzogui/web").Variable<string>;
        white9: import("@hanzogui/web").Variable<string>;
        white10: import("@hanzogui/web").Variable<string>;
        white11: import("@hanzogui/web").Variable<string>;
        white12: import("@hanzogui/web").Variable<string>;
        black1: import("@hanzogui/web").Variable<string>;
        black2: import("@hanzogui/web").Variable<string>;
        black3: import("@hanzogui/web").Variable<string>;
        black4: import("@hanzogui/web").Variable<string>;
        black5: import("@hanzogui/web").Variable<string>;
        black6: import("@hanzogui/web").Variable<string>;
        black7: import("@hanzogui/web").Variable<string>;
        black8: import("@hanzogui/web").Variable<string>;
        black9: import("@hanzogui/web").Variable<string>;
        black10: import("@hanzogui/web").Variable<string>;
        black11: import("@hanzogui/web").Variable<string>;
        black12: import("@hanzogui/web").Variable<string>;
    };
}, "color" | "space" | "size" | "radius" | "zIndex">;
export {};
//# sourceMappingURL=v3-themes.d.ts.map
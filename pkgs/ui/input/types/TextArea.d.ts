import { type GetProps } from '@hanzogui/web';
/**
 * A web-aligned textarea component (multi-line input).
 * @see — Docs https://hanzogui.dev/ui/inputs#textarea
 */
export declare const TextArea: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "children" | "style" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "textAlign" | "textTransform" | "className" | ("autoCapitalize" | "autoCorrect" | "spellCheck")> & {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@hanzogui/web").GetThemeValueForKey<"color"> | undefined;
    fontFamily?: "unset" | import("@hanzogui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@hanzogui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@hanzogui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@hanzogui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    textTransform?: "unset" | "none" | "capitalize" | "uppercase" | "lowercase" | undefined;
} & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | "on" | "off";
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | "off" | "on";
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@hanzogui/web").ColorTokens;
    selectionColor?: import("@hanzogui/web").ColorTokens;
    onChangeText?: (text: string) => void;
    onSubmitEditing?: (e: {
        nativeEvent: {
            text: string;
        };
    }) => void;
    selection?: {
        start: number;
        end?: number;
    };
    onSelectionChange?: (e: {
        nativeEvent: {
            selection: {
                start: number;
                end: number;
            };
        };
    }) => void;
    textContentType?: import("./types").InputTextContentType;
}, import("@hanzogui/web").StackStyleBase & {
    readonly placeholderTextColor?: import("@hanzogui/web").ColorTokens | undefined;
    readonly selectionColor?: import("@hanzogui/web").ColorTokens | undefined;
    readonly cursorColor?: import("@hanzogui/web").ColorTokens | undefined;
    readonly selectionHandleColor?: import("@hanzogui/web").ColorTokens | undefined;
    readonly underlineColorAndroid?: import("@hanzogui/web").ColorTokens | undefined;
}, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, {
    readonly isInput: true;
    readonly accept: {
        readonly placeholderTextColor: "color";
        readonly selectionColor: "color";
        readonly cursorColor: "color";
        readonly selectionHandleColor: "color";
        readonly underlineColorAndroid: "color";
    };
    readonly validStyles: {
        [key: string]: boolean;
    } | undefined;
} & import("@hanzogui/web").StaticConfigPublic>;
export type TextAreaProps = GetProps<typeof TextArea>;
//# sourceMappingURL=TextArea.d.ts.map
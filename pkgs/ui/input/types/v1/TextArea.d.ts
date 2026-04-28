/**
 * @deprecated Use the new TextArea from '@hanzogui/input' instead
 * @summary A text area is a multi-line input field that allows users to enter text.
 * @see — Docs https://hanzogui.dev/ui/inputs#textarea
 */
export declare const TextArea: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps & import("@hanzogui/web").StackNonStyleProps & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & Omit<import("react").ClassAttributes<HTMLInputElement> & import("react").HTMLProps<HTMLInputElement>, "size" | `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "value" | keyof import("@hanzogui/web").StackNonStyleProps | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>>> & Pick<import("@hanzogui/web").TextProps, "color"> & Omit<import("react").CSSProperties | undefined, "color"> & Omit<import("react-native").TextInputProps, "numberOfLines" | "selectionColor" | "secureTextEntry" | "keyboardType" | "enterKeyHint" | "inputMode" | "placeholderTextColor" | "editable" | "onChangeText"> & {
    secureTextEntry?: import("react-native").TextInputProps["secureTextEntry"];
    onChangeText?: import("react-native").TextInputProps["onChangeText"];
    editable?: import("react-native").TextInputProps["editable"];
    enterKeyHint?: "done" | "go" | "next" | "search" | "send" | "enter" | "previous";
    keyboardType?: import("react-native").TextInputProps["keyboardType"];
    inputMode?: import("react-native").InputModeOptions;
    placeholderTextColor?: import("@hanzogui/web").ColorTokens;
    selectionColor?: import("@hanzogui/web").ColorTokens;
    render?: import("@hanzogui/web").HanzoguiComponentPropsBase["render"];
    multiline?: boolean;
    numberOfLines?: number;
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
//# sourceMappingURL=TextArea.d.ts.map
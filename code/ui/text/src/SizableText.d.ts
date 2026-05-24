import type { GetProps } from '@hanzogui/web';
export declare const SizableText: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase & {
    [x: string]: `$${string}` | `$${number}`;
}, {
    unstyled?: boolean;
    size?: import("@hanzogui/web").FontSizeTokens;
}, import("@hanzogui/web").StaticConfigPublic>;
export type SizableTextProps = GetProps<typeof SizableText>;

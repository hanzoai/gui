import type { GetProps, GetRef } from '@hanzogui/web';
import { ScrollView as ScrollViewNative } from 'react-native';
export declare const ScrollView: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, ScrollViewNative, import("@hanzogui/web").GuiComponentPropsBaseBase & import("react-native").ScrollViewProps, import("@hanzogui/web").StackStyleBase & {
    readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof ScrollViewNative, {
        accept: {
            readonly contentContainerStyle: "style";
        };
    }>> | undefined;
}, {
    fullscreen?: boolean | undefined;
}, {
    accept: {
        readonly contentContainerStyle: "style";
    };
}>;
export type ScrollView = GetRef<typeof ScrollView>;
export type ScrollViewProps = GetProps<typeof ScrollView>;
//# sourceMappingURL=ScrollView.d.ts.map
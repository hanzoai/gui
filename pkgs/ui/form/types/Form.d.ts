import type { ViewProps } from '@hanzogui/core';
export declare const FormFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
type FormContextValue = {
    onSubmit?: () => unknown;
};
export declare const FormContext: import("@hanzogui/core").StyledContext<FormContextValue>;
export declare const useFormContext: (scope?: string) => FormContextValue, FormProvider: import("react").Provider<FormContextValue> & import("react").ProviderExoticComponent<Partial<FormContextValue> & {
    children?: import("react").ReactNode;
    scope?: string;
}>;
type FormExtraProps = {
    scope?: string;
    onSubmit?: () => void;
};
export type FormProps = ViewProps & FormExtraProps;
export interface FormTriggerProps extends ViewProps {
    scope?: string;
}
export declare const FormTrigger: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps & FormTriggerProps, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
export declare const Form: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, keyof FormExtraProps> & FormExtraProps & import("react").RefAttributes<import("@hanzogui/core").HanzoguiElement>> & import("@hanzogui/core").StaticComponentObject<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, keyof FormExtraProps> & FormExtraProps, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps & FormExtraProps, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic> & Omit<import("@hanzogui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, keyof FormExtraProps> & FormExtraProps, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps & FormExtraProps, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic];
} & {
    Trigger: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps & FormTriggerProps, import("@hanzogui/core").StackStyleBase, {}, import("@hanzogui/core").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Form.d.ts.map
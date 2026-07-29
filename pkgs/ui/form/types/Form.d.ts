import type { ViewProps } from '@hanzogui/core';
export declare const FormFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
type FormContextValue = {
    onSubmit?: () => unknown;
};
export declare const FormContext: import("@hanzogui/web").StyledContext<FormContextValue>;
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
export declare const FormTrigger: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & FormTriggerProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
export declare const Form: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, keyof FormExtraProps> & FormExtraProps & import("react").RefAttributes<import("@hanzogui/web").GuiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, keyof FormExtraProps> & FormExtraProps, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & FormExtraProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, keyof FormExtraProps> & FormExtraProps, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & FormExtraProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic];
} & {
    Trigger: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & FormTriggerProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Form.d.ts.map
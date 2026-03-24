import { Suspense, use } from 'react'
import { Spinner, View } from '@hanzo/gui'
import type { ComponentType } from 'react'

const cached: any = {}

function getLazyComponent(
  importFunc: () => Promise<ComponentType<any>>
): Promise<ComponentType<any>> {
  const key = importFunc.toString()
  if (cached[key]) {
    return cached[key]
  }

  cached[key] = importFunc()

  return cached[key]
}

export function lazyDemo(importFunc: () => Promise<ComponentType<any>>) {
  return () => {
    const Component = use(getLazyComponent(importFunc)) as ComponentType<any>

    return (
      <Suspense fallback={<Spinner />}>
        <View display="contents" id="demo">
          <Component />
        </View>
      </Suspense>
    )
  }
}

export const BuildAButtonDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/BuildAButtonDemo').then((x) => x.BuildAButtonDemo)
)

export const AccordionDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/AccordionDemo').then((x) => x.AccordionDemo)
)

export const ThemeBuilderDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ThemeBuilderDemo').then((x) => x.ThemeBuilderDemo)
)

export const StacksDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/StacksDemo').then((x) => x.StacksDemo)
)
export const SheetDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/SheetDemo').then((x) => x.SheetDemo)
)
export const ShapesDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ShapesDemo').then((x) => x.ShapesDemo)
)
export const TextDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/TextDemo').then((x) => x.TextDemo)
)
export const ButtonDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ButtonDemo').then((x) => x.ButtonDemo)
)
export const ThemeInverseDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ThemeInverseDemo').then((x) => x.ThemeInverseDemo)
)
export const FormsDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/FormsDemo').then((x) => x.FormsDemo)
)
export const InputsDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/InputsDemo').then((x) => x.InputsDemo)
)

export const NewInputsDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/NewInputsDemo').then((x) => x.NewInputsDemo)
)
export const LinearGradientDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/LinearGradientDemo').then((x) => x.LinearGradientDemo)
)
export const HeadingsDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/HeadingsDemo').then((x) => x.HeadingsDemo)
)
export const SeparatorDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/SeparatorDemo').then((x) => x.SeparatorDemo)
)
export const ImageDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ImageDemo').then((x) => x.ImageDemo)
)

export const WebNativeImageDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/WebNativeImageDemo').then((x) => x.WebNativeImageDemo)
)

export const LabelDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/LabelDemo').then((x) => x.LabelDemo)
)
export const GroupDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/GroupDemo').then((x) => x.GroupDemo)
)
export const SelectDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/SelectDemo').then((x) => x.SelectDemo)
)
export const CardDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/CardDemo').then((x) => x.CardDemo)
)
export const AvatarDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/AvatarDemo').then((x) => x.AvatarDemo)
)
export const ProgressDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ProgressDemo').then((x) => x.ProgressDemo)
)
export const ListItemDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ListItemDemo').then((x) => x.ListItemDemo)
)
export const TabsDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/TabsDemo').then((x) => x.TabsDemo)
)
export const TabsAdvancedDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/TabsAdvancedDemo').then((x) => x.TabsAdvancedDemo)
)

export const TooltipDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/TooltipDemo').then((x) => x.TooltipDemo)
)
export const PopoverDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/PopoverDemo').then((x) => x.PopoverDemo)
)
export const DialogDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/DialogDemo').then((x) => x.DialogDemo)
)
export const ToastDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ToastDemo').then((x) => x.ToastDemo)
)
export const ToastDuplicateDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ToastDuplicateDemo').then((x) => x.ToastDuplicateDemo)
)
export const AnimationsDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/AnimationsDemo').then((x) => x.AnimationsDemo)
)
export const AlertDialogDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/AlertDialogDemo').then((x) => x.AlertDialogDemo)
)
export const AnimationsHoverDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/AnimationsHoverDemo').then((x) => x.AnimationsHoverDemo)
)
export const AnimationsEnterDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/AnimationsEnterDemo').then((x) => x.AnimationsEnterDemo)
)
export const AnimationsPresenceDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/AnimationsPresenceDemo').then(
    (x) => x.AnimationsPresenceDemo
  )
)
export const SwitchDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/SwitchDemo').then((x) => x.SwitchDemo)
)
export const SwitchHeadlessDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/SwitchHeadlessDemo').then((x) => x.SwitchHeadlessDemo)
)
export const SwitchUnstyledDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/SwitchUnstyledDemo').then((x) => x.SwitchUnstyledDemo)
)
export const SliderDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/SliderDemo').then((x) => x.SliderDemo)
)
export const SpinnerDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/SpinnerDemo').then((x) => x.SpinnerDemo)
)
export const AddThemeDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/AddThemeDemo').then((x) => x.AddThemeDemo)
)
export const UpdateThemeDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/UpdateThemeDemo').then((x) => x.UpdateThemeDemo)
)
export const ReplaceThemeDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ReplaceThemeDemo').then((x) => x.ReplaceThemeDemo)
)
export const LucideIconsDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/LucideIconsDemo').then((x) => x.LucideIconsDemo)
)
export const ScrollViewDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ScrollViewDemo').then((x) => x.ScrollViewDemo)
)
export const ColorsDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ColorsDemo').then((x) => x.ColorsDemo)
)
export const TokensDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/TokensDemo').then((x) => x.TokensDemo)
)
export const ToggleGroupDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ToggleGroupDemo').then((x) => x.ToggleGroupDemo)
)
export const CheckboxDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/CheckboxDemo').then((x) => x.CheckboxDemo)
)
export const CheckboxHeadlessDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/CheckboxHeadlessDemo').then((x) => x.CheckboxHeadlessDemo)
)
export const CheckboxUnstyledDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/CheckboxUnstyledDemo').then((x) => x.CheckboxUnstyledDemo)
)
export const RadioGroupDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/RadioGroupDemo').then((x) => x.RadioGroupDemo)
)
export const RadioGroupHeadlessDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/RadioGroupHeadlessDemo').then(
    (x) => x.RadioGroupHeadlessDemo
  )
)
export const RadioGroupUnstyledDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/RadioGroupUnstyledDemo').then(
    (x) => x.RadioGroupUnstyledDemo
  )
)

export const MenuDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/MenuDemo').then((x) => x.MenuDemo)
)

export const ContextMenuDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/ContextMenuDemo').then((x) => x.ContextMenuDemo)
)

export const TabsHeadlessDemo = lazyDemo(() =>
  import('@hanzogui/demos/demo/TabsHeadlessDemo').then((x) => x.TabsHeadlessDemo)
)

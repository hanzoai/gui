import { validStyles } from '@hanzogui/helpers'

import { createComponent } from '../createComponent.tsx'
import type {
  StackNonStyleProps,
  StackStyle,
  StackStyleBase,
  GuiElement,
} from '../types.tsx'

export type View = GuiElement
export type ViewNonStyleProps = StackNonStyleProps
export type ViewStylePropsBase = StackStyleBase
export type ViewStyle = StackStyle
export type ViewProps = ViewNonStyleProps & ViewStyle

export const View = createComponent<
  ViewProps,
  View,
  ViewNonStyleProps,
  ViewStylePropsBase
>({
  acceptsClassName: true,
  validStyles,
})

import { validStyles } from '@hanzogui/helpers'

import { createComponent } from '../createComponent'
import type { StackNonStyleProps, StackStyle, StackStyleBase, GuiElement } from '../types'

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

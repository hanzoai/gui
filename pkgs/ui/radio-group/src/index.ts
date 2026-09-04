import {
  RadioGroupFrame,
  RadioGroupIndicatorFrame,
  RadioGroupItemFrame,
} from './RadioGroup.tsx'
import { createRadioGroup } from './createRadioGroup.tsx'

export * from './createRadioGroup.tsx'
export * from './RadioGroup.tsx'
export * from './RadioGroupStyledContext.tsx'

export const RadioGroup = createRadioGroup({
  Frame: RadioGroupFrame,
  Indicator: RadioGroupIndicatorFrame,
  Item: RadioGroupItemFrame,
})

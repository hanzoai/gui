import { CheckboxFrame, CheckboxIndicatorFrame } from './Checkbox.tsx'
import { createCheckbox } from './createCheckbox.tsx'

export * from './createCheckbox.tsx'
export * from './Checkbox.tsx'
export * from './CheckboxStyledContext.tsx'
export type { CheckedState } from '@hanzogui/checkbox-headless'

export const Checkbox = createCheckbox({
  Frame: CheckboxFrame,
  Indicator: CheckboxIndicatorFrame,
})

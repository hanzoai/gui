import type { HanzoguiComponentState } from './types'

export const defaultComponentState: HanzoguiComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  focusVisible: false,
  focusWithin: false,
  unmounted: true,
  disabled: false,
}

export const defaultComponentStateMounted: HanzoguiComponentState = {
  ...defaultComponentState,
  unmounted: false,
}

export const defaultComponentStateShouldEnter: HanzoguiComponentState = {
  ...defaultComponentState,
  unmounted: 'should-enter',
}

import type { GuiComponentState } from './types'

export const defaultComponentState: GuiComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  focusVisible: false,
  focusWithin: false,
  unmounted: true,
  disabled: false,
}

export const defaultComponentStateMounted: GuiComponentState = {
  ...defaultComponentState,
  unmounted: false,
}

export const defaultComponentStateShouldEnter: GuiComponentState = {
  ...defaultComponentState,
  unmounted: 'should-enter',
}

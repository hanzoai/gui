import { createSwitch } from './createSwitch.tsx'
import { SwitchFrame, SwitchThumb } from './Switch.tsx'

export * from './createSwitch.tsx'
export * from './StyledContext.tsx'
export * from './Switch.tsx'
export * from './types.ts'
export { useSwitchNative } from './useSwitchNative.tsx'

/**
 * @summary A component that displays a switch that can be used to toggle between two states.
 * @see — Docs https://hanzogui.dev/ui/switch
 *
 * @example
 * ```tsx
 * <Switch id={id} size={props.size} defaultChecked={props.defaultChecked}>
 *  <Switch.Thumb transition="quicker" />
 * </Switch>
 * ```
 */
export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})

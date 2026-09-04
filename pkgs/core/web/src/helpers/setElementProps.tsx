import { hooks } from '../setupHooks.ts'

export const setElementProps = (node) => {
  hooks.setElementProps?.(node)
}

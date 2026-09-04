export * from './useStore.tsx'
export { configureUseStore } from './configureUseStore.tsx'
export * from './interfaces.tsx'
export * from './observe.tsx'
export { UNWRAP_PROXY } from './constants.tsx'
export * from './comparators.tsx'
export * from './decorators.tsx'

// to extend for prop types
export class Store<Props extends Record<string, any>> {
  constructor(public props: Props) {}
}

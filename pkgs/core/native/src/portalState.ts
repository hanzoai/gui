import { createGlobalState } from './globalState.ts'
import type { NativePortalState } from './types.ts'

const state = createGlobalState<NativePortalState>(`portal`, {
  enabled: false,
  type: null,
})

export interface PortalAccessor {
  readonly isEnabled: boolean
  readonly state: NativePortalState
  set(newState: NativePortalState): void
}

export function getPortal(): PortalAccessor {
  return {
    get isEnabled(): boolean {
      return state.get().enabled
    },
    get state(): NativePortalState {
      return state.get()
    },
    set(newState: NativePortalState): void {
      state.set(newState)
    },
  }
}

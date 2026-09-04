import { createGlobalState } from './globalState.ts'
import type { BurntState } from './types.ts'

const state = createGlobalState<BurntState>(`burnt`, {
  enabled: false,
  toast: null,
  dismissAllAlerts: null,
})

export interface BurntAccessor {
  readonly isEnabled: boolean
  readonly state: BurntState
  set(newState: BurntState): void
}

export function getBurnt(): BurntAccessor {
  return {
    get isEnabled(): boolean {
      return state.get().enabled
    },
    get state(): BurntState {
      return state.get()
    },
    set(newState: BurntState): void {
      state.set(newState)
    },
  }
}

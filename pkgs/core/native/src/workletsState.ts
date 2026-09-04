import { createGlobalState } from './globalState.ts'
import type { WorkletsState } from './types.ts'

const state = createGlobalState<WorkletsState>(`worklets`, {
  enabled: false,
  Worklets: null,
  useRunOnJS: null,
  useWorklet: null,
  createWorkletContextValue: null,
})

export interface WorkletsAccessor {
  readonly isEnabled: boolean
  readonly state: WorkletsState
  set(updates: Partial<WorkletsState>): void
}

export function getWorklets(): WorkletsAccessor {
  return {
    get isEnabled(): boolean {
      return state.get().enabled
    },
    get state(): WorkletsState {
      return state.get()
    },
    set(updates: Partial<WorkletsState>): void {
      Object.assign(state.get(), updates)
    },
  }
}

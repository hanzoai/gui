// Nexus UI state. The page maintains:
//   - selected endpoint id (persisted via URL, mirrored in store for
//     panes that don't own the URL)
//   - draft endpoint editor (uncommitted form fields)
//
// Pure useSyncExternalStore — no zustand, no context. Smaller than
// adding a dep, and the cross-component fanout for nexus is shallow.

import { useSyncExternalStore } from 'react'
import type { NexusEndpointSpec } from '../lib/types'

export interface NexusDraft extends NexusEndpointSpec {
  // null name means "creating new"
  name: string
  description: string
  target: string
  allowedCallerNamespaces: string[]
}

export const EMPTY_DRAFT: NexusDraft = {
  name: '',
  description: '',
  target: '',
  allowedCallerNamespaces: [],
}

interface State {
  selectedId: string | null
  draft: NexusDraft
  dirty: boolean
}

let state: State = {
  selectedId: null,
  draft: { ...EMPTY_DRAFT },
  dirty: false,
}

const listeners = new Set<() => void>()
function emit() {
  for (const l of listeners) l()
}

function set(next: Partial<State>) {
  state = { ...state, ...next }
  emit()
}

export const nexusStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
  selectEndpoint(id: string | null) {
    set({ selectedId: id })
  },
  startDraft(seed?: Partial<NexusDraft>) {
    set({ draft: { ...EMPTY_DRAFT, ...seed }, dirty: false })
  },
  patchDraft(patch: Partial<NexusDraft>) {
    set({ draft: { ...state.draft, ...patch }, dirty: true })
  },
  clearDraft() {
    set({ draft: { ...EMPTY_DRAFT }, dirty: false })
  },
}

// React bindings.
export function useNexusState(): State {
  return useSyncExternalStore(nexusStore.subscribe, nexusStore.getState, nexusStore.getState)
}

export function useNexusDraft() {
  const s = useNexusState()
  return {
    draft: s.draft,
    dirty: s.dirty,
    set: nexusStore.patchDraft,
    start: nexusStore.startDraft,
    clear: nexusStore.clearDraft,
  }
}

export function useSelectedNexusId(): string | null {
  return useNexusState().selectedId
}

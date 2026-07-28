import type { ComponentType } from 'react'
import type { Component } from 'svelte'
import Facts from '~/views/Facts.svelte'
import { Home } from '~/views/Home'
import { Session } from '~/views/Session'

/*
 * What the sidebar can select.
 *
 * The shell hands every view the SAME props whichever language it is written in.
 * That symmetry is the point: porting a Huly view to React means changing which
 * key its entry carries — `svelte` becomes `react` — and touching nothing else.
 * So the ~40 remaining `*-resources` plugins are a queue, not a cliff.
 */

/** The context every view receives. */
export interface Props extends Record<string, unknown> {
  workspace: string
  token: string | null
}

/** A view is React or Svelte. Never both, and there is no third option. */
export type Content = { react: ComponentType<Props> } | { svelte: Component<Props> }

export interface View {
  /** Stable id — the sidebar selection and the route segment. */
  id: string
  label: string
  content: Content
}

export const VIEWS: readonly View[] = [
  { id: 'home', label: 'Home', content: { react: Home } },
  { id: 'session', label: 'Session', content: { react: Session } },
  // The same content in Svelte, through the seam. It reads its tokens from the
  // same stylesheet the React views do, so the two must render identically —
  // that equivalence is what tells us a half-migrated shell looks whole.
  { id: 'facts', label: 'Session · Svelte', content: { svelte: Facts as Component<Props> } },
]

export function viewFor(id: string | undefined): View {
  return VIEWS.find((v) => v.id === id) ?? VIEWS[0]
}

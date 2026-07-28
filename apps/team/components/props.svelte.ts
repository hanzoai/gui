/*
 * Reactive props for a mounted Svelte view.
 *
 * `mount` reads its props object once. To reach a LIVE view a prop change has to
 * land on something Svelte tracks, so the seam mounts this proxy and then assigns
 * into it. Without this, a prop change could only be delivered by tearing the view
 * down and building a new one — which is both slower and a different lifecycle.
 *
 * This file is `.svelte.ts` because `$state` is a compiler rune, not a function.
 */

/** A props object Svelte tracks. */
export function track<P extends Record<string, unknown>>(initial: P): P {
  const props = $state({ ...initial })
  return props as P
}

/**
 * Copy `next` onto a tracked object so the mounted view sees the change.
 * Svelte's proxy compares before notifying, so assigning an unchanged value is
 * inert — the seam does not need to diff first.
 */
export function push<P extends Record<string, unknown>>(tracked: P, next: P): void {
  const target = tracked as Record<string, unknown>
  for (const key of Object.keys(next)) target[key] = next[key]
}

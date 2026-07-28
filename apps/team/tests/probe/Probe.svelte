<script lang="ts">
  /*
   * The seam's conformance view. Not part of the app — the app never registers it.
   *
   * It counts its own live instances and its own listeners so a leak is
   * observable from the browser. Counting DOM nodes instead would be a test that
   * cannot fail: React removes the seam's host element on unmount, so the page
   * looks clean whether or not the Svelte instance was destroyed. The instance and
   * listener counters are what distinguish "torn down" from "orphaned but hidden".
   */
  import { onDestroy, onMount } from 'svelte'

  export let workspace: string
  export let token: string | null

  interface Counters {
    live: number
    mounts: number
    destroys: number
    listeners: number
  }

  const scope = globalThis as unknown as { probe?: Counters }
  const probe: Counters = (scope.probe ??= { live: 0, mounts: 0, destroys: 0, listeners: 0 })

  function onResize(): void {
    // Exists to be registered and removed; a leaked instance keeps it attached.
  }

  onMount(() => {
    probe.live += 1
    probe.mounts += 1
    window.addEventListener('resize', onResize)
    probe.listeners += 1
  })

  onDestroy(() => {
    probe.live -= 1
    probe.destroys += 1
    window.removeEventListener('resize', onResize)
    probe.listeners -= 1
  })
</script>

<p data-probe="workspace">{workspace}</p>
<p data-probe="token">{token === null ? 'absent' : 'present'}</p>

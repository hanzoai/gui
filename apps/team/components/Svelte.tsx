import { useEffect, useRef } from 'react'
import { mount, unmount, type Component } from 'svelte'
import { push, track } from './props.svelte'

/*
 * The one seam between the React shell and a Svelte view.
 *
 * React owns the shell, the sidebar and navigation. A Svelte view is only ever
 * content: the sidebar decides which view is active, this mounts it, and nothing
 * a view does can reach the chrome. Every unported Huly view arrives through
 * here, so porting one to React means changing which key its registry entry
 * carries (`svelte` -> `react`) and touching nothing else.
 *
 * Lifecycle, and why it is split across two effects:
 *
 *   mount    keyed on `view` alone, so switching sidebar items — or swapping a
 *            view for its React port — rebuilds, and a mere prop change does not.
 *   props    assigns onto the tracked proxy, so a live view updates in place.
 *   destroy  the mount effect's cleanup calls `unmount`, which runs the view's
 *            `onDestroy` and removes its nodes. Leaking one instance per
 *            navigation is the failure mode this ordering exists to prevent;
 *            tests/seam.spec.ts cycles it and asserts the live count returns to
 *            zero, and that the assertion can fail.
 */
export function Svelte<P extends Record<string, unknown>>({
  view,
  props,
  className,
}: {
  view: Component<P>
  props: P
  className?: string
}) {
  const host = useRef<HTMLDivElement | null>(null)
  const tracked = useRef<P | null>(null)

  // Read at mount time without making `props` a mount dependency.
  const latest = useRef(props)
  latest.current = props

  useEffect(() => {
    const target = host.current
    if (target === null) return

    const box = track(latest.current)
    const instance = mount(view, { target, props: box })
    tracked.current = box

    return () => {
      tracked.current = null
      void unmount(instance, { outro: false })
    }
  }, [view])

  useEffect(() => {
    if (tracked.current !== null) push(tracked.current, props)
  }, [props])

  return <div ref={host} className={className} />
}

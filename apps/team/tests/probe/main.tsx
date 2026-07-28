import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Svelte } from '~/components/Svelte'
import Probe from './Probe.svelte'

/*
 * Drives the seam directly so its lifecycle can be asserted without the shell's
 * data fetching in the way. Exercises the same components/Svelte.tsx the app uses.
 *
 * No StrictMode here, on purpose: StrictMode double-invokes effects, so mount and
 * destroy counts would be doubled and the arithmetic in tests/seam.spec.ts would
 * stop being exact. The app keeps StrictMode; this harness wants precise counts.
 */
function Harness() {
  const [on, setOn] = useState(true)
  const [n, setN] = useState(0)

  return (
    <>
      <button data-probe-action="toggle" onClick={() => setOn((v) => !v)}>
        toggle
      </button>
      <button data-probe-action="bump" onClick={() => setN((v) => v + 1)}>
        bump
      </button>
      <span data-probe-state={on ? 'on' : 'off'} />
      {on ? <Svelte view={Probe} props={{ workspace: `ws-${n}`, token: null }} /> : null}
    </>
  )
}

const root = document.getElementById('root')
if (root === null) throw new Error('#root missing')
createRoot(root).render(<Harness />)

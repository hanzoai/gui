import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Shell } from '~/components/Shell'
import './theme.css'

const root = document.getElementById('root')
if (root === null) throw new Error('#root missing')

// StrictMode stays on deliberately. It mounts every effect twice in development,
// which means the Svelte seam's mount/destroy pair is exercised on every single
// navigation — a leak there shows up immediately rather than in production.
createRoot(root).render(
  <StrictMode>
    <Shell />
  </StrictMode>,
)

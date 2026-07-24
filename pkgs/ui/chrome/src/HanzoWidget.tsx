'use client'

import { useEffect } from 'react'

export interface HanzoWidgetProps {
  /** The repo the AI widget edits, e.g. "hanzo-docs/chat". Sets <meta name="hanzo:repo">. */
  repo: string
  /** Optional git provider (github/gitlab/…). Sets <meta name="hanzo:provider">. */
  provider?: string
  /** Optional path scope within the repo. Sets <meta name="hanzo:path">. */
  path?: string
  /** Loader script. Defaults to the canonical hanzo.app edit.js. */
  src?: string
}

const DEFAULT_SRC = 'https://hanzo.app/edit.js'
const SCRIPT_ID = 'hanzo-edit-js'

function upsertMeta(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * HanzoWidget — the AI-widget MOUNT (loader only).
 *
 * Injects the `<meta name="hanzo:repo">` convention (+ provider/path) and loads
 * the async `edit.js` loader once. The widget's BEHAVIOUR is owned by a separate
 * workstream (edit.js); this component is purely the mount/meta contract, so any
 * Hanzo surface can opt in with one line: `<HanzoWidget repo="org/repo" />`.
 */
export function HanzoWidget({ repo, provider, path, src = DEFAULT_SRC }: HanzoWidgetProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return

    upsertMeta('hanzo:repo', repo)
    if (provider) upsertMeta('hanzo:provider', provider)
    if (path) upsertMeta('hanzo:path', path)

    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement('script')
      s.id = SCRIPT_ID
      s.async = true
      s.src = src
      document.body.appendChild(s)
    }
  }, [repo, provider, path, src])

  return null
}

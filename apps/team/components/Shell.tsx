import { Separator } from '@hanzo/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  login as fetchLogin,
  workspaces as fetchWorkspaces,
  type Login,
  type Workspace,
} from '~/src/account'
import { brandFor } from '~/src/brand'
import { claim, token } from '~/src/session'
import { VIEWS, viewFor, type Props } from '~/src/views'
import { Account } from './Account'
import { Palette } from './Palette'
import { Sidebar } from './Sidebar'
import { Svelte } from './Svelte'

/*
 * The chrome.
 *
 * React owns the frame and the navigation. The sidebar decides which view is
 * active; the content area renders it. A view is React or Svelte and gets the
 * same props either way, so which language it happens to be written in is not
 * something the shell — or the user — can observe.
 */
export function Shell() {
  const brand = useMemo(() => brandFor(window.location.hostname), [])
  const [active, setActive] = useState(() => window.location.hash.replace(/^#/, '') || VIEWS[0].id)
  const [login, setLogin] = useState<Login | undefined>(undefined)
  const [workspaces, setWorkspaces] = useState<readonly Workspace[]>([])
  const [workspace, setWorkspace] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  // Take any token the backend handed back before asking who we are.
  useEffect(() => {
    setError(claim().error)
  }, [])

  useEffect(() => {
    if (token() === null) return
    let live = true
    void (async () => {
      try {
        const [who, list] = await Promise.all([fetchLogin(), fetchWorkspaces()])
        if (!live) return
        setLogin(who)
        setWorkspaces(list)
        setWorkspace((current) => current ?? list[0]?.url)
      } catch (e) {
        if (live) setError(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => {
      live = false
    }
  }, [])

  const select = useCallback((id: string) => {
    setActive(id)
    window.location.hash = id
  }, [])

  const view = viewFor(active)

  // One object per (workspace, token) pair rather than per render, so a live
  // Svelte view is not re-pushed props it already has.
  const props = useMemo<Props>(() => ({ workspace: workspace ?? '', token: token() }), [workspace])

  return (
    <div className="flex h-full w-full">
      <Sidebar brand={brand} views={VIEWS} active={view.id} onSelect={select} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 px-4" role="banner">
          <span className="truncate text-sm font-medium" data-shell="title">
            {view.label}
          </span>
          <div className="flex-1" />
          <Account
            login={login}
            workspaces={workspaces}
            current={workspace}
            onSelect={(w) => setWorkspace(w.url)}
          />
        </header>

        <Separator />

        {error !== null ? (
          <p role="alert" data-shell="error" className="text-destructive px-4 py-2 text-xs">
            {error}
          </p>
        ) : null}

        <main className="min-h-0 flex-1 overflow-auto p-4" data-shell="content">
          {'react' in view.content ? (
            <view.content.react {...props} />
          ) : (
            <Svelte view={view.content.svelte} props={props} className="h-full" />
          )}
        </main>
      </div>

      <Palette
        views={VIEWS}
        workspaces={workspaces}
        onView={select}
        onWorkspace={(w) => setWorkspace(w.url)}
      />
    </div>
  )
}

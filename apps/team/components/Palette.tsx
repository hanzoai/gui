import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@hanzo/ui'
import { useEffect, useState } from 'react'
import type { Workspace } from '~/src/account'
import type { View } from '~/src/views'

/*
 * Cmd+K. One keyboard path to every view and every workspace.
 *
 * The palette navigates; it does not act. Selecting a view asks the shell to
 * change view, exactly as clicking the sidebar does — the same call, so the two
 * cannot drift into disagreeing about what "active" means.
 */
export function Palette({
  views,
  workspaces,
  onView,
  onWorkspace,
}: {
  views: readonly View[]
  workspaces: readonly Workspace[]
  onView: (id: string) => void
  onWorkspace: (workspace: Workspace) => void
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command palette">
      <CommandInput placeholder="Search views and workspaces…" data-palette="input" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>

        <CommandGroup heading="Views">
          {views.map((view) => (
            <CommandItem
              key={view.id}
              value={`view ${view.label}`}
              data-palette-view={view.id}
              onSelect={() => {
                onView(view.id)
                setOpen(false)
              }}
            >
              {view.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {workspaces.length > 0 ? (
          <CommandGroup heading="Workspaces">
            {workspaces.map((workspace) => (
              <CommandItem
                key={workspace.uuid}
                value={`workspace ${workspace.name}`}
                data-palette-workspace={workspace.url}
                onSelect={() => {
                  onWorkspace(workspace)
                  setOpen(false)
                }}
              >
                {workspace.name}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  )
}

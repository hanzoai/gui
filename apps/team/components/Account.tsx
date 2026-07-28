import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@hanzo/ui'
import { byOrg, type Login, type Workspace } from '~/src/account'
import { signIn, signOut } from '~/src/session'

/*
 * Identity and scope: which workspace is open, and who has it open.
 *
 * Workspaces are grouped by owning org because `getUserWorkspaces` unions across
 * every org the user belongs to — a user in two orgs sees both, each tagged. So
 * the org is a heading over its workspaces rather than a second separate control:
 * picking a workspace IS picking its org, and two controls could disagree.
 */
export function Account({
  login,
  workspaces,
  current,
  onSelect,
}: {
  login: Login | undefined
  workspaces: readonly Workspace[]
  current: string | undefined
  onSelect: (workspace: Workspace) => void
}) {
  if (login === undefined) {
    return (
      <Button size="sm" onClick={signIn} data-account="out">
        Sign in
      </Button>
    )
  }

  const name = login.name !== undefined && login.name !== '' ? login.name : login.account
  const groups = byOrg(workspaces)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" data-account="in">
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px]">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-40 truncate text-xs">{name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-muted-foreground text-[11px] font-normal">
          {login.account}
        </DropdownMenuLabel>

        {groups.map((group) => (
          <div key={group.org}>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-wider">
              {group.org !== '' ? group.org : 'Personal'}
            </DropdownMenuLabel>
            {group.workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.uuid}
                data-workspace={workspace.url}
                aria-current={workspace.url === current ? 'true' : undefined}
                disabled={workspace.isDisabled}
                onSelect={() => onSelect(workspace)}
              >
                <span className="truncate">{workspace.name}</span>
                {workspace.url === current ? <span className="ml-auto text-xs">✓</span> : null}
              </DropdownMenuItem>
            ))}
          </div>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="https://hanzo.id/account" data-account-link="settings">
            Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={signOut} data-account-link="out">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

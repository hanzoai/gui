/*
 * The account plane: who is signed in, and which workspaces they can open.
 *
 * One JSON-RPC endpoint, `POST /v1/team/account`, with `{method, params}` in and
 * `{result}` or `{error}` out. Types mirror the Go structs in cloud
 * `apps/team/account.go` (`LoginInfo`, `WorkspaceInfo`) — same field names, same
 * casing, so a drift shows up as a type error rather than as an empty menu.
 */

import { token } from './session'

/** `LoginInfo` — cloud apps/team/account.go:114. */
export interface Login {
  account: string
  name?: string
  socialId?: string
}

/** One entry of `getUserWorkspaces` — cloud apps/team/account.go:135. */
export interface Workspace {
  uuid: string
  name: string
  url: string
  /** The owning IAM tenant. `getUserWorkspaces` unions across every org the user
   *  belongs to, so the switcher groups on this. */
  org?: string
  region: string
  mode: string
  isDisabled: boolean
}

export class Refused extends Error {}

async function call<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
  const bearer = token()
  const res = await fetch('/v1/team/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(bearer !== null ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    body: JSON.stringify({ method, params }),
  })

  const body = (await res.json()) as { result?: T; error?: { code?: string; params?: { message?: string } } }
  if (body.error !== undefined) {
    throw new Refused(body.error.params?.message ?? body.error.code ?? 'refused')
  }
  return body.result as T
}

export const login = (): Promise<Login> => call<Login>('getLoginInfoByToken')
export const workspaces = (): Promise<Workspace[]> => call<Workspace[]>('getUserWorkspaces')

/** Group workspaces by owning org, preserving first-seen order. */
export function byOrg(list: readonly Workspace[]): { org: string; workspaces: Workspace[] }[] {
  const groups: { org: string; workspaces: Workspace[] }[] = []
  for (const workspace of list) {
    const org = workspace.org ?? ''
    const found = groups.find((g) => g.org === org)
    if (found === undefined) groups.push({ org, workspaces: [workspace] })
    else found.workspaces.push(workspace)
  }
  return groups
}

// The team surface, through the generated client.
//
// The SDK carries the routes, the request and response types, and the
// Authorization header, so nothing here states a path, a host or a header. When
// a route moves in the product it moves here by regenerating hanzoai, not by
// editing this file — which is the whole reason the app stopped hand-rolling
// fetch against a base URL it had typed out itself.
//
// Every field on a generated model is optional, because the document marks none
// of them required. That is not a shape to paper over with a cast: the screens
// read them as optional and say so.

import { Configuration, TeamApi } from 'hanzoai'
import type { TeamMessage, TeamRoom } from 'hanzoai'
import { API } from './config'

export type { TeamMessage, TeamRoom }

function team(token: string): TeamApi {
  return new TeamApi(new Configuration({ basePath: API, accessToken: token }))
}

/** Every room the signed-in principal can see. */
export async function fetchRooms(token: string): Promise<TeamRoom[]> {
  const { data } = await team(token).getTeamRooms()
  return data.rooms ?? []
}

/**
 * One room's tail, oldest first — the order a conversation is read in.
 *
 * `space` rides along because a room id is unique within a space and not across
 * the org; without it the answer would depend on which space was searched first.
 */
export async function fetchMessages(
  id: string,
  space: string,
  token: string
): Promise<TeamMessage[]> {
  const { data } = await team(token).getTeamRoomsByIdMessages({ id, space })
  return data.messages ?? []
}

/** Say something. Plain text in; the surface wraps it in the client's markup. */
export async function sendMessage(
  id: string,
  space: string,
  text: string,
  token: string
): Promise<TeamMessage> {
  const { data } = await team(token).postTeamRoomsByIdMessages({
    id,
    teamMessageWrite: { space, text },
  })
  return data
}

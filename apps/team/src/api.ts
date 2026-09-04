// A session token, applied once.
//
// The credential used to ride along as the last argument of every call —
// fetchRooms(token), fetchMessages(id, space, token), sendMessage(id, space,
// text, token) — so who you are and what you are doing were stitched together at
// each call site, and two modules each built their own client. Here the token is
// applied once and the operations come back bound to it.
//
// The SDK carries the routes, the request and response types, and the
// Authorization header, so nothing below states a path, a host or a header. A
// route that moves in the product moves here by regenerating hanzoai.
//
// Every generated field is optional — the document marks none required — so the
// list reads default to empty rather than pretending otherwise.

import { BillingApi, Configuration, TeamApi } from 'hanzoai'
import type { TeamMessage, TeamRoom } from 'hanzoai'
import { API } from './config'
import { read, type Wallet } from './money'

export type { TeamMessage, TeamRoom, Wallet }

/** Where we talk and who we are, met in one place. */
const client = (token: string) => new Configuration({ basePath: API, accessToken: token })

/** Rooms and what is said in them. */
export const team = (token: string) => {
  const api = new TeamApi(client(token))
  return {
    /** Every room the signed-in principal can see. */
    rooms: async (): Promise<TeamRoom[]> => (await api.getTeamRooms()).data.rooms ?? [],

    /**
     * One room's tail, oldest first — the order a conversation is read in.
     *
     * `space` rides along because a room id is unique within a space and not
     * across the org; without it the answer depends on which space was searched
     * first.
     */
    messages: async (id: string, space: string): Promise<TeamMessage[]> =>
      (await api.getTeamRoomsByIdMessages({ id, space })).data.messages ?? [],

    /** Say something. Plain text in; the surface wraps it in the client's markup. */
    say: async (id: string, space: string, text: string): Promise<TeamMessage> =>
      (await api.postTeamRoomsByIdMessages({ id, teamMessageWrite: { space, text } }))
        .data,
  }
}

/** What the org has and what it has spent. */
export const billing = (token: string) => {
  const api = new BillingApi(client(token))
  return {
    /** The org wallet. Throws on any non-2xx or unreadable shape. */
    wallet: async (): Promise<Wallet> =>
      read((await api.getBillingBalance()).data as Record<string, unknown>),
  }
}

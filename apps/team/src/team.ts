// Rooms and messages, read from the team surface with the session's bearer token.
// The wire nouns are the surface's own — a room belongs to a space, a message
// carries an author and plain text — so nothing is renamed on the way through.
//
// A room id is unique within a space and not across the org, so every read of a
// room's contents names the space too. That is why a room link carries it.

const TEAM_BASE = 'https://api.hanzo.ai/v1/team'

export interface Room {
  id: string
  space: string
  name: string
  topic?: string
  direct: boolean
  private: boolean
  archived: boolean
}

export interface Message {
  id: string
  room: string
  /** the author's account uuid — what to call somebody is the roster's answer */
  author: string
  text: string
  /** unix milliseconds */
  createdOn: number
}

function headers(token: string): Record<string, string> {
  return { authorization: `Bearer ${token}`, accept: 'application/json' }
}

async function read<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${TEAM_BASE}${path}`, { headers: headers(token) })
  if (!res.ok) throw new Error(`team ${res.status}`)
  return (await res.json()) as T
}

/** Every room the signed-in principal can see. */
export async function fetchRooms(token: string): Promise<Room[]> {
  const data = await read<{ rooms?: Room[] }>('/rooms', token)
  return data.rooms ?? []
}

/** One room's tail, oldest first — the order a conversation is read in. */
export async function fetchMessages(
  room: string,
  space: string,
  token: string
): Promise<Message[]> {
  const path = `/rooms/${encodeURIComponent(room)}/messages?space=${encodeURIComponent(space)}`
  const data = await read<{ messages?: Message[] }>(path, token)
  return data.messages ?? []
}

/** Say something. Plain text in; the surface wraps it in the client's markup. */
export async function sendMessage(
  room: string,
  space: string,
  text: string,
  token: string
): Promise<Message> {
  const res = await fetch(`${TEAM_BASE}/rooms/${encodeURIComponent(room)}/messages`, {
    method: 'POST',
    headers: { ...headers(token), 'content-type': 'application/json' },
    body: JSON.stringify({ space, text }),
  })
  if (!res.ok) throw new Error(`team ${res.status}`)
  return (await res.json()) as Message
}

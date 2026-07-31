// Data plane for the Hanzo Calendar (Cal API-v2 shapes).
// Pure fetch layer — no React, no DOM. Runs on web and React Native.

export const DEFAULT_API_URL = 'https://api.hanzo.ai/v1/calendar'
export const CAL_API_VERSION = '2024-08-13'

export interface Location {
  type?: string
  link?: string
  address?: string
}

export interface Profile {
  name?: string | null
  username?: string | null
  image?: string | null
  avatarUrl?: string | null
}

export interface EventType {
  id: number
  slug: string
  title: string
  description: string
  /** duration in minutes */
  length: number
  locations: Location[]
  price: number
  currency: string
  profile?: Profile
}

export interface Slot {
  /** ISO-8601 UTC instant, e.g. "2026-07-24T16:00:00Z" */
  time: string
}

/** Slots grouped by day key "YYYY-MM-DD" (in the requested time zone). */
export type SlotsByDay = Record<string, Slot[]>

export interface Attendee {
  name?: string
  email?: string
  timeZone?: string
}

export interface Booking {
  uid: string
  status: string
  start: string
  end: string
  title: string
  location?: string
  attendees?: Attendee[]
}

export interface BookingResponses {
  name: string
  email: string
  notes?: string
}

export interface CreateBookingInput {
  eventTypeSlug: string
  username: string
  /** ISO instant of the chosen slot */
  start: string
  timeZone: string
  responses: BookingResponses
}

export interface SlotsInput {
  eventTypeSlug: string
  username: string
  startTime: string
  endTime: string
  timeZone: string
}

/** Error carrying the HTTP status; `conflict` marks a 409 (slot just taken). */
export class CalendarError extends Error {
  status: number
  conflict: boolean
  constructor(message: string, status: number) {
    super(message)
    this.name = 'CalendarError'
    this.status = status
    this.conflict = status === 409
  }
}

interface Envelope<T> {
  data?: T
  error?: { message?: string }
  message?: string
}

function messageOf(body: unknown, status: number): string {
  const b = body as Envelope<unknown> | null
  return b?.error?.message || b?.message || `Request failed (${status})`
}

async function readJson(res: Response): Promise<unknown> {
  return res.json().catch(() => null)
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, signal })
  const body = await readJson(res)
  if (!res.ok) throw new CalendarError(messageOf(body, res.status), res.status)
  return (body as Envelope<T>).data as T
}

function normalizeEventType(raw: Record<string, unknown>): EventType {
  const length =
    (raw.length as number) ??
    (raw.lengthInMinutes as number) ??
    (raw.durationMinutes as number) ??
    30
  return {
    id: Number(raw.id ?? 0),
    slug: String(raw.slug ?? ''),
    title: String(raw.title ?? ''),
    description: String(raw.description ?? ''),
    length,
    locations: (raw.locations as Location[]) ?? [],
    price: Number(raw.price ?? 0),
    currency: String(raw.currency ?? 'usd'),
    profile: raw.profile as Profile | undefined,
  }
}

export async function fetchEventType(
  api: string,
  eventSlug: string,
  username: string,
  signal?: AbortSignal
): Promise<EventType> {
  const url = `${api}/atoms/event-types/${encodeURIComponent(eventSlug)}/public?username=${encodeURIComponent(username)}`
  const raw = await getJson<Record<string, unknown>>(url, signal)
  return normalizeEventType(raw)
}

export async function fetchSlots(
  api: string,
  input: SlotsInput,
  signal?: AbortSignal
): Promise<SlotsByDay> {
  const q = new URLSearchParams({
    eventTypeSlug: input.eventTypeSlug,
    usernameList: input.username,
    startTime: input.startTime,
    endTime: input.endTime,
    timeZone: input.timeZone,
  })
  const data = await getJson<{ slots?: SlotsByDay } | SlotsByDay>(
    `${api}/slots/available?${q.toString()}`,
    signal
  )
  // API returns { data: { slots: {...} } }; tolerate a bare map too.
  const slots = (data as { slots?: SlotsByDay }).slots ?? (data as SlotsByDay)
  return slots ?? {}
}

export async function createBooking(
  api: string,
  input: CreateBookingInput,
  signal?: AbortSignal
): Promise<Booking> {
  const res = await fetch(`${api}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'cal-api-version': CAL_API_VERSION,
    },
    body: JSON.stringify({
      eventTypeSlug: input.eventTypeSlug,
      user: input.username,
      start: input.start,
      timeZone: input.timeZone,
      responses: input.responses,
    }),
    signal,
  })
  const body = await readJson(res)
  if (!res.ok) throw new CalendarError(messageOf(body, res.status), res.status)
  return (body as Envelope<Booking>).data as Booking
}

export async function fetchBooking(
  api: string,
  uid: string,
  signal?: AbortSignal
): Promise<Booking> {
  return getJson<Booking>(`${api}/bookings/${encodeURIComponent(uid)}`, signal)
}

export async function cancelBooking(
  api: string,
  uid: string,
  reason?: string,
  signal?: AbortSignal
): Promise<Booking> {
  const res = await fetch(`${api}/bookings/${encodeURIComponent(uid)}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'cal-api-version': CAL_API_VERSION,
    },
    body: JSON.stringify({ reason: reason ?? '' }),
    signal,
  })
  const body = await readJson(res)
  if (!res.ok) throw new CalendarError(messageOf(body, res.status), res.status)
  return (body as Envelope<Booking>).data as Booking
}

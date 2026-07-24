// React data hooks over the client. useState/useEffect only — no query lib.

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createBooking,
  fetchBooking,
  fetchEventType,
  fetchSlots,
  CalendarError,
  type Booking,
  type BookingResponses,
  type EventType,
  type SlotsByDay,
} from './client'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useEventType(
  api: string,
  eventSlug: string,
  username: string
): AsyncState<EventType> {
  const [state, setState] = useState<AsyncState<EventType>>({
    data: null,
    loading: true,
    error: null,
  })
  useEffect(() => {
    const ctrl = new AbortController()
    setState({ data: null, loading: true, error: null })
    fetchEventType(api, eventSlug, username, ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return
        setState({ data: null, loading: false, error: errorText(err) })
      })
    return () => ctrl.abort()
  }, [api, eventSlug, username])
  return state
}

export interface SlotsQuery {
  eventTypeSlug: string
  username: string
  startTime: string
  endTime: string
  timeZone: string
  enabled?: boolean
}

export interface SlotsState extends AsyncState<SlotsByDay> {
  refetch: () => void
}

export function useAvailableSlots(api: string, query: SlotsQuery): SlotsState {
  const { eventTypeSlug, username, startTime, endTime, timeZone, enabled = true } = query
  const [state, setState] = useState<AsyncState<SlotsByDay>>({
    data: null,
    loading: enabled,
    error: null,
  })
  const [nonce, setNonce] = useState(0)
  const refetch = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    if (!enabled) return
    const ctrl = new AbortController()
    setState((s) => ({ data: s.data, loading: true, error: null }))
    fetchSlots(
      api,
      { eventTypeSlug, username, startTime, endTime, timeZone },
      ctrl.signal
    )
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return
        setState({ data: null, loading: false, error: errorText(err) })
      })
    return () => ctrl.abort()
  }, [api, eventTypeSlug, username, startTime, endTime, timeZone, enabled, nonce])

  return { ...state, refetch }
}

export type SubmitResult =
  | { ok: true; booking: Booking }
  | { ok: false; conflict: boolean; message: string }

export interface CreateBookingState {
  submit: (input: {
    eventTypeSlug: string
    username: string
    start: string
    timeZone: string
    responses: BookingResponses
  }) => Promise<SubmitResult>
  submitting: boolean
  error: string | null
  conflict: boolean
  reset: () => void
}

export function useCreateBooking(api: string): CreateBookingState {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conflict, setConflict] = useState(false)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setConflict(false)
  }, [])

  const submit = useCallback(
    async (input: {
      eventTypeSlug: string
      username: string
      start: string
      timeZone: string
      responses: BookingResponses
    }): Promise<SubmitResult> => {
      setSubmitting(true)
      setError(null)
      setConflict(false)
      try {
        const booking = await createBooking(api, input)
        return { ok: true, booking }
      } catch (err: unknown) {
        const isConflict = err instanceof CalendarError && err.conflict
        const message = errorText(err)
        if (mounted.current) {
          setError(message)
          setConflict(isConflict)
        }
        return { ok: false, conflict: isConflict, message }
      } finally {
        if (mounted.current) setSubmitting(false)
      }
    },
    [api]
  )

  return { submit, submitting, error, conflict, reset }
}

export function useBooking(api: string, uid: string | undefined): AsyncState<Booking> {
  const [state, setState] = useState<AsyncState<Booking>>({
    data: null,
    loading: !!uid,
    error: null,
  })
  useEffect(() => {
    if (!uid) return
    const ctrl = new AbortController()
    setState({ data: null, loading: true, error: null })
    fetchBooking(api, uid, ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return
        setState({ data: null, loading: false, error: errorText(err) })
      })
    return () => ctrl.abort()
  }, [api, uid])
  return state
}

function errorText(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Something went wrong'
}

// Orchestration hook — the one booking state machine both shells consume.

import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_API_URL, type Booking, type BookingResponses, type Slot } from './client.ts'
import {
  useAvailableSlots,
  useCreateBooking,
  useEventType,
  type AsyncState,
  type SlotsState,
} from './hooks.ts'
import type { EventType } from './client.ts'
import { addMonths, monthRange, startOfMonth, visitorTimeZone } from './time.ts'

export type BookerPhase = 'pick' | 'form' | 'done'

export interface UseBookerOptions {
  host: string
  eventSlug: string
  apiUrl?: string
  timeZone?: string
  weekStartsOn?: 0 | 1
  onBooked?: (booking: Booking) => void
  /** Auto-select the soonest available day (used by the compact embed). */
  autoSelectFirst?: boolean
}

export interface BookerModel {
  api: string
  timeZone: string
  weekStartsOn: 0 | 1
  event: AsyncState<EventType>
  slots: SlotsState
  viewDate: Date
  availableKeys: Set<string>
  selectedDay: string | null
  daySlots: Slot[]
  selectedSlot: string | null
  phase: BookerPhase
  booking: Booking | null
  submitting: boolean
  error: string | null
  conflict: boolean
  goPrevMonth: () => void
  goNextMonth: () => void
  atFirstMonth: boolean
  selectDay: (key: string) => void
  selectSlot: (iso: string) => void
  submit: (responses: BookingResponses) => Promise<void>
  back: () => void
  reset: () => void
}

export function useBooker(opts: UseBookerOptions): BookerModel {
  const api = opts.apiUrl ?? DEFAULT_API_URL
  const timeZone = opts.timeZone ?? visitorTimeZone()
  const weekStartsOn = opts.weekStartsOn ?? 0

  const event = useEventType(api, opts.eventSlug, opts.host)

  const [viewDate, setViewDate] = useState<Date>(() => startOfMonth(new Date()))
  const { startTime, endTime } = useMemo(() => monthRange(viewDate), [viewDate])

  const slots = useAvailableSlots(api, {
    eventTypeSlug: opts.eventSlug,
    username: opts.host,
    startTime,
    endTime,
    timeZone,
    enabled: !!event.data,
  })

  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [phase, setPhase] = useState<BookerPhase>('pick')
  const [booking, setBooking] = useState<Booking | null>(null)

  const create = useCreateBooking(api)

  const availableKeys = useMemo(() => {
    const map = slots.data ?? {}
    return new Set(Object.keys(map).filter((k) => (map[k]?.length ?? 0) > 0))
  }, [slots.data])

  const daySlots = useMemo(() => {
    if (!selectedDay) return []
    return slots.data?.[selectedDay] ?? []
  }, [slots.data, selectedDay])

  // Optionally auto-select the soonest available day once slots arrive.
  useEffect(() => {
    if (!opts.autoSelectFirst) return
    if (selectedDay && availableKeys.has(selectedDay)) return
    const first = [...availableKeys].sort()[0]
    if (first) {
      setSelectedDay(first)
      setSelectedSlot(null)
    }
  }, [opts.autoSelectFirst, availableKeys, selectedDay])

  const now = startOfMonth(new Date())
  const atFirstMonth =
    viewDate.getFullYear() === now.getFullYear() && viewDate.getMonth() === now.getMonth()

  const goPrevMonth = () => {
    if (atFirstMonth) return
    setViewDate((d) => addMonths(d, -1))
    setSelectedDay(null)
    setSelectedSlot(null)
  }
  const goNextMonth = () => {
    setViewDate((d) => addMonths(d, 1))
    setSelectedDay(null)
    setSelectedSlot(null)
  }

  const selectDay = (key: string) => {
    setSelectedDay(key)
    setSelectedSlot(null)
  }
  const selectSlot = (iso: string) => {
    setSelectedSlot(iso)
    setPhase('form')
    create.reset()
  }
  const back = () => {
    setPhase('pick')
    setSelectedSlot(null)
    create.reset()
  }
  const reset = () => {
    setBooking(null)
    setSelectedSlot(null)
    setSelectedDay(null)
    setPhase('pick')
    create.reset()
    slots.refetch()
  }

  const submit = async (responses: BookingResponses) => {
    if (!selectedSlot) return
    const result = await create.submit({
      eventTypeSlug: opts.eventSlug,
      username: opts.host,
      start: selectedSlot,
      timeZone,
      responses,
    })
    if (result.ok) {
      setBooking(result.booking)
      setPhase('done')
      opts.onBooked?.(result.booking)
    } else if (result.conflict) {
      // Slot was just taken — refresh availability and return to picking.
      slots.refetch()
      setSelectedSlot(null)
      setPhase('pick')
    }
    // non-conflict errors stay visible in the form via `error`.
  }

  return {
    api,
    timeZone,
    weekStartsOn,
    event,
    slots,
    viewDate,
    availableKeys,
    selectedDay,
    daySlots,
    selectedSlot,
    phase,
    booking,
    submitting: create.submitting,
    error: create.error,
    conflict: create.conflict,
    goPrevMonth,
    goNextMonth,
    atFirstMonth,
    selectDay,
    selectSlot,
    submit,
    back,
    reset,
  }
}

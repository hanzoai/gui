// @hanzo/calendar — universal (web + native) booking UI on the Hanzo Calendar
// backend, built with hanzogui primitives.

export { Booker, type BookerProps } from './Booker.tsx'
export { CalendarEmbed, type CalendarEmbedProps } from './CalendarEmbed.tsx'
export { Confirmation, type ConfirmationProps } from './Confirmation.tsx'

// Composable sub-views (use these to build a custom flow).
export { EventHeader, type EventHeaderProps } from './EventHeader.tsx'
export { MonthCalendar, type MonthCalendarProps } from './MonthCalendar.tsx'
export { TimeSlots, type TimeSlotsProps } from './TimeSlots.tsx'
export { BookingForm, type BookingFormProps } from './BookingForm.tsx'

// Orchestration hook + data hooks.
export {
  useBooker,
  type UseBookerOptions,
  type BookerModel,
  type BookerPhase,
} from './useBooker.ts'
export {
  useEventType,
  useAvailableSlots,
  useCreateBooking,
  useBooking,
  type AsyncState,
  type SlotsQuery,
  type SlotsState,
  type CreateBookingState,
  type SubmitResult,
} from './hooks.ts'

// Data plane.
export {
  DEFAULT_API_URL,
  CAL_API_VERSION,
  CalendarError,
  fetchEventType,
  fetchSlots,
  createBooking,
  fetchBooking,
  cancelBooking,
  type EventType,
  type Slot,
  type SlotsByDay,
  type Booking,
  type Attendee,
  type Location,
  type Profile,
  type BookingResponses,
  type CreateBookingInput,
  type SlotsInput,
} from './client.ts'

// Time plane (Intl/Date helpers).
export {
  visitorTimeZone,
  ymd,
  monthMatrix,
  monthRange,
  weekdayLabels,
  formatMonthLabel,
  formatDayLong,
  formatSlotTime,
  formatBookingWhen,
  dateFromKey,
  startOfMonth,
  addMonths,
  sameMonth,
  isBeforeToday,
  type MonthCell,
} from './time.ts'

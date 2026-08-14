import { SizableText, Spinner, XStack, YStack } from '@hanzo/gui'
import type { Booking } from './client'
import { BookingForm } from './BookingForm'
import { Confirmation } from './Confirmation'
import { EventHeader } from './EventHeader'
import { TimeSlots } from './TimeSlots'
import { formatMonthLabel } from './time'
import { useBooker } from './useBooker'

export interface CalendarEmbedProps {
  host: string
  eventSlug: string
  apiUrl?: string
  timeZone?: string
  weekStartsOn?: 0 | 1
  onBooked?: (booking: Booking) => void
}

/**
 * Compact booking card for a marketing hero — soonest availability inline,
 * no month grid. Same state machine as <Booker>.
 */
export function CalendarEmbed(props: CalendarEmbedProps) {
  const m = useBooker({ ...props, autoSelectFirst: true })

  return (
    <YStack
      backgroundColor="$background"
      borderColor="$borderColor"
      borderWidth={1}
      borderRadius="$6"
      padding="$4"
      gap="$3"
      width="100%"
      maxWidth={420}
    >
      {m.event.loading ? (
        <YStack
          alignItems="center"
          justifyContent="center"
          gap="$2"
          padding="$6"
          minHeight={160}
        >
          <Spinner size="large" color="$color9" />
        </YStack>
      ) : m.event.error || !m.event.data ? (
        <YStack
          alignItems="center"
          justifyContent="center"
          padding="$5"
          minHeight={140}
          gap="$1"
        >
          <SizableText size="$4" fontWeight="600" color="$color12">
            Unavailable
          </SizableText>
          <SizableText size="$2" color="$color10" textAlign="center">
            {m.event.error ?? 'Event not found.'}
          </SizableText>
        </YStack>
      ) : m.phase === 'done' && m.booking ? (
        <Confirmation booking={m.booking} timeZone={m.timeZone} onDone={m.reset} />
      ) : m.phase === 'form' && m.selectedSlot ? (
        <BookingForm
          slotIso={m.selectedSlot}
          timeZone={m.timeZone}
          eventLength={m.event.data.length}
          submitting={m.submitting}
          error={m.error}
          onSubmit={m.submit}
          onBack={m.back}
        />
      ) : (
        <>
          <EventHeader
            event={m.event.data}
            host={props.host}
            timeZone={m.timeZone}
            compact
          />
          {m.conflict ? (
            <SizableText size="$1" color="$yellow11">
              That time was just taken — pick another.
            </SizableText>
          ) : null}
          {m.slots.loading && m.availableKeys.size === 0 ? (
            <YStack alignItems="center" padding="$4">
              <Spinner color="$color9" />
            </YStack>
          ) : m.availableKeys.size === 0 ? (
            <SizableText size="$2" color="$color10">
              No availability in {formatMonthLabel(m.viewDate)}.
            </SizableText>
          ) : (
            <TimeSlots
              dayKey={m.selectedDay}
              slots={m.daySlots}
              timeZone={m.timeZone}
              onPick={m.selectSlot}
              selectedIso={m.selectedSlot}
              loading={m.slots.loading}
              compact
              maxHeight={220}
            />
          )}
        </>
      )}
    </YStack>
  )
}

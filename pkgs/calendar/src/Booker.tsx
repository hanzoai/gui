import type { ReactNode } from 'react'
import { SizableText, Spinner, XStack, YStack } from 'hanzogui'
import type { Booking } from './client'
import { BookingForm } from './BookingForm'
import { Confirmation } from './Confirmation'
import { EventHeader } from './EventHeader'
import { MonthCalendar } from './MonthCalendar'
import { TimeSlots } from './TimeSlots'
import { useBooker } from './useBooker'

export interface BookerProps {
  /** Host username (the calendar owner), e.g. "hanzo". */
  host: string
  /** Event-type slug, e.g. "intro". */
  eventSlug: string
  /** API base, defaults to https://api.hanzo.ai/v1/calendar */
  apiUrl?: string
  /** Visitor IANA time zone; defaults to the browser/device zone. */
  timeZone?: string
  weekStartsOn?: 0 | 1
  onBooked?: (booking: Booking) => void
}

/** Universal scheduling flow: event → month → times → details → confirmation. */
export function Booker(props: BookerProps) {
  const m = useBooker(props)

  return (
    <YStack
      backgroundColor="$background"
      borderColor="$borderColor"
      borderWidth={1}
      borderRadius="$6"
      padding="$4"
      gap="$4"
      width="100%"
      maxWidth={860}
      alignSelf="center"
    >
      {m.event.loading ? (
        <StatePanel>
          <Spinner size="large" color="$color9" />
          <SizableText size="$3" color="$color10">
            Loading…
          </SizableText>
        </StatePanel>
      ) : m.event.error || !m.event.data ? (
        <StatePanel>
          <SizableText size="$5" fontWeight="600" color="$color12">
            Couldn't load this event
          </SizableText>
          <SizableText size="$3" color="$color10" textAlign="center">
            {m.event.error ?? 'The event type was not found.'}
          </SizableText>
        </StatePanel>
      ) : m.phase === 'done' && m.booking ? (
        <Confirmation booking={m.booking} timeZone={m.timeZone} onDone={m.reset} />
      ) : (
        <YStack gap="$4">
          <EventHeader
            event={m.event.data}
            host={props.host}
            timeZone={m.timeZone}
            compact={m.phase === 'form'}
          />

          {m.phase === 'form' && m.selectedSlot ? (
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
              {m.conflict ? <JustTakenBanner /> : null}
              {m.slots.error ? (
                <SizableText size="$2" color="$red10">
                  Couldn't load availability: {m.slots.error}
                </SizableText>
              ) : null}
              <XStack
                gap="$5"
                flexDirection="column"
                $sm={{ flexDirection: 'row' }}
                alignItems="flex-start"
              >
                <MonthCalendar
                  viewDate={m.viewDate}
                  availableKeys={m.availableKeys}
                  selectedDay={m.selectedDay}
                  onSelectDay={m.selectDay}
                  onPrev={m.goPrevMonth}
                  onNext={m.goNextMonth}
                  atFirstMonth={m.atFirstMonth}
                  weekStartsOn={m.weekStartsOn}
                  loading={m.slots.loading}
                />
                <TimeSlots
                  dayKey={m.selectedDay}
                  slots={m.daySlots}
                  timeZone={m.timeZone}
                  onPick={m.selectSlot}
                  selectedIso={m.selectedSlot}
                  loading={m.slots.loading && !m.selectedDay}
                />
              </XStack>
              {m.availableKeys.size === 0 && !m.slots.loading && !m.slots.error ? (
                <SizableText size="$3" color="$color10" textAlign="center">
                  No availability this month — try the next month.
                </SizableText>
              ) : null}
            </>
          )}
        </YStack>
      )}
    </YStack>
  )
}

function StatePanel({ children }: { children: ReactNode }) {
  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      gap="$3"
      padding="$8"
      minHeight={220}
    >
      {children}
    </YStack>
  )
}

function JustTakenBanner() {
  return (
    <YStack
      backgroundColor="$yellow3"
      borderColor="$yellow6"
      borderWidth={1}
      borderRadius="$4"
      padding="$2.5"
    >
      <SizableText size="$2" color="$yellow11">
        That time was just taken. We refreshed the calendar — please pick another.
      </SizableText>
    </YStack>
  )
}

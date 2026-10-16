import type { ReactNode } from 'react'
import { Button, ScrollView, SizableText, XStack, YStack } from '@hanzo/gui'
import type { Slot } from './client.ts'
import { dateFromKey, formatDayLong, formatSlotTime } from './time.ts'

export interface TimeSlotsProps {
  dayKey: string | null
  slots: Slot[]
  timeZone: string
  onPick: (iso: string) => void
  selectedIso?: string | null
  loading?: boolean
  /** compact = wrap into a flowing grid instead of a tall column */
  compact?: boolean
  maxHeight?: number
}

/** Time-slot pills for the selected day, shown in the visitor's time zone. */
export function TimeSlots({
  dayKey,
  slots,
  timeZone,
  onPick,
  selectedIso,
  loading,
  compact,
  maxHeight = 360,
}: TimeSlotsProps) {
  if (!dayKey) {
    return (
      <Column share={!compact}>
        <Centered>
          <SizableText size="$3" color="$color10" textAlign="center">
            Select a day to see available times.
          </SizableText>
        </Centered>
      </Column>
    )
  }

  const heading = formatDayLong(dateFromKey(dayKey))

  return (
    <Column share={!compact}>
      <SizableText size="$4" fontWeight="600" color="$color12">
        {heading}
      </SizableText>

      {loading ? (
        <Centered>
          <SizableText size="$2" color="$color10">
            Loading times…
          </SizableText>
        </Centered>
      ) : slots.length === 0 ? (
        <Centered>
          <SizableText size="$3" color="$color10" textAlign="center">
            No times left on this day. Try another.
          </SizableText>
        </Centered>
      ) : (
        <ScrollView maxHeight={maxHeight} showsVerticalScrollIndicator={false}>
          <XStack flexWrap="wrap" gap="$2" flexDirection={compact ? 'row' : 'column'}>
            {slots.map((slot) => {
              const active = selectedIso === slot.time
              return (
                <Button
                  key={slot.time}
                  size="$3"
                  // Chosen is the theme's inverse, as the confirm control is;
                  // otherwise a tile on the same ground as the form's fields.
                  theme={active ? 'accent' : undefined}
                  borderWidth={1}
                  borderColor={active ? 'transparent' : '$borderColor'}
                  backgroundColor={active ? undefined : '$color3'}
                  hoverStyle={active ? undefined : { borderColor: '$color8' }}
                  pressStyle={active ? undefined : { borderColor: '$color8' }}
                  onPress={() => onPick(slot.time)}
                  aria-label={`Book ${formatSlotTime(slot.time, timeZone)}`}
                  {...(compact ? {} : { alignSelf: 'stretch' })}
                >
                  {formatSlotTime(slot.time, timeZone)}
                </Button>
              )
            })}
          </XStack>
        </ScrollView>
      )}
    </Column>
  )
}

/** The times' column. Beside the month (`share`) it takes the same share of
 *  the row whether or not a day is chosen yet; stacked under a header, as in
 *  CalendarEmbed, it keeps its content height, which a zero basis would take. */
function Column({ share, children }: { share: boolean; children: ReactNode }) {
  return (
    <YStack
      gap="$2"
      flexGrow={1}
      minWidth={200}
      $sm={share ? { flexBasis: 0 } : undefined}
    >
      {children}
    </YStack>
  )
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <YStack
      flexGrow={1}
      minHeight={120}
      alignItems="center"
      justifyContent="center"
      padding="$4"
    >
      {children}
    </YStack>
  )
}

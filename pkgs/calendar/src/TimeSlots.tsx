import type { ReactNode } from 'react'
import { Button, ScrollView, SizableText, XStack, YStack } from '@hanzo/gui'
import type { Slot } from './client'
import { dateFromKey, formatDayLong, formatSlotTime } from './time'

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
      <Centered>
        <SizableText size="$3" color="$color10" textAlign="center">
          Select a day to see available times.
        </SizableText>
      </Centered>
    )
  }

  const heading = formatDayLong(dateFromKey(dayKey))

  return (
    <YStack gap="$2" flex={1} minWidth={200}>
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
                  theme={active ? 'blue' : undefined}
                  chromeless={!active}
                  borderWidth={1}
                  borderColor={active ? '$color8' : '$color6'}
                  backgroundColor={active ? undefined : '$color1'}
                  hoverStyle={{ borderColor: '$color10' }}
                  pressStyle={{ backgroundColor: '$color4' }}
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
    </YStack>
  )
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <YStack
      flex={1}
      minHeight={120}
      alignItems="center"
      justifyContent="center"
      padding="$4"
    >
      {children}
    </YStack>
  )
}

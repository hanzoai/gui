import type { ReactNode } from 'react'
import { Paragraph, SizableText, XStack, YStack } from '@hanzo/gui'
import type { EventType } from './client.ts'

export interface EventHeaderProps {
  event: EventType
  host: string
  timeZone: string
  compact?: boolean
}

/** Event identity: host, title, duration, timezone, description. */
export function EventHeader({ event, host, timeZone, compact }: EventHeaderProps) {
  const name = event.profile?.name || host
  const initial = (name?.[0] || 'H').toUpperCase()
  return (
    <YStack gap="$2">
      <XStack alignItems="center" gap="$2.5">
        <YStack
          width={28}
          height={28}
          borderRadius={9999}
          backgroundColor="$color5"
          alignItems="center"
          justifyContent="center"
        >
          <SizableText size="$2" color="$color11" fontWeight="600">
            {initial}
          </SizableText>
        </YStack>
        <SizableText size="$3" color="$color10">
          {name}
        </SizableText>
      </XStack>

      <SizableText size={compact ? '$6' : '$8'} fontWeight="700" color="$color12">
        {event.title}
      </SizableText>

      <XStack gap="$2" alignItems="center" flexWrap="wrap">
        <Pill>{event.length} min</Pill>
        <Pill>{shortZone(timeZone)}</Pill>
        {event.locations?.[0]?.type ? (
          <Pill>{prettyLocation(event.locations[0].type)}</Pill>
        ) : null}
      </XStack>

      {!compact && event.description ? (
        <Paragraph size="$3" color="$color11" marginTop="$1">
          {event.description}
        </Paragraph>
      ) : null}
    </YStack>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <XStack
      backgroundColor="$color3"
      paddingHorizontal="$2.5"
      paddingVertical="$1"
      borderRadius="$10"
      alignItems="center"
    >
      <SizableText size="$1" color="$color11">
        {children}
      </SizableText>
    </XStack>
  )
}

function shortZone(tz: string): string {
  const city = tz.split('/').pop() || tz
  return city.replace(/_/g, ' ')
}

function prettyLocation(type: string): string {
  const t = type.toLowerCase()
  if (t.includes('google')) return 'Google Meet'
  if (t.includes('zoom')) return 'Zoom'
  if (t.includes('phone')) return 'Phone'
  if (t.includes('person')) return 'In person'
  return 'Video call'
}

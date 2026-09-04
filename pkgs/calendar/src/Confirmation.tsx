import {
  Button,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  XStack,
  YStack,
} from '@hanzo/gui'
import { DEFAULT_API_URL, type Booking } from './client.ts'
import { useBooking } from './hooks.ts'
import { visitorTimeZone } from './time.ts'
import { formatBookingWhen } from './time.ts'

export interface ConfirmationProps {
  /** Provide a booking directly, or a uid to fetch one. */
  booking?: Booking
  uid?: string
  apiUrl?: string
  timeZone?: string
  onDone?: () => void
}

/** Booking confirmation card. Accepts a booking object or fetches by uid. */
export function Confirmation({
  booking,
  uid,
  apiUrl,
  timeZone,
  onDone,
}: ConfirmationProps) {
  const api = apiUrl ?? DEFAULT_API_URL
  const tz = timeZone ?? visitorTimeZone()
  const fetched = useBooking(api, booking ? undefined : uid)
  const data = booking ?? fetched.data

  if (!data && fetched.loading) {
    return (
      <YStack
        alignItems="center"
        justifyContent="center"
        padding="$6"
        gap="$3"
        minHeight={200}
      >
        <Spinner size="large" color="$color9" />
        <SizableText size="$3" color="$color10">
          Loading your booking…
        </SizableText>
      </YStack>
    )
  }

  if (!data) {
    return (
      <YStack
        alignItems="center"
        justifyContent="center"
        padding="$6"
        gap="$2"
        minHeight={200}
      >
        <SizableText size="$4" fontWeight="600" color="$color12">
          Booking not found
        </SizableText>
        <SizableText size="$3" color="$color10" textAlign="center">
          {fetched.error ?? 'We could not load this booking.'}
        </SizableText>
      </YStack>
    )
  }

  const attendee = data.attendees?.[0]
  const location = data.location

  return (
    <YStack gap="$3" padding="$1" alignItems="center">
      <YStack
        width={52}
        height={52}
        borderRadius={9999}
        backgroundColor="$green4"
        alignItems="center"
        justifyContent="center"
      >
        <SizableText size="$8" color="$green11">
          {'✓'}
        </SizableText>
      </YStack>

      <YStack gap="$1" alignItems="center">
        <SizableText size="$7" fontWeight="700" color="$color12" textAlign="center">
          You're booked
        </SizableText>
        <SizableText size="$4" color="$color11" textAlign="center">
          {data.title}
        </SizableText>
      </YStack>

      <Separator width="100%" />

      <YStack gap="$2.5" width="100%" maxWidth={420}>
        <Row label="When" value={formatBookingWhen(data.start, tz)} />
        {location ? <Row label="Where" value={location} /> : null}
        {attendee?.email ? <Row label="Guest" value={attendee.email} /> : null}
        <Row label="Status" value={titleCase(data.status)} />
        <Row label="Reference" value={data.uid} />
      </YStack>

      <Paragraph size="$2" color="$color10" textAlign="center" marginTop="$1">
        A calendar invite is on its way to {attendee?.email ?? 'your inbox'}.
      </Paragraph>

      {onDone ? (
        <Button size="$3" chromeless onPress={onDone} marginTop="$1">
          Book another time
        </Button>
      ) : null}
    </YStack>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <XStack justifyContent="space-between" gap="$3" alignItems="flex-start">
      <SizableText size="$3" color="$color10">
        {label}
      </SizableText>
      <SizableText
        size="$3"
        color="$color12"
        fontWeight="500"
        textAlign="right"
        flexShrink={1}
      >
        {value}
      </SizableText>
    </XStack>
  )
}

function titleCase(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

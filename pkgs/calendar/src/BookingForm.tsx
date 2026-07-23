import { useState, type ReactNode } from 'react'
import { Button, Input, SizableText, TextArea, XStack, YStack } from 'hanzogui'
import type { BookingResponses } from './client'
import { formatBookingWhen } from './time'

export interface BookingFormProps {
  slotIso: string
  timeZone: string
  eventLength: number
  submitting?: boolean
  error?: string | null
  onSubmit: (responses: BookingResponses) => void
  onBack: () => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Attendee details form for the chosen slot. */
export function BookingForm({
  slotIso,
  timeZone,
  eventLength,
  submitting,
  error,
  onSubmit,
  onBack,
}: BookingFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [touched, setTouched] = useState(false)

  const nameValid = name.trim().length > 0
  const emailValid = EMAIL_RE.test(email.trim())
  const valid = nameValid && emailValid

  const submit = () => {
    setTouched(true)
    if (!valid || submitting) return
    onSubmit({ name: name.trim(), email: email.trim(), notes: notes.trim() || undefined })
  }

  return (
    <YStack gap="$3" flex={1} minWidth={240}>
      <YStack gap="$1">
        <XStack alignItems="center" gap="$2">
          <BackLink onPress={onBack} />
          <SizableText size="$5" fontWeight="700" color="$color12">
            Enter details
          </SizableText>
        </XStack>
        <SizableText size="$3" color="$color11">
          {formatBookingWhen(slotIso, timeZone)} · {eventLength} min
        </SizableText>
      </YStack>

      <Field
        label="Name"
        required
        invalid={touched && !nameValid}
        hint="Please enter your name"
      >
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Ada Lovelace"
          autoComplete="name"
          size="$4"
        />
      </Field>

      <Field
        label="Email"
        required
        invalid={touched && !emailValid}
        hint="Please enter a valid email"
      >
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="ada@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          size="$4"
        />
      </Field>

      <Field label="Notes" hint="Optional">
        <TextArea
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything that would help prepare?"
          numberOfLines={3}
          size="$4"
        />
      </Field>

      {error ? (
        <YStack
          backgroundColor="$red3"
          borderColor="$red6"
          borderWidth={1}
          borderRadius="$4"
          padding="$2.5"
        >
          <SizableText size="$2" color="$red11">
            {error}
          </SizableText>
        </YStack>
      ) : null}

      <XStack gap="$2" justifyContent="flex-end" marginTop="$1">
        <Button size="$4" chromeless onPress={onBack} disabled={submitting}>
          Back
        </Button>
        <Button
          size="$4"
          theme="blue"
          onPress={submit}
          disabled={submitting || (touched && !valid)}
          opacity={submitting ? 0.7 : 1}
        >
          {submitting ? 'Booking…' : 'Confirm booking'}
        </Button>
      </XStack>
    </YStack>
  )
}

function Field({
  label,
  required,
  invalid,
  hint,
  children,
}: {
  label: string
  required?: boolean
  invalid?: boolean
  hint?: string
  children: ReactNode
}) {
  return (
    <YStack gap="$1.5">
      <SizableText size="$2" color="$color11" fontWeight="600">
        {label}
        {required ? <SizableText color="$red10"> *</SizableText> : null}
      </SizableText>
      {children}
      {invalid && hint ? (
        <SizableText size="$1" color="$red10">
          {hint}
        </SizableText>
      ) : null}
    </YStack>
  )
}

function BackLink({ onPress }: { onPress: () => void }) {
  return (
    <YStack
      width={30}
      height={30}
      alignItems="center"
      justifyContent="center"
      borderRadius="$4"
      cursor="pointer"
      hoverStyle={{ backgroundColor: '$color4' }}
      pressStyle={{ backgroundColor: '$color6' }}
      onPress={onPress}
      aria-label="Back"
      role="button"
    >
      <SizableText size="$6" color="$color11">
        {'‹'}
      </SizableText>
    </YStack>
  )
}

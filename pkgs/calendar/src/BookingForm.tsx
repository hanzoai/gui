import { useId, useState, type ReactNode } from 'react'
import { Button, Input, SizableText, TextArea, XStack, YStack } from '@hanzo/gui'
import type { BookingResponses } from './client.ts'
import { formatBookingWhen } from './time.ts'

export interface BookingFormProps {
  slotIso: string
  timeZone: string
  eventLength: number
  submitting?: boolean
  error?: string | null
  onSubmit: (responses: BookingResponses) => void
  onBack: () => void
  /** What the form starts with: the attendee a host page already knows. */
  prefill?: Partial<BookingResponses>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** A capsule, whatever the control's height. */
const PILL = 9999

/**
 * A field: a raised tile under the theme's hairline, the value in the full ink
 * and the placeholder in the theme's placeholder colour. Named, because gui's
 * Input sub-theme draws its value a rung below the ink and a field that names
 * no placeholder colour paints the hint in the value's colour — a sample
 * placeholder then reads as something typed.
 */
const FIELD = {
  backgroundColor: '$color3',
  borderColor: '$borderColor',
  color: '$color12',
  placeholderTextColor: '$placeholderColor',
} as const

/** Attendee details form for the chosen slot. */
export function BookingForm({
  slotIso,
  timeZone,
  eventLength,
  submitting,
  error,
  onSubmit,
  onBack,
  prefill,
}: BookingFormProps) {
  const [name, setName] = useState(prefill?.name ?? '')
  const [email, setEmail] = useState(prefill?.email ?? '')
  const [notes, setNotes] = useState(prefill?.notes ?? '')
  const [touched, setTouched] = useState(false)

  const nameValid = name.trim().length > 0
  const emailValid = EMAIL_RE.test(email.trim())
  const valid = nameValid && emailValid

  // Blocked while booking, or once a submit has shown what is missing. Its
  // look is stated, so it reads as unavailable under any host's config.
  const blocked = Boolean(submitting) || (touched && !valid)

  const submit = () => {
    setTouched(true)
    if (!valid || submitting) return
    onSubmit({ name: name.trim(), email: email.trim(), notes: notes.trim() || undefined })
  }

  return (
    <YStack gap="$3" flexGrow={1} minWidth={240}>
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

      <Field label="Name" invalid={touched && !nameValid} hint="Please enter your name">
        {(a11y) => (
          <Input
            {...FIELD}
            {...a11y}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            autoComplete="name"
            size="$4"
          />
        )}
      </Field>

      <Field
        label="Email"
        invalid={touched && !emailValid}
        hint="Please enter a valid email"
      >
        {(a11y) => (
          <Input
            {...FIELD}
            {...a11y}
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            size="$4"
          />
        )}
      </Field>

      <Field label="Notes" optional>
        {(a11y) => (
          <TextArea
            {...FIELD}
            {...a11y}
            value={notes}
            onChangeText={setNotes}
            placeholder="Anything that would help prepare?"
            numberOfLines={3}
            size="$4"
          />
        )}
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

      <XStack gap="$2" justifyContent="flex-end" alignItems="center" marginTop="$1">
        <Button
          size="$4"
          chromeless
          borderRadius={PILL}
          color="$color11"
          hoverStyle={{ backgroundColor: '$color3' }}
          pressStyle={{ backgroundColor: '$color3' }}
          onPress={onBack}
          disabled={submitting}
        >
          Back
        </Button>
        {/* The one loud control: the theme's inverse, a white pill on the dark
            ground and a black one on the light. */}
        <Button
          size="$4"
          theme="accent"
          borderRadius={PILL}
          paddingHorizontal="$5"
          fontWeight="600"
          onPress={submit}
          disabled={blocked}
          opacity={blocked ? 0.5 : 1}
          cursor={blocked ? 'default' : 'pointer'}
        >
          {submitting ? 'Booking…' : 'Confirm booking'}
        </Button>
      </XStack>
    </YStack>
  )
}

/** What a field's control carries so a screen reader hears what a sighted
 *  person sees: its label (not its placeholder) as its name, whether it is
 *  required, and the hint when it is invalid. */
interface FieldA11y {
  'aria-labelledby': string
  'aria-required': boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

/** A labelled field. Fields are required unless marked optional, so the one
 *  optional field says so and the required ones carry no mark. */
function Field({
  label,
  optional,
  invalid,
  hint,
  children,
}: {
  label: string
  optional?: boolean
  invalid?: boolean
  hint?: string
  children: (a11y: FieldA11y) => ReactNode
}) {
  const id = useId()
  const shown = Boolean(invalid && hint)
  const a11y: FieldA11y = {
    'aria-labelledby': `${id}-label`,
    'aria-required': !optional,
    ...(invalid ? { 'aria-invalid': true } : null),
    ...(shown ? { 'aria-describedby': `${id}-hint` } : null),
  }
  return (
    <YStack gap="$1.5">
      <SizableText id={`${id}-label`} size="$2" color="$color11" fontWeight="600">
        {label}
        {optional ? (
          <SizableText size="$2" color="$color10" fontWeight="400">
            {' · Optional'}
          </SizableText>
        ) : null}
      </SizableText>
      {children(a11y)}
      {shown ? (
        <SizableText id={`${id}-hint`} role="alert" size="$1" color="$red10">
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

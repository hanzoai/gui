import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Button, Input, Label, SizableText, TextArea, XStack, YStack } from '@hanzo/gui'
import type { BookingResponses } from './client.ts'
import { Press, RING, RING_FILLED } from './press.tsx'
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
  // 16px, not the type ladder's 15: iOS Safari zooms the page into any field
  // whose text is smaller than 16px, and does not zoom back out.
  fontSize: 16,
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

  // The step moved: the time that was pressed is gone, so focus goes to this
  // step's heading rather than to the top of the document. A keyboard user
  // continues from here, and a screen reader announces the new step.
  const heading = useRef<HTMLElement>(null)
  useEffect(() => {
    heading.current?.focus?.()
  }, [])

  const nameValid = name.trim().length > 0
  const emailValid = EMAIL_RE.test(email.trim())
  const valid = nameValid && emailValid

  // Blocked while booking, or once a submit has shown what is missing. Its
  // look is stated, so it reads as unavailable under any host's config.
  const blocked = Boolean(submitting) || (touched && !valid)

  // A submit that finds a field missing puts the keyboard in it, rather than on
  // a Confirm that has just gone unavailable.
  const nameField = useRef<HTMLElement>(null)
  const emailField = useRef<HTMLElement>(null)

  const submit = () => {
    setTouched(true)
    if (!valid) {
      ;(nameValid ? emailField : nameField).current?.focus?.()
      return
    }
    if (submitting) return
    onSubmit({ name: name.trim(), email: email.trim(), notes: notes.trim() || undefined })
  }

  return (
    <YStack gap="$3" flexGrow={1} minWidth={240}>
      <YStack gap="$1">
        <XStack alignItems="center" gap="$2">
          <BackLink onPress={onBack} />
          <SizableText
            ref={heading as never}
            tabIndex={-1}
            role="heading"
            aria-level={2}
            size="$5"
            fontWeight="700"
            color="$color12"
            outlineStyle="none"
          >
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
            {...a11y}
            value={name}
            ref={nameField as never}
            onChangeText={setName}
            // Return books, as it would in a form; Notes keeps Return for lines.
            onSubmitEditing={submit}
            placeholder="Your name"
            autoComplete="name"
            size="$4"
            // After `size`, whose variant writes a 15px font of its own.
            {...FIELD}
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
            {...a11y}
            value={email}
            ref={emailField as never}
            onChangeText={setEmail}
            onSubmitEditing={submit}
            placeholder="you@company.com"
            type="email"
            inputMode="email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            size="$4"
            // After `size`, whose variant writes a 15px font of its own.
            {...FIELD}
          />
        )}
      </Field>

      <Field label="Notes" optional>
        {(a11y) => (
          <TextArea
            {...a11y}
            value={notes}
            onChangeText={setNotes}
            placeholder="Anything that would help prepare?"
            numberOfLines={3}
            size="$4"
            // After `size`, whose variant writes a 15px font of its own.
            {...FIELD}
            // TextArea re-applies its size variant's font over a prop, so the
            // 16px floor rides the style, which nothing outranks.
            style={{ fontSize: FIELD.fontSize }}
          />
        )}
      </Field>

      {error ? (
        <YStack
          role="alert"
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
          focusVisibleStyle={RING}
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
          focusVisibleStyle={RING_FILLED}
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

/** What a field's control carries: the id its <label> points at, whether it
 *  is required, and the hint when it is invalid. */
interface FieldA11y {
  id: string
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
    id: `${id}-field`,
    'aria-required': !optional,
    ...(invalid ? { 'aria-invalid': true } : null),
    ...(shown ? { 'aria-describedby': `${id}-hint` } : null),
  }
  return (
    <YStack gap="$1.5">
      {/* A real <label for>: it names the field, and a click on it focuses the field. */}
      <Label
        unstyled
        htmlFor={`${id}-field`}
        size="$2"
        // Label's size variant leads the line at a button's height (28px);
        // a label reads at its type's own leading.
        lineHeight="$2"
        color="$color11"
        fontWeight="600"
        cursor="default"
      >
        {label}
        {optional ? (
          <SizableText size="$2" color="$color10" fontWeight="400">
            {' · Optional'}
          </SizableText>
        ) : null}
      </Label>
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
    <Press
      width={30}
      height={30}
      alignItems="center"
      justifyContent="center"
      borderRadius="$4"
      hoverStyle={{ backgroundColor: '$color4' }}
      pressStyle={{ backgroundColor: '$color6' }}
      onPress={onPress}
      aria-label="Back to times"
    >
      <SizableText size="$6" color="$color11" aria-hidden>
        {'‹'}
      </SizableText>
    </Press>
  )
}

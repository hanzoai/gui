// Tiny form field primitive. Casdoor's edit pages use Ant Design
// `<Form.Item>` with `<Row><Col>` 22-grid layouts. We don't need that
// here — admin edit forms in this surface are vertical: label on top,
// control below, error/help text underneath. One-way binding via
// `value` + `onChangeText` matches @hanzo/gui's `<Input>` API.
//
// We expose two flavours:
//   - <Field> for text/number inputs
//   - <ToggleField> for booleans (Switch)
// Anything more exotic (Select, MultiSelect) is rendered inline by
// the caller using hanzogui primitives directly. Keeping the
// abstraction tiny avoids the Ant Design over-form trap.

import type { ReactNode } from 'react'
import { Input, Label, Paragraph, Switch, Text, YStack } from 'hanzogui'

export interface FieldProps {
  id: string
  label: string
  value: string
  onChangeText: (next: string) => void
  placeholder?: string
  hint?: string
  error?: string
  type?: 'text' | 'email' | 'url' | 'number'
  disabled?: boolean
  required?: boolean
}

export function Field({
  id,
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  error,
  type = 'text',
  disabled,
  required,
}: FieldProps) {
  return (
    <YStack gap="$2">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <Text color="#fca5a5" fontSize="$2">
            {' *'}
          </Text>
        ) : null}
      </Label>
      <Input
        id={id}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={type === 'number' ? 'numeric' : 'default'}
        disabled={disabled}
        borderColor={error ? ('#7f1d1d' as never) : '$borderColor'}
      />
      {error ? (
        <Paragraph color="#fca5a5" fontSize="$2">
          {error}
        </Paragraph>
      ) : hint ? (
        <Paragraph color="$placeholderColor" fontSize="$2">
          {hint}
        </Paragraph>
      ) : null}
    </YStack>
  )
}

export interface ToggleFieldProps {
  id: string
  label: string
  value: boolean
  onChange: (next: boolean) => void
  hint?: ReactNode
  disabled?: boolean
}

export function ToggleField({
  id,
  label,
  value,
  onChange,
  hint,
  disabled,
}: ToggleFieldProps) {
  return (
    <YStack gap="$2">
      <Label htmlFor={id}>{label}</Label>
      <Switch
        id={id}
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
        size="$3"
      >
        <Switch.Thumb />
      </Switch>
      {hint ? (
        <Paragraph color="$placeholderColor" fontSize="$2">
          {hint}
        </Paragraph>
      ) : null}
    </YStack>
  )
}

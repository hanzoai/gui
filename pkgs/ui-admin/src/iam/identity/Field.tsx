// Tiny form field primitive. Casdoor's edit pages use Ant Design
// `<Form.Item>` with `<Row><Col>` 22-grid layouts. We don't need that
// here — admin edit forms in this surface are vertical: label on top,
// control below, error/help text underneath. One-way binding via
// `value` + `onChangeText` matches @hanzo/gui's `<Input>` API.
//
// We expose three flavours:
//   - <Field> for text/number inputs
//   - <ToggleField> for booleans (Switch)
//   - <SelectField> for closed-set string options (server-trust gate)
// Anything more exotic (MultiSelect) is rendered inline by the caller
// using hanzogui primitives directly. Keeping the abstraction tiny
// avoids the Ant Design over-form trap.

import type { ReactNode } from 'react'
import {
  Input,
  Label,
  Paragraph,
  Select,
  Switch,
  Text,
  YStack,
} from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'

// PASSWORD_TYPE_OPTIONS — the only safe password-hashing algorithm
// the admin UI is allowed to write. Plaintext, bcrypt, md5, etc are
// physically impossible to set from the UI by virtue of this list.
// The server enforces the same policy; this is defense-in-depth.
export const PASSWORD_TYPE_OPTIONS = ['argon2id'] as const
export type PasswordType = (typeof PASSWORD_TYPE_OPTIONS)[number]

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

// SelectField — closed-set string picker. Use this for any input
// where the safe set of values is enumerable and the UI MUST NOT let
// an operator type something else. Examples: passwordType (only
// `argon2id` is safe; plaintext/bcrypt/123 must be impossible from
// the UI). The current `value` is shown verbatim in the trigger even
// when it isn't in `options` — legacy data round-trips visibly — but
// the operator can only save one of the offered options. Callers
// keep `options` as a literal `readonly string[]` so tests can assert
// the exact safe set by `===`.
export interface SelectFieldProps {
  id: string
  label: string
  value: string
  options: readonly string[]
  onChange: (next: string) => void
  hint?: string
  disabled?: boolean
  required?: boolean
}

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  hint,
  disabled,
  required,
}: SelectFieldProps) {
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
      <Select
        id={id}
        value={value}
        onValueChange={onChange}
        disablePreventBodyScroll
      >
        <Select.Trigger width="100%" iconAfter={ChevronDown} disabled={disabled}>
          <Select.Value placeholder={value || options[0]} />
        </Select.Trigger>
        <Select.Content zIndex={2_000_000}>
          <Select.Viewport>
            {options.map((opt, idx) => (
              <Select.Item key={opt} index={idx} value={opt}>
                <Select.ItemText>{opt}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select>
      {hint ? (
        <Paragraph color="$placeholderColor" fontSize="$2">
          {hint}
        </Paragraph>
      ) : null}
    </YStack>
  )
}

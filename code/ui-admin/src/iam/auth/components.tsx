// Local form primitives for the IAM auth bucket. Mirrors the shape
// of `iam/identity/Field.tsx` but lives in this bucket so the auth
// surface doesn't reach into a sibling bucket. Tiny — vertical label
// + control + error/hint. Selects use hanzogui's `Select`; we never
// fall back to native HTML `<select>`.

import type { ReactNode } from 'react'
import { Input, Label, Paragraph, Select, Switch, Text, YStack } from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'

export interface FieldProps {
  id: string
  label: string
  value: string
  onChangeText: (next: string) => void
  placeholder?: string
  hint?: string
  error?: string
  type?: 'text' | 'email' | 'url' | 'number' | 'password'
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
        secureTextEntry={type === 'password'}
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

export interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  options: Array<{ value: string; label: string }>
  hint?: string
  disabled?: boolean
  placeholder?: string
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  hint,
  disabled,
  placeholder = 'Select…',
}: SelectFieldProps) {
  return (
    <YStack gap="$2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        id={id}
        value={value}
        onValueChange={onChange}
        disablePreventBodyScroll
      >
        <Select.Trigger
          size="$3"
          iconAfter={ChevronDown as never}
          disabled={disabled}
        >
          <Select.Value placeholder={placeholder} />
        </Select.Trigger>
        <Select.Content>
          <Select.Viewport>
            <Select.Group>
              {options.map((o, i) => (
                <Select.Item key={o.value} index={i} value={o.value}>
                  <Select.ItemText>{o.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Group>
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

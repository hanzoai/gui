// Local form primitives for the IAM auth bucket. Mirrors the shape
// of `iam/identity/Field.tsx` but lives in this bucket so the auth
// surface doesn't reach into a sibling bucket. Tiny — vertical label
// + control + error/hint. Anything more (Select, Switch toggles)
// renders inline with hanzogui primitives.

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
        <Switch.Thumb animation="quick" />
      </Switch>
      {hint ? (
        <Paragraph color="$placeholderColor" fontSize="$2">
          {hint}
        </Paragraph>
      ) : null}
    </YStack>
  )
}

// SelectField — Casdoor uses Ant Design `<Select>` ubiquitously. We
// render a native select for accessibility + zero-deps. Wrap with
// XStack/YStack at the call site if more layout is needed.
export interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  options: Array<{ value: string; label: string }>
  hint?: string
  disabled?: boolean
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  hint,
  disabled,
}: SelectFieldProps) {
  return (
    <YStack gap="$2">
      <Label htmlFor={id}>{label}</Label>
      {/* Native select keeps a11y and avoids portal/zIndex issues. The
          minimal styling matches the Input border tokens. */}
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 6,
          color: '#f2f2f2',
          fontSize: 14,
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? (
        <Paragraph color="$placeholderColor" fontSize="$2">
          {hint}
        </Paragraph>
      ) : null}
    </YStack>
  )
}

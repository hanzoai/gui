// Signup — account creation form. Renders the static fields
// (username + password + email/phone) plus any dynamic fields the
// application's `signupItems` configures.
//
// Original at `~/work/hanzo/iam/web/src/auth/SignupPage.tsx`.

import { useMemo, useState } from 'react'
import { Eye } from '@hanzogui/lucide-icons-2/icons/Eye'
import { EyeOff } from '@hanzogui/lucide-icons-2/icons/EyeOff'
import { Input, Paragraph, Text, XStack, YStack } from 'hanzogui'
import type { AuthApplication, AuthSignupItem, SignupPayload } from './types'
import { isEmail, isPhoneShape, readCsrfToken, scorePassword } from './util'

export interface SignupProps {
  application: AuthApplication
  onSubmit: (payload: SignupPayload) => Promise<void>
  onLogin?: () => void
  invitationCode?: string
  error?: string | null
}

interface FieldRowProps {
  item: AuthSignupItem
  value: string
  onChange: (next: string) => void
}

function FieldRow({ item, value, onChange }: FieldRowProps) {
  if (item.type === 'Single Choice' || item.type === 'Multiple Choices') {
    // Native <select> through Hanzo GUI's tag escape hatch — keeps
    // bundle small and accessible.
    return (
      <YStack gap="$1">
        <Text fontSize="$2" color="$placeholderColor">
          {item.label || item.name}
          {item.required ? ' *' : ''}
        </Text>
        <Text
          tag="select"
          {...({
            value,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value),
            multiple: item.type === 'Multiple Choices',
            name: item.name,
            required: item.required,
          } as never)}
          px="$2"
          py="$2"
          rounded="$2"
          borderWidth={1}
          borderColor="$borderColor"
          bg="$background"
        >
          {item.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Text>
      </YStack>
    )
  }
  return (
    <YStack gap="$1">
      <Text fontSize="$2" color="$placeholderColor">
        {item.label || item.name}
        {item.required ? ' *' : ''}
      </Text>
      <Input
        value={value}
        onChangeText={onChange}
        placeholder={item.placeholder}
        {...({ name: item.name, required: item.required } as never)}
      />
    </YStack>
  )
}

export function Signup({ application, onSubmit, onLogin, invitationCode, error }: SignupProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [extra, setExtra] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [csrfToken] = useState(() => readCsrfToken())

  const score = scorePassword(password)
  const isEmailValue = isEmail(emailOrPhone)
  const isPhoneValue = isPhoneShape(emailOrPhone)

  const canSubmit =
    username.trim().length > 0 &&
    password.length >= 8 &&
    (isEmailValue || isPhoneValue) &&
    !submitting

  const dynamicItems = useMemo(
    () => application.signupItems?.filter((i) => i.visible !== false && i.name !== 'Username' && i.name !== 'Password' && i.name !== 'Email' && i.name !== 'Phone') ?? [],
    [application.signupItems]
  )

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const payload: SignupPayload = {
        application: application.name,
        organization: application.organization || application.owner,
        username: username.trim(),
        password,
        email: isEmailValue ? emailOrPhone : undefined,
        phone: isPhoneValue ? emailOrPhone : undefined,
        invitationCode,
        csrfToken: csrfToken || undefined,
        extra,
      }
      await onSubmit(payload)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <YStack
      tag="form"
      gap="$3"
      width="100%"
      maxWidth={400}
      {...({
        onSubmit: (e: React.FormEvent) => {
          e.preventDefault()
          void submit()
        },
        autoComplete: 'on',
        noValidate: true,
      } as never)}
    >
      <input type="hidden" name="csrfToken" value={csrfToken} readOnly />
      <Text fontSize="$8" fontWeight="700">
        Create your account
      </Text>

      <YStack gap="$1">
        <Text fontSize="$2" color="$placeholderColor">Username *</Text>
        <Input
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          {...({ autoComplete: 'username', name: 'username', required: true, spellCheck: false } as never)}
        />
      </YStack>

      <YStack gap="$1">
        <Text fontSize="$2" color="$placeholderColor">Email or phone *</Text>
        <Input
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          autoCapitalize="none"
          {...({
            autoComplete: 'email',
            name: 'emailOrPhone',
            required: true,
            inputMode: isPhoneValue ? 'tel' : 'email',
            spellCheck: false,
          } as never)}
        />
      </YStack>

      <YStack gap="$1">
        <Text fontSize="$2" color="$placeholderColor">Password *</Text>
        <XStack items="center" gap="$2">
          <Input
            flex={1}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            {...({
              type: showPassword ? 'text' : 'password',
              autoComplete: 'new-password',
              name: 'password',
              required: true,
              minLength: 8,
            } as never)}
          />
          <Text
            tag="button"
            {...({
              type: 'button',
              onClick: () => setShowPassword((s) => !s),
              'aria-label': showPassword ? 'Hide password' : 'Show password',
            } as never)}
            cursor="pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Text>
        </XStack>
        <Text fontSize="$1" color={score >= 3 ? '#86efac' : score >= 2 ? '#f59e0b' : '#fca5a5'}>
          {password.length === 0
            ? 'At least 8 characters.'
            : score >= 3
              ? 'Strong password.'
              : score >= 2
                ? 'OK — add a symbol or more length.'
                : 'Weak — mix letters, digits, symbols.'}
        </Text>
      </YStack>

      {dynamicItems.map((item) => (
        <FieldRow
          key={item.name}
          item={item}
          value={extra[item.name] ?? ''}
          onChange={(v) => setExtra((e) => ({ ...e, [item.name]: v }))}
        />
      ))}

      {error ? (
        <Paragraph color="#fca5a5" fontSize="$2">
          {error}
        </Paragraph>
      ) : null}

      <Text
        tag="button"
        {...({ type: 'submit', disabled: !canSubmit } as never)}
        px="$4"
        py="$3"
        rounded="$3"
        bg={canSubmit ? ('#3b82f6' as never) : ('rgba(59,130,246,0.4)' as never)}
        color="#ffffff"
        cursor={canSubmit ? 'pointer' : 'not-allowed'}
        text="center"
      >
        {submitting ? 'Creating account…' : 'Sign up'}
      </Text>

      {onLogin ? (
        <Paragraph color="$placeholderColor" fontSize="$2" text="center">
          Already have an account?{' '}
          <Text
            tag="button"
            {...({ type: 'button', onClick: onLogin } as never)}
            color="#60a5fa"
            cursor="pointer"
          >
            Sign in
          </Text>
        </Paragraph>
      ) : null}
    </YStack>
  )
}

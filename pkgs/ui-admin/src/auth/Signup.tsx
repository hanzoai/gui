// Signup — account creation form. Renders the static fields
// (username + password + email/phone) plus any dynamic fields the
// application's `signupItems` configures.
//
// Original at `~/work/hanzo/iam/web/src/auth/SignupPage.tsx`.

import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type FormEvent,
} from 'react'
import { Eye } from '@hanzogui/lucide-icons-2/icons/Eye'
import { EyeOff } from '@hanzogui/lucide-icons-2/icons/EyeOff'
import { Button, Input, Label, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Captcha } from './Captcha'
import type {
  AuthApplication,
  AuthSignupItem,
  CaptchaConfig,
  SignupPayload,
} from './types'
import { isEmail, isPhoneShape, scorePassword } from './util'

export interface SignupProps {
  application: AuthApplication
  onSubmit: (payload: SignupPayload) => Promise<void>
  onLogin?: () => void
  invitationCode?: string
  error?: string | null
  captcha?: CaptchaConfig
  CaptchaWidget?: ComponentType<{
    siteKey: string
    onToken: (token: string) => void
    onError?: (msg: string) => void
  }>
}

interface FieldRowProps {
  item: AuthSignupItem
  value: string
  onChange: (next: string) => void
}

function FieldRow({ item, value, onChange }: FieldRowProps) {
  if (item.type === 'Single Choice' || item.type === 'Multiple Choices') {
    return (
      <YStack gap="$1">
        <Label htmlFor={`signup-${item.name}`}>
          {item.label || item.name}
          {item.required ? ' *' : ''}
        </Label>
        <select
          id={`signup-${item.name}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          multiple={item.type === 'Multiple Choices'}
          name={item.name}
          required={item.required}
          style={{
            padding: '8px',
            borderRadius: 6,
            border: '1px solid #555',
            background: 'inherit',
            color: 'inherit',
          }}
        >
          {item.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </YStack>
    )
  }
  return (
    <YStack gap="$1">
      <Label htmlFor={`signup-${item.name}`}>
        {item.label || item.name}
        {item.required ? ' *' : ''}
      </Label>
      <Input
        id={`signup-${item.name}`}
        value={value}
        onChangeText={onChange}
        placeholder={item.placeholder}
      />
    </YStack>
  )
}

export function Signup({
  application,
  onSubmit,
  onLogin,
  invitationCode,
  error,
  captcha,
  CaptchaWidget,
}: SignupProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [extra, setExtra] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaProviderType, setCaptchaProviderType] = useState<
    CaptchaConfig['type']
  >(captcha?.type ?? 'none')

  useEffect(() => {
    setCaptchaProviderType(captcha?.type ?? 'none')
  }, [captcha?.type])

  const score = scorePassword(password)
  const isEmailValue = isEmail(emailOrPhone)
  const isPhoneValue = isPhoneShape(emailOrPhone)

  // When the application configures a captcha, the user MUST solve it
  // before we let them submit. Skipping this check defeats the
  // bot-mitigation contract the server expects.
  const captchaRequired = !!captcha && captcha.type !== 'none'
  const canSubmit =
    username.trim().length > 0 &&
    password.length >= 8 &&
    (isEmailValue || isPhoneValue) &&
    (!captchaRequired || captchaToken !== null) &&
    !submitting

  const dynamicItems = useMemo(
    () =>
      application.signupItems?.filter(
        (i) =>
          i.visible !== false &&
          i.name !== 'Username' &&
          i.name !== 'Password' &&
          i.name !== 'Email' &&
          i.name !== 'Phone'
      ) ?? [],
    [application.signupItems]
  )

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
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
        captchaType: captchaToken ? captchaProviderType : undefined,
        captchaToken: captchaToken || undefined,
        extra,
      }
      await onSubmit(payload)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} autoComplete="on" noValidate>
      <YStack gap="$3" width="100%" maxW={400}>
        <Text fontSize="$8" fontWeight="700">
          Create your account
        </Text>

        <YStack gap="$1">
          <Label htmlFor="signup-username">Username *</Label>
          <Input
            id="signup-username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </YStack>

        <YStack gap="$1">
          <Label htmlFor="signup-emailOrPhone">Email or phone *</Label>
          <Input
            id="signup-emailOrPhone"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            autoCapitalize="none"
            keyboardType={isPhoneValue ? 'phone-pad' : 'email-address'}
          />
        </YStack>

        <YStack gap="$1">
          <Label htmlFor="signup-password">Password *</Label>
          <XStack items="center" gap="$2">
            <Input
              id="signup-password"
              flex={1}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Button
              size="$2"
              chromeless
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onPress={() => setShowPassword((s) => !s)}
              icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            />
          </XStack>
          <Paragraph
            color={
              score >= 3 ? '#86efac' : score >= 2 ? '#f59e0b' : '#fca5a5'
            }
            fontSize="$1"
          >
            {password.length === 0
              ? 'At least 8 characters.'
              : score >= 3
                ? 'Strong password.'
                : score >= 2
                  ? 'OK — add a symbol or more length.'
                  : 'Weak — mix letters, digits, symbols.'}
          </Paragraph>
        </YStack>

        {dynamicItems.map((item) => (
          <FieldRow
            key={item.name}
            item={item}
            value={extra[item.name] ?? ''}
            onChange={(v) => setExtra((current) => ({ ...current, [item.name]: v }))}
          />
        ))}

        {captcha && captcha.type !== 'none' ? (
          <Captcha
            config={captcha}
            Widget={CaptchaWidget}
            onToken={(t, providerType) => {
              setCaptchaToken(t)
              setCaptchaProviderType(providerType)
            }}
          />
        ) : null}

        {error ? (
          <Paragraph color="#fca5a5" fontSize="$2">
            {error}
          </Paragraph>
        ) : null}

        <Button
          size="$4"
          theme="blue"
          disabled={!canSubmit}
          onPress={() => void submit()}
        >
          {submitting ? 'Creating account…' : 'Sign up'}
        </Button>

        {onLogin ? (
          <XStack gap="$2" justify="center">
            <Paragraph color="$placeholderColor" fontSize="$2">
              Already have an account?
            </Paragraph>
            <Button size="$2" chromeless onPress={onLogin}>
              Sign in
            </Button>
          </XStack>
        ) : null}
      </YStack>
    </form>
  )
}

// Signup — account creation form. Renders the static fields
// (username + password + email/phone) plus any dynamic fields the
// application's `signupItems` configures.
//
// Canonical auth boundary is the `IAM` class from `@hanzo/iam/browser`.
// On submit:
//   1. Email path: `iam.sendVerificationCode({ email }, 'signup')` →
//      collect emailCode → `iam.signup({ method: 'email', ... })`.
//   2. Phone path: `iam.sendVerificationCode({ phone }, 'signup')` →
//      collect phoneCode → `iam.signup({ method: 'phone', ... })`.
// To keep the form linear, the OTP step is rendered inline under the
// email/phone field once the user clicks "Send code". A second submit
// with the code triggers the actual signup.
//
// Original at `~/work/hanzo/iam/web/src/auth/SignupPage.tsx`.

import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type FormEvent,
} from 'react'
import type { IAM } from '@hanzo/iam/browser'
import { Eye } from '@hanzogui/lucide-icons-2/icons/Eye'
import { EyeOff } from '@hanzogui/lucide-icons-2/icons/EyeOff'
import { Button, Input, Label, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Captcha } from './Captcha'
import type {
  AuthApplication,
  AuthSignupItem,
  CaptchaConfig,
} from './types'
import { isEmail, isPhoneShape, scorePassword } from './util'

export interface SignupProps {
  iam: IAM
  application: AuthApplication
  onSuccess?: (id?: string) => void
  onLogin?: () => void
  /** Country code applied when the contact is detected as a phone. */
  countryCode?: string
  invitationCode?: string
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
  iam,
  application,
  onSuccess,
  onLogin,
  countryCode = '+1',
  invitationCode: _invitationCode,
  captcha,
  CaptchaWidget,
}: SignupProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [extra, setExtra] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [, setCaptchaProviderType] = useState<CaptchaConfig['type']>(
    captcha?.type ?? 'none',
  )

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
    (!otpSent || otp.length > 0) &&
    !submitting

  const dynamicItems = useMemo(
    () =>
      application.signupItems?.filter(
        (i) =>
          i.visible !== false &&
          i.name !== 'Username' &&
          i.name !== 'Password' &&
          i.name !== 'Email' &&
          i.name !== 'Phone',
      ) ?? [],
    [application.signupItems],
  )

  const sendCode = async () => {
    if (!isEmailValue && !isPhoneValue) return
    setError(null)
    try {
      const result = isEmailValue
        ? await iam.sendVerificationCode({ email: emailOrPhone }, 'signup')
        : await iam.sendVerificationCode(
            { phone: emailOrPhone, countryCode },
            'signup',
          )
      if (!result.ok) {
        throw new Error(result.error ?? 'Failed to send verification code')
      }
      setOtpSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code')
    }
  }

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!canSubmit) return
    if (!otpSent) {
      // First submit: kick off OTP delivery.
      await sendCode()
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const result = isEmailValue
        ? await iam.signup({
            method: 'email',
            name: username.trim(),
            email: emailOrPhone,
            emailCode: otp,
            password,
          })
        : await iam.signup({
            method: 'phone',
            name: username.trim(),
            phone: emailOrPhone,
            countryCode,
            phoneCode: otp,
            password,
          })
      if (!result.ok) {
        throw new Error(result.error ?? 'Signup failed')
      }
      onSuccess?.(result.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
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
            onChangeText={(v) => {
              setEmailOrPhone(v)
              setOtpSent(false)
              setOtp('')
            }}
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

        {otpSent ? (
          <YStack gap="$1">
            <Label htmlFor="signup-otp">Verification code</Label>
            <Input
              id="signup-otp"
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              keyboardType="numeric"
              autoCapitalize="none"
            />
            <Button size="$1" chromeless onPress={() => void sendCode()}>
              Resend code
            </Button>
          </YStack>
        ) : null}

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
          {submitting
            ? 'Creating account…'
            : otpSent
              ? 'Sign up'
              : 'Send verification code'}
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

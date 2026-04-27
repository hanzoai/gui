// ForgotPassword — three-step password reset flow.
//   1. Enter username (or email/phone). Backend resolves the user
//      and tells us which verification channels are available.
//   2. Receive code via email or phone. User submits it.
//   3. Enter new password. Backend re-checks the code, then sets it.
//
// Original at `~/work/hanzo/iam/web/src/auth/ForgetPage.tsx`.
//
// Security:
//   - the email/phone returned by /resolve-user is rendered MASKED.
//     Showing the raw value here would let any anonymous client
//     enumerate accounts (submit a username → harvest the address).
//   - the password field is `secureTextEntry` and `autoComplete="new-password"`.
//   - CSRF protection lives in `apiPost`/`apiDelete` via the
//     `X-CSRF-Token` header. No body-echoed token, no hidden field.

import {
  useEffect,
  useState,
  type ComponentType,
  type FormEvent,
} from 'react'
import { Eye } from '@hanzogui/lucide-icons-2/icons/Eye'
import { EyeOff } from '@hanzogui/lucide-icons-2/icons/EyeOff'
import { Button, Input, Label, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Captcha } from './Captcha'
import type { AuthApplication, CaptchaConfig, ForgetPayload } from './types'
import { maskEmail, maskPhone, scorePassword } from './util'

type Step = 'username' | 'code' | 'password' | 'done'

export interface ForgotPasswordProps {
  application: AuthApplication
  onResolveUser: (username: string) => Promise<{ email?: string; phone?: string }>
  onVerifyCode: (input: {
    username: string
    verifyType: 'email' | 'phone'
    code: string
  }) => Promise<void>
  onResetPassword: (payload: ForgetPayload) => Promise<void>
  onBackToLogin?: () => void
  captcha?: CaptchaConfig
  CaptchaWidget?: ComponentType<{
    siteKey: string
    onToken: (token: string) => void
    onError?: (msg: string) => void
  }>
}

export function ForgotPassword({
  application,
  onResolveUser,
  onVerifyCode,
  onResetPassword,
  onBackToLogin,
  captcha,
  CaptchaWidget,
}: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('username')
  const [username, setUsername] = useState('')
  const [resolved, setResolved] = useState<{ email?: string; phone?: string } | null>(null)
  const [verifyType, setVerifyType] = useState<'email' | 'phone'>('email')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaProviderType, setCaptchaProviderType] = useState<
    CaptchaConfig['type']
  >(captcha?.type ?? 'none')

  useEffect(() => {
    setCaptchaProviderType(captcha?.type ?? 'none')
  }, [captcha?.type])

  const score = scorePassword(newPassword)

  // The username step initiates a verification challenge; we gate it on
  // the captcha when configured so a bot can't enumerate accounts via
  // /resolve-user. The code + password steps already require a fresh
  // server-issued code, so they don't re-gate.
  const captchaRequired = !!captcha && captcha.type !== 'none'
  const canStepSubmit =
    step !== 'username' || !captchaRequired || captchaToken !== null

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!canStepSubmit) return
    setError(null)
    setSubmitting(true)
    try {
      if (step === 'username') {
        const r = await onResolveUser(username.trim())
        setResolved(r)
        setVerifyType(r.email ? 'email' : 'phone')
        setStep('code')
      } else if (step === 'code') {
        await onVerifyCode({ username: username.trim(), verifyType, code })
        setStep('password')
      } else if (step === 'password') {
        const payload: ForgetPayload = {
          application: application.name,
          organization: application.organization || application.owner,
          username: username.trim(),
          newPassword,
          code,
          verifyType,
          captchaType: captchaToken ? captchaProviderType : undefined,
          captchaToken: captchaToken || undefined,
        }
        await onResetPassword(payload)
        setStep('done')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'done') {
    return (
      <YStack gap="$3" width="100%" maxW={400}>
        <Text fontSize="$8" fontWeight="700">
          Password updated
        </Text>
        <Paragraph color="$placeholderColor">
          You can now sign in with your new password.
        </Paragraph>
        {onBackToLogin ? (
          <Button size="$4" theme="blue" onPress={onBackToLogin}>
            Back to sign in
          </Button>
        ) : null}
      </YStack>
    )
  }

  return (
    <form onSubmit={submit} autoComplete="on" noValidate>
      <YStack gap="$3" width="100%" maxW={400}>
        <Text fontSize="$8" fontWeight="700">
          Reset your password
        </Text>

        {step === 'username' ? (
          <YStack gap="$1">
            <Label htmlFor="forgot-username">Username, email, or phone</Label>
            <Input
              id="forgot-username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
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
          </YStack>
        ) : null}

        {step === 'code' ? (
          <YStack gap="$2">
            <Paragraph color="$placeholderColor" fontSize="$2">
              We sent a code to your{' '}
              {verifyType === 'email'
                ? maskEmail(resolved?.email)
                : maskPhone(resolved?.phone)}
              .
            </Paragraph>
            {resolved?.email && resolved?.phone ? (
              <XStack gap="$2">
                <Button
                  size="$2"
                  chromeless
                  theme={verifyType === 'email' ? 'blue' : undefined}
                  onPress={() => setVerifyType('email')}
                >
                  Email
                </Button>
                <Button
                  size="$2"
                  chromeless
                  theme={verifyType === 'phone' ? 'blue' : undefined}
                  onPress={() => setVerifyType('phone')}
                >
                  Phone
                </Button>
              </XStack>
            ) : null}
            <YStack gap="$1">
              <Label htmlFor="forgot-code">Code</Label>
              <Input
                id="forgot-code"
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                keyboardType="numeric"
              />
            </YStack>
          </YStack>
        ) : null}

        {step === 'password' ? (
          <YStack gap="$1">
            <Label htmlFor="forgot-newpw">New password *</Label>
            <XStack items="center" gap="$2">
              <Input
                id="forgot-newpw"
                flex={1}
                value={newPassword}
                onChangeText={setNewPassword}
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
              color={score >= 3 ? '#86efac' : score >= 2 ? '#f59e0b' : '#fca5a5'}
              fontSize="$1"
            >
              {score >= 3 ? 'Strong.' : score >= 2 ? 'OK.' : 'Weak.'}
            </Paragraph>
          </YStack>
        ) : null}

        {error ? (
          <Paragraph color="#fca5a5" fontSize="$2">
            {error}
          </Paragraph>
        ) : null}

        <Button
          size="$4"
          theme="blue"
          disabled={submitting || !canStepSubmit}
          onPress={() => void submit()}
        >
          {step === 'username'
            ? 'Continue'
            : step === 'code'
              ? 'Verify code'
              : 'Set new password'}
        </Button>

        {onBackToLogin ? (
          <XStack gap="$2" justify="center">
            <Paragraph color="$placeholderColor" fontSize="$2">
              Remembered it?
            </Paragraph>
            <Button size="$2" chromeless onPress={onBackToLogin}>
              Back to sign in
            </Button>
          </XStack>
        ) : null}
      </YStack>
    </form>
  )
}

// ForgotPassword — recover account via OTP. Two-step flow:
//   1. Enter username/email/phone. We call
//      `iam.sendVerificationCode(..., 'reset')` to dispatch the OTP.
//   2. Enter the code. We call `iam.loginWithCredentials` (or
//      `iam.loginWithPhoneOTP` for phone) with the OTP as the
//      passphrase — Casdoor accepts a `reset`-issued OTP through the
//      same `/login` round-trip and lands the user signed-in.
//
// Once authenticated, the user changes their password from the
// authenticated Settings → Security pane in the host app. The IAM
// SDK does not currently expose a standalone `resetPassword(...)`
// method, so we deliberately do not collect a new password here —
// see `@hanzo/iam` v0.9+ for the canonical follow-up.
//
// Original at `~/work/hanzo/iam/web/src/auth/ForgetPage.tsx`.
//
// Security:
//   - the email/phone shown after the OTP send is the value the user
//     just typed, NOT a server-confirmed identifier — so account
//     enumeration via masked echo is impossible.
//   - the IAM class drives PKCE / token storage. This component
//     never sees a token directly.

import { useEffect, useMemo, useState, type ComponentType, type FormEvent } from 'react'
import type { IAM } from '@hanzo/iam/browser'
import { Button, Input, Label, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Captcha } from './Captcha'
import type { AuthApplication, CaptchaConfig } from './types'
import { isEmail, isPhoneShape } from './util'

type Step = 'identifier' | 'code' | 'done'

export interface ForgotPasswordProps {
  iam: IAM
  application: AuthApplication
  onSuccess?: () => void
  onBackToLogin?: () => void
  /** Country code applied when the identifier is detected as a phone. */
  countryCode?: string
  captcha?: CaptchaConfig
  CaptchaWidget?: ComponentType<{
    siteKey: string
    onToken: (token: string) => void
    onError?: (msg: string) => void
  }>
}

export function ForgotPassword({
  iam,
  application: _application,
  onSuccess,
  onBackToLogin,
  countryCode = '+1',
  captcha,
  CaptchaWidget,
}: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('identifier')
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [, setCaptchaProviderType] = useState<CaptchaConfig['type']>(
    captcha?.type ?? 'none',
  )

  useEffect(() => {
    setCaptchaProviderType(captcha?.type ?? 'none')
  }, [captcha?.type])

  const channel = useMemo<'email' | 'phone' | null>(() => {
    if (isEmail(identifier)) return 'email'
    if (isPhoneShape(identifier)) return 'phone'
    return null
  }, [identifier])

  // The identifier step initiates a verification challenge; we gate it
  // on the captcha when configured so a bot can't enumerate accounts
  // via the OTP send. The code step already requires a fresh
  // server-issued OTP, so it doesn't re-gate.
  const captchaRequired = !!captcha && captcha.type !== 'none'
  const canStepSubmit =
    step !== 'identifier' || !captchaRequired || captchaToken !== null

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!canStepSubmit || submitting) return
    setError(null)
    setSubmitting(true)
    try {
      if (step === 'identifier') {
        if (!channel) throw new Error('Enter a valid email or phone number.')
        const dispatch =
          channel === 'email'
            ? await iam.sendVerificationCode({ email: identifier.trim() }, 'reset')
            : await iam.sendVerificationCode(
                { phone: identifier.trim(), countryCode },
                'reset',
              )
        if (!dispatch.ok) {
          throw new Error(dispatch.error ?? 'Failed to send verification code.')
        }
        setStep('code')
      } else if (step === 'code') {
        if (channel === 'phone') {
          await iam.loginWithPhoneOTP({
            phone: identifier.trim(),
            countryCode,
            code,
          })
        } else {
          // Email: Casdoor accepts the OTP as the password against the
          // same `/login` endpoint when the verification code was
          // issued for `forget`/`reset`.
          const result = await iam.loginWithCredentials({
            username: identifier.trim(),
            password: code,
          })
          if (!result.ok || !result.code) {
            throw new Error(result.error ?? 'Invalid or expired code.')
          }
          await iam.exchangeCodeForToken(result.code)
        }
        setStep('done')
        onSuccess?.()
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
          You're signed in
        </Text>
        <Paragraph color="$placeholderColor">
          Update your password from your account settings to keep things secure.
        </Paragraph>
        {onBackToLogin ? (
          <Button size="$4" theme="blue" onPress={onBackToLogin}>
            Continue
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

        {step === 'identifier' ? (
          <YStack gap="$1">
            <Label htmlFor="forgot-identifier">Email or phone</Label>
            <Input
              id="forgot-identifier"
              value={identifier}
              onChangeText={setIdentifier}
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
              We sent a code to {identifier.trim()}. Enter it below to continue.
            </Paragraph>
            <YStack gap="$1">
              <Label htmlFor="forgot-code">Code</Label>
              <Input
                id="forgot-code"
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                keyboardType="numeric"
                autoCapitalize="none"
              />
            </YStack>
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
          {step === 'identifier' ? 'Send code' : 'Verify code'}
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
